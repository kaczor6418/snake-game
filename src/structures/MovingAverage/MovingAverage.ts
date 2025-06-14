import { MATH_UTILS } from '../../common/Utils/MATH_UTILS';
import { IncorrectBufferSizeError } from '../../errors/IncorrectBufferSizeError';
import { IMovingAverage } from './IMovingAverage';

export class MovingAverage implements IMovingAverage {
  private index = 0;

  private readonly buffer: number[];

  constructor(size: number) {
    if (size < 1) {
      throw new IncorrectBufferSizeError('Can not create a buffer if size is less or equal 0!');
    }
    this.buffer = new Array<number>(size).fill(0);
  }

  public size(): number {
    return this.buffer.length;
  }

  public fillBuffer(value: number): void {
    this.index = 0;
    this.buffer.fill(value);
  }

  public addOrReplace(value: number): void {
    if (this.buffer.length === this.index) {
      this.index = 0;
    }
    this.buffer[this.index] = value;
    this.index++;
  }

  public average(): number {
    return MATH_UTILS.average(this.buffer);
  }

  public reset(): void {
    this.index = 0;
    this.buffer.fill(0);
  }
}
