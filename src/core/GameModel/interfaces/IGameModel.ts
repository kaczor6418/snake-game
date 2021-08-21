import { ReinforcementModel } from '../../../ReinforcementAgents/interfaces/ReinforcementModel';
import { Direction } from './Direction';
import { GameModelProps } from './GameModelProps';
import { Position } from './Position';

export interface IGameModel extends ReinforcementModel {
  score: number;
  shouldFinish: boolean;
  snakeHeadDirection: Direction;

  readonly allFoods: Position[];
  readonly allSnakeBodyParts: Position[];
  readonly snakeHeadPosition: Position;
  readonly snakeBodyPartsCount: number;

  addFood(position: Position): void;
  addNewSnakeTailPart(): void;
  isBottomWall(y: number): boolean;
  isFoodPosition(position: Position): boolean;
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
  removeFood(position: Position): Position;
  removeSnakeBodyPart(position: number | Position): Position;
  setNewSnakeHead(position: Position): void;
  updateBoard(props: Partial<GameModelProps>): void;
}
