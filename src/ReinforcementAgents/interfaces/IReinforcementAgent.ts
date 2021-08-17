export interface IReinforcementAgent<T> {
  learn(epochs: number): void;
  fit(callback?: (action: T) => void, callbackDellyInMs?: number): Promise<void>;
}
