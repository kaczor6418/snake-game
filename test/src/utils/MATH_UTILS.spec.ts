import { MATH_UTILS } from '../../../src/common/Utils/MATH_UTILS';

describe(MATH_UTILS.generateRandomInteger.name, () => {
  it('should generate positive random integer in range 1 - 3', () => {
    const expectedValues = [1, 2, 3];
    expect(expectedValues.includes(MATH_UTILS.generateRandomInteger(1, 3))).toBeTruthy();
  });
  it('should generate positive random integer in range 3 - 1', () => {
    const expectedValues = [1, 2, 3];
    expect(expectedValues.includes(MATH_UTILS.generateRandomInteger(3, 1))).toBeTruthy();
  });
  it('should generate negative random integer in range (-1) - (-3)', () => {
    const expectedValues = [-1, -2, -3];
    expect(expectedValues.includes(MATH_UTILS.generateRandomInteger(-1, -3))).toBeTruthy();
  });
  it('should generate negative random integer in range (-3) - (-1)', () => {
    const expectedValues = [-1, -2, -3];
    expect(expectedValues.includes(MATH_UTILS.generateRandomInteger(-3, -1))).toBeTruthy();
  });
  it('should generate 0 if range is 0 - 0', () => {
    expect(MATH_UTILS.generateRandomInteger(0, 0)).toBe(0);
  });
});

describe(MATH_UTILS.generateRandomNumber.name, () => {
  it('should generate positive random number in range 1 - 3', () => {
    const minValue = 1;
    const maxValue = 3;
    const generatedValue = MATH_UTILS.generateRandomNumber(minValue, maxValue);
    expect(generatedValue).toBeGreaterThanOrEqual(minValue);
    expect(generatedValue).toBeLessThanOrEqual(maxValue);
  });
  it('should generate positive random number in range 3 - 1', () => {
    const minValue = 3;
    const maxValue = 1;
    const generatedValue = MATH_UTILS.generateRandomNumber(minValue, maxValue);
    expect(generatedValue).toBeLessThanOrEqual(minValue);
    expect(generatedValue).toBeGreaterThanOrEqual(maxValue);
  });
  it('should generate negative random number in range (-1) - (-3)', () => {
    const minValue = -1;
    const maxValue = -3;
    const generatedValue = MATH_UTILS.generateRandomNumber(minValue, maxValue);
    expect(generatedValue).toBeLessThanOrEqual(minValue);
    expect(generatedValue).toBeGreaterThanOrEqual(maxValue);
  });
  it('should generate negative random number in range (-3) - (-1)', () => {
    const minValue = -3;
    const maxValue = -1;
    const generatedValue = MATH_UTILS.generateRandomNumber(minValue, maxValue);
    expect(generatedValue).toBeGreaterThanOrEqual(minValue);
    expect(generatedValue).toBeLessThanOrEqual(maxValue);
  });
  it('should generate 0 if range is 0 - 0', () => {
    expect(MATH_UTILS.generateRandomNumber(0, 0)).toBe(0);
  });
});

describe(MATH_UTILS.sum.name, () => {
  it('should sum all integers in array', () => {
    const v1 = 1;
    const v2 = 2;
    const v3 = 3;
    const expectedSum = v1 + v2 + v3;
    expect(MATH_UTILS.sum([v1, v2, v3])).toBe(expectedSum);
  });
  it('should sum all floats values in array', () => {
    const v1 = 1.1;
    const v2 = 2.2;
    const v3 = 3.3;
    const expectedSum = v1 + v2 + v3;
    expect(MATH_UTILS.sum([v1, v2, v3])).toBe(expectedSum);
  });
  it('should sum all floats and integers values in array', () => {
    const v1 = 1.1;
    const v2 = 2;
    const v3 = 3.3;
    const expectedSum = v1 + v2 + v3;
    expect(MATH_UTILS.sum([v1, v2, v3])).toBe(expectedSum);
  });
  it('should return 0 if array is empty', () => {
    expect(MATH_UTILS.sum([])).toBe(0);
  });
});

describe(MATH_UTILS.average.name, () => {
  it('should sum all integers in array', () => {
    const v1 = 1;
    const v2 = 2;
    const v3 = 3;
    const expectedSum = (v1 + v2 + v3) / 3;
    expect(MATH_UTILS.average([v1, v2, v3])).toBe(expectedSum);
  });
  it('should sum all floats values in array', () => {
    const v1 = 1.1;
    const v2 = 2.2;
    const v3 = 3.3;
    const expectedSum = (v1 + v2 + v3) / 3;
    expect(MATH_UTILS.average([v1, v2, v3])).toBe(expectedSum);
  });
  it('should sum all floats and integers values in array', () => {
    const v1 = 1.1;
    const v2 = 2;
    const v3 = 3.3;
    const expectedSum = (v1 + v2 + v3) / 3;
    expect(MATH_UTILS.average([v1, v2, v3])).toBe(expectedSum);
  });
  it('should return 0 if array contains only 0', () => {
    expect(MATH_UTILS.average([0, 0, 0])).toBe(0);
  });
  it('should return NaN if array is empty', () => {
    expect(MATH_UTILS.average([])).toBeNaN();
  });
});
