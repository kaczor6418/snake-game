import { tensor1d, tensor2d } from '@tensorflow/tfjs';
import { Tensor } from '@tensorflow/tfjs-core';
import { ReinforcementModel } from '../interfaces/ReinforcementModel';
import { ReinforcementAgent } from '../ReinforcementAgent';
import { DeepQNetwork } from './DeepQNetwork';
import { DeepQLearningAgentProps } from './interfaces/DeepQLearningAgentProps';
import { MovingAverage } from './MovingAverage';
import { ReplayMemory } from './ReplayMemory';

export class DeepQLearningAgent extends ReinforcementAgent {
  private readonly minScore: number;
  private readonly replayUpdateTrigger: number;
  private readonly tau: number;
  private readonly maxEpsilon: number;
  private readonly epsilonDecay: number;
  private readonly batchSize: number;
  private readonly replayMemory: ReplayMemory;
  private readonly qNetwork: DeepQNetwork;
  private readonly targetNetwork: DeepQNetwork;

  constructor({
    batchSize,
    minScore,
    epsilonDecay,
    maxEpsilon,
    replayUpdateIndicator,
    tau,
    replayBufferSize,
    ...baseAgentProps
  }: DeepQLearningAgentProps) {
    super(baseAgentProps);
    this.tau = tau ?? 0.85;
    this.minScore = minScore;
    this.batchSize = batchSize;
    this.replayUpdateTrigger = replayUpdateIndicator;
    this.maxEpsilon = maxEpsilon;
    this.epsilonDecay = epsilonDecay;
    this.replayMemory = new ReplayMemory(replayBufferSize ?? this.batchSize * 2);
    const environmentSize = this.player.model.environmentSize.width * this.player.model.environmentSize.height;
    this.qNetwork = new DeepQNetwork(environmentSize, this.player.model.allActions.length);
    this.targetNetwork = new DeepQNetwork(environmentSize, this.player.model.allActions.length, false);
  }

  protected runSingleEpoch(): void {
    this.replayMemory.reset();
    let replayCounter = 1;
    const totalReward = new MovingAverage(100);
    while (totalReward.average() >= this.minScore) {
      this.player.model.reset();
      totalReward.addOrReplace(this.singleRun());
      if (replayCounter % this.replayUpdateTrigger && this.replayMemory.isFull()) {
        void this.replayExperience();
      }
      replayCounter++;
    }
  }

  protected getBestAction(state: ReinforcementModel): number {
    return (this.qNetwork.model.predict(tensor1d(state.stateAsVector())) as Tensor).argMax().arraySync() as number;
  }

  private singleRun(): number {
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

  private async replayExperience(): Promise<void> {
    const states = [];
    const nextStates = [];
    const randomMemories = this.replayMemory.sample(this.batchSize);
    for (const [state, _action, _reward, nextState] of randomMemories) {
      states.push(state);
      nextStates.push(nextState);
    }
    const statesTensor = tensor2d(states);
    const nextStatesTensor = tensor2d(nextStates);
    const stateTargets = (this.qNetwork.model.predictOnBatch(statesTensor) as Tensor).bufferSync();
    const nextStateTargets: Array<number[]> = (
      this.targetNetwork.model.predictOnBatch(nextStatesTensor) as Tensor
    ).arraySync() as Array<number[]>;
    for (let i = 0; i < stateTargets.size; i++) {
      const [_state, action, reward, _nextState, done] = randomMemories[i];
      if (done) {
        stateTargets.set(reward, i, action);
      } else {
        const bestActionQuality = Math.max(...nextStateTargets[i]);
        const newQValue = reward + this.adaptation * bestActionQuality;
        stateTargets.set(newQValue, i, action);
      }
    }
    await this.qNetwork.model.trainOnBatch(statesTensor, stateTargets.toTensor());
    this.decreaseExplorationChance();
    this.updateTargetModelWeights();
  }

  private updateTargetModelWeights(): void {
    const qNetworkWeights: Tensor[] = this.qNetwork.model.getWeights();
    const targetNetworkWeights: Tensor[] = this.targetNetwork.model.getWeights();
    for (let i = 0; i < targetNetworkWeights.length; i++) {
      const targetTensorBuffer = targetNetworkWeights[i].bufferSync();
      const qTensorBuffer = qNetworkWeights[i].bufferSync();
      for (let j = 0; j < targetTensorBuffer.size; j++) {
        const newWeight = this.tau * qTensorBuffer.get(0, j) + (1 - this.tau) * targetTensorBuffer.get(0, j);
        targetTensorBuffer.set(newWeight, 0, j);
      }
    }
  }

  private decreaseExplorationChance(): void {
    const newEpsilon = this.maxEpsilon * this.epsilonDecay;
    if (newEpsilon >= this.minEpsilon) {
      this.currentEpsilon = newEpsilon;
    }
  }
}
