import 'jest';
import { GameController } from './GameController';
import { createGameModelMock } from '../GameModel/GameModel.unit.test';
import { IGameModel } from '../GameModel/interfaces/IGameModel';
import { GameModel } from '../GameModel/GameModel';
import { Direction } from '../GameModel/interfaces/Direction';
import { MoveDirection } from './interfaces/MoveDirection';
import { Position } from '../GameModel/interfaces/Position';

describe(GameController.name, () => {
  let gameController: GameController;
  let gameModel: GameModel;
  beforeEach(() => {
    gameModel = createGameModelMock();
    gameController = createGameController(gameModel);
  });
  describe(GameController.prototype.move.name, () => {
    describe('For snake head direction BOTTOM', () => {
      beforeEach(() => {
        gameModel['snakeHeadDirection'] = Direction.BOTTOM;
      });
      test('should move right for move direction LEFT', () => {
        const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
        gameController.move(MoveDirection.LEFT);
        expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x + 1);
        expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y);
        expect(gameModel.snakeHeadDirection).toBe(Direction.RIGHT);
      });
      test('should move left for move direction RIGHT', () => {
        const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
        gameController.move(MoveDirection.RIGHT);
        expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x - 1);
        expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y);
        expect(gameModel.snakeHeadDirection).toBe(Direction.LEFT);
      });
      test('should move bottom for move direction STRAIGHT', () => {
        const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
        gameController.move(MoveDirection.STRAIGHT);
        expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x);
        expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y + 1);
        expect(gameModel.snakeHeadDirection).toBe(Direction.BOTTOM);
      });
    });
    describe('For snake head direction LEFT', () => {
      beforeEach(() => {
        gameModel['snakeHeadDirection'] = Direction.LEFT;
      });
      test('should move bottom for move direction LEFT', () => {
        const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
        gameController.move(MoveDirection.LEFT);
        expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x);
        expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y + 1);
        expect(gameModel.snakeHeadDirection).toBe(Direction.BOTTOM);
      });
      test('should move top for move direction RIGHT', () => {
        const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
        gameController.move(MoveDirection.RIGHT);
        expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x);
        expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y - 1);
        expect(gameModel.snakeHeadDirection).toBe(Direction.TOP);
      });
      test('should move left for move direction STRAIGHT', () => {
        const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
        gameController.move(MoveDirection.STRAIGHT);
        expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x - 1);
        expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y);
        expect(gameModel.snakeHeadDirection).toBe(Direction.LEFT);
      });
    });
    describe('For snake head direction RIGHT', () => {
      beforeEach(() => {
        gameModel['snakeHeadDirection'] = Direction.RIGHT;
      });
      test('should move top for move direction LEFT', () => {
        const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
        gameController.move(MoveDirection.LEFT);
        expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x);
        expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y - 1);
        expect(gameModel.snakeHeadDirection).toBe(Direction.TOP);
      });
      test('should move bottom for move direction RIGHT', () => {
        const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
        gameController.move(MoveDirection.RIGHT);
        expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x);
        expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y + 1);
        expect(gameModel.snakeHeadDirection).toBe(Direction.BOTTOM);
      });
      test('should move right for move direction STRAIGHT', () => {
        const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
        gameController.move(MoveDirection.STRAIGHT);
        expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x + 1);
        expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y);
        expect(gameModel.snakeHeadDirection).toBe(Direction.RIGHT);
      });
    });
    describe('For snake head direction TOP', () => {
      beforeEach(() => {
        gameModel['snakeHeadDirection'] = Direction.TOP;
      });
      test('should move left for move direction LEFT', () => {
        const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
        gameController.move(MoveDirection.LEFT);
        expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x - 1);
        expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y);
        expect(gameModel.snakeHeadDirection).toBe(Direction.LEFT);
      });
      test('should move right for move direction RIGHT', () => {
        const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
        gameController.move(MoveDirection.RIGHT);
        expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x + 1);
        expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y);
        expect(gameModel.snakeHeadDirection).toBe(Direction.RIGHT);
      });
      test('should move top for move direction STRAIGHT', () => {
        const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
        gameController.move(MoveDirection.STRAIGHT);
        expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x);
        expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y - 1);
        expect(gameModel.snakeHeadDirection).toBe(Direction.TOP);
      });
    });
  });
});

function createGameController(gameModel: IGameModel): GameController {
  return new GameController(gameModel);
}
