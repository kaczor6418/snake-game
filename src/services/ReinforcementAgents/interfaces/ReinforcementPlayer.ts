import { ReinforcementModel } from './ReinforcementModel';
import { ReinforcementController } from './ReinforcementController';

export interface ReinforcementPlayer<T extends string> {
  readonly model: ReinforcementModel;
  readonly controller: ReinforcementController<T>;
}
