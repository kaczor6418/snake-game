import { UTILS } from './UTILS';

describe(UTILS.isDefined.name, () => {
  test('should be truthy for not null or undefined values', () => {
    const value = 12;
    expect(UTILS.isDefined(value)).toBeTruthy();
  });
  test('should be falsy for null values', () => {
    const value = null;
    expect(UTILS.isDefined(value)).toBeFalsy();
  });
  test('should be falsy for undefined values', () => {
    const value = undefined;
    expect(UTILS.isDefined(value)).toBeFalsy();
  });
});
describe(UTILS.isNullOrUndefined.name, () => {
  test('should be falsy for not null or undefined values', () => {
    const value = 12;
    expect(UTILS.isNullOrUndefined(value)).toBeFalsy();
  });
  test('should be truthy for null values', () => {
    const value = null;
    expect(UTILS.isNullOrUndefined(value)).toBeTruthy();
  });
  test('should be truthy for undefined values', () => {
    const value = undefined;
    expect(UTILS.isNullOrUndefined(value)).toBeTruthy();
  });
});

describe(UTILS.shallowCopy.name, () => {
  test('should not modify copied elements', () => {
    const obj = { x: 0, y: 0 };
    const objCopy = UTILS.shallowCopy(obj);
    ++objCopy.x;
    ++objCopy.y;
    expect(obj.x).toBe(0);
    expect(obj.y).toBe(0);
    expect(objCopy.x).toBe(1);
    expect(objCopy.y).toBe(1);
  });
});
