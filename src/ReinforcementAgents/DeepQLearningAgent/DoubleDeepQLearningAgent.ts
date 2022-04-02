import {
  AdamOptimizer,
  Tensor,
  buffer,
  dispose,
  losses,
  oneHot,
  scalar,
  tensor1d,
  tidy,
  train,
  variableGrads
} from '@tensorflow/tfjs';
import { ReinforcementModel } from '../interfaces/ReinforcementModel';
import { ReinforcementAgent } from '../ReinforcementAgent';
import { DeepQNetwork } from './DeepQNetwork';
import { DoubleDeepQLearningAgentProps } from './interfaces/DoubleDeepQLearningAgentProps';
import { MovingAverage } from './MovingAverage';
import { ReplayMemory } from './ReplayMemory';

export class DoubleDeepQLearningAgent extends ReinforcementAgent {
  private readonly minScore: number;
  private readonly replayUpdateIndicator: number;
  private readonly minEpsilon: number;
  private readonly epsilonDecay: number;
  private readonly batchSize: number;
  private readonly optimizer: AdamOptimizer;
  private readonly replayMemory: ReplayMemory;
  private readonly qNetwork: DeepQNetwork;
  private readonly targetNetwork: DeepQNetwork;

  constructor({
    batchSize,
    minScore,
    epsilonDecay,
    minEpsilon,
    replayUpdateIndicator,
    ...baseAgentProps
  }: DoubleDeepQLearningAgentProps) {
    super(baseAgentProps);
    this.minScore = minScore;
    this.batchSize = batchSize;
    this.replayUpdateIndicator = replayUpdateIndicator;
    this.minEpsilon = minEpsilon;
    this.epsilonDecay = epsilonDecay;
    this.replayMemory = new ReplayMemory(this.batchSize);
    this.optimizer = train.adam(this.learningRate);
    const inputSize = this.player.model.environmentSize.width * this.player.model.environmentSize.height;
    this.qNetwork = new DeepQNetwork(inputSize, this.player.model.allActions.length, this.learningRate);
    this.targetNetwork = new DeepQNetwork(inputSize, this.player.model.allActions.length, this.learningRate, false);
  }

  protected runSingleEpoch(): void {
    let replayCounter = 1;
    const totalReward = new MovingAverage(100);
    while (replayCounter < this.minScore) {
      totalReward.addOrReplace(this.singleRun());
      this.decreaseExplorationChance();
      if (replayCounter % this.replayUpdateIndicator && this.replayMemory.isFull()) {
        this.trainOnReplayBatch();
      }
      this.qNetwork.copyWeightsToNetwork(this.targetNetwork.model);
      replayCounter++;
    }
  }

  protected getBestAction(state: ReinforcementModel): number {
    const prediction = this.qNetwork.model.predict(this.statesAsTensor([state.stateAsVector()])) as Tensor;
    return prediction.argMax(-1).dataSync()[0];
  }

  private singleRun(): number {
    this.player.model.reset();
    let state = this.player.model.copy();
    while (!state.isGameOver()) {
      const action = this.getAction(state);
      const nextState = this.player.controller.move(action);
      this.replayMemory.addOrReplace([
        state.stateAsVector(),
        action,
        nextState.score,
        nextState.stateAsVector(),
        Number(nextState.isGameOver())
      ]);
      state = nextState.copy();
    }
    return state.score;
  }

  private trainOnReplayBatch(): void {
    const states: Array<number[]> = [];
    const actions: number[] = [];
    const rewards: number[] = [];
    const nextStates: Array<number[]> = [];
    const dones: number[] = [];
    for (const [state, action, reward, nextState, done] of this.replayMemory.sample(this.batchSize)) {
      states.push(state);
      actions.push(action);
      rewards.push(reward);
      nextStates.push(nextState);
      dones.push(done);
    }
    const lossFunction = () =>
      tidy(() => {
        const statesTensor = this.statesAsTensor(states);
        const actionTensor = tensor1d(actions, 'int32');
        const qs = (this.qNetwork.model.apply(statesTensor, { training: true }) as Tensor)
          .mul(oneHot(actionTensor, this.player.model.allActions.length))
          .sum(-1);
        const rewardsTensor = tensor1d(rewards);
        const nextStatesTensor = this.statesAsTensor(nextStates);
        const nextMaxQTensor = (this.targetNetwork.model.predict(nextStatesTensor) as Tensor).max(-1);
        const doneMask = scalar(1).sub(tensor1d(dones).asType('float32'));
        const targetQs = rewardsTensor.add(nextMaxQTensor.mul(doneMask).mul(this.adaptation));
        return losses.meanSquaredError(targetQs, qs);
      });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const grads = variableGrads(lossFunction);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.optimizer.applyGradients(grads.grads);
    dispose(grads);
  }

  public statesAsTensor(states: Array<number[]>): Tensor {
    return buffer(
      [states.length, this.player.model.environmentSize.height * this.player.model.environmentSize.width],
      'int32',
      new Int32Array(states.flat())
    ).toTensor();
  }

  private decreaseExplorationChance(): void {
    const newEpsilon = this.currentEpsilon * this.epsilonDecay;
    if (newEpsilon >= this.minEpsilon) {
      this.currentEpsilon = newEpsilon;
    }
  }
}
