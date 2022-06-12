import { MATH_UTILS } from '../../../src/common/Utils/MATH_UTILS';
import { IncorrectBufferSizeError } from '../../../src/errors/IncorrectBufferSizeError';
import { IMovingAverage } from '../../../src/structures/MovingAverage/IMovingAverage';
import { MovingAverage } from '../../../src/structures/MovingAverage/MovingAverage';

describe(MovingAverage.name, () => {
  let movingAverage: IMovingAverage;
  describe(MovingAverage.prototype.size.name, () => {
    it('should create moving average of given size between 1 - 1000', () => {
      const expected = MATH_UTILS.generateRandomInteger(1, 1000);
      movingAverage = new MovingAverage(expected);
      expect(movingAverage.size()).toBe(expected);
    });
    it('should throw an error if given size is 0', () => {
      expect(() => new MovingAverage(0)).toThrowError(IncorrectBufferSizeError);
    });
    it('should throw an error if try to create moving average with of size less than 0', () => {
      expect(() => new MovingAverage(-1)).toThrowError(IncorrectBufferSizeError);
    });
  });
  describe(MovingAverage.prototype.addOrReplace.name, () => {
    const bufferSize = 10;
    beforeEach(() => {
      movingAverage = new MovingAverage(bufferSize);
    });
    it('should replace item in buffer', () => {
      const value = 1;
      const expected = value / bufferSize;
      movingAverage.addOrReplace(value);
      expect(movingAverage.average()).toBe(expected);
    });
    it('should fill buffer with given number', () => {
      const expected = 2;
      movingAverage.fillBuffer(expected);
      expect(movingAverage.average()).toBe(expected);
    });
    it('should change buffer value after filling whole buffer to given value', () => {
      const value = 2;
      const fillValue = 1;
      const expected = (value + bufferSize - 1) / bufferSize;
      for (let i = 0; i < bufferSize; i++) {
        movingAverage.addOrReplace(fillValue);
      }
      movingAverage.addOrReplace(value);
      expect(movingAverage.average()).toBe(expected);
    });
  });
  describe(MovingAverage.prototype.fillBuffer.name, () => {
    const bufferSize = 10;
    beforeEach(() => {
      movingAverage = new MovingAverage(bufferSize);
    });
    it('should fill whole buffer with positive value', () => {
      const expected = -1;
      movingAverage.fillBuffer(expected);
      expect(movingAverage.average()).toBe(expected);
    });
    it('should fill whole buffer with 0', () => {
      const expected = 0;
      movingAverage.fillBuffer(expected);
      expect(movingAverage.average()).toBe(expected);
    });
    it('should fill whole buffer with negative value', () => {
      const expected = 1;
      movingAverage.fillBuffer(expected);
      expect(movingAverage.average()).toBe(expected);
    });
  });
  describe(MovingAverage.prototype.average.name, () => {
    it('should return average value for given values in buffer', () => {
      movingAverage = new MovingAverage(10);
      const expected = 12;
      const mathUtilsSpy = jest.spyOn(MATH_UTILS, 'average').mockReturnValue(expected);
      const avg = movingAverage.average();
      expect(avg).toBe(expected);
      expect(mathUtilsSpy).toBeCalledTimes(1);
      mathUtilsSpy.mockRestore();
    });
  });
  describe(MovingAverage.prototype.reset.name, () => {
    it('should reset buffer and fill with 0', () => {
      movingAverage = new MovingAverage(10);
      movingAverage.fillBuffer(1);
      movingAverage.reset();
      expect(movingAverage.average()).toBe(0);
    });
  });
});
