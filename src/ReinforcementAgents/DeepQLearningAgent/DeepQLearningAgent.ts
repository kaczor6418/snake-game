import { tensor1d, tensor2d } from '@tensorflow/tfjs';
import { Tensor } from '@tensorflow/tfjs-core';
import { ReinforcementModel } from '../interfaces/ReinforcementModel';
import { ReinforcementAgent } from '../ReinforcementAgent';
import { DeepQNetwork } from './DeepQNetwork';
import { DeepQLearningAgentProps } from './interfaces/DeepQLearningAgentProps';
import { ReplayMemory } from './ReplayMemory';

export class DeepQLearningAgent extends ReinforcementAgent {
  private replayUpdateCounter = 0;
  private replayUpdateIndicator = 10;

  private readonly tau: number;
  private readonly maxEpsilon: number;
  private readonly epsilonDecay: number;
  private readonly replayMemory: ReplayMemory;
  private readonly qNetwork: DeepQNetwork;
  private readonly targetNetwork: DeepQNetwork;

  constructor({ replayBufferSize, epsilonDecay, maxEpsilon, tau, ...baseAgentProps }: DeepQLearningAgentProps) {
    super(baseAgentProps);
    this.tau = tau;
    this.maxEpsilon = maxEpsilon;
    this.epsilonDecay = epsilonDecay;
    this.replayMemory = new ReplayMemory(replayBufferSize);
    const environmentSize = this.player.model.environmentSize.width * this.player.model.environmentSize.height;
    this.qNetwork = new DeepQNetwork(environmentSize, this.player.model.allActions.length);
    this.targetNetwork = new DeepQNetwork(environmentSize, this.player.model.allActions.length, false);
  }

  protected runSingleEpoch(): void {}

  protected getBestAction(state: ReinforcementModel): number {
    return (this.qNetwork.model.predict(tensor1d(state.stateAsVector())) as Tensor).argMax().arraySync() as number;
  }

  private async replayExperience(batchSize: number): Promise<void> {
    const states = [];
    const nextStates = [];
    const randomMemories = this.replayMemory.sample(batchSize);
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
    this.replayUpdateCounter++;
    this.decreaseExplorationChance();
    if (this.replayUpdateCounter === this.replayUpdateIndicator) {
      this.updateTargetModelWeights();
      this.replayUpdateCounter = 0;
    }
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
