import { IGameView } from './interfaces/IGameView';
import { IWebGLService } from '../../services/WebGLService/interfaces/IWebGLService';
import { Position } from '../GameModel/interfaces/Position';

export class GameView implements IGameView {
  private readonly webGLService: IWebGLService;
  private readonly fieldWidth: number;
  private readonly fieldHeight: number;

  constructor(webGLService: IWebGLService, fieldWidth: number, fieldHeight: number) {
    this.webGLService = webGLService;
    this.fieldWidth = fieldWidth;
    this.fieldHeight = fieldHeight;
  }

  public render(snakeBodyParts: Position[], foods: Position[]): void {
    this.webGLService.clearCanvas();
    snakeBodyParts.forEach((bodyPart) => this.drawSnakeBodyPart(bodyPart));
    foods.forEach((food) => this.drawFood(food));
  }

  private drawSnakeBodyPart(position: Position): void {
    this.webGLService.drawRectangle(this.convertToPositionOnCanvas(position), this.fieldWidth, this.fieldHeight, [0, 1, 0, 1]);
  }

  private drawFood(position: Position): void {
    const [x, y] = this.convertToPositionOnCanvas(position);
    this.webGLService.drawTriangle([x, y], [x + this.fieldWidth, y], [x + this.fieldWidth / 2, y + this.fieldHeight], [1, 0, 0, 1]);
  }

  private convertToPositionOnCanvas({ x, y }: Position): [x: number, y: number] {
    return [x * this.fieldWidth, y * this.fieldHeight];
  }
}
