export interface IMovingAverage {
  addOrReplace(value: number): void;
  fillBuffer(value: number): void;
  average(): number;
  size(): number;
  reset(): void;
}
