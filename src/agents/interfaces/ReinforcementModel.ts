import { EnvironmentSize } from '../../common/interfaces/EnvironmentSize';

export interface ReinforcementModel {
  readonly allActions: number[];
  readonly score: number;
  readonly environmentSize: EnvironmentSize;

  copy(): ReinforcementModel;
  stateAsVector(): number[];
  hash(): string;
  isGameOver(): boolean;
  gameEndState(): 0 | 1;
  reset(): void;
}
