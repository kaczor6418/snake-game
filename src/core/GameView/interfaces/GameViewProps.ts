import { FieldSize } from './FieldSize';
import { IWebGLService } from '../../../services/WebGLService/interfaces/IWebGLService';
import { IGameModel } from '../../GameModel/interfaces/IGameModel';

export interface GameViewProps {
  gameModel: IGameModel;
  webGLService: IWebGLService;
  fieldSize: FieldSize;
}
