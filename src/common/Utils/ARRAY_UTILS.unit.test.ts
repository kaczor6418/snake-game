import { ARRAY_UTILS } from './ARRAY_UTILS';
import { CouldNotFindValueError } from '../../errors/CouldNotFindValueError';

describe(ARRAY_UTILS.shallowCopy.name, () => {
  test('should make a shell copy of every element', () => {
    const arr = [
      { x: 0, y: 1 },
      { x: 1, y: 1 }
    ];
    const arrCopy = ARRAY_UTILS.shallowCopy(arr);
    ++arrCopy[0].x;
    ++arrCopy[1].x;
    expect(arr[0].x).toBe(0);
    expect(arr[1].x).toBe(1);
  });
});
describe(ARRAY_UTILS.isEmpty.name, () => {
  test('should return true if array does not contains any elements', () => {
    const arr: unknown[] = [];
    expect(ARRAY_UTILS.isEmpty(arr)).toBeTruthy();
  });
  test('should return false if array contains at least one element', () => {
    const arr = [1, 2, 3, 4];
    expect(ARRAY_UTILS.isEmpty(arr)).toBeFalsy();
  });
});
describe(ARRAY_UTILS.isNotEmpty.name, () => {
  test('should return false if array does not contains any elements', () => {
    const arr: unknown[] = [];
    expect(ARRAY_UTILS.isNotEmpty(arr)).toBeFalsy();
  });
  test('should return true if array contains at least one element', () => {
    const arr = [1, 2, 3, 4];
    expect(ARRAY_UTILS.isNotEmpty(arr)).toBeTruthy();
  });
});
describe(ARRAY_UTILS.getLastElementReference.name, () => {
  test('should return mutable element reference', () => {
    const arr = [
      { x: 0, y: 0 },
      { x: 1, y: 1 }
    ];
    const element = ARRAY_UTILS.getLastElementReference(arr);
    ++element.x;
    ++element.y;
    expect(arr[1]).toBe(element);
  });
});
describe(ARRAY_UTILS.getLastElementCopy.name, () => {
  test('should return mutable element reference', () => {
    const arr = [
      { x: 0, y: 0 },
      { x: 1, y: 1 }
    ];
    const element = ARRAY_UTILS.getLastElementCopy(arr);
    ++element.x;
    ++element.y;
    expect(arr[1].x).toBe(1);
    expect(arr[1].y).toBe(1);
  });
});
describe(ARRAY_UTILS.removeElement.name, () => {
  test('should remove element under given index', () => {
    const arr = [1, 2, 3, 4];
    const arrLengthBeforeRemove = arr.length;
    const removed = ARRAY_UTILS.removeElement(arr, 1);
    expect(arr.length).toBe(arrLengthBeforeRemove - 1);
    expect(removed).toBe(2);
  });
});

describe(ARRAY_UTILS.hasObjectWithSameShape.name, () => {
  test('should return true for element with same shape', () => {
    const arr = [{ x: 0, y: 0 }];
    expect(ARRAY_UTILS.hasObjectWithSameShape(arr, { x: 0, y: 0 })).toBeTruthy();
  });
  test('should return false for element with different shape', () => {
    const arr = [{ x: 0, y: 0 }];
    expect(ARRAY_UTILS.hasObjectWithSameShape(arr, { x: 1, y: 0 })).toBeFalsy();
  });
});

describe(ARRAY_UTILS.getRandomValue.name, () => {
  test('should return random value from array', () => {
    const array = [1, 2, 3, 4];
    expect(array).toContain(ARRAY_UTILS.getRandomValue(array));
  });
  test('should return undefined if array is empty', () => {
    const array: unknown[] = [];
    expect(ARRAY_UTILS.getRandomValue(array)).toBe(undefined);
  });
});

describe(ARRAY_UTILS.removePrimitiveValue.name, () => {
  test('should remove given value from array', () => {
    const array = [2, 6, 5, 1];
    const oldLength = array.length;
    expect(ARRAY_UTILS.removePrimitiveValue(array, 6)).toBe(6);
    expect(array.length).toBe(oldLength - 1);
  });
  test('should throw an error if try to remove value that does not exists in array', () => {
    const array = [1, 2, 3];
    expect(() => ARRAY_UTILS.removePrimitiveValue(array, 6)).toThrowError(CouldNotFindValueError);
  });
  test('should return undefined if try to remove value from empty array', () => {
    const array: number[] = [];
    expect(() => ARRAY_UTILS.removePrimitiveValue(array, 6)).toThrowError(CouldNotFindValueError);
  });
});
