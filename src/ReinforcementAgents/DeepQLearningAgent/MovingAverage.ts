import { MATH_UTILS } from '../../common/Utils/MATH_UTILS';

export class MovingAverage {
  private index = 0;
  private filled = false;

  private readonly buffer: number[];

  constructor(size: number) {
    this.buffer = new Array<number>(size);
  }

  public addOrReplace(value: number): void {
    if (this.buffer.length === this.index) {
      this.filled = true;
      this.index = 0;
    }
    this.buffer[this.index] = value;
  }

  public average(): number {
    return MATH_UTILS.average(this.buffer.slice(0, this.filled ? this.buffer.length : this.index));
  }
}
