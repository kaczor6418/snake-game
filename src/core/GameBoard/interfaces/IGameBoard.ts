import { Position } from './Position';
import { Direction } from './Direction';
import { GameBoardProps } from './GameBoardProps';

export interface IGameBoard {
  score: number;
  snakeHeadDirection: Direction;

  addFood(position: Position): void;
  addSnakeBodyPart(position: Position): void;
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
  render(): void;
  removeFood(position: Position): void;
  removeSnakeBodyPart(position: Position): void;
  resetBoard(): void;
  updateBoard(props: Partial<GameBoardProps>): void;
}
