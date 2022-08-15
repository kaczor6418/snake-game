import { ReinforcementModel } from './ReinforcementModel';
import { ReinforcementController } from './ReinforcementController';
import { IReinforcementAgent } from './IReinforcementAgent';

export interface ReinforcementPlayer {
  readonly model: ReinforcementModel;
  readonly controller: ReinforcementController;
  runGameWithAgent(agent: IReinforcementAgent): Promise<void>;
}
