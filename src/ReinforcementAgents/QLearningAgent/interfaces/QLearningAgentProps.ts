import { BaseReinforcementAgentProps, ReinforcementAgentProps } from '../../interfaces/ReinforcementAgentProps';

export type QLearningAgentProps = BaseReinforcementAgentProps;

export function isQLearningAgentProps(value: ReinforcementAgentProps): value is QLearningAgentProps {
  return (
    'learningRate' in value &&
    'minEpsilon' in value &&
    'adaptation' in value &&
    'getPossibleActions' in value &&
    'player' in value
  );
}
