import {
  AdamOptimizer,
  buffer,
  dispose,
  losses,
  oneHot,
  scalar,
  Tensor,
  tensor1d,
  tidy,
  train,
  variableGrads
} from '@tensorflow/tfjs';
import { ReinforcementModel } from '../interfaces/ReinforcementModel';
import { ReinforcementAgent } from '../ReinforcementAgent';
import { DeepQNetwork } from './DeepQNetwork';
import { DoubleDeepQLearningAgentProps } from './interfaces/DoubleDeepQLearningAgentProps';
import { ReplayMemory } from './ReplayMemory';

export class DoubleDeepQLearningAgent extends ReinforcementAgent {
  private readonly replayUpdateIndicator: number;
  private readonly minEpsilon: number;
  private readonly epsilonDecay: number;
  private readonly batchSize: number;
  private readonly optimizer: AdamOptimizer;
  private readonly replayMemory: ReplayMemory;
  private readonly predictingNetwork: DeepQNetwork;
  private readonly trainingNetwork: DeepQNetwork;

  constructor({
    batchSize,
    epsilonDecay,
    minEpsilon,
    replayUpdateIndicator,
    ...baseAgentProps
  }: DoubleDeepQLearningAgentProps) {
    super(baseAgentProps);
    this.batchSize = batchSize;
    this.replayUpdateIndicator = replayUpdateIndicator;
    this.minEpsilon = minEpsilon;
    this.epsilonDecay = epsilonDecay;
    this.replayMemory = new ReplayMemory(this.batchSize * 3);
    this.optimizer = train.adam(this.learningRate);
    const inputSize = this.player.model.environmentSize.width * this.player.model.environmentSize.height;
    this.predictingNetwork = new DeepQNetwork(inputSize, this.player.model.allActions.length, this.learningRate);
    this.trainingNetwork = new DeepQNetwork(inputSize, this.player.model.allActions.length, this.learningRate);
    this.initializeReplayExperienceBuffer();
  }

  protected async runSingleEpoch(): Promise<void> {
    let replayCounter = 1;
    this.player.model.reset();
    let state = this.player.model.copy();
    while (!state.isGameOver()) {
      this.trainOnReplayBatch();
      const nextState = this.playSingleStep(state);
      state = nextState.copy();
      this.totalReward.addOrReplace(state.score);
      if (replayCounter % this.replayUpdateIndicator) {
        this.trainingNetwork.copyWeightsToNetwork(this.predictingNetwork.model);
      }
      replayCounter++;
    }
    this.decreaseExplorationChance();
    return Promise.resolve();
  }

  protected getBestAction(state: ReinforcementModel): number {
    let predictedAction = 0;
    tidy(() => {
      const prediction = this.predictingNetwork.model.predict(this.statesAsTensor([state.stateAsVector()])) as Tensor;
      predictedAction = prediction.argMax(-1).dataSync()[0];
    });
    return predictedAction;
  }

  private playSingleStep(state: ReinforcementModel): ReinforcementModel {
    const action = this.getAction(state);
    const nextState = this.player.controller.move(action);
    this.replayMemory.addOrReplace([
      state.stateAsVector(),
      action,
      nextState.score,
      nextState.stateAsVector(),
      Number(nextState.isGameOver())
    ]);
    return nextState;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
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
        const qs = (this.predictingNetwork.model.apply(statesTensor, { training: true }) as Tensor)
          .mul(oneHot(actionTensor, this.player.model.allActions.length))
          .sum(-1);
        const rewardsTensor = tensor1d(rewards);
        const nextStatesTensor = this.statesAsTensor(nextStates);
        const nextMaxQTensor = (this.trainingNetwork.model.predict(nextStatesTensor) as Tensor).max(-1);
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

  private initializeReplayExperienceBuffer(): void {
    for (let i = 0; i < this.replayMemory.size; i++) {
      if (this.playSingleStep(this.player.model).isGameOver()) {
        this.player.model.reset();
      }
    }
    this.player.model.reset();
  }

  private statesAsTensor(states: Array<number[]>): Tensor {
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
