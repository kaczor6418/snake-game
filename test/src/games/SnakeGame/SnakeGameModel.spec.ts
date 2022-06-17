import { MATH_UTILS } from '../../../../src/common/Utils/MATH_UTILS';
import { UTILS } from '../../../../src/common/Utils/UTILS';
import { MoveDirection } from '../../../../src/games/SnakeGame/Controller/interfaces/MoveDirection';
import { Direction } from '../../../../src/games/SnakeGame/Model/interfaces/Direction';
import { ISnakeGameModel } from '../../../../src/games/SnakeGame/Model/interfaces/ISnakeGameModel';
import { Position } from '../../../../src/games/SnakeGame/Model/interfaces/Position';
import { SnakeEnvironmentElements } from '../../../../src/games/SnakeGame/Model/interfaces/SnakeEnvironmentElements';
import { SnakeGameModel } from '../../../../src/games/SnakeGame/Model/SnakeGameModel';
import { InvalidPositionError } from '../../../../src/errors/InvalidPositionError';

describe(SnakeGameModel.name, () => {
  let gameModel: ISnakeGameModel;
  const rowsCount = 4;
  const columnsCount = 4;
  const gridSize = () => rowsCount * columnsCount;
  const foodCount = 2;

  beforeEach(() => {
    gameModel = new SnakeGameModel({ foodCount, columnsCount, rowsCount });
  });
  describe('Game model grid generation', () => {
    it('should generate grid with given size', () => {
      const envSize = gameModel.environmentSize;
      expect(envSize.width).toBe(columnsCount);
      expect(envSize.height).toBe(rowsCount);
    });
    it('should generate grid with food count', () => {
      expect(gameModel.allFoods.length).toBe(foodCount);
    });
    it('should generate grid with only one snake body part', () => {
      expect(gameModel.allSnakeBodyParts.length).toBe(1);
    });
  });
  describe('All possible model actions', () => {
    it('should return LEFT, RIGHT and STRAIGHT action', () => {
      const result = gameModel.allActions;
      expect(result).toContain(MoveDirection.LEFT);
      expect(result).toContain(MoveDirection.RIGHT);
      expect(result).toContain(MoveDirection.STRAIGHT);
    });
  });
  describe(SnakeGameModel.prototype.addFood.name, () => {
    it('should add food under given position if doesnt exists yet', () => {
      let newFoodPosition: Position = { x: 0, y: 0 };
      while (gameModel.allFoods.some((foodPosition) => UTILS.isObjectWithSameKeyValues(newFoodPosition, foodPosition))) {
        newFoodPosition = {
          x: MATH_UTILS.generateRandomInteger(0, columnsCount),
          y: MATH_UTILS.generateRandomInteger(0, rowsCount),
        };
      }
      gameModel.addFood(newFoodPosition);
      expect(gameModel.hash().length).toBe(gridSize());
    });
    it('should NOT add food under given position if there is already food', () => {
      expect(() => gameModel.addFood(gameModel.allFoods[0])).toThrow(InvalidPositionError);
    });
    it('should NOT add food under given position if x is bigger than total columns count', () => {
      expect(() => gameModel.addFood({ x: columnsCount, y: 0 })).toThrow(InvalidPositionError);
    });
    it('should NOT add food under given position if y is bigger than total rows count', () => {
      expect(() => gameModel.addFood({ x: 0, y: rowsCount })).toThrow(InvalidPositionError);
    });
  });
  describe(SnakeGameModel.prototype.addNewSnakeTailPart.name, () => {
    it('should add snake tail part to snake body parts', () => {
      const snakeBodyPartsCount: number = gameModel.snakeBodyPartsCount;
      gameModel.setNewSnakeHead({ x: 0, y: 1 });
      gameModel.addNewSnakeTailPart();
      expect(gameModel.snakeBodyPartsCount).toEqual(snakeBodyPartsCount + 1);
    });
  });
  describe(SnakeGameModel.prototype.copy.name, () => {
    it('should create copy of class instance', () => {
      const gameModelCopy = gameModel.copy();
      expect(gameModelCopy).not.toBe(gameModel);
      expect(gameModelCopy.hash()).toBe(gameModel.hash());
    });
  });
  describe(SnakeGameModel.prototype.hash.name, () => {
    it('should create same has everytime in the same state', () => {
      expect(gameModel.hash()).toBe(gameModel.hash());
    });
    it('should create different hash if food was eaten', () => {
      const hashBeforeFoodEat = gameModel.hash();
      gameModel.removeFood(gameModel.allFoods[0]);
      expect(hashBeforeFoodEat).not.toBe(gameModel.hash());
    });
    it('should create different hash if snake has move', () => {
      const hashBeforeSnakeMove = gameModel.hash();
      const changedSnakeHeadPosition = { x: gameModel.snakeHeadPosition.x + 1, y: gameModel.snakeHeadPosition.y + 1 };
      gameModel.setNewSnakeHead(changedSnakeHeadPosition);
      expect(hashBeforeSnakeMove).not.toBe(gameModel.hash());
    });
    it('should create different hash if snake head changed direction', () => {
      const hashBeforeSnakeMove = gameModel.hash();
      gameModel.snakeHeadDirection = gameModel.snakeHeadDirection + 1;
      expect(hashBeforeSnakeMove).not.toBe(gameModel.hash());
    });
  });
  describe(SnakeGameModel.prototype.isBottomWall.name, () => {
    it('should return true if position is a bottom wall', () => {
      expect(gameModel.isBottomWall(rowsCount)).toBeTruthy();
    });
    it('should return false if position is not a bottom wall', () => {
      expect(gameModel.isBottomWall(rowsCount - 1)).toBeFalsy();
    });
  });
  describe(SnakeGameModel.prototype.isFoodPosition.name, () => {
    it('should return true if position is a food position', () => {
      expect(gameModel.isFoodPosition(gameModel.allFoods[0])).toBeTruthy();
    });
    it('should return false if position is not a food position', () => {
      expect(gameModel.isFoodPosition({ x: columnsCount, y: rowsCount })).toBeFalsy();
    });
  });
  describe(SnakeGameModel.prototype.isGameOver.name, () => {
    it('should return true if all food have been eaten', () => {
      for (const foodPosition of structuredClone(gameModel.allFoods)) {
        gameModel.removeFood(foodPosition);
      }
      expect(gameModel.isGameOver()).toBeTruthy();
    });
    it('should return false if all food have NOT been eaten and shouldFinish is false', () => {
      gameModel.shouldFinish = false;
      expect(gameModel.isGameOver()).toBeFalsy();
    });
    it('should return true if shouldFinish is true', () => {
      gameModel.shouldFinish = true;
      expect(gameModel.isGameOver()).toBeTruthy();
    });
  });
  describe(SnakeGameModel.prototype.isLeftWall.name, () => {
    it('should return true if position is a left wall', () => {
      expect(gameModel.isLeftWall(-1)).toBeTruthy();
    });
    it('should return false if position is not a left wall', () => {
      expect(gameModel.isLeftWall(0)).toBeFalsy();
    });
  });
  describe(SnakeGameModel.prototype.isNotBottomWall.name, () => {
    it('should return true if position is not a bottom wall', () => {
      expect(gameModel.isNotBottomWall(0)).toBeTruthy();
    });
    it('should return false if position is a bottom wall', () => {
      expect(gameModel.isNotBottomWall(rowsCount)).toBeFalsy();
    });
  });
  describe(SnakeGameModel.prototype.isNotFoodPosition.name, () => {
    it('should return true if position is not a food position', () => {
      expect(gameModel.isNotFoodPosition({ x: -1, y: -1 })).toBeTruthy();
    });
    it('should return false if position is a food position', () => {
      expect(gameModel.isNotFoodPosition(gameModel.allFoods[0])).toBeFalsy();
    });
  });
  describe(SnakeGameModel.prototype.isNotLeftWall.name, () => {
    it('should return true if position is not a left wall', () => {
      expect(gameModel.isNotLeftWall(0)).toBeTruthy();
    });
    it('should return false if position is a left wall', () => {
      expect(gameModel.isNotLeftWall(-1)).toBeFalsy();
    });
  });
  describe(SnakeGameModel.prototype.isNotRightWall.name, () => {
    it('should return true if position is not a right wall', () => {
      expect(gameModel.isNotRightWall(0)).toBeTruthy();
    });
    it('should return false if position is a right wall', () => {
      expect(gameModel.isNotRightWall(columnsCount)).toBeFalsy();
    });
  });
  describe(SnakeGameModel.prototype.isNotSnakeBodyPosition.name, () => {
    it('should return true if position is not a snake body part position', () => {
      expect(gameModel.isNotSnakeBodyPosition({ x: -1, y: -1 })).toBeTruthy();
    });
    it('should return false if position is a snake body part position', () => {
      expect(gameModel.isNotSnakeBodyPosition(gameModel.allSnakeBodyParts[0])).toBeFalsy();
    });
  });
  describe(SnakeGameModel.prototype.isNotTopWall.name, () => {
    it('should return true if position is not a top wall', () => {
      expect(gameModel.isNotTopWall(0)).toBeTruthy();
    });
    it('should return false if position is a top wall', () => {
      expect(gameModel.isNotTopWall(-1)).toBeFalsy();
    });
  });
  describe(SnakeGameModel.prototype.isNotWall.name, () => {
    it('should return false if position is not a bottom wall', () => {
      expect(gameModel.isNotWall({ x: 0, y: rowsCount })).toBeFalsy();
    });
    it('should return false if position is not a left wall', () => {
      expect(gameModel.isNotWall({ x: -1, y: 0 })).toBeFalsy();
    });
    it('should return false if position is not a right wall', () => {
      expect(gameModel.isNotWall({ x: columnsCount, y: 0 })).toBeFalsy();
    });
    it('should return false if position is not a top wall', () => {
      expect(gameModel.isNotWall({ x: 0, y: -1 })).toBeFalsy();
    });
    it('should return true if position is not a wall', () => {
      expect(gameModel.isNotWall({ x: 0, y: 0 })).toBeTruthy();
    });
  });
  describe(SnakeGameModel.prototype.isRightWall.name, () => {
    it('should return true if position is a right wall', () => {
      expect(gameModel.isRightWall(columnsCount)).toBeTruthy();
    });
    it('should return false if position is not a right wall', () => {
      expect(gameModel.isRightWall(0)).toBeFalsy();
    });
  });
  describe(SnakeGameModel.prototype.isSnakeBodyPartPosition.name, () => {
    it('should return true if position is a snake body part position', () => {
      expect(gameModel.isSnakeBodyPartPosition(gameModel.allSnakeBodyParts[0])).toBeTruthy();
    });
    it('should return false if position is not a snake body part position', () => {
      expect(gameModel.isSnakeBodyPartPosition({ x: -1, y: -1 })).toBeFalsy();
    });
  });
  describe(SnakeGameModel.prototype.isTopWall.name, () => {
    it('should return true if position is a top wall', () => {
      expect(gameModel.isTopWall(-1)).toBeTruthy();
    });
    it('should return false if position is not a top wall', () => {
      expect(gameModel.isTopWall(0)).toBeFalsy();
    });
  });
  describe(SnakeGameModel.prototype.isWall.name, () => {
    it('should return true if position is a bottom wall', () => {
      expect(gameModel.isWall({ x: 0, y: rowsCount })).toBeTruthy();
    });
    it('should return true if position is a left wall', () => {
      expect(gameModel.isWall({ x: -1, y: 0 })).toBeTruthy();
    });
    it('should return true if position is a right wall', () => {
      expect(gameModel.isWall({ x: columnsCount, y: 0 })).toBeTruthy();
    });
    it('should return true if position is a top wall', () => {
      expect(gameModel.isWall({ x: 0, y: -1 })).toBeTruthy();
    });
    it('should return false if position is not a wall', () => {
      expect(gameModel.isWall({ x: 0, y: 0 })).toBeFalsy();
    });
  });
  describe(SnakeGameModel.prototype.removeFood.name, () => {
    it('should remove one food from foods list', () => {
      const foodsCountBeforeRemove: number = gameModel.allFoods.length;
      const foodPositionToRemove: Position = gameModel.allFoods[0];
      gameModel.removeFood(foodPositionToRemove);
      expect(gameModel.allFoods.length).toEqual(foodsCountBeforeRemove - 1);
      expect(gameModel.allFoods.some((foodPosition) => UTILS.isObjectWithSameKeyValues(foodPositionToRemove, foodPosition))).toBeFalsy();
    });
    it('should remove all food from foods list', () => {
      for (const foodPosition of structuredClone(gameModel.allFoods)) {
        gameModel.removeFood(foodPosition);
      }
      expect(gameModel.allFoods.length).toEqual(0);
    });
  });
  describe(SnakeGameModel.prototype.removeSnakeBodyPart.name, () => {
    it('should remove one snake body part with given position from snake body parts list', () => {
      const snakeBodyPartsCountBeforeRemove: number = gameModel.snakeBodyPartsCount;
      const bodyPart: Position = gameModel.allSnakeBodyParts[0];
      const expected = gameModel.removeSnakeBodyPart(bodyPart);
      expect(gameModel.snakeBodyPartsCount).toEqual(snakeBodyPartsCountBeforeRemove - 1);
      expect(bodyPart).toBe(expected);
    });
    it('should remove one snake body part under given index from snake body parts list', () => {
      const snakeBodyPartsCountBeforeRemove: number = gameModel.snakeBodyPartsCount;
      const bodyPart: Position = gameModel.allSnakeBodyParts[0];
      const expected = gameModel.removeSnakeBodyPart(0);
      expect(gameModel.snakeBodyPartsCount).toEqual(snakeBodyPartsCountBeforeRemove - 1);
      expect(bodyPart).toBe(expected);
    });
  });
  describe(SnakeGameModel.prototype.reset.name, () => {
    it('should rest game board to initial state after eating one food', () => {
      const initialFoodCount = gameModel.allFoods.length;
      gameModel.removeFood(gameModel.allFoods[0]);
      gameModel.reset();
      expect(initialFoodCount).toBe(gameModel.allFoods.length);
    });
    it('should rest game board to initial state after increasing snake body size', () => {
      const initialSnakeBodyPartsCount = gameModel.snakeBodyPartsCount;
      gameModel.addNewSnakeTailPart();
      gameModel.reset();
      expect(initialSnakeBodyPartsCount).toBe(gameModel.snakeBodyPartsCount);
    });
    it('should rest game board to initial state after chaining head position', () => {
      const initialSnakeHeadPosition = gameModel.snakeHeadPosition;
      gameModel.setNewSnakeHead({ x: 0, y: 1 });
      gameModel.reset();
      expect(initialSnakeHeadPosition).toMatchObject(gameModel.snakeHeadPosition);
    });
    it('should rest game board to initial state after chaining head direction', () => {
      const initialSnakeHeadDirection = gameModel.snakeHeadDirection;
      gameModel.snakeHeadDirection = Direction.TOP;
      gameModel.reset();
      expect(initialSnakeHeadDirection).toBe(gameModel.snakeHeadDirection);
    });
    it('should rest game board to initial state after changing score', () => {
      const initialScore = gameModel.score;
      gameModel.score = 12;
      gameModel.reset();
      expect(initialScore).toBe(gameModel.score);
    });
  });
  describe(SnakeGameModel.prototype.setNewSnakeHead.name, () => {
    it('should set new head position', () => {
      const newHeadPosition: Position = { x: 1, y: 2 };
      gameModel.setNewSnakeHead(newHeadPosition);
      expect(gameModel.snakeHeadPosition).toMatchObject(newHeadPosition);
    });
  });
  describe(SnakeGameModel.prototype.updateBoard.name, () => {
    it('should update only columns count', () => {
      const newColumnsCount = columnsCount + 1;
      const initialFood = gameModel.allFoods;
      gameModel.updateBoard({ columnsCount: newColumnsCount });
      expect(gameModel.hash().length).toBe(newColumnsCount * rowsCount);
      expect(gameModel.allFoods).toStrictEqual(initialFood);
    });
    it('should update only rows count', () => {
      const newRowsCount = rowsCount + 1;
      const initialFood = gameModel.allFoods;
      gameModel.updateBoard({ rowsCount: newRowsCount });
      expect(gameModel.hash().length).toBe(newRowsCount * columnsCount);
      expect(gameModel.allFoods).toStrictEqual(initialFood);
    });
    it('should update only foods count', () => {
      const initialBoardSize = gameModel.hash().length;
      const newFoodCount = foodCount + 1;
      gameModel.updateBoard({ foodCount: newFoodCount });
      expect(gameModel.allFoods.length).toBe(newFoodCount);
      expect(gameModel.hash().length).toBe(initialBoardSize);
    });
    it('should update food, columns and rows count', () => {
      const newColumnsCount = columnsCount + 1;
      const newRowsCount = rowsCount + 1;
      const newFoodCount = foodCount + 1;
      gameModel.updateBoard({ columnsCount: newColumnsCount, rowsCount: newRowsCount, foodCount: newFoodCount });
      expect(gameModel.hash().length).toBe(newRowsCount * newColumnsCount);
      expect(gameModel.allFoods.length).toBe(newFoodCount);
    });
  });
  describe(SnakeGameModel.prototype.stateAsVector.name, () => {
    it('should return vector with initial body parts food and size', () => {
      const vector = gameModel.stateAsVector();
      const foodInVector = vector.filter((value) => value === SnakeEnvironmentElements.FOOD).length;
      const bodyPartsInVector = vector.filter((value) => value === SnakeEnvironmentElements.BODY_PART).length;
      expect(foodInVector).toBe(foodInVector);
      expect(bodyPartsInVector).toBe(0);
      expect(vector).toContain(gameModel.snakeHeadDirection);
      expect(vector.length).toBe(rowsCount * columnsCount);
    });
    it('should return vector without eaten food and additional snake body part', () => {
      gameModel.removeFood(gameModel.allFoods[0]);
      gameModel.setNewSnakeHead({ x: 0, y: 1 });
      gameModel.addNewSnakeTailPart();
      const vector = gameModel.stateAsVector();
      const foodInVector = vector.filter((value) => value === SnakeEnvironmentElements.FOOD).length;
      const bodyPartsInVector = vector.filter((value) => value === SnakeEnvironmentElements.BODY_PART).length;
      expect(foodInVector).toBe(foodCount - 1);
      expect(bodyPartsInVector).toBe(1);
      expect(vector).toContain(gameModel.snakeHeadDirection);
      expect(vector.length).toBe(rowsCount * columnsCount);
    });
  });
  afterEach(() => {
    gameModel.reset();
  });
});
