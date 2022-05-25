import { MoveDirection } from './MoveDirection';
import { ISnakeGameModel } from '../../GameModel/interfaces/ISnakeGameModel';
import { ReinforcementController } from '../../../ReinforcementAgents/interfaces/ReinforcementController';

export interface IGameController extends ReinforcementController {
  move(direction: MoveDirection): ISnakeGameModel;
}
