import { EnvironmentSize } from '../../common/interfaces/EnvironmentSize';
import { isNumber } from '../../common/TYPEGUARDS';
import { ARRAY_UTILS } from '../../common/Utils/ARRAY_UTILS';
import { MATH_UTILS } from '../../common/Utils/MATH_UTILS';
import { UTILS } from '../../common/Utils/UTILS';
import { InvalidPositionError } from '../../errors/InvalidPositionError';
import { MoveDirection } from '../GameController/interfaces/MoveDirection';
import { Direction } from './interfaces/Direction';
import { SnakeGameModelProps } from './interfaces/SnakeGameModelProps';
import { ISnakeGameModel } from './interfaces/ISnakeGameModel';
import { Position } from './interfaces/Position';
import { SnakeEnvironmentElements } from './interfaces/SnakeEnvironmentElements';

export class SnakeGameModel implements ISnakeGameModel {
  public score: number;
  public shouldFinish: boolean;
  public snakeHeadDirection: Direction;

  private rowsCount: number;
  private columnsCount: number;
  private lastSnakeTailPart: Position;
  private foodPositions: Position[];
  private originalFoodsPositions: Position[];
  private snakeBodyPartsPositions: Position[];

  constructor({ foodCount, rowsCount, columnsCount }: SnakeGameModelProps) {
    this.score = 0;
    this.shouldFinish = false;
    this.snakeHeadDirection = Direction.RIGHT;
    this.snakeBodyPartsPositions = [{ x: 0, y: 0 }];
    this.rowsCount = rowsCount;
    this.columnsCount = columnsCount;
    this.lastSnakeTailPart = { x: 0, y: 0 };
    this.foodPositions = this.generateRandomFoodsPositions(foodCount);
    this.originalFoodsPositions = ARRAY_UTILS.shellCopy(this.foodPositions);
  }

  get allActions(): MoveDirection[] {
    return [MoveDirection.LEFT, MoveDirection.RIGHT, MoveDirection.STRAIGHT];
  }

  get allFoods(): Position[] {
    return this.foodPositions;
  }

  get allSnakeBodyParts(): Position[] {
    return this.snakeBodyPartsPositions;
  }

  get environmentSize(): EnvironmentSize {
    return {
      width: this.columnsCount,
      height: this.rowsCount
    };
  }

  get snakeHeadPosition(): Position {
    return this.snakeBodyPartsPositions[this.snakeBodyPartsCount - 1];
  }

  get snakeBodyPartsCount(): number {
    return this.snakeBodyPartsPositions.length;
  }

  public addFood(position: Position): void {
    if (position.x >= this.columnsCount || position.y >= this.rowsCount) {
      throw new InvalidPositionError(
        `Can not add food under: ${JSON.stringify(position)} position if x is bigger than total rows count(${
          this.rowsCount - 1
        }) or y is bigger than total columns count(${this.columnsCount - 1})`
      );
    }
    const hasFoodUnderNewPosition = this.foodPositions.some((foodPosition) =>
      UTILS.isObjectWithSameKeyValues(position, foodPosition)
    );
    if (hasFoodUnderNewPosition) {
      throw new InvalidPositionError(
        `Can not add food under: ${JSON.stringify(position)} if there is already food under this position`
      );
    }
    this.foodPositions.push(position);
  }

  public addNewSnakeTailPart(): void {
    this.snakeBodyPartsPositions.unshift(this.lastSnakeTailPart);
  }

  public copy(): ISnakeGameModel {
    const gameModelCopy = new SnakeGameModel({
      columnsCount: this.columnsCount,
      rowsCount: this.rowsCount,
      foodCount: 0
    });
    gameModelCopy.score = this.score;
    gameModelCopy.shouldFinish = this.shouldFinish;
    gameModelCopy.snakeHeadDirection = this.snakeHeadDirection;
    gameModelCopy.setFoodsOriginalPositions(ARRAY_UTILS.shellCopy(this.originalFoodsPositions));
    gameModelCopy.setFoodsPositions(ARRAY_UTILS.shellCopy(this.foodPositions));
    gameModelCopy.setSnakeBodyPartsPositions(ARRAY_UTILS.shellCopy(this.snakeBodyPartsPositions));
    return gameModelCopy;
  }

  public hash(): string {
    return this.stateAsVector().toString().replace(/,/g, '');
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
    return this.snakeBodyPartsPositions.every(
      (snakeBodyPosition) => snakeBodyPosition.x !== x && snakeBodyPosition.y !== y
    );
  }

  public isNotTopWall(y: number): boolean {
    return y >= 0;
  }

  public isRightWall(x: number): boolean {
    return x === this.columnsCount;
  }

  public isSnakeBodyPartPosition({ x, y }: Position): boolean {
    return this.snakeBodyPartsPositions.some(
      (snakeBodyPosition) => snakeBodyPosition.x === x && snakeBodyPosition.y === y
    );
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
      this.foodPositions.findIndex(
        ({ x: foodXPosition, y: foodYPosition }) => x === foodXPosition && y === foodYPosition
      )
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

  public reset(): void {
    this.score = 0;
    this.shouldFinish = false;
    this.snakeHeadDirection = Direction.RIGHT;
    this.snakeBodyPartsPositions = [{ x: 0, y: 0 }];
    this.lastSnakeTailPart = { x: 0, y: 0 };
    this.foodPositions = ARRAY_UTILS.shellCopy(this.originalFoodsPositions);
  }

  public setNewSnakeHead(position: Position): void {
    this.lastSnakeTailPart = this.removeSnakeBodyPart(0);
    this.snakeBodyPartsPositions.push(position);
  }

  public updateBoard(props: Partial<SnakeGameModelProps>): void {
    this.reset();
    this.rowsCount = props.rowsCount ?? this.rowsCount;
    this.columnsCount = props.columnsCount ?? this.columnsCount;
    if (UTILS.isDefined(props.foodCount)) {
      this.foodPositions = this.generateRandomFoodsPositions(props.foodCount);
      this.originalFoodsPositions = this.foodPositions;
    }
  }

  public stateAsVector(): number[] {
    const modelVector = new Array<number>(this.rowsCount * this.columnsCount).fill(0);
    const snakeHeadPosition = this.snakeHeadPosition.x * this.columnsCount + this.snakeHeadPosition.y;
    for (const { x, y } of this.foodPositions) {
      modelVector[x * this.columnsCount + y] = Number(SnakeEnvironmentElements.FOOD);
    }
    for (const { x, y } of this.snakeBodyPartsPositions) {
      const bodyPartPosition = x * this.columnsCount + y;
      if (bodyPartPosition >= 0 && bodyPartPosition !== snakeHeadPosition) {
        modelVector[x * this.columnsCount + y] = Number(SnakeEnvironmentElements.BODY_PART);
      }
    }
    if (snakeHeadPosition < modelVector.length) {
      modelVector[snakeHeadPosition] = Number(`${modelVector[snakeHeadPosition]}${this.snakeHeadDirection}`);
    }
    return modelVector;
  }

  protected setSnakeBodyPartsPositions(snakeBodyPartsPositions: Position[]): void {
    this.snakeBodyPartsPositions = snakeBodyPartsPositions;
  }

  protected setFoodsPositions(foodsPositions: Position[]): void {
    this.foodPositions = foodsPositions;
  }

  protected setFoodsOriginalPositions(originalFoodsPositions: Position[]): void {
    this.originalFoodsPositions = originalFoodsPositions;
  }

  private generateRandomFoodsPositions(foodCount: number): Position[] {
    const foodPositions: Position[] = [];
    for (let i = 0; i < foodCount; i++) {
      let uniqueFoodPosition = {
        x: MATH_UTILS.generateRandomInteger(0, this.columnsCount),
        y: MATH_UTILS.generateRandomInteger(0, this.rowsCount)
      };
      while (
        ARRAY_UTILS.hasObjectWithSameShape(foodPositions, uniqueFoodPosition) ||
        (uniqueFoodPosition.x === 0 && uniqueFoodPosition.y === 0)
      ) {
        uniqueFoodPosition = {
          x: MATH_UTILS.generateRandomInteger(0, this.columnsCount),
          y: MATH_UTILS.generateRandomInteger(0, this.rowsCount)
        };
      }
      foodPositions.push(uniqueFoodPosition);
    }
    return foodPositions;
  }
}
