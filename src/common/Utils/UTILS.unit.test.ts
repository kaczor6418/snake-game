import 'jest';
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
