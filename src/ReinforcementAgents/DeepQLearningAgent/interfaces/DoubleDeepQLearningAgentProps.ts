import { BaseReinforcementAgentProps, ReinforcementAgentProps } from '../../interfaces/ReinforcementAgentProps';
import { isQLearningAgentProps } from '../../QLearningAgent/interfaces/QLearningAgentProps';

export interface DoubleDeepQLearningAgentProps extends BaseReinforcementAgentProps {
  batchSize: number;
  epsilonDecay: number;
  minEpsilon: number;
  minScore: number;
  replayUpdateIndicator: number;
}

export function isDoubleDeepQLearningAgentProps(
  value: ReinforcementAgentProps
): value is DoubleDeepQLearningAgentProps {
  return isQLearningAgentProps(value) && 'batchSize' in value;
}
