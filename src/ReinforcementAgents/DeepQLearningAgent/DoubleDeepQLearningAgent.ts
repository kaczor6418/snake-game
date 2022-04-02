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
    this.targetNetwork = new DeepQNetwork(inputSize, this.player.model.allActions.length, this.learningRate);
  }

  protected async runSingleEpoch(): Promise<void> {
    let replayCounter = 1;
    const totalReward = new MovingAverage(100);
    while (replayCounter < this.minScore) {
      totalReward.addOrReplace(this.singleRun());
      if (this.replayMemory.isFull()) {
        await this.replayExperience();
        this.targetNetwork.copyWeightsToNetwork(this.qNetwork.model);
      }
      if (replayCounter % this.replayUpdateIndicator && this.replayMemory.isFull()) {
        console.log('Score:', this.player.model.score);
        console.log('Epsilon;', this.currentEpsilon);
      }
      replayCounter++;
    }
    this.decreaseExplorationChance();
    return Promise.resolve();
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

  public trainOnReplayBatch(): void {
    const states: Array<number[]> = [];
    const actions: number[] = [];
    const rewards: number[] = [];
    const nextStates: Array<number[]> = [];
    const dones: number[] = [];
    console.log(
      'MIN',
      Math.min(
        ...this.qNetwork.model
          .getWeights()
          .map((l) => Array.from(l.bufferSync().values).flat())
          .flat()
      )
    );
    console.log(
      'MAX',
      Math.max(
        ...this.qNetwork.model
          .getWeights()
          .map((l) => Array.from(l.bufferSync().values).flat())
          .flat()
      )
    );
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

  public async replayExperience(): Promise<void> {
    console.log(
      'MIN',
      Math.min(
        ...this.qNetwork.model
          .getWeights()
          .map((l) => Array.from(l.bufferSync().values).flat())
          .flat()
      )
    );
    console.log(
      'MAX',
      Math.max(
        ...this.qNetwork.model
          .getWeights()
          .map((l) => Array.from(l.bufferSync().values).flat())
          .flat()
      )
    );
    const states = [];
    const nextStates = [];
    const randomMemories = this.replayMemory.sample(this.batchSize);
    for (const [state, _action, _reward, nextState] of randomMemories) {
      states.push(state);
      nextStates.push(nextState);
    }
    const statesTensor = this.statesAsTensor(states);
    const nextStatesTensor = this.statesAsTensor(nextStates);
    const stateTargets = (this.qNetwork.model.predictOnBatch(statesTensor) as Tensor).bufferSync();
    const nextStateTargets: Array<number[]> = (
      this.targetNetwork.model.predictOnBatch(nextStatesTensor) as Tensor
    ).arraySync() as Array<number[]>;
    for (let i = 0; i < stateTargets.shape[0]; i++) {
      const [_state, action, reward, _nextState, done] = randomMemories[i];
      if (done) {
        stateTargets.set(reward, i, action);
      } else {
        const bestActionQuality = Math.max(...nextStateTargets[i]);
        const newQValue = reward + this.adaptation * bestActionQuality;
        stateTargets.set(newQValue, i, action);
      }
    }
    await this.targetNetwork.model.trainOnBatch(statesTensor, stateTargets.toTensor());
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
