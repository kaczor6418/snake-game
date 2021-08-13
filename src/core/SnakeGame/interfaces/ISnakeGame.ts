import { ReinforcementPlayer } from '../../../ReinforcementAgents/interfaces/ReinforcementPlayer';
import { MoveDirection } from '../../GameController/interfaces/MoveDirection';

export interface ISnakeGame extends ReinforcementPlayer<MoveDirection> {
  fullScreen(): void;
  restart(): void;
  start(): void;
  stop(): void;
}
