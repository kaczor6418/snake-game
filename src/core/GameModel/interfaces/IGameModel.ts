import { Position } from './Position';
import { Direction } from './Direction';
import { GameModelProps } from './GameModelProps';

export interface IGameModel {
  score: number;
  snakeHeadDirection: Direction;
  readonly snakeHeadPosition: Position;
  readonly snakeBodyPartsCount: number;

  addFood(position: Position): void;
  addSnakeBodyPart(position: Position): void;
  insertSnakeBodyPartBeforeHead(position: Position): void;
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
  removeFood(position: Position): Position;
  removeSnakeBodyPart(position: number): Position;
  removeSnakeBodyPart(position: Position): Position;
  reset(): void;
  updateBoard(props: Partial<GameModelProps>): void;
}
