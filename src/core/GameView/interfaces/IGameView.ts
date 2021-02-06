import { Position } from '../../GameModel/interfaces/Position';

export interface IGameView {
  render(snakeBodyParts: Position[], foods: Position[]): void;
}
