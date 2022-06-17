import type { ReinforcementPlayer } from './ReinforcementPlayer';
import type { QLearningAgentProps } from '../QLearningAgent/interfaces/QLearningAgentProps';
import type { DoubleDeepQLearningAgentProps } from '../DeepQLearningAgent/interfaces/DoubleDeepQLearningAgentProps';

export interface BaseReinforcementAgentProps {
  learningRate: number;
  initialEpsilon: number;
  gamma: number;
  getPossibleActions: () => number[];
  player: ReinforcementPlayer;

  cumulativeRewardThreshold?: number;
}

export type ReinforcementAgentProps = QLearningAgentProps | DoubleDeepQLearningAgentProps;
