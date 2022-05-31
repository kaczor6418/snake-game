import { FieldSize } from './FieldSize';
import { IWebGLService } from '../../../../services/WebGLService/interfaces/IWebGLService';
import { ISnakeGameModel } from '../../Model/interfaces/ISnakeGameModel';

export interface SnakeGameViewProps {
  gameModel: ISnakeGameModel;
  webGLService: IWebGLService;
  fieldSize: FieldSize;
}
