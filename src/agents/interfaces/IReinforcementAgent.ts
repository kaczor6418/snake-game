export interface IReinforcementAgent {
  learn(epochs: number): Promise<void>;
  fit(callback?: (action: number) => void, callbackDellyInMs?: number): Promise<void>;
}
