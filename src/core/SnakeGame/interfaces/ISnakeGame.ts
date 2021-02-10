import { ReinforcementAgent } from '../../../services/ReinforcementAgents/interfaces/ReinforcementAgent';

export interface ISnakeGame<T extends string> {
  fullScreen(): void;
  start(): void;
  stop(): void;
  runSnakeWithAgent(agent: ReinforcementAgent<T>): void;
}
