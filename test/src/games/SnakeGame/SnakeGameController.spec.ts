import { FieldPoints } from '../../../../src/games/SnakeGame/Controller/interfaces/FieldPoints';
import { ISnakeGameController } from '../../../../src/games/SnakeGame/Controller/interfaces/ISnakeGameController';
import { MoveDirection } from '../../../../src/games/SnakeGame/Controller/interfaces/MoveDirection';
import { SnakeGameController } from '../../../../src/games/SnakeGame/Controller/SnakeGameController';
import { Direction } from '../../../../src/games/SnakeGame/Model/interfaces/Direction';
import { ISnakeGameModel } from '../../../../src/games/SnakeGame/Model/interfaces/ISnakeGameModel';
import { Position } from '../../../../src/games/SnakeGame/Model/interfaces/Position';
import { SnakeGameModel } from '../../../../src/games/SnakeGame/Model/SnakeGameModel';

describe(SnakeGameController.name, () => {
  const rowsCount = 4;
  const columnsCount = 4;
  const foodCount = 4;
  let gameController: ISnakeGameController;
  let gameModel: ISnakeGameModel;
  beforeEach(() => {
    gameModel = new SnakeGameModel({ foodCount, rowsCount, columnsCount });
    gameController = new SnakeGameController(gameModel);
  });
  describe(SnakeGameController.prototype.move.name, () => {
    describe('Head position', () => {
      beforeEach(() => {
        gameModel.isWall = () => true;
      });
      describe('For snake head direction BOTTOM', () => {
        beforeEach(() => {
          gameModel.snakeHeadDirection = Direction.BOTTOM;
        });
        it('should move right for move direction LEFT', () => {
          const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
          gameController.move(MoveDirection.LEFT);
          expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x + 1);
          expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y);
          expect(gameModel.snakeHeadDirection).toBe(Direction.RIGHT);
        });
        it('should move left for move direction RIGHT', () => {
          const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
          gameController.move(MoveDirection.RIGHT);
          expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x - 1);
          expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y);
          expect(gameModel.snakeHeadDirection).toBe(Direction.LEFT);
        });
        it('should move bottom for move direction STRAIGHT', () => {
          const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
          gameController.move(MoveDirection.STRAIGHT);
          expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x);
          expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y + 1);
          expect(gameModel.snakeHeadDirection).toBe(Direction.BOTTOM);
        });
      });
      describe('For snake head direction LEFT', () => {
        beforeEach(() => {
          gameModel.snakeHeadDirection = Direction.LEFT;
        });
        it('should move bottom for move direction LEFT', () => {
          const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
          gameController.move(MoveDirection.LEFT);
          expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x);
          expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y + 1);
          expect(gameModel.snakeHeadDirection).toBe(Direction.BOTTOM);
        });
        it('should move top for move direction RIGHT', () => {
          const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
          gameController.move(MoveDirection.RIGHT);
          expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x);
          expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y - 1);
          expect(gameModel.snakeHeadDirection).toBe(Direction.TOP);
        });
        it('should move left for move direction STRAIGHT', () => {
          const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
          gameController.move(MoveDirection.STRAIGHT);
          expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x - 1);
          expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y);
          expect(gameModel.snakeHeadDirection).toBe(Direction.LEFT);
        });
      });
      describe('For snake head direction RIGHT', () => {
        beforeEach(() => {
          gameModel.snakeHeadDirection = Direction.RIGHT;
        });
        it('should move top for move direction LEFT', () => {
          const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
          gameController.move(MoveDirection.LEFT);
          expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x);
          expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y - 1);
          expect(gameModel.snakeHeadDirection).toBe(Direction.TOP);
        });
        it('should move bottom for move direction RIGHT', () => {
          const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
          gameController.move(MoveDirection.RIGHT);
          expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x);
          expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y + 1);
          expect(gameModel.snakeHeadDirection).toBe(Direction.BOTTOM);
        });
        it('should move right for move direction STRAIGHT', () => {
          const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
          gameController.move(MoveDirection.STRAIGHT);
          expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x + 1);
          expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y);
          expect(gameModel.snakeHeadDirection).toBe(Direction.RIGHT);
        });
      });
      describe('For snake head direction TOP', () => {
        beforeEach(() => {
          gameModel.snakeHeadDirection = Direction.TOP;
        });
        it('should move left for move direction LEFT', () => {
          const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
          gameController.move(MoveDirection.LEFT);
          expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x - 1);
          expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y);
          expect(gameModel.snakeHeadDirection).toBe(Direction.LEFT);
        });
        it('should move right for move direction RIGHT', () => {
          const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
          gameController.move(MoveDirection.RIGHT);
          expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x + 1);
          expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y);
          expect(gameModel.snakeHeadDirection).toBe(Direction.RIGHT);
        });
        it('should move top for move direction STRAIGHT', () => {
          const snakeHeadPositionBeforeMove: Position = gameModel.snakeHeadPosition;
          gameController.move(MoveDirection.STRAIGHT);
          expect(gameModel.snakeHeadPosition.x).toBe(snakeHeadPositionBeforeMove.x);
          expect(gameModel.snakeHeadPosition.y).toBe(snakeHeadPositionBeforeMove.y - 1);
          expect(gameModel.snakeHeadDirection).toBe(Direction.TOP);
        });
      });
    });
    describe('Score', () => {
      it('should increase score by WALL score and set flag to finish the game', () => {
        const oldScore = gameModel.score;
        gameModel.isWall = () => true;
        gameController.move(MoveDirection.LEFT);
        expect(gameModel.score).toBe(oldScore + FieldPoints.WALL);
        expect(gameModel.shouldFinish).toBeTruthy();
      });
      it('should increase score by TAIL score and set flag to finish the game', () => {
        const oldScore = gameModel.score;
        gameModel.isWall = () => false;
        gameModel.isSnakeBodyPartPosition = () => true;
        gameController.move(MoveDirection.LEFT);
        expect(gameModel.score).toBe(oldScore + FieldPoints.TAIL);
        expect(gameModel.shouldFinish).toBeTruthy();
      });
      it('should increase score by FOOD score and do not change flag to finish the game', () => {
        const oldScore = gameModel.score;
        const oldShouldFinishGame = gameModel.shouldFinish;
        gameModel.isWall = () => false;
        gameModel.isSnakeBodyPartPosition = () => false;
        gameModel.isFoodPosition = () => true;
        gameController.move(MoveDirection.LEFT);
        expect(gameModel.score).toBe(oldScore + FieldPoints.FOOD);
        expect(gameModel.shouldFinish).toBe(oldShouldFinishGame);
      });
      it('should increase score by BLANK score and do not change flag to finish the game', () => {
        const oldScore = gameModel.score;
        const oldShouldFinishGame = gameModel.shouldFinish;
        gameModel.isWall = () => false;
        gameModel.isSnakeBodyPartPosition = () => false;
        gameModel.isFoodPosition = () => false;
        gameController.move(MoveDirection.LEFT);
        expect(gameModel.score).toBe(oldScore + FieldPoints.BLANK);
        expect(gameModel.shouldFinish).toBe(oldShouldFinishGame);
      });
      it('should increase score by FOOD + WIN score and do not change flag to finish the game if eat all food', () => {
        const oldScore = gameModel.score;
        for (const food of structuredClone(gameModel.allFoods)) {
          gameModel.removeFood(food);
        }
        gameModel.isWall = () => false;
        gameModel.isSnakeBodyPartPosition = () => false;
        gameModel.isFoodPosition = () => true;
        gameController.move(MoveDirection.LEFT);
        expect(gameModel.score).toBe(oldScore + FieldPoints.FOOD + FieldPoints.WIN);
        expect(gameModel.shouldFinish).toBeTruthy();
      });
    });
  });
});
