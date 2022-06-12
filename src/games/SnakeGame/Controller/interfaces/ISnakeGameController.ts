import { MoveDirection } from './MoveDirection';
import { ISnakeGameModel } from '../../Model/interfaces/ISnakeGameModel';
import { ReinforcementController } from '../../../../agents/interfaces/ReinforcementController';

export interface ISnakeGameController extends ReinforcementController {
  move(direction: MoveDirection): ISnakeGameModel;
}
