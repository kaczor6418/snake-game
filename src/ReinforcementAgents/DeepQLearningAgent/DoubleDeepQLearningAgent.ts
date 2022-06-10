import { buffer, dispose, losses, oneHot, scalar, Tensor, tensor1d, tidy, variableGrads } from '@tensorflow/tfjs';
import { ReinforcementModel } from '../interfaces/ReinforcementModel';
import { ReinforcementAgent } from '../ReinforcementAgent';
import { DeepQNetwork } from './DeepQNetwork';
import { DoubleDeepQLearningAgentProps } from './interfaces/DoubleDeepQLearningAgentProps';
import { ReplayMemory } from './ReplayMemory';

export class DoubleDeepQLearningAgent extends ReinforcementAgent {
  private replayCounter: number;

  private readonly replayUpdateIndicator: number;
  private readonly minEpsilon: number;
  private readonly epsilonDecay: number;
  private readonly batchSize: number;
  private readonly replayMemory: ReplayMemory;
  private readonly onlineNetwork: DeepQNetwork;
  private readonly targetNetwork: DeepQNetwork;

  constructor({
    batchSize,
    epsilonDecay,
    minEpsilon,
    replayUpdateIndicator,
    replayMemorySize,
    ...baseAgentProps
  }: DoubleDeepQLearningAgentProps) {
    super(baseAgentProps);
    this.replayCounter = 1;
    this.batchSize = batchSize;
    this.replayUpdateIndicator = replayUpdateIndicator;
    this.minEpsilon = minEpsilon;
    this.epsilonDecay = epsilonDecay;
    this.replayMemory = new ReplayMemory(replayMemorySize);
    const inputSize = this.player.model.environmentSize.width * this.player.model.environmentSize.height;
    this.onlineNetwork = new DeepQNetwork(inputSize, this.player.model.allActions.length, this.learningRate);
    this.targetNetwork = new DeepQNetwork(inputSize, this.player.model.allActions.length, this.learningRate, false);
    this.initializeReplayExperienceBuffer();
  }

  protected async runSingleEpoch(): Promise<void> {
    this.player.model.reset();
    let state = this.player.model.copy();
    while (!state.isGameOver()) {
      this.trainOnReplayBatch();
      state = this.playSingleStep(state);
      if (this.replayCounter % this.replayUpdateIndicator) {
        this.onlineNetwork.copyWeightsToNetwork(this.targetNetwork.model);
      }
      this.replayCounter++;
    }
    console.log('EPSILON', this.currentEpsilon);
    console.log('SCORE', state.score);
    this.totalReward.addOrReplace(state.score);
    this.decreaseExplorationChance();
    return Promise.resolve();
  }

  protected getBestAction(state: ReinforcementModel): number {
    let predictedAction = 0;
    tidy(() => {
      const prediction = this.onlineNetwork.model.predict(this.statesAsTensor([state.stateAsVector()])) as Tensor;
      predictedAction = prediction.argMax(-1).dataSync()[0];
    });
    return this.getPossibleActions()[predictedAction];
  }

  private playSingleStep(state: ReinforcementModel): ReinforcementModel {
    const action = this.getAction(state);
    const nextState = this.player.controller.move(action);
    this.replayMemory.addOrReplace([
      state.stateAsVector(),
      action,
      nextState.score,
      nextState.stateAsVector(),
      nextState.gameEndState()
    ]);
    return nextState;
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
        const qs = (this.onlineNetwork.model.apply(statesTensor, { training: true }) as Tensor)
          .mul(oneHot(actionTensor, this.player.model.allActions.length))
          .sum(-1);
        const rewardsTensor = tensor1d(rewards);
        const nextStatesTensor = this.statesAsTensor(nextStates);
        const nextMaxQTensor = (this.targetNetwork.model.predict(nextStatesTensor) as Tensor).max(-1);
        const doneMask = scalar(1).sub(tensor1d(dones).asType('float32'));
        const targetQs = rewardsTensor.add(nextMaxQTensor.mul(doneMask).mul(this.gamma));
        return losses.meanSquaredError(targetQs, qs);
      });
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const grads = variableGrads(lossFunction);
    this.onlineNetwork.model.optimizer.applyGradients(grads.grads);
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
