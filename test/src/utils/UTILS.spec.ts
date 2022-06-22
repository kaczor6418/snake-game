import { UTILS } from '../../../src/common/Utils/UTILS';

describe(UTILS.isDefined.name, () => {
  describe('Truthy values', () => {
    it(`should return true if true`, () => {
      expect(UTILS.isDefined(true)).toBeTruthy();
    });
    it(`should return true if positive number`, () => {
      expect(UTILS.isDefined(1)).toBeTruthy();
    });
    it(`should return true if positive BigInt`, () => {
      expect(UTILS.isDefined(1n)).toBeTruthy();
    });
    it(`should return true if negative BigInt`, () => {
      expect(UTILS.isDefined(-1n)).toBeTruthy();
    });
    it(`should return true if Infinity`, () => {
      expect(UTILS.isDefined(Infinity)).toBeTruthy();
    });
    it(`should return true if -Infinity`, () => {
      expect(UTILS.isDefined(-Infinity)).toBeTruthy();
    });
    it(`should return true if negative number`, () => {
      expect(UTILS.isDefined(-1)).toBeTruthy();
    });
    it(`should return true if 'false' string`, () => {
      expect(UTILS.isDefined('false')).toBeTruthy();
    });
    it(`should return true if '0' string`, () => {
      expect(UTILS.isDefined('0')).toBeTruthy();
    });
    it(`should return true if any string longer than 0`, () => {
      expect(UTILS.isDefined('.')).toBeTruthy();
    });
    it(`should return true if empty object {}`, () => {
      expect(UTILS.isDefined({})).toBeTruthy();
    });
    it(`should return true if empty array []`, () => {
      expect(UTILS.isDefined([])).toBeTruthy();
    });
    it(`should return true if Date object`, () => {
      expect(UTILS.isDefined(new Date())).toBeTruthy();
    });
    it(`should return true if false`, () => {
      expect(UTILS.isDefined(false)).toBeTruthy();
    });
    it(`should return true if 0`, () => {
      expect(UTILS.isDefined(0)).toBeTruthy();
    });
    it(`should return true if -0`, () => {
      expect(UTILS.isDefined(-0)).toBeTruthy();
    });
    it(`should return true if BigInt 0`, () => {
      expect(UTILS.isDefined(0n)).toBeTruthy();
    });
    it(`should return true if negative BigInt 0`, () => {
      expect(UTILS.isDefined(-0n)).toBeTruthy();
    });
    it(`should return true if empty string`, () => {
      expect(UTILS.isDefined('')).toBeTruthy();
    });
    it(`should return true if NaN`, () => {
      expect(UTILS.isDefined(NaN)).toBeTruthy();
    });
  });
  describe('Falsy values', () => {
    it(`should return false if null`, () => {
      expect(UTILS.isDefined(null)).toBeFalsy();
    });
    it(`should return false if undefined`, () => {
      expect(UTILS.isDefined(undefined)).toBeFalsy();
    });
  });
});
describe(UTILS.isNullOrUndefined.name, () => {
  describe('Truthy values', () => {
    it(`should return true if null`, () => {
      expect(UTILS.isNullOrUndefined(null)).toBeTruthy();
    });
    it(`should return true if undefined`, () => {
      expect(UTILS.isNullOrUndefined(undefined)).toBeTruthy();
    });
  });
  describe('Falsy values', () => {
    it(`should return false if number created with Number constructor`, () => {
      expect(UTILS.isNullOrUndefined(new Number(1))).toBeFalsy();
    });
    it(`should return false if number created with empty Number constructor`, () => {
      expect(UTILS.isNullOrUndefined(new Number())).toBeFalsy();
    });
    it(`should return false if created with String constructor`, () => {
      expect(UTILS.isNullOrUndefined(new String('abc'))).toBeFalsy();
    });
    it(`should return false if created with empty String constructor`, () => {
      expect(UTILS.isNullOrUndefined(new String())).toBeFalsy();
    });
    it(`should return false if true`, () => {
      expect(UTILS.isNullOrUndefined(true)).toBeFalsy();
    });
    it(`should return false if positive number`, () => {
      expect(UTILS.isNullOrUndefined(1)).toBeFalsy();
    });
    it(`should return false if positive BigInt`, () => {
      expect(UTILS.isNullOrUndefined(1n)).toBeFalsy();
    });
    it(`should return false if negative BigInt`, () => {
      expect(UTILS.isNullOrUndefined(-1n)).toBeFalsy();
    });
    it(`should return false if Infinity`, () => {
      expect(UTILS.isNullOrUndefined(Infinity)).toBeFalsy();
    });
    it(`should return false if -Infinity`, () => {
      expect(UTILS.isNullOrUndefined(-Infinity)).toBeFalsy();
    });
    it(`should return false if negative number`, () => {
      expect(UTILS.isNullOrUndefined(-1)).toBeFalsy();
    });
    it(`should return false if 'false' string`, () => {
      expect(UTILS.isNullOrUndefined('false')).toBeFalsy();
    });
    it(`should return false if '0' string`, () => {
      expect(UTILS.isNullOrUndefined('0')).toBeFalsy();
    });
    it(`should return false if any string longer than 0`, () => {
      expect(UTILS.isNullOrUndefined('.')).toBeFalsy();
    });
    it(`should return false if empty object {}`, () => {
      expect(UTILS.isNullOrUndefined({})).toBeFalsy();
    });
    it(`should return false if empty array []`, () => {
      expect(UTILS.isNullOrUndefined([])).toBeFalsy();
    });
    it(`should return false if Date object`, () => {
      expect(UTILS.isNullOrUndefined(new Date())).toBeFalsy();
    });
    it(`should return false if false`, () => {
      expect(UTILS.isNullOrUndefined(false)).toBeFalsy();
    });
    it(`should return false if 0`, () => {
      expect(UTILS.isNullOrUndefined(0)).toBeFalsy();
    });
    it(`should return false if -0`, () => {
      expect(UTILS.isNullOrUndefined(-0)).toBeFalsy();
    });
    it(`should return false if BigInt 0`, () => {
      expect(UTILS.isNullOrUndefined(0n)).toBeFalsy();
    });
    it(`should return false if negative BigInt 0`, () => {
      expect(UTILS.isNullOrUndefined(-0n)).toBeFalsy();
    });
    it(`should return false if empty string`, () => {
      expect(UTILS.isNullOrUndefined('')).toBeFalsy();
    });
    it(`should return false if NaN`, () => {
      expect(UTILS.isNullOrUndefined(NaN)).toBeFalsy();
    });
  });
});

describe(UTILS.isTruthy.name, () => {
  describe('JavaScript Truthy values', () => {
    it(`should return true if true`, () => {
      expect(UTILS.isTruthy(true)).toBeTruthy();
    });
    it(`should return true if positive number`, () => {
      expect(UTILS.isTruthy(1)).toBeTruthy();
    });
    it(`should return true if positive BigInt`, () => {
      expect(UTILS.isTruthy(1n)).toBeTruthy();
    });
    it(`should return true if negative BigInt`, () => {
      expect(UTILS.isTruthy(-1n)).toBeTruthy();
    });
    it(`should return true if Infinity`, () => {
      expect(UTILS.isTruthy(Infinity)).toBeTruthy();
    });
    it(`should return true if -Infinity`, () => {
      expect(UTILS.isTruthy(-Infinity)).toBeTruthy();
    });
    it(`should return true if negative number`, () => {
      expect(UTILS.isTruthy(-1)).toBeTruthy();
    });
    it(`should return true if 'false' string`, () => {
      expect(UTILS.isTruthy('false')).toBeTruthy();
    });
    it(`should return true if '0' string`, () => {
      expect(UTILS.isTruthy('0')).toBeTruthy();
    });
    it(`should return true if any string longer than 0`, () => {
      expect(UTILS.isTruthy('.')).toBeTruthy();
    });
    it(`should return true if empty object {}`, () => {
      expect(UTILS.isTruthy({})).toBeTruthy();
    });
    it(`should return true if empty array []`, () => {
      expect(UTILS.isTruthy([])).toBeTruthy();
    });
    it(`should return true if Date object`, () => {
      expect(UTILS.isTruthy(new Date())).toBeTruthy();
    });
  });
  describe('JavaScript Falsy values', () => {
    it(`should return false if false`, () => {
      expect(UTILS.isTruthy(false)).toBeFalsy();
    });
    it(`should return false if 0`, () => {
      expect(UTILS.isTruthy(0)).toBeFalsy();
    });
    it(`should return false if -0`, () => {
      expect(UTILS.isTruthy(-0)).toBeFalsy();
    });
    it(`should return false if BigInt 0`, () => {
      expect(UTILS.isTruthy(0n)).toBeFalsy();
    });
    it(`should return false if negative BigInt 0`, () => {
      expect(UTILS.isTruthy(-0n)).toBeFalsy();
    });
    it(`should return false if empty string`, () => {
      expect(UTILS.isTruthy('')).toBeFalsy();
    });
    it(`should return false if null`, () => {
      expect(UTILS.isTruthy(null)).toBeFalsy();
    });
    it(`should return false if undefined`, () => {
      expect(UTILS.isTruthy(undefined)).toBeFalsy();
    });
    it(`should return false if NaN`, () => {
      expect(UTILS.isTruthy(NaN)).toBeFalsy();
    });
  });
});

describe(UTILS.isFalsy.name, () => {
  describe('JavaScript Falsy values', () => {
    it(`should return false if true`, () => {
      expect(UTILS.isFalsy(true)).toBeFalsy();
    });
    it(`should return false if positive number`, () => {
      expect(UTILS.isFalsy(1)).toBeFalsy();
    });
    it(`should return false if positive BigInt`, () => {
      expect(UTILS.isFalsy(1n)).toBeFalsy();
    });
    it(`should return false if negative BigInt`, () => {
      expect(UTILS.isFalsy(-1n)).toBeFalsy();
    });
    it(`should return false if Infinity`, () => {
      expect(UTILS.isFalsy(Infinity)).toBeFalsy();
    });
    it(`should return false if -Infinity`, () => {
      expect(UTILS.isFalsy(-Infinity)).toBeFalsy();
    });
    it(`should return false if negative number`, () => {
      expect(UTILS.isFalsy(-1)).toBeFalsy();
    });
    it(`should return false if 'false' string`, () => {
      expect(UTILS.isFalsy('false')).toBeFalsy();
    });
    it(`should return false if '0' string`, () => {
      expect(UTILS.isFalsy('0')).toBeFalsy();
    });
    it(`should return false if any string longer than 0`, () => {
      expect(UTILS.isFalsy('.')).toBeFalsy();
    });
    it(`should return false if empty object {}`, () => {
      expect(UTILS.isFalsy({})).toBeFalsy();
    });
    it(`should return false if empty array []`, () => {
      expect(UTILS.isFalsy([])).toBeFalsy();
    });
    it(`should return false if Date object`, () => {
      expect(UTILS.isFalsy(new Date())).toBeFalsy();
    });
  });
  describe('JavaScript Falsy values', () => {
    it(`should return true if false`, () => {
      expect(UTILS.isFalsy(false)).toBeTruthy();
    });
    it(`should return true if 0`, () => {
      expect(UTILS.isFalsy(0)).toBeTruthy();
    });
    it(`should return true if -0`, () => {
      expect(UTILS.isFalsy(-0)).toBeTruthy();
    });
    it(`should return true if BigInt 0`, () => {
      expect(UTILS.isFalsy(0n)).toBeTruthy();
    });
    it(`should return true if negative BigInt 0`, () => {
      expect(UTILS.isFalsy(-0n)).toBeTruthy();
    });
    it(`should return true if empty string`, () => {
      expect(UTILS.isFalsy('')).toBeTruthy();
    });
    it(`should return true if null`, () => {
      expect(UTILS.isFalsy(null)).toBeTruthy();
    });
    it(`should return true if undefined`, () => {
      expect(UTILS.isFalsy(undefined)).toBeTruthy();
    });
    it(`should return true if NaN`, () => {
      expect(UTILS.isFalsy(NaN)).toBeTruthy();
    });
  });
});

describe(UTILS.shallowCopy.name, () => {
  it('should not modify copied elements', () => {
    const obj = { x: 0, y: 0 };
    const objCopy = UTILS.shallowCopy(obj);
    objCopy.x += 1;
    objCopy.y += 1;
    expect(obj.x).toBe(0);
    expect(obj.y).toBe(0);
    expect(objCopy.x).toBe(1);
    expect(objCopy.y).toBe(1);
  });
});

describe(UTILS.wait.name, () => {
  it('should call function after given period of time', async () => {
    const time = 100; // in milliseconds
    const mistakeMargin = 20; // in milliseconds
    const minTimeWaited = time - mistakeMargin;
    const maxTimeWaited = time + mistakeMargin;
    const start = performance.now();
    await UTILS.wait(time);
    const timeWaited = performance.now() - start;
    expect(timeWaited).toBeGreaterThanOrEqual(minTimeWaited);
    expect(timeWaited).toBeLessThanOrEqual(maxTimeWaited);
  });
});
