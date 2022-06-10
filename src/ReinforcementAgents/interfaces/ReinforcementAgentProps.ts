import { ReinforcementPlayer } from './ReinforcementPlayer';
import { QLearningAgentProps } from '../QLearningAgent/interfaces/QLearningAgentProps';
import { DoubleDeepQLearningAgentProps } from '../DeepQLearningAgent/interfaces/DoubleDeepQLearningAgentProps';

export interface BaseReinforcementAgentProps {
  learningRate: number;
  initialEpsilon: number;
  gamma: number;
  getPossibleActions: () => number[];
  player: ReinforcementPlayer;

  cumulativeRewardThreshold?: number;
}

export type ReinforcementAgentProps = QLearningAgentProps | DoubleDeepQLearningAgentProps;
