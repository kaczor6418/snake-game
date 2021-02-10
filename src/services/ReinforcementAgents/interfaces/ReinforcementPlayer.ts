import { ReinforcementModel } from './ReinforcementModel';
import { ReinforcementController } from './ReinforcementController';
import { ReinforcementAgent } from './ReinforcementAgent';

export interface ReinforcementPlayer<T extends string> {
  readonly model: ReinforcementModel;
  readonly controller: ReinforcementController<T>;
  runSnakeWithAgent(agent: ReinforcementAgent<T>): void;
}
