import { ReinforcementModel } from './ReinforcementModel';
import { ReinforcementController } from './ReinforcementController';
import { IReinforcementAgent } from './IReinforcementAgent';

export interface ReinforcementPlayer<T> {
  readonly model: ReinforcementModel;
  readonly controller: ReinforcementController<T>;
  runSnakeWithAgent(agent: IReinforcementAgent<T>): Promise<void>;
}
