import { ARRAY_UTILS } from '../../common/Utils/ARRAY_UTILS';
import { MATH_UTILS } from '../../common/Utils/MATH_UTILS';
import { UTILS } from '../../common/Utils/UTILS';
import { ReinforcementModel } from '../interfaces/ReinforcementModel';
import { ReinforcementAgent } from '../ReinforcementAgent';
import { QLearningAgentProps } from './interfaces/QLearningAgentProps';

export class QLearningAgent<T> extends ReinforcementAgent<T> {
  private qValues: Map<string, Map<T, number>>;

  constructor(agentProps: QLearningAgentProps<T>) {
    super(agentProps);
    this.qValues = new Map<string, Map<T, number>>();
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

  protected getAction(state: ReinforcementModel<T>): T {
    const possibleActions = this.getPossibleActions();
    const bestAction = this.getBestAction(state);
    let chosenAction = bestAction;
    if (possibleActions.length > 1 && MATH_UTILS.generateRandomNumber(0, 1) < this.initialEpsilon) {
      ARRAY_UTILS.removePrimitiveValue(possibleActions, bestAction);
      chosenAction = ARRAY_UTILS.getRandomValue(possibleActions);
    }
    return chosenAction;
  }

  private calculateQValue(
    state: ReinforcementModel<T>,
    action: T,
    reward: number,
    nextState: ReinforcementModel<T>
  ): number {
    return (
      (1 - this.learningRate) * this.getQValue(state, action) +
      this.learningRate * (reward + this.adaptation * this.getMaxValue(nextState))
    );
  }

  private getBestAction(state: ReinforcementModel<T>): T {
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

  private getMaxValue(state: ReinforcementModel<T>): number {
    return this.getPossibleActions().reduce((maxValue, action) => {
      const newValue = this.getQValue(state, action);
      if (newValue > maxValue) {
        maxValue = newValue;
      }
      return maxValue;
    }, -Infinity);
  }

  private getQValue(state: ReinforcementModel<T>, action: T): number {
    return this.qValues.get(state.hash())?.get(action) ?? 0;
  }

  private setQValue(state: ReinforcementModel<T>, action: T, value: number): void {
    const currentState = this.qValues.get(state.hash());
    if (UTILS.isDefined(currentState)) {
      currentState.set(action, value);
    } else {
      this.qValues.set(state.hash(), new Map<T, number>([[action, value]]));
    }
  }

  private updateQValue(
    state: ReinforcementModel<T>,
    action: T,
    reward: number,
    nextState: ReinforcementModel<T>
  ): void {
    this.setQValue(state, action, this.calculateQValue(state, action, reward, nextState));
  }
}
