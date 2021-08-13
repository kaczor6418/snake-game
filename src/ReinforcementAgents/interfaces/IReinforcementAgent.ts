import { ReinforcementPlayer } from './ReinforcementPlayer';

export interface IReinforcementAgent<T> {
  learn(player: ReinforcementPlayer<T>, epochs: number): void;
  fit(player: ReinforcementPlayer<T>, callback?: (action: T) => void, callbackDellyInMs?: number): Promise<void>;
}
