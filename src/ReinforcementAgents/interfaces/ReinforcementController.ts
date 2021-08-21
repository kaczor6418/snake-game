import { ReinforcementModel } from './ReinforcementModel';

export interface ReinforcementController {
  move(action: number): ReinforcementModel;
}
