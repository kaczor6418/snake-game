export interface ReinforcementModel {
  readonly score: number;

  copy(): ReinforcementModel;
  hash(): string;
  isGameOver(): boolean;
  reset(): void;
}
