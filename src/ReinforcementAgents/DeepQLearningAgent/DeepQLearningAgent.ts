/* eslint-disable */
// @ts-nocheck
import * as tf from '@tensorflow/tfjs';
import { ReinforcementModel } from '../interfaces/ReinforcementModel';
import { ReinforcementAgent } from '../ReinforcementAgent';
import { DeepQNetwork } from './DeepQNetwork';
import { DeepQLearningAgentProps } from './interfaces/DeepQLearningAgentProps';
import { ReplayMemory } from './ReplayMemory';

export class DeepQLearningAgent<T> extends ReinforcementAgent<T> {
  private currentEpsilon: number;

  private readonly maxEpsilon: number;
  private readonly epsilonDecay: number;
  private readonly replayMemory: ReplayMemory;
  private readonly qNetwork: DeepQNetwork;
  private readonly targetNetwork: DeepQNetwork;

  constructor({ replayBufferSize, epsilonDecay, maxEpsilon, ...baseAgentProps }: DeepQLearningAgentProps<T>) {
    super(baseAgentProps);
    this.epsilonDecay = epsilonDecay;
    this.maxEpsilon = maxEpsilon;
    this.replayMemory = new ReplayMemory(replayBufferSize);
    this.currentEpsilon = this.minEpsilon;
    this.qNetwork = new DeepQNetwork(
      this.player.model.environmentSize.width,
      this.player.model.environmentSize.height,
      this.player.model.allActions.length
    );
    this.targetNetwork = new DeepQNetwork(
      this.player.model.environmentSize.width,
      this.player.model.environmentSize.height,
      this.player.model.allActions.length,
      false
    );
  }

  protected getAction(state: ReinforcementModel<T>): T {
    const possibleActions = this.getPossibleActions();
  }

  private getBestAction(state: ReinforcementModel<T>): T {
  }

  private decreaseExplorationChance(): void {
    const newEpsilon = this.maxEpsilon * this.epsilonDecay;
    if (newEpsilon >= this.minEpsilon) {
      this.currentEpsilon = newEpsilon;
    }
  }
}
