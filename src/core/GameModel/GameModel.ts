import { Position } from './interfaces/Position';
import { GameModelProps } from './interfaces/GameModelProps';
import { MATH_UTILS } from '../../common/Utils/MATH_UTILS';
import { IGameModel } from './interfaces/IGameModel';
import { ARRAY_UTILS } from '../../common/Utils/ARRAY_UTILS';
import { Direction } from './interfaces/Direction';
import { UTILS } from '../../common/Utils/UTILS';
import { isNumber } from '../../common/TYPEGUARDS';

export class GameModel implements IGameModel {
  public score: number;
  public shouldFinish: boolean;
  public snakeHeadDirection: Direction;

  private rowsCount: number;
  private columnsCount: number;
  private lastSnakeTailPart: Position | null;
  private foodPositions: Position[];
  private originalFoodsPositions: Position[];
  private snakeBodyPartsPositions: Position[];

  constructor({ foodCount, rowsCount, columnsCount }: GameModelProps) {
    this.score = 0;
    this.shouldFinish = false;
    this.snakeHeadDirection = Direction.RIGHT;
    this.snakeBodyPartsPositions = [{ x: 0, y: 0 }];
    this.rowsCount = rowsCount;
    this.columnsCount = columnsCount;
    this.lastSnakeTailPart = null;
    this.foodPositions = this.generateRandomFoodsPositions(foodCount);
    this.originalFoodsPositions = ARRAY_UTILS.shellCopy(this.foodPositions);
  }

  get snakeHeadPosition(): Position {
    return this.snakeBodyPartsPositions[0];
  }

  get snakeBodyPartsCount(): number {
    return this.snakeBodyPartsPositions.length;
  }

  public addFood(position: Position): void {
    this.foodPositions.push(position);
  }

  public addNewSnakeTailPart(): void {
    if (UTILS.isDefined(this.lastSnakeTailPart)) {
      this.snakeBodyPartsPositions.unshift(this.lastSnakeTailPart);
    } else {
      throw new Error('Can not add snake tail part before moving head!');
    }
  }

  public setNewSnakeHead(position: Position): void {
    this.lastSnakeTailPart = this.removeSnakeBodyPart(0);
    this.snakeBodyPartsPositions.push(position);
  }

  public isBottomWall(y: number): boolean {
    return y === this.rowsCount;
  }

  public isFoodPosition({ x, y }: Position): boolean {
    return this.foodPositions.some((foodPosition) => foodPosition.x === x && foodPosition.y === y);
  }

  public isGameOver(): boolean {
    return this.shouldFinish || ARRAY_UTILS.isEmpty(this.foodPositions);
  }

  public isLeftWall(x: number): boolean {
    return x < 0;
  }

  public isNotBottomWall(y: number): boolean {
    return y !== this.rowsCount;
  }

  public isNotFoodPosition({ x, y }: Position): boolean {
    return this.foodPositions.every((foodPosition) => foodPosition.x !== x && foodPosition.y !== y);
  }

  public isNotLeftWall(x: number): boolean {
    return x >= 0;
  }

  public isNotRightWall(x: number): boolean {
    return x < this.columnsCount;
  }

  public isNotSnakeBodyPosition({ x, y }: Position): boolean {
    return this.snakeBodyPartsPositions.every((snakeBodyPosition) => snakeBodyPosition.x !== x && snakeBodyPosition.y !== y);
  }

  public isNotTopWall(y: number): boolean {
    return y >= 0;
  }

  public isRightWall(x: number): boolean {
    return x === this.columnsCount;
  }

  public isSnakeBodyPartPosition({ x, y }: Position): boolean {
    return this.snakeBodyPartsPositions.some((snakeBodyPosition) => snakeBodyPosition.x === x && snakeBodyPosition.y === y);
  }

  public isTopWall(y: number): boolean {
    return y < 0;
  }

  public isNotWall({ x, y }: Position): boolean {
    return this.isNotBottomWall(y) && this.isNotLeftWall(x) && this.isNotRightWall(x) && this.isNotTopWall(y);
  }

  public isWall({ x, y }: Position): boolean {
    return this.isBottomWall(y) || this.isLeftWall(x) || this.isRightWall(x) || this.isTopWall(y);
  }

  public removeFood({ x, y }: Position): Position {
    return ARRAY_UTILS.removeElement(
      this.foodPositions,
      this.foodPositions.findIndex(({ x: foodXPosition, y: foodYPosition }) => x === foodXPosition && y === foodYPosition)
    );
  }

  public removeSnakeBodyPart(position: number | Position): Position {
    const indexOfPartToRemove: number = isNumber(position)
      ? position
      : this.foodPositions.findIndex(
          ({ x: snakeXPosition, y: snakeYPosition }) => position.x === snakeXPosition && position.y === snakeYPosition
        );
    return ARRAY_UTILS.removeElement(this.snakeBodyPartsPositions, indexOfPartToRemove);
  }

  public render(): void {
    for (let x = 0; x < this.columnsCount; x++) {
      for (let y = 0; y < this.rowsCount; y++) {
        if (this.isFoodPosition({ x, y })) {
          // code responsible to render food
        } else if (this.isSnakeBodyPartPosition({ x, y })) {
          // code responsible to render snake body part
        } else {
          // code responsible to render grid tile
        }
      }
    }
  }

  public reset(): void {
    this.score = 0;
    this.snakeHeadDirection = Direction.RIGHT;
    this.snakeBodyPartsPositions = [{ x: 0, y: 0 }];
    this.foodPositions = this.originalFoodsPositions;
  }

  public updateBoard(props: Partial<GameModelProps>): void {
    this.reset();
    this.rowsCount = props.rowsCount ?? this.rowsCount;
    this.columnsCount = props.columnsCount ?? this.columnsCount;
    if (UTILS.isDefined(props.foodCount)) {
      this.foodPositions = this.generateRandomFoodsPositions(props.foodCount);
      this.originalFoodsPositions = this.foodPositions;
    }
  }

  private generateRandomFoodsPositions(foodCount: number): Position[] {
    const foodPositions: Position[] = [];
    for (let i = 0; i < foodCount; i++) {
      foodPositions.push({
        x: MATH_UTILS.generateRandomInteger(1, this.columnsCount - 1),
        y: MATH_UTILS.generateRandomInteger(1, this.rowsCount - 1)
      });
    }
    return foodPositions;
  }
}
