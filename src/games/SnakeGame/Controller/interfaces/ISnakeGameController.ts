import { MoveDirection } from './MoveDirection';
import { ISnakeGameModel } from '../../Model/interfaces/ISnakeGameModel';
import { ReinforcementController } from '../../../../ReinforcementAgents/interfaces/ReinforcementController';

export interface ISnakeGameController extends ReinforcementController {
  move(direction: MoveDirection): ISnakeGameModel;
}
