import { Position } from './interfaces/Position';
import { GameBoardProps } from './interfaces/GameBoardProps';
import { MATH_UTILS } from '../../common/Utils/MATH_UTILS';
import { IGameBoard } from './interfaces/IGameBoard';
import { ARRAY_UTILS } from '../../common/Utils/ARRAY_UTILS';
import { MoveDirection } from './interfaces/MoveDirection';
import { Direction } from './interfaces/Direction';

export class GameBoard implements IGameBoard {
  private width: number;
  private height: number;
  private score: number;
  private headDirection: Direction;
  private foodPositions: Position[];
  private snakeBodyPartsPositions: Position[];

  constructor({ foodCount, height, width }: GameBoardProps) {
    this.score = 0;
    this.width = width;
    this.height = height;
    this.snakeBodyPartsPositions = [{ x: 0, y: 0 }];
    this.foodPositions = this.generateRandomFoodsPositions(foodCount);
  }

  public getGameScore(): number {
    return this.score;
  }

  public isBottomWall(y: number): boolean {
    return y === this.height;
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
    return y !== this.height;
  }

  public isNotFoodPosition({ x, y }: Position): boolean {
    return this.foodPositions.every((foodPosition) => foodPosition.x !== x && foodPosition.y !== y);
  }

  public isNotLeftWall(x: number): boolean {
    return x > 0;
  }

  public isNotRightWall(x: number): boolean {
    return x < this.width;
  }

  public isNotSnakeBodyPosition({ x, y }: Position): boolean {
    return this.snakeBodyPartsPositions.every((snakeBodyPosition) => snakeBodyPosition.x !== x && snakeBodyPosition.y !== y);
  }

  public isNotTopWall(y: number): boolean {
    return y > 0;
  }

  public isRightWall(x: number): boolean {
    return x === this.width;
  }

  public isSnakeBodyPartPosition({ x, y }: Position): boolean {
    return this.snakeBodyPartsPositions.some((snakeBodyPosition) => snakeBodyPosition.x === x && snakeBodyPosition.y === y);
  }

  public isTopWall(y: number): boolean {
    return y === 0;
  }

  public render(): void {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
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

  addFood(position: Position): void {}

  addSnakeBodyPart(position: Position): void {}

  moveSnake(direction: MoveDirection): void {}

  removeFood(position: Position): void {}

  removeSnakeBodyPart(position: Position): void {}

  private calculateNewLastPartPosition(direction: MoveDirection): Position {
    let newPosition: Position = ARRAY_UTILS.getLastElementCopy(this.snakeBodyPartsPositions);
    switch (direction) {
      case MoveDirection.LEFT:
        switch (this.headDirection) {
          case Direction.BOTTOM:
            ++newPosition.x;
            break;
          case Direction.LEFT:
            ++newPosition.y;
            break;
          case Direction.RIGHT:
            --newPosition.y;
            break;
          case Direction.TOP:
            --newPosition.x;
            break;
          default:
            console.log('This should have had never happen');
        }
        break;
      case MoveDirection.RIGHT:
        switch (this.headDirection) {
          case Direction.BOTTOM:
            --newPosition.x;
            break;
          case Direction.LEFT:
            --newPosition.y;
            break;
          case Direction.RIGHT:
            ++newPosition.y;
            break;
          case Direction.TOP:
            ++newPosition.x;
            break;
          default:
            console.log('This should have had never happen');
        }
        break;
      case MoveDirection.STRAIGHT:
        switch (this.headDirection) {
          case Direction.BOTTOM:
            ++newPosition.y;
            break;
          case Direction.LEFT:
            --newPosition.x;
            break;
          case Direction.RIGHT:
            ++newPosition.x;
            break;
          case Direction.TOP:
            --newPosition.y;
            break;
          default:
            console.log('This should have had never happen');
        }
        break;
      default:
        console.log('This should have had never happen');
    }
    return newPosition;
  }

  private generateRandomFoodsPositions(foodCount: number): Position[] {
    const foodPositions: Position[] = [];
    for (let i = 0; i < foodCount; i++) {
      foodPositions.push({
        x: MATH_UTILS.generateRandomInteger(1, this.width - 1),
        y: MATH_UTILS.generateRandomInteger(1, this.height - 1)
      });
    }
    return foodPositions;
  }
}
