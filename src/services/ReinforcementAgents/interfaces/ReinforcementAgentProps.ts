export interface ReinforcementAgentProps<T> {
  learningRate: number;
  exploreChance: number;
  adaptation: number;
  getPossibleActions: () => T[];
}
