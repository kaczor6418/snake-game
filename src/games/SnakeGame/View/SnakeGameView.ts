import { ISnakeGameView } from './interfaces/ISnakeGameView';
import { IWebGLService } from '../../../services/WebGLService/interfaces/IWebGLService';
import { Position } from '../Model/interfaces/Position';
import { SnakeGameViewProps } from './interfaces/SnakeGameViewProps';
import { ISnakeGameModel } from '../Model/interfaces/ISnakeGameModel';

export class SnakeGameView implements ISnakeGameView {
  private readonly gameModel: ISnakeGameModel;
  private readonly webGLService: IWebGLService;
  private readonly fieldWidth: number;
  private readonly fieldHeight: number;

  constructor({ gameModel, fieldSize, webGLService }: SnakeGameViewProps) {
    this.gameModel = gameModel;
    this.webGLService = webGLService;
    this.fieldWidth = fieldSize.width;
    this.fieldHeight = fieldSize.height;
  }

  public render(): void {
    this.webGLService.clearCanvas();
    this.gameModel.allSnakeBodyParts.forEach((bodyPart) => this.drawSnakeBodyPart(bodyPart));
    this.gameModel.allFoods.forEach((food) => this.drawFood(food));
  }

  private drawSnakeBodyPart(position: Position): void {
    this.webGLService.drawRectangle(
      this.convertToPositionOnCanvas(position),
      this.fieldWidth,
      this.fieldHeight,
      [0, 1, 0, 1]
    );
  }

  private drawFood(position: Position): void {
    const [x, y] = this.convertToPositionOnCanvas(position);
    this.webGLService.drawTriangle(
      [x, y],
      [x + this.fieldWidth, y],
      [x + this.fieldWidth / 2, y + this.fieldHeight],
      [1, 0, 0, 1]
    );
  }

  private convertToPositionOnCanvas({ x, y }: Position): [x: number, y: number] {
    return [x * this.fieldWidth, y * this.fieldHeight];
  }
}
