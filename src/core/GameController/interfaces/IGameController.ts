import { MoveDirection } from './MoveDirection';
import { IGameModel } from '../../GameModel/interfaces/IGameModel';
import { ReinforcementController } from '../../../services/ReinforcementAgents/interfaces/ReinforcementController';

export interface IGameController extends ReinforcementController<MoveDirection> {
  move(direction: MoveDirection): IGameModel;
}
