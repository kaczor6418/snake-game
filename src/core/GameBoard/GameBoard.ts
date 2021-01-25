import { Position } from './interfaces/Position';
import { GameBoardProps } from './interfaces/GameBoardProps';
import { MATH_UTILS } from '../../common/Utils/MATH_UTILS';
import { IGameBoard } from './interfaces/IGameBoard';
import { ARRAY_UTILS } from '../../common/Utils/ARRAY_UTILS';
import { Direction } from './interfaces/Direction';
import { UTILS } from '../../common/Utils/UTILS';
import { isNumber } from '../../common/TYPEGUARDS';

export class GameBoard implements IGameBoard {
  private rowsCount: number;
  private columnsCount: number;
  private foodPositions: Position[];
  private originalFoodsPositions: Position[];
  private snakeBodyPartsPositions: Position[];

  public score: number;
  public snakeHeadDirection: Direction;

  constructor({ foodCount, rowsCount, columnsCount }: GameBoardProps) {
    this.score = 0;
    this.snakeHeadDirection = Direction.RIGHT;
    this.snakeBodyPartsPositions = [{ x: 0, y: 0 }];
    this.rowsCount = rowsCount;
    this.columnsCount = columnsCount;
    this.foodPositions = this.generateRandomFoodsPositions(foodCount);
    this.originalFoodsPositions = ARRAY_UTILS.deepCopy(this.foodPositions);
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

  public addSnakeBodyPart(position: Position): void {
    this.snakeBodyPartsPositions.push(position);
  }

  public insertSnakeBodyPartBeforeHead(position: Position): void {
    this.snakeBodyPartsPositions.unshift(position);
  }

  public isBottomWall(y: number): boolean {
    return y === this.rowsCount;
  }

  public isFoodPosition({ x, y }: Position): boolean {
    return this.foodPositions.some((foodPosition) => foodPosition.x === x && foodPosition.y === y);
  }

  public isGameOver(): boolean {
    return ARRAY_UTILS.isEmpty(this.foodPositions);
  }

  public isLeftWall(x: number): boolean {
    return x === 0;
  }

  public isNotBottomWall(y: number): boolean {
    return y !== this.rowsCount;
  }

  public isNotFoodPosition({ x, y }: Position): boolean {
    return this.foodPositions.every((foodPosition) => foodPosition.x !== x && foodPosition.y !== y);
  }

  public isNotLeftWall(x: number): boolean {
    return x > 0;
  }

  public isNotRightWall(x: number): boolean {
    return x < this.columnsCount;
  }

  public isNotSnakeBodyPosition({ x, y }: Position): boolean {
    return this.snakeBodyPartsPositions.every((snakeBodyPosition) => snakeBodyPosition.x !== x && snakeBodyPosition.y !== y);
  }

  public isNotTopWall(y: number): boolean {
    return y > 0;
  }

  public isRightWall(x: number): boolean {
    return x === this.columnsCount;
  }

  public isSnakeBodyPartPosition({ x, y }: Position): boolean {
    return this.snakeBodyPartsPositions.some((snakeBodyPosition) => snakeBodyPosition.x === x && snakeBodyPosition.y === y);
  }

  public isTopWall(y: number): boolean {
    return y === 0;
  }

  public removeFood({ x, y }: Position): Position {
    return ARRAY_UTILS.removeElement(
      this.foodPositions,
      this.foodPositions.findIndex(({ x: foodXPosition, y: foodYPosition }) => x === foodXPosition && y === foodYPosition)
    );
  }

  public removeSnakeBodyPart(position: number): Position;
  public removeSnakeBodyPart(position: Position): Position;
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

  public updateBoard(props: Partial<GameBoardProps>): void {
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
