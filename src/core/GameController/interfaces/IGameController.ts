import { MoveDirection } from './MoveDirection';
import { IGameModel } from '../../GameModel/interfaces/IGameModel';
import { ReinforcementController } from '../../../ReinforcementAgents/interfaces/ReinforcementController';

export interface IGameController extends ReinforcementController {
  move(direction: MoveDirection): IGameModel;
}
