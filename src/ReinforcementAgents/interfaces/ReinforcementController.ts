import { ReinforcementModel } from './ReinforcementModel';

export interface ReinforcementController<T> {
  move(action: T): ReinforcementModel<T>;
}
