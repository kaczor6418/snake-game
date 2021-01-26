import 'jest';
import { MATH_UTILS } from './MATH_UTILS';

describe(MATH_UTILS.generateRandomInteger.name, () => {
  test('should generate random value in range 0 - 3', () => {
    const expectedValues = [0, 1, 2, 3];
    expect(expectedValues.includes(MATH_UTILS.generateRandomInteger(0, 3))).toBeTruthy();
  });
});
