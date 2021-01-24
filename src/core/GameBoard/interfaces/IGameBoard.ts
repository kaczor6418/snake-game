import { Position } from './Position';
import { MoveDirection } from './MoveDirection';

export interface IGameBoard {
  addFood(position: Position): void;
  addSnakeBodyPart(position: Position): void;
  getGameScore(): number;
  isBottomWall(y: number): boolean;
  isFoodPosition({ x, y }: Position): boolean;
  isGameOver(): boolean;
  isLeftWall(x: number): boolean;
  isRightWall(x: number): boolean;
  isTopWall(y: number): boolean;
  isSnakeBodyPartPosition({ x, y }: Position): boolean;
  isNotFoodPosition({ x, y }: Position): boolean;
  isNotBottomWall(y: number): boolean;
  isNotLeftWall(x: number): boolean;
  isNotRightWall(x: number): boolean;
  isNotTopWall(y: number): boolean;
  isNotSnakeBodyPosition({ x, y }: Position): boolean;
  moveSnake(direction: MoveDirection): void;
  render(): void;
  removeFood(position: Position): void;
  removeSnakeBodyPart(position: Position): void;
}
