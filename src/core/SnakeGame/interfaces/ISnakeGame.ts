import { ReinforcementPlayer } from '../../../services/ReinforcementAgents/interfaces/ReinforcementPlayer';

export interface ISnakeGame<T extends string> extends ReinforcementPlayer<T> {
  fullScreen(): void;
  start(): void;
  stop(): void;
}
