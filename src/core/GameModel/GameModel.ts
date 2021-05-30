import { Position } from './interfaces/Position';
import { GameModelProps } from './interfaces/GameModelProps';
import { MATH_UTILS } from '../../common/Utils/MATH_UTILS';
import { IGameModel } from './interfaces/IGameModel';
import { ARRAY_UTILS } from '../../common/Utils/ARRAY_UTILS';
import { Direction } from './interfaces/Direction';
import { UTILS } from '../../common/Utils/UTILS';
import { isNumber } from '../../common/TYPEGUARDS';
import { ReinforcementModel } from '../../services/ReinforcementAgents/interfaces/ReinforcementModel';

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
    this.lastSnakeTailPart = { x: 0, y: 0 };
    this.foodPositions = this.generateRandomFoodsPositions(foodCount);
    this.originalFoodsPositions = ARRAY_UTILS.shellCopy(this.foodPositions);
  }

  get allFoods() {
    return this.foodPositions;
  }

  get allSnakeBodyParts() {
    return this.snakeBodyPartsPositions;
  }

  get snakeHeadPosition(): Position {
    return this.snakeBodyPartsPositions[this.snakeBodyPartsCount - 1];
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

  public copy(): ReinforcementModel {
    const gameModelCopy = new GameModel({ columnsCount: this.columnsCount, rowsCount: this.rowsCount, foodCount: 0 });
    gameModelCopy.score = this.score;
    gameModelCopy.shouldFinish = this.shouldFinish;
    gameModelCopy.snakeHeadDirection = this.snakeHeadDirection;
    gameModelCopy.setFoodsOriginalPositions(ARRAY_UTILS.shellCopy(this.originalFoodsPositions));
    gameModelCopy.setFoodsPositions(ARRAY_UTILS.shellCopy(this.foodPositions));
    gameModelCopy.setSnakeBodyPartsPositions(ARRAY_UTILS.shellCopy(this.snakeBodyPartsPositions));
    return gameModelCopy;
  }

  public hash(): string {
    return (
      this.snakeHeadDirection.toString() +
      Number(this.shouldFinish).toString() +
      this.foodPositions
        .map(({ x, y }) => x.toString() + y.toString())
        .toString()
        .replace(/,/g, '') +
      this.snakeBodyPartsPositions
        .map(({ x, y }) => x.toString() + y.toString())
        .toString()
        .replace(/,/g, '')
    );
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

  public updateBoard(props: Partial<GameModelProps>): void {
    this.reset();
    this.rowsCount = props.rowsCount ?? this.rowsCount;
    this.columnsCount = props.columnsCount ?? this.columnsCount;
    if (UTILS.isDefined(props.foodCount)) {
      this.foodPositions = this.generateRandomFoodsPositions(props.foodCount);
      this.originalFoodsPositions = this.foodPositions;
    }
  }

  public getModelAsVector(): number[] {
    const modelVector = new Array<number>(this.rowsCount * this.columnsCount).fill(0);
    for (const { x, y } of this.foodPositions) {
      modelVector[x * this.columnsCount + y] = -2;
    }
    for (const { x, y } of this.snakeBodyPartsPositions) {
      modelVector[x * this.columnsCount + y] = -1;
    }
    modelVector[this.snakeHeadPosition.x * this.columnsCount + this.snakeHeadPosition.y] = this.snakeHeadDirection;
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
