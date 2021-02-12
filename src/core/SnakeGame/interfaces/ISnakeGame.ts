import { ReinforcementPlayer } from '../../../services/ReinforcementAgents/interfaces/ReinforcementPlayer';

export interface ISnakeGame<T> extends ReinforcementPlayer<T> {
  fullScreen(): void;
  start(): void;
  stop(): void;
}
