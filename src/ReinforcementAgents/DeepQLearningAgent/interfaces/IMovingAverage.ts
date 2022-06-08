export interface IMovingAverage {
  addOrReplace(value: number): void;
  average(): number;

  reset(): void;
}
