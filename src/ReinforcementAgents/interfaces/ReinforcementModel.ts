export interface ReinforcementModel {
  readonly score: number;

  copy(): ReinforcementModel;
  environmentAsVector(): number[];
  hash(): string;
  isGameOver(): boolean;
  reset(): void;
}
