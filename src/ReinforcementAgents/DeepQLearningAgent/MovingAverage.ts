import { MATH_UTILS } from '../../common/Utils/MATH_UTILS';

export class MovingAverage {
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
}
