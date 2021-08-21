import { ReinforcementPlayer } from './ReinforcementPlayer';

export interface ReinforcementAgentProps {
  learningRate: number;
  minEpsilon: number;
  adaptation: number;
  getPossibleActions: () => number[];
  player: ReinforcementPlayer;
}
