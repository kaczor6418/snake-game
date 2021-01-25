import 'jest';
import { GameModel } from './GameModel';
import { Position } from './interfaces/Position';

describe(GameModel.name, () => {
  let gameBoard: GameModel;
  beforeEach(() => {
    gameBoard = createGameBoard();
  });
  describe(GameModel.prototype.addFood.name, () => {
    test('should add one food to foods list', () => {
      const foodsCountBeforeAdd: number = gameBoard['foodPositions'].length;
      const newFood: Position = { x: 1, y: 2 };
      gameBoard.addFood(newFood);
      expect(gameBoard['foodPositions'].length).toEqual(foodsCountBeforeAdd + 1);
    });
  });
  describe(GameModel.prototype.addSnakeBodyPart.name, () => {
    test('should add snake body part to snake body parts', () => {
      const foodsCountBeforeAdd: number = gameBoard['snakeBodyPartsPositions'].length;
      const newPart: Position = { x: 1, y: 2 };
      gameBoard.addSnakeBodyPart(newPart);
      expect(gameBoard['snakeBodyPartsPositions'].length).toEqual(foodsCountBeforeAdd + 1);
    });
  });
  describe(GameModel.prototype.isBottomWall.name, () => {
    test('should return true if position is a bottom wall', () => {
      expect(gameBoard.isBottomWall(gameBoard['rowsCount'])).toBeTruthy();
    });
    test('should return false if position is not a bottom wall', () => {
      expect(gameBoard.isBottomWall(gameBoard['rowsCount'] - 1)).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isFoodPosition.name, () => {
    test('should return true if position is a food position', () => {
      expect(gameBoard.isFoodPosition(gameBoard['foodPositions'][0])).toBeTruthy();
    });
    test('should return false if position is not a food position', () => {
      expect(gameBoard.isFoodPosition({ x: 1000, y: 1000 })).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isGameOver.name, () => {
    test('should return true if all food have been eaten', () => {
      for (let i = gameBoard['foodPositions'].length - 1; i >= 0; i--) {
        gameBoard.removeFood(gameBoard['foodPositions'][i]);
      }
      expect(gameBoard.isGameOver()).toBeTruthy();
    });
    test('should return false if all food have not been eaten', () => {
      expect(gameBoard.isGameOver()).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isLeftWall.name, () => {
    test('should return true if position is a left wall', () => {
      expect(gameBoard.isLeftWall(0)).toBeTruthy();
    });
    test('should return false if position is not a left wall', () => {
      expect(gameBoard.isLeftWall(1)).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isNotBottomWall.name, () => {
    test('should return true if position is not a bottom wall', () => {
      expect(gameBoard.isNotBottomWall(0)).toBeTruthy();
    });
    test('should return false if position is a bottom wall', () => {
      expect(gameBoard.isNotBottomWall(gameBoard['rowsCount'])).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isNotFoodPosition.name, () => {
    test('should return true if position is not a food position', () => {
      expect(gameBoard.isNotFoodPosition({ x: 1000, y: 1000 })).toBeTruthy();
    });
    test('should return false if position is a food position', () => {
      expect(gameBoard.isNotFoodPosition(gameBoard['foodPositions'][0])).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isNotLeftWall.name, () => {
    test('should return true if position is not a left wall', () => {
      expect(gameBoard.isNotLeftWall(1)).toBeTruthy();
    });
    test('should return false if position is a left wall', () => {
      expect(gameBoard.isNotLeftWall(0)).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isNotRightWall.name, () => {
    test('should return true if position is not a right wall', () => {
      expect(gameBoard.isNotRightWall(0)).toBeTruthy();
    });
    test('should return false if position is a right wall', () => {
      expect(gameBoard.isNotRightWall(gameBoard['columnsCount'])).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isNotSnakeBodyPosition.name, () => {
    test('should return true if position is not a snake body part position', () => {
      expect(gameBoard.isNotSnakeBodyPosition({ x: 1000, y: 1000 })).toBeTruthy();
    });
    test('should return false if position is a snake body part position', () => {
      expect(gameBoard.isNotSnakeBodyPosition(gameBoard['snakeBodyPartsPositions'][0])).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isNotTopWall.name, () => {
    test('should return true if position is not a top wall', () => {
      expect(gameBoard.isNotTopWall(1)).toBeTruthy();
    });
    test('should return false if position is not a top wall', () => {
      expect(gameBoard.isNotTopWall(0)).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isRightWall.name, () => {
    test('should return true if position is a right wall', () => {
      expect(gameBoard.isRightWall(gameBoard['columnsCount'])).toBeTruthy();
    });
    test('should return false if position is not a right wall', () => {
      expect(gameBoard.isRightWall(0)).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isSnakeBodyPartPosition.name, () => {
    test('should return true if position is not a snake body part position', () => {
      expect(gameBoard.isSnakeBodyPartPosition(gameBoard['snakeBodyPartsPositions'][0])).toBeTruthy();
    });
    test('should return false if position is a snake body part position', () => {
      expect(gameBoard.isSnakeBodyPartPosition({ x: 1000, y: 1000 })).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isTopWall.name, () => {
    test('should return true if position is a top wall', () => {
      expect(gameBoard.isTopWall(0)).toBeTruthy();
    });
    test('should return false if position is not a top wall', () => {
      expect(gameBoard.isTopWall(1)).toBeFalsy();
    });
  });
  describe(GameModel.prototype.removeFood.name, () => {
    test('should remove one food from foods list', () => {
      const foodsCountBeforeRemove: number = gameBoard['foodPositions'].length;
      const foodPosition: Position = gameBoard['foodPositions'][0];
      gameBoard.removeFood(foodPosition);
      expect(gameBoard['foodPositions'].length).toEqual(foodsCountBeforeRemove - 1);
    });
  });
  describe(GameModel.prototype.removeSnakeBodyPart.name, () => {
    test('should remove one snake body part from snake body parts list', () => {
      const snakeBodyPartsCountBeforeRemove: number = gameBoard['snakeBodyPartsPositions'].length;
      const bodyPart: Position = gameBoard['snakeBodyPartsPositions'][0];
      gameBoard.removeSnakeBodyPart(bodyPart);
      expect(gameBoard['snakeBodyPartsPositions'].length).toEqual(snakeBodyPartsCountBeforeRemove - 1);
    });
  });
  describe(GameModel.prototype.reset.name, () => {
    test('should rest game board to initial state', () => {
      gameBoard.score = 12;
      gameBoard.removeFood(gameBoard['foodPositions'][0]);
      gameBoard.addSnakeBodyPart({ x: 0, y: 1 });
      gameBoard.reset();
      expect(gameBoard.score).toBe(0);
      expect(gameBoard['snakeBodyPartsPositions'].length).toBe(1);
      expect(gameBoard['foodPositions'].length).toBe(gameBoard['originalFoodsPositions'].length);
    });
  });
  describe(GameModel.prototype.updateBoard.name, () => {
    test('should update only columns count', () => {
      const columnsCount = gameBoard['columnsCount'] + 1;
      gameBoard.updateBoard({ columnsCount });
      expect(gameBoard['columnsCount']).toBe(columnsCount);
    });
    test('should update only rows count', () => {
      const rowsCount = gameBoard['rowsCount'] + 1;
      gameBoard.updateBoard({ rowsCount });
      expect(gameBoard['rowsCount']).toBe(rowsCount);
    });
    test('should update only foods count', () => {
      const foodCount = gameBoard['foodPositions'].length + 1;
      gameBoard.updateBoard({ foodCount });
      expect(gameBoard['foodPositions'].length).toBe(foodCount);
      expect(gameBoard['originalFoodsPositions'].length).toBe(foodCount);
    });
    test('should update food, columns and rows count', () => {
      const columnsCount = gameBoard['columnsCount'] + 1;
      const rowsCount = gameBoard['rowsCount'] + 1;
      const foodCount = gameBoard['foodPositions'].length + 1;
      gameBoard.updateBoard({ columnsCount, rowsCount, foodCount });
      expect(gameBoard['columnsCount']).toBe(columnsCount);
      expect(gameBoard['rowsCount']).toBe(rowsCount);
      expect(gameBoard['foodPositions'].length).toBe(foodCount);
      expect(gameBoard['originalFoodsPositions'].length).toBe(foodCount);
    });
  });
});

function createGameBoard(): GameModel {
  return new GameModel({ foodCount: 2, columnsCount: 4, rowsCount: 4 });
}
