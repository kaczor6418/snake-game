import { ReinforcementPlayer } from './ReinforcementPlayer';

export interface ReinforcementAgent<T extends string> {
  learn(player: ReinforcementPlayer<T>, epochs: number): void;
  fit(player: ReinforcementPlayer<T>, callback?: (action: T) => void, callbackDellyInMs?: number): Promise<void>;
}
