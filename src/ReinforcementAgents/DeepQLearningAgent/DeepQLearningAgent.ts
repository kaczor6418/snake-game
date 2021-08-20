/* eslint-disable */
// @ts-nocheck
import * as tf from '@tensorflow/tfjs';
import { ReinforcementModel } from '../interfaces/ReinforcementModel';
import { ReinforcementAgent } from '../ReinforcementAgent';
import { DeepQNetwork } from './DeepQNetwork';
import { DeepQLearningAgentProps } from './interfaces/DeepQLearningAgentProps';
import { ReplayMemory } from './ReplayMemory';

export class DeepQLearningAgent<T> extends ReinforcementAgent<T> {
  private replayUpdateCounter = 0;
  private replayUpdateIndicator = 10;

  private readonly tau: number;
  private readonly maxEpsilon: number;
  private readonly epsilonDecay: number;
  private readonly replayMemory: ReplayMemory;
  private readonly qNetwork: DeepQNetwork;
  private readonly targetNetwork: DeepQNetwork;

  constructor({ replayBufferSize, epsilonDecay, maxEpsilon, tau, ...baseAgentProps }: DeepQLearningAgentProps<T>) {
    super(baseAgentProps);
    this.tau = tau;
    this.maxEpsilon = maxEpsilon;
    this.epsilonDecay = epsilonDecay;
    this.replayMemory = new ReplayMemory(replayBufferSize);
    const environmentSize = this.player.model.environmentSize.width * this.player.model.environmentSize.height;
    this.qNetwork = new DeepQNetwork(environmentSize, this.player.model.allActions.length);
    this.targetNetwork = new DeepQNetwork(environmentSize, this.player.model.allActions.length, false);
  }

  protected getBestAction(state: ReinforcementModel<T>): T {
    return this.qNetwork.model.predict(tf.tensor(state.stateAsVector())).argMax().arraySync();
  }

  private async replayExperience(batchSize: number): Promise<void> {
    const states = [];
    const nextStates = [];
    const randomMemories = this.replayMemory.sample(batchSize);
    for (const [state, _action, _reward, nextState] of randomMemories) {
      states.push(state);
      nextStates.push(nextState);
    }
    const statesTensor = tf.tensor(states);
    const nextStatesTensor = tf.tensor(nextStates);
    const stateTargets = this.qNetwork.model.predictOnBatch(statesTensor);
    const nextStateTargets = this.targetNetwork.model.predictOnBatch(nextStatesTensor);
    for (let i = 0; i < randomMemories.length; i++) {
      const [_state, action, reward, _nextState, done] = randomMemories[i].arraySync();
      if (done) {
        stateTargets.bufferSync().set(reward, i, action);
      } else {
        const bestActionQuality = Math.max(...nextStateTargets[i].arraySync());
        const newQValue = reward + this.adaptation * bestActionQuality;
        stateTargets.bufferSync().set(newQValue, i, action);
      }
    }
    await this.qNetwork.model.trainOnBatch(statesTensor, stateTargets);
    this.replayUpdateCounter++;
    this.decreaseExplorationChance();
    if (this.replayUpdateCounter === this.replayUpdateIndicator) {
      this.updateWeights;
      this.replayUpdateCounter = 0;
    }
  }

  private updateTargetModel(): void {
    const qNetworkWeights = this.qNetwork.model.getWeights();
    const targetNetworkWeights = this.targetNetwork.model.getWeights();
    const singleBufferSize = targetNetworkWeights[0].arraySync().length;
    for (let i = 0; i < targetNetworkWeights.length; i++) {
      const targetTensorBuffer = targetNetworkWeights[i].bufferSync();
      const qTensorBuffer = qNetworkWeights[i].bufferSync();
      for (let j = 0; j < singleBufferSize; j++) {
        const newWeight = this.tau * qTensorBuffer.get(0, j) + (1 - this.tau) * targetTensorBuffer.get(0, j);
        targetTensorBuffer.set(newWeight, 0, j);
      }
    }
  }

  private takeStep() {}

  private decreaseExplorationChance(): void {
    const newEpsilon = this.maxEpsilon * this.epsilonDecay;
    if (newEpsilon >= this.minEpsilon) {
      this.currentEpsilon = newEpsilon;
    }
  }
}
