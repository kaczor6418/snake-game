import { MoveDirection } from './MoveDirection';

export interface IGameController {
  move(direction: MoveDirection): void;
}
