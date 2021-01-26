import 'jest';
import { GameController } from './GameController';
import { createGameModelMock } from '../GameModel/GameModel.unit.test';
import { IGameModel } from '../GameModel/interfaces/IGameModel';
import { GameModel } from '../GameModel/GameModel';
import { Direction } from '../GameModel/interfaces/Direction';
import { MoveDirection } from './interfaces/MoveDirection';

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
        gameController.move(MoveDirection.LEFT);
        expect(gameModel['snakeBodyPartsPositions'][0].x).toBe(gameModel['snakeBodyPartsPositions'][1].x + 1);
        expect(gameModel['snakeBodyPartsPositions'][0].y).toBe(gameModel['snakeBodyPartsPositions'][1].y);
      });
      test('should move left for move direction RIGHT', () => {
        gameController.move(MoveDirection.RIGHT);
        expect(gameModel['snakeBodyPartsPositions'][0].x).toBe(gameModel['snakeBodyPartsPositions'][1].x - 1);
        expect(gameModel['snakeBodyPartsPositions'][0].y).toBe(gameModel['snakeBodyPartsPositions'][1].y);
      });
      test('should move bottom for move direction STRAIGHT', () => {
        gameController.move(MoveDirection.STRAIGHT);
        expect(gameModel['snakeBodyPartsPositions'][0].x).toBe(gameModel['snakeBodyPartsPositions'][1].x);
        expect(gameModel['snakeBodyPartsPositions'][0].y).toBe(gameModel['snakeBodyPartsPositions'][1].y + 1);
      });
    });
    describe('For snake head direction LEFT', () => {
      beforeEach(() => {
        gameModel['snakeHeadDirection'] = Direction.LEFT;
      });
      test('should move bottom for move direction LEFT', () => {
        gameController.move(MoveDirection.LEFT);
        expect(gameModel['snakeBodyPartsPositions'][0].x).toBe(gameModel['snakeBodyPartsPositions'][1].x);
        expect(gameModel['snakeBodyPartsPositions'][0].y).toBe(gameModel['snakeBodyPartsPositions'][1].y + 1);
      });
      test('should move top for move direction RIGHT', () => {
        gameController.move(MoveDirection.RIGHT);
        expect(gameModel['snakeBodyPartsPositions'][0].x).toBe(gameModel['snakeBodyPartsPositions'][1].x);
        expect(gameModel['snakeBodyPartsPositions'][0].y).toBe(gameModel['snakeBodyPartsPositions'][1].y - 1);
      });
      test('should move left for move direction STRAIGHT', () => {
        gameController.move(MoveDirection.STRAIGHT);
        expect(gameModel['snakeBodyPartsPositions'][0].x).toBe(gameModel['snakeBodyPartsPositions'][1].x - 1);
        expect(gameModel['snakeBodyPartsPositions'][0].y).toBe(gameModel['snakeBodyPartsPositions'][1].y);
      });
    });
    describe('For snake head direction RIGHT', () => {
      beforeEach(() => {
        gameModel['snakeHeadDirection'] = Direction.RIGHT;
      });
      test('should move top for move direction LEFT', () => {
        gameController.move(MoveDirection.LEFT);
        expect(gameModel['snakeBodyPartsPositions'][0].x).toBe(gameModel['snakeBodyPartsPositions'][1].x);
        expect(gameModel['snakeBodyPartsPositions'][0].y).toBe(gameModel['snakeBodyPartsPositions'][1].y - 1);
      });
      test('should move bottom for move direction RIGHT', () => {
        gameController.move(MoveDirection.RIGHT);
        expect(gameModel['snakeBodyPartsPositions'][0].x).toBe(gameModel['snakeBodyPartsPositions'][1].x);
        expect(gameModel['snakeBodyPartsPositions'][0].y).toBe(gameModel['snakeBodyPartsPositions'][1].y + 1);
      });
      test('should move right for move direction STRAIGHT', () => {
        gameController.move(MoveDirection.STRAIGHT);
        expect(gameModel['snakeBodyPartsPositions'][0].x).toBe(gameModel['snakeBodyPartsPositions'][1].x + 1);
        expect(gameModel['snakeBodyPartsPositions'][0].y).toBe(gameModel['snakeBodyPartsPositions'][1].y);
      });
    });
    describe('For snake head direction TOP', () => {
      beforeEach(() => {
        gameModel['snakeHeadDirection'] = Direction.TOP;
      });
      test('should move left for move direction LEFT', () => {
        gameController.move(MoveDirection.LEFT);
        expect(gameModel['snakeBodyPartsPositions'][0].x).toBe(gameModel['snakeBodyPartsPositions'][1].x - 1);
        expect(gameModel['snakeBodyPartsPositions'][0].y).toBe(gameModel['snakeBodyPartsPositions'][1].y);
      });
      test('should move right for move direction RIGHT', () => {
        gameController.move(MoveDirection.RIGHT);
        expect(gameModel['snakeBodyPartsPositions'][0].x).toBe(gameModel['snakeBodyPartsPositions'][1].x + 1);
        expect(gameModel['snakeBodyPartsPositions'][0].y).toBe(gameModel['snakeBodyPartsPositions'][1].y);
      });
      test('should move top for move direction STRAIGHT', () => {
        gameController.move(MoveDirection.STRAIGHT);
        expect(gameModel['snakeBodyPartsPositions'][0].x).toBe(gameModel['snakeBodyPartsPositions'][1].x);
        expect(gameModel['snakeBodyPartsPositions'][0].y).toBe(gameModel['snakeBodyPartsPositions'][1].y - 1);
      });
    });
  });
});

function createGameController(gameModel: IGameModel): GameController {
  return new GameController(gameModel);
}
