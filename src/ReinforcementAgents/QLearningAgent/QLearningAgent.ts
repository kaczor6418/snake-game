import { ARRAY_UTILS } from '../../common/Utils/ARRAY_UTILS';
import { UTILS } from '../../common/Utils/UTILS';
import { ReinforcementModel } from '../interfaces/ReinforcementModel';
import { ReinforcementAgent } from '../ReinforcementAgent';
import { QLearningAgentProps } from './interfaces/QLearningAgentProps';

export class QLearningAgent extends ReinforcementAgent {
  private qValues: Map<string, Map<number, number>>;

  constructor(agentProps: QLearningAgentProps) {
    super(agentProps);
    this.qValues = new Map<string, Map<number, number>>();
  }

  protected runSingleEpoch(): void {
    let state = this.player.model.copy();
    while (UTILS.isFalsy(state.isGameOver())) {
      const action = this.getAction(state);
      const nextState = this.player.controller.move(action);
      this.updateQValue(state, action, nextState.score, nextState);
      state = nextState.copy();
    }
    this.player.model.reset();
  }

  private calculateQValue(
    state: ReinforcementModel,
    action: number,
    reward: number,
    nextState: ReinforcementModel
  ): number {
    return (
      (1 - this.learningRate) * this.getQValue(state, action) +
      this.learningRate * (reward + this.adaptation * this.getMaxValue(nextState))
    );
  }

  protected getBestAction(state: ReinforcementModel): number {
    const [firstAction, ...actions] = this.getPossibleActions();
    let bestActions = [firstAction];
    let bestActionValue = this.getQValue(state, firstAction);
    for (const action of actions) {
      const newBestValue = this.getQValue(state, action);
      if (newBestValue > bestActionValue) {
        bestActions = [action];
        bestActionValue = newBestValue;
      } else if (newBestValue === bestActionValue) {
        bestActions.push(action);
      }
    }
    return ARRAY_UTILS.getRandomValue(bestActions);
  }

  private getMaxValue(state: ReinforcementModel): number {
    return this.getPossibleActions().reduce((maxValue, action) => {
      const newValue = this.getQValue(state, action);
      if (newValue > maxValue) {
        maxValue = newValue;
      }
      return maxValue;
    }, -Infinity);
  }

  private getQValue(state: ReinforcementModel, action: number): number {
    return this.qValues.get(state.hash())?.get(action) ?? 0;
  }

  private setQValue(state: ReinforcementModel, action: number, value: number): void {
    const currentState = this.qValues.get(state.hash());
    if (UTILS.isDefined(currentState)) {
      currentState.set(action, value);
    } else {
      this.qValues.set(state.hash(), new Map<number, number>([[action, value]]));
    }
  }

  private updateQValue(state: ReinforcementModel, action: number, reward: number, nextState: ReinforcementModel): void {
    this.setQValue(state, action, this.calculateQValue(state, action, reward, nextState));
  }
}
