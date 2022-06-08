import { MATH_UTILS } from '../../common/Utils/MATH_UTILS';
import { IMovingAverage } from './interfaces/IMovingAverage';

export class MovingAverage implements IMovingAverage {
  private index = 0;

  private readonly buffer: number[];

  constructor(size: number) {
    this.buffer = new Array<number>(size).fill(0);
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
    this.buffer.fill(0);
  }
}
