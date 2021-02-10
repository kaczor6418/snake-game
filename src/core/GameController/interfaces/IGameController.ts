import { MoveDirection } from './MoveDirection';
import { IGameModel } from '../../GameModel/interfaces/IGameModel';
import { ReinforcementController } from '../../../services/ReinforcementAgents/interfaces/ReinforcementController';

export type IGameController = ReinforcementController<keyof typeof MoveDirection> & {
  move(direction: MoveDirection): IGameModel;
};
