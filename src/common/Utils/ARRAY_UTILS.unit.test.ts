import { ARRAY_UTILS } from './ARRAY_UTILS';

describe(ARRAY_UTILS.shellCopy.name, () => {
  test('should make a shell copy of every element', () => {
    const arr = [
      { x: 0, y: 1 },
      { x: 1, y: 1 }
    ];
    const arrCopy = ARRAY_UTILS.shellCopy(arr);
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
    const arr = [1, 2, 3];
    expect(ARRAY_UTILS.isEmpty(arr)).toBeFalsy();
  });
});
describe(ARRAY_UTILS.isNotEmpty.name, () => {
  test('should return false if array does not contains any elements', () => {
    const arr: unknown[] = [];
    expect(ARRAY_UTILS.isNotEmpty(arr)).toBeFalsy();
  });
  test('should return true if array contains at least one element', () => {
    const arr = [1, 2, 3];
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
