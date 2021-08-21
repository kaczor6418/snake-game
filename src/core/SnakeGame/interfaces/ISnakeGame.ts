import { ReinforcementPlayer } from '../../../ReinforcementAgents/interfaces/ReinforcementPlayer';

export interface ISnakeGame extends ReinforcementPlayer {
  fullScreen(): void;
  restart(): void;
  start(): void;
  stop(): void;
}
