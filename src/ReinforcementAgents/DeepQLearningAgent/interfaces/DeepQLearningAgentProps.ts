import { ReinforcementAgentProps } from '../../interfaces/ReinforcementAgentProps';

export interface DeepQLearningAgentProps extends ReinforcementAgentProps {
  batchSize: number;
  epsilonDecay: number;
  maxEpsilon: number;
  minScore: number;
  replayUpdateIndicator: number;

  replayBufferSize?: number;
  tau?: number;
}
