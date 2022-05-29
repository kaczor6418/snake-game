import { MoveDirection } from './MoveDirection';
import { ISnakeGameModel } from '../../GameModel/interfaces/ISnakeGameModel';
import { ReinforcementController } from '../../../ReinforcementAgents/interfaces/ReinforcementController';

export interface ISnakeGameController extends ReinforcementController {
  move(direction: MoveDirection): ISnakeGameModel;
}
