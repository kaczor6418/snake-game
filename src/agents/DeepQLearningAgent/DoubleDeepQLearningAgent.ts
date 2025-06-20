import { buffer, dispose, losses, oneHot, Rank, Scalar, scalar, Tensor, Tensor1D, tensor1d, Tensor2D, tidy, variableGrads } from '@tensorflow/tfjs';
import { ReinforcementModel } from '../interfaces/ReinforcementModel';
import { ReinforcementAgent } from '../ReinforcementAgent';
import { DeepQNetwork } from './DeepQNetwork';
import { DoubleDeepQLearningAgentProps } from './interfaces/DoubleDeepQLearningAgentProps';
import { IDeepQNetwork } from './interfaces/IDeepQNetwork';
import { ReplayMemory } from './ReplayMemory';

export class DoubleDeepQLearningAgent extends ReinforcementAgent {
  private replayCounter: number;

  private readonly replayUpdateIndicator: number;
  private readonly batchSize: number;
  private readonly replayMemory: ReplayMemory;
  private readonly onlineNetwork: IDeepQNetwork;
  private readonly targetNetwork: IDeepQNetwork;
  private readonly isReplayMemeoryFilled: Promise<void>;

  constructor({ batchSize, replayUpdateIndicator, replayMemorySize, ...baseAgentProps }: DoubleDeepQLearningAgentProps) {
    super(baseAgentProps);
    this.replayCounter = 1;
    this.batchSize = batchSize;
    this.replayUpdateIndicator = replayUpdateIndicator;
    this.replayMemory = new ReplayMemory(replayMemorySize);
    const inputSize = this.player.model.environmentSize.width * this.player.model.environmentSize.height;
    this.onlineNetwork = new DeepQNetwork(inputSize, this.player.model.allActions.length, this.learningRate);
    this.targetNetwork = new DeepQNetwork(inputSize, this.player.model.allActions.length, this.learningRate, false);
    this.isReplayMemeoryFilled = this.initializeReplayExperienceBuffer();
  }

  protected async runSingleEpoch(): Promise<void> {
    await this.isReplayMemeoryFilled;
    this.player.model.reset();
    let state = this.player.model.copy();
    while (!state.isGameOver()) {
      this.trainOnReplayBatch();
      state = await this.playSingleStep(state);
      if (this.replayCounter % this.replayUpdateIndicator === 0) {
        this.onlineNetwork.copyWeightsToNetwork(this.targetNetwork.model);
      }
      this.replayCounter++;
    }
    this.totalReward.addOrReplace(state.score);
    this.decreaseExplorationChance();
    return Promise.resolve();
  }

  protected async getBestAction(state: ReinforcementModel): Promise<number> {
    const prediction = this.onlineNetwork.model.predict(this.statesAsTensor([state.stateAsVector()])) as Tensor;
    const predictedActions = prediction.argMax(-1).data();
    const bestAction = (await predictedActions)[0];
    dispose(prediction);
    return this.getPossibleActions()[bestAction];
  }

  private async playSingleStep(state: ReinforcementModel): Promise<ReinforcementModel> {
    const action = await this.getAction(state);
    const nextState = this.player.controller.move(action);
    this.replayMemory.addOrReplace([state.stateAsVector(), action, nextState.score, nextState.stateAsVector(), nextState.gameEndState()]);
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
        const statesTensor: Tensor2D = this.statesAsTensor(states);
        const actionTensor: Tensor1D = tensor1d(actions, 'int32');
        const qs: Tensor1D = (this.onlineNetwork.model.apply(statesTensor, { training: true }) as Tensor)
          .mul(oneHot(actionTensor, this.player.model.allActions.length))
          .sum(-1);
        const rewardsTensor: Tensor1D = tensor1d(rewards);
        const nextStatesTensor: Tensor2D = this.statesAsTensor(nextStates);
        const nextMaxQTensor: Tensor1D = (this.targetNetwork.model.predict(nextStatesTensor) as Tensor).max(-1);
        const doneMask: Scalar = scalar(1).sub(tensor1d(dones).asType('float32'));
        const targetQs: Tensor1D = rewardsTensor.add(nextMaxQTensor.mul(doneMask).mul(this.gamma));
        return losses.meanSquaredError(targetQs, qs).asScalar();
      });
    const grads = variableGrads(lossFunction);
    this.onlineNetwork.model.optimizer.applyGradients(grads.grads);
    dispose(grads);
  }

  private async initializeReplayExperienceBuffer(): Promise<void> {
    for (let i = 0; i < this.replayMemory.size; i++) {
      await this.playSingleStep(this.player.model);
      if (this.player.model.isGameOver()) {
        this.totalReward.addOrReplace(this.player.model.score);
        this.player.model.reset();
      }
    }
    this.player.model.reset();
  }

  private statesAsTensor(states: Array<number[]>): Tensor2D {
    return buffer<Rank.R2, 'int32'>(
      [states.length, this.player.model.environmentSize.height * this.player.model.environmentSize.width],
      'int32',
      new Int32Array(states.flat())
    ).toTensor();
  }
}
