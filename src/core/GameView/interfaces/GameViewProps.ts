import { FieldSize } from './FieldSize';
import { IWebGLService } from '../../../services/WebGLService/interfaces/IWebGLService';
import { ISnakeGameModel } from '../../GameModel/interfaces/ISnakeGameModel';

export interface GameViewProps {
  gameModel: ISnakeGameModel;
  webGLService: IWebGLService;
  fieldSize: FieldSize;
}
