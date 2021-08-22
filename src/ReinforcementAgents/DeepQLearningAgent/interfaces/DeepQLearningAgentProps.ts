import { ReinforcementAgentProps } from '../../interfaces/ReinforcementAgentProps';

export interface DeepQLearningAgentProps extends ReinforcementAgentProps {
  epsilonDecay: number;
  maxEpsilon: number;
  minScore: number;

  replayBufferSize?: number;
  tau?: number;
}
