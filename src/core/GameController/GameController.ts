import { IGameModel } from '../GameModel/interfaces/IGameModel';
import { IGameController } from './interfaces/IGameController';
import { MoveDirection } from './interfaces/MoveDirection';
import { UTILS } from '../../common/Utils/UTILS';
import { Position } from '../GameModel/interfaces/Position';
import { Direction } from '../GameModel/interfaces/Direction';
import { FieldPoints } from './interfaces/FieldPoints';

export class GameController implements IGameController {
  private readonly gameModel: IGameModel;

  constructor(gameModel: IGameModel) {
    this.gameModel = gameModel;
  }

  public move(direction: MoveDirection): void {
    const snakeHead: Position = UTILS.shellCopy(this.gameModel.snakeHeadPosition);
    if (
      (direction === MoveDirection.LEFT && this.gameModel.snakeHeadDirection === Direction.LEFT) ||
      (direction === MoveDirection.RIGHT && this.gameModel.snakeHeadDirection === Direction.RIGHT) ||
      (direction === MoveDirection.STRAIGHT && this.gameModel.snakeHeadDirection === Direction.BOTTOM)
    ) {
      this.moveBottom(snakeHead);
    } else if (
      (direction === MoveDirection.LEFT && this.gameModel.snakeHeadDirection === Direction.TOP) ||
      (direction === MoveDirection.RIGHT && this.gameModel.snakeHeadDirection === Direction.BOTTOM) ||
      (direction === MoveDirection.STRAIGHT && this.gameModel.snakeHeadDirection === Direction.LEFT)
    ) {
      this.moveLeft(snakeHead);
    } else if (
      (direction === MoveDirection.LEFT && this.gameModel.snakeHeadDirection === Direction.BOTTOM) ||
      (direction === MoveDirection.RIGHT && this.gameModel.snakeHeadDirection === Direction.TOP) ||
      (direction === MoveDirection.STRAIGHT && this.gameModel.snakeHeadDirection === Direction.RIGHT)
    ) {
      this.moveRight(snakeHead);
    } else if (
      (direction === MoveDirection.LEFT && this.gameModel.snakeHeadDirection === Direction.RIGHT) ||
      (direction === MoveDirection.RIGHT && this.gameModel.snakeHeadDirection === Direction.LEFT) ||
      (direction === MoveDirection.STRAIGHT && this.gameModel.snakeHeadDirection === Direction.TOP)
    ) {
      this.moveTop(snakeHead);
    }
    this.changeScore(snakeHead);
    this.gameModel.setNewSnakeHead(snakeHead);
  }

  private changeScore(position: Position): void {
    if (this.gameModel.isWall(position)) {
      this.gameModel.score += FieldPoints.WALL;
      this.gameModel.shouldFinish = true;
    } else if (this.gameModel.isSnakeBodyPartPosition(position)) {
      this.gameModel.score += FieldPoints.TAIL;
      this.gameModel.shouldFinish = true;
    } else if (this.gameModel.isFoodPosition(position)) {
      this.gameModel.score += FieldPoints.FOOD;
      this.gameModel.removeFood(position);
      this.gameModel.addNewSnakeTailPart();
    } else {
      this.gameModel.score += FieldPoints.BLANK;
    }
  }

  private moveBottom(position: Position): void {
    ++position.y;
    this.gameModel.snakeHeadDirection = Direction.BOTTOM;
  }

  private moveLeft(position: Position): void {
    --position.x;
    this.gameModel.snakeHeadDirection = Direction.LEFT;
  }

  private moveRight(position: Position): void {
    ++position.x;
    this.gameModel.snakeHeadDirection = Direction.RIGHT;
  }

  private moveTop(position: Position): void {
    --position.y;
    this.gameModel.snakeHeadDirection = Direction.TOP;
  }
}
