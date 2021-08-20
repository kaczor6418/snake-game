import { ReinforcementAgentProps } from '../../interfaces/ReinforcementAgentProps';

export interface DeepQLearningAgentProps<T> extends ReinforcementAgentProps<T> {
  tau: number;
  epsilonDecay: number;
  maxEpsilon: number;
  replayBufferSize: number;
}
