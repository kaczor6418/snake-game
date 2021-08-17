import { EnvironmentSize } from '../../common/interfaces/EnvironmentSize';

export interface ReinforcementModel<T> {
  readonly allActions: T[];
  readonly score: number;
  readonly environmentSize: EnvironmentSize;

  copy(): ReinforcementModel<T>;
  environmentAsVector(): number[];
  hash(): string;
  isGameOver(): boolean;
  reset(): void;
}
