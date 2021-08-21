export interface IReinforcementAgent {
  learn(epochs: number): void;
  fit(callback?: (action: number) => void, callbackDellyInMs?: number): Promise<void>;
}
