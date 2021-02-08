import { ReinforcementModel } from './ReinforcementModel';

export interface ReinforcementPlayer<T extends string> {
  move(action: T): ReinforcementModel;
  getModel(): ReinforcementModel;
}
