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
  describe(GameModel.prototype.addNewSnakeTailPart.name, () => {
    test('should add snake tail part to snake body parts', () => {
      const snakeBodyPartsCount: number = gameModel.snakeBodyPartsCount;
      const snakeHeadPositionBeforeAddingTailPart: Position = gameModel['snakeBodyPartsPositions'][0];
      gameModel.setNewSnakeHead({ x: 0, y: 1 });
      gameModel.addNewSnakeTailPart();
      expect(gameModel.snakeBodyPartsCount).toEqual(snakeBodyPartsCount + 1);
      expect(snakeHeadPositionBeforeAddingTailPart.x).toEqual(gameModel['snakeBodyPartsPositions'][0].x);
      expect(snakeHeadPositionBeforeAddingTailPart.y).toEqual(gameModel['snakeBodyPartsPositions'][0].y);
    });
    test('should throw an error if tried to add tail part before changing head position', () => {
      expect(() => {
        gameModel['lastSnakeTailPart'] = null;
        gameModel.addNewSnakeTailPart();
      }).toThrowError(Error);
    });
  });
  describe(GameModel.prototype.copy.name, () => {
    test('should create copy of class instance', () => {
      const gameModelCopy = <GameModel>gameModel.copy();
      expect(gameModelCopy).not.toBe(gameModel);
      expect(gameModelCopy.hash()).toBe(gameModel.hash());
      expect(gameModelCopy['foodPositions']).not.toBe(gameModel['foodPositions']);
      expect(gameModelCopy['originalFoodsPositions']).not.toBe(gameModel['originalFoodsPositions']);
      expect(gameModelCopy['snakeBodyPartsPositions']).not.toBe(gameModel['snakeBodyPartsPositions']);
    });
  });
  describe(GameModel.prototype.hash.name, () => {
    test('should create same has everytime in the same state', () => {
      expect(gameModel.hash()).toBe(gameModel.hash());
    });
    test('should create different hash if food was eaten', () => {
      const hashBeforeFoodEat = gameModel.hash();
      gameModel.removeFood(gameModel['foodPositions'][0]);
      expect(hashBeforeFoodEat).not.toBe(gameModel.hash());
    });
    test('should create different hash if snake has move', () => {
      const hashBeforeSnakeMove = gameModel.hash();
      const changedSnakeHeadPosition = { x: gameModel.snakeHeadPosition.x + 1, y: gameModel.snakeHeadPosition.y + 1 };
      gameModel.setNewSnakeHead(changedSnakeHeadPosition);
      expect(hashBeforeSnakeMove).not.toBe(gameModel.hash());
    });
    test('should create different hash if snake head changed direction', () => {
      const hashBeforeSnakeMove = gameModel.hash();
      gameModel.snakeHeadDirection = gameModel.snakeHeadDirection + 1;
      expect(hashBeforeSnakeMove).not.toBe(gameModel.hash());
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
      expect(gameModel.isLeftWall(-1)).toBeTruthy();
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
      expect(gameModel.isNotLeftWall(-1)).toBeFalsy();
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
      expect(gameModel.isNotTopWall(-1)).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isNotWall.name, () => {
    test('should return false if position is not a bottom wall', () => {
      expect(gameModel.isNotWall({ x: 0, y: gameModel['rowsCount'] })).toBeFalsy();
    });
    test('should return false if position is not a left wall', () => {
      expect(gameModel.isNotWall({ x: -1, y: 0 })).toBeFalsy();
    });
    test('should return false if position is not a right wall', () => {
      expect(gameModel.isNotWall({ x: gameModel['columnsCount'], y: 0 })).toBeFalsy();
    });
    test('should return false if position is not a top wall', () => {
      expect(gameModel.isNotWall({ x: 0, y: -1 })).toBeFalsy();
    });
    test('should return true if position is not a wall', () => {
      expect(gameModel.isNotWall({ x: 0, y: 0 })).toBeTruthy();
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
      expect(gameModel.isTopWall(-1)).toBeTruthy();
    });
    test('should return false if position is not a top wall', () => {
      expect(gameModel.isTopWall(1)).toBeFalsy();
    });
  });
  describe(GameModel.prototype.isWall.name, () => {
    test('should return true if position is not a bottom wall', () => {
      expect(gameModel.isWall({ x: 0, y: gameModel['rowsCount'] })).toBeTruthy();
    });
    test('should return true if position is not a left wall', () => {
      expect(gameModel.isWall({ x: -1, y: 0 })).toBeTruthy();
    });
    test('should return true if position is not a right wall', () => {
      expect(gameModel.isWall({ x: gameModel['columnsCount'], y: 0 })).toBeTruthy();
    });
    test('should return true if position is not a top wall', () => {
      expect(gameModel.isWall({ x: 0, y: -1 })).toBeTruthy();
    });
    test('should return false if position is not a wall', () => {
      expect(gameModel.isWall({ x: 0, y: 0 })).toBeFalsy();
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
      const snakeBodyPartsCountBeforeRemove: number = gameModel.snakeBodyPartsCount;
      const bodyPart: Position = gameModel['snakeBodyPartsPositions'][0];
      gameModel.removeSnakeBodyPart(bodyPart);
      expect(gameModel.snakeBodyPartsCount).toEqual(snakeBodyPartsCountBeforeRemove - 1);
    });
  });
  describe(GameModel.prototype.reset.name, () => {
    test('should rest game board to initial state', () => {
      gameModel.score = 12;
      gameModel.removeFood(gameModel['foodPositions'][0]);
      gameModel.setNewSnakeHead({ x: 0, y: 1 });
      gameModel.addNewSnakeTailPart();
      gameModel.reset();
      expect(gameModel.score).toBe(0);
      expect(gameModel.snakeBodyPartsCount).toBe(1);
      expect(gameModel['foodPositions'].length).toBe(gameModel['originalFoodsPositions'].length);
    });
  });
  describe(GameModel.prototype.setNewSnakeHead.name, () => {
    test('should set new head position', () => {
      const snakeBodyPartsCount: number = gameModel.snakeBodyPartsCount;
      const newHeadPosition: Position = { x: 1, y: 2 };
      gameModel.setNewSnakeHead(newHeadPosition);
      expect(gameModel.snakeBodyPartsCount).toEqual(snakeBodyPartsCount);
      expect(newHeadPosition.x).toEqual(gameModel['snakeBodyPartsPositions'][snakeBodyPartsCount - 1].x);
      expect(newHeadPosition.y).toEqual(gameModel['snakeBodyPartsPositions'][snakeBodyPartsCount - 1].y);
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
  describe(GameModel.prototype.stateAsVector.name, () => {
    test('should return vector with correct size', () => {
      const expectedSize =
        gameModel['columnsCount'] * gameModel['rowsCount'] -
        gameModel.snakeBodyPartsCount -
        gameModel.allFoods.length +
        gameModel.snakeBodyPartsCount * 3 +
        gameModel.allFoods.length * 3 +
        1;
      const environmentVectorLength = gameModel.stateAsVector().toString().replace(/,/g, '').length;
      expect(expectedSize).toBe(environmentVectorLength);
    });
  });
});

export function createGameModelMock(): GameModel {
  return new GameModel({ foodCount: 2, columnsCount: 4, rowsCount: 4 });
}
