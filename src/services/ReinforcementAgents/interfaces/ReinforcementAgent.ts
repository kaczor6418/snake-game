import { ReinforcementPlayer } from './ReinforcementPlayer';

export interface ReinforcementAgent<T extends string> {
  train(player: ReinforcementPlayer<T>): Promise<number>;
  test(player: ReinforcementPlayer<T>): void;
}
