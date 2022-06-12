import { ReinforcementPlayer } from '../../../agents/interfaces/ReinforcementPlayer';

export interface ISnakeGame extends ReinforcementPlayer {
  fullScreen(): void;
  restart(): void;
  start(): void;
  stop(): void;
}
