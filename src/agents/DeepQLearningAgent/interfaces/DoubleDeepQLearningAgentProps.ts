import type { BaseReinforcementAgentProps, ReinforcementAgentProps } from '../../interfaces/ReinforcementAgentProps';
import { isQLearningAgentProps } from '../../QLearningAgent/interfaces/QLearningAgentProps';

export interface DoubleDeepQLearningAgentProps extends BaseReinforcementAgentProps {
  batchSize: number;
  replayUpdateIndicator: number;
  replayMemorySize: number;
}

export function isDoubleDeepQLearningAgentProps(value: ReinforcementAgentProps): value is DoubleDeepQLearningAgentProps {
  return isQLearningAgentProps(value) && 'batchSize' in value;
}
