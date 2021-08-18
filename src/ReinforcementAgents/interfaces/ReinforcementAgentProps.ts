import { ReinforcementPlayer } from './ReinforcementPlayer';

export interface ReinforcementAgentProps<T> {
  learningRate: number;
  minEpsilon: number;
  adaptation: number;
  getPossibleActions: () => T[];
  player: ReinforcementPlayer<T>;
}
