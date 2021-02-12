import { ReinforcementPlayer } from '../../../services/ReinforcementAgents/interfaces/ReinforcementPlayer';
import { MoveDirection } from '../../GameController/interfaces/MoveDirection';

export interface ISnakeGame extends ReinforcementPlayer<MoveDirection> {
  fullScreen(): void;
  start(): void;
  stop(): void;
}
