import { ReinforcementAgentProps } from '../../interfaces/ReinforcementAgentProps';

export interface DeepQLearningAgentProps<T> extends ReinforcementAgentProps<T> {
  epsilonDecay: number;
  maxEpsilon: number;
  replayBufferSize: number;
}
