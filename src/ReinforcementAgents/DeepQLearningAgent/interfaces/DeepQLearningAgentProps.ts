import { ReinforcementAgentProps } from '../../interfaces/ReinforcementAgentProps';

export interface DeepQLearningAgentProps extends ReinforcementAgentProps {
  tau: number;
  epsilonDecay: number;
  maxEpsilon: number;
  replayBufferSize: number;
}
