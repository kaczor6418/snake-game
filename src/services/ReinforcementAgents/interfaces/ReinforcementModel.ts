export interface ReinforcementModel {
  score: number;

  copy(): ReinforcementModel;
  hash(): string;
  isGameOver(): boolean;
  reset(): void;
}
