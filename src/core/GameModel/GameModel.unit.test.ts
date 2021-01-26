import 'jest';
import { GameModel } from './GameModel';
import { Position } from './interfaces/Position';

describe(GameModel.name, () => {
  let gameModel: GameModel;
  beforeEach(() => {
    gameModel = createGameModelMock();
  });
  describe(GameModel.prototype.addFood.name, () => {
    test('should add one food to foods list', () => {
      const foodsCountBeforeAdd: number = gameModel['foodPositions'].length;
      const newFood: Position = { x: 1, y: 2 };
      gameModel.addFood(newFood);
      expect(gameModel['foodPositions'].length).toEqual(foodsCountBeforeAdd + 1);
    });
  });
  describe(GameModel.prototype.addSnakeBodyPart.name, () => {
    test('should add snake body part to snake body parts', () => {
      const foodsCountBeforeAdd: number = gameModel['snakeBodyPartsPositions'].length;
      const newPart: Position = { x: 1, y: 2 };
      gameModel.addSnakeBodyPart(newPart);
      expect(gameModel['snakeBodyPartsPositions'].length).toEqual(foodsCountBeforeAdd + 1);
    });
  });
  describe(GameModel.prototype.isBottomWall.name, () => {
    test('should return true if position is a bottom wall', () => {
      expect(gameModel.isBottomWall(gameModel['rowsCount'])).toBeTruthy();
    });
    test('should return false if position is not a bottom wall', () => {
      expect(gameModel.isBottomWall(gameModel['rowsCount'] - 1)).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isFoodPosition.name, () => {
    test('should return true if position is a food position', () => {
      expect(gameModel.isFoodPosition(gameModel['foodPositions'][0])).toBeTruthy();
    });
    test('should return false if position is not a food position', () => {
      expect(gameModel.isFoodPosition({ x: 1000, y: 1000 })).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isGameOver.name, () => {
    test('should return true if all food have been eaten', () => {
      for (let i = gameModel['foodPositions'].length - 1; i >= 0; i--) {
        gameModel.removeFood(gameModel['foodPositions'][i]);
      }
      expect(gameModel.isGameOver()).toBeTruthy();
    });
    test('should return false if all food have not been eaten', () => {
      expect(gameModel.isGameOver()).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isLeftWall.name, () => {
    test('should return true if position is a left wall', () => {
      expect(gameModel.isLeftWall(0)).toBeTruthy();
    });
    test('should return false if position is not a left wall', () => {
      expect(gameModel.isLeftWall(1)).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isNotBottomWall.name, () => {
    test('should return true if position is not a bottom wall', () => {
      expect(gameModel.isNotBottomWall(0)).toBeTruthy();
    });
    test('should return false if position is a bottom wall', () => {
      expect(gameModel.isNotBottomWall(gameModel['rowsCount'])).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isNotFoodPosition.name, () => {
    test('should return true if position is not a food position', () => {
      expect(gameModel.isNotFoodPosition({ x: 1000, y: 1000 })).toBeTruthy();
    });
    test('should return false if position is a food position', () => {
      expect(gameModel.isNotFoodPosition(gameModel['foodPositions'][0])).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isNotLeftWall.name, () => {
    test('should return true if position is not a left wall', () => {
      expect(gameModel.isNotLeftWall(1)).toBeTruthy();
    });
    test('should return false if position is a left wall', () => {
      expect(gameModel.isNotLeftWall(0)).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isNotRightWall.name, () => {
    test('should return true if position is not a right wall', () => {
      expect(gameModel.isNotRightWall(0)).toBeTruthy();
    });
    test('should return false if position is a right wall', () => {
      expect(gameModel.isNotRightWall(gameModel['columnsCount'])).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isNotSnakeBodyPosition.name, () => {
    test('should return true if position is not a snake body part position', () => {
      expect(gameModel.isNotSnakeBodyPosition({ x: 1000, y: 1000 })).toBeTruthy();
    });
    test('should return false if position is a snake body part position', () => {
      expect(gameModel.isNotSnakeBodyPosition(gameModel['snakeBodyPartsPositions'][0])).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isNotTopWall.name, () => {
    test('should return true if position is not a top wall', () => {
      expect(gameModel.isNotTopWall(1)).toBeTruthy();
    });
    test('should return false if position is not a top wall', () => {
      expect(gameModel.isNotTopWall(0)).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isRightWall.name, () => {
    test('should return true if position is a right wall', () => {
      expect(gameModel.isRightWall(gameModel['columnsCount'])).toBeTruthy();
    });
    test('should return false if position is not a right wall', () => {
      expect(gameModel.isRightWall(0)).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isSnakeBodyPartPosition.name, () => {
    test('should return true if position is not a snake body part position', () => {
      expect(gameModel.isSnakeBodyPartPosition(gameModel['snakeBodyPartsPositions'][0])).toBeTruthy();
    });
    test('should return false if position is a snake body part position', () => {
      expect(gameModel.isSnakeBodyPartPosition({ x: 1000, y: 1000 })).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isTopWall.name, () => {
    test('should return true if position is a top wall', () => {
      expect(gameModel.isTopWall(0)).toBeTruthy();
    });
    test('should return false if position is not a top wall', () => {
      expect(gameModel.isTopWall(1)).toBeFalsy();
    });
  });
  describe(GameModel.prototype.removeFood.name, () => {
    test('should remove one food from foods list', () => {
      const foodsCountBeforeRemove: number = gameModel['foodPositions'].length;
      const foodPosition: Position = gameModel['foodPositions'][0];
      gameModel.removeFood(foodPosition);
      expect(gameModel['foodPositions'].length).toEqual(foodsCountBeforeRemove - 1);
    });
  });
  describe(GameModel.prototype.removeSnakeBodyPart.name, () => {
    test('should remove one snake body part from snake body parts list', () => {
      const snakeBodyPartsCountBeforeRemove: number = gameModel['snakeBodyPartsPositions'].length;
      const bodyPart: Position = gameModel['snakeBodyPartsPositions'][0];
      gameModel.removeSnakeBodyPart(bodyPart);
      expect(gameModel['snakeBodyPartsPositions'].length).toEqual(snakeBodyPartsCountBeforeRemove - 1);
    });
  });
  describe(GameModel.prototype.reset.name, () => {
    test('should rest game board to initial state', () => {
      gameModel.score = 12;
      gameModel.removeFood(gameModel['foodPositions'][0]);
      gameModel.addSnakeBodyPart({ x: 0, y: 1 });
      gameModel.reset();
      expect(gameModel.score).toBe(0);
      expect(gameModel['snakeBodyPartsPositions'].length).toBe(1);
      expect(gameModel['foodPositions'].length).toBe(gameModel['originalFoodsPositions'].length);
    });
  });
  describe(GameModel.prototype.updateBoard.name, () => {
    test('should update only columns count', () => {
      const columnsCount = gameModel['columnsCount'] + 1;
      gameModel.updateBoard({ columnsCount });
      expect(gameModel['columnsCount']).toBe(columnsCount);
    });
    test('should update only rows count', () => {
      const rowsCount = gameModel['rowsCount'] + 1;
      gameModel.updateBoard({ rowsCount });
      expect(gameModel['rowsCount']).toBe(rowsCount);
    });
    test('should update only foods count', () => {
      const foodCount = gameModel['foodPositions'].length + 1;
      gameModel.updateBoard({ foodCount });
      expect(gameModel['foodPositions'].length).toBe(foodCount);
      expect(gameModel['originalFoodsPositions'].length).toBe(foodCount);
    });
    test('should update food, columns and rows count', () => {
      const columnsCount = gameModel['columnsCount'] + 1;
      const rowsCount = gameModel['rowsCount'] + 1;
      const foodCount = gameModel['foodPositions'].length + 1;
      gameModel.updateBoard({ columnsCount, rowsCount, foodCount });
      expect(gameModel['columnsCount']).toBe(columnsCount);
      expect(gameModel['rowsCount']).toBe(rowsCount);
      expect(gameModel['foodPositions'].length).toBe(foodCount);
      expect(gameModel['originalFoodsPositions'].length).toBe(foodCount);
    });
  });
});

export function createGameModelMock(): GameModel {
  return new GameModel({ foodCount: 2, columnsCount: 4, rowsCount: 4 });
}
