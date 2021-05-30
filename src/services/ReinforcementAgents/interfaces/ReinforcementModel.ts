export interface ReinforcementModel {
  readonly score: number;

  copy(): ReinforcementModel;
  getModelAsVector(): number[];
  hash(): string;
  isGameOver(): boolean;
  reset(): void;
}
