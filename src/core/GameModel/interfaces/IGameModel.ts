import { Position } from './Position';
import { Direction } from './Direction';
import { GameModelProps } from './GameModelProps';

export interface IGameModel {
  score: number;
  shouldFinish: boolean;
  snakeHeadDirection: Direction;
  readonly snakeHeadPosition: Position;
  readonly snakeBodyPartsCount: number;

  addFood(position: Position): void;
  addNewSnakeTailPart(): void;
  isBottomWall(y: number): boolean;
  isFoodPosition(position: Position): boolean;
  isGameOver(): boolean;
  isLeftWall(x: number): boolean;
  isRightWall(x: number): boolean;
  isTopWall(y: number): boolean;
  isSnakeBodyPartPosition(position: Position): boolean;
  isNotFoodPosition(position: Position): boolean;
  isNotBottomWall(y: number): boolean;
  isNotLeftWall(x: number): boolean;
  isNotRightWall(x: number): boolean;
  isNotTopWall(y: number): boolean;
  isNotSnakeBodyPosition(position: Position): boolean;
  isNotWall(position: Position): boolean;
  isWall(position: Position): boolean;
  render(): void;
  removeFood(position: Position): Position;
  removeSnakeBodyPart(position: number): Position;
  removeSnakeBodyPart(position: Position): Position;
  reset(): void;
  setNewSnakeHead(position: Position): void;
  updateBoard(props: Partial<GameModelProps>): void;
}
