import { IGameModel } from '../GameModel/interfaces/IGameModel';
import { IGameController } from './interfaces/IGameController';
import { MoveDirection } from './interfaces/MoveDirection';
import { UTILS } from '../../common/Utils/UTILS';
import { Position } from '../GameModel/interfaces/Position';
import { Direction } from '../GameModel/interfaces/Direction';

export class GameController implements IGameController {
  private readonly gameModel: IGameModel;

  constructor(gameModel: IGameModel) {
    this.gameModel = gameModel;
  }

  public move(direction: MoveDirection): void {
    const snakeHead: Position = UTILS.shellCopy(this.gameModel.snakeHeadPosition);
    this.gameModel.removeSnakeBodyPart(this.gameModel.snakeBodyPartsCount - 1);
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
    this.gameModel.insertSnakeBodyPartBeforeHead(snakeHead);
  }

  private moveBottom(position: Position): void {
    ++position.y;
  }

  private moveLeft(position: Position): void {
    --position.x;
  }

  private moveRight(position: Position): void {
    ++position.x;
  }

  private moveTop(position: Position): void {
    --position.y;
  }
}
