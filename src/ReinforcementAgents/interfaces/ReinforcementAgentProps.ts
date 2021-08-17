export interface ReinforcementAgentProps<T> {
  learningRate: number;
  initialEpsilon: number;
  adaptation: number;
  getPossibleActions: () => T[];
}
