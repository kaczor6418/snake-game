import { ARRAY_UTILS } from '../../../common/Utils/ARRAY_UTILS';
import { MATH_UTILS } from '../../../common/Utils/MATH_UTILS';
import { ReinforcementModel } from '../interfaces/ReinforcementModel';
import { ReinforcementPlayer } from '../interfaces/ReinforcementPlayer';
import { UTILS } from '../../../common/Utils/UTILS';
import { ReinforcementAgent } from '../ReinforcementAgent';
import { QLearningAgentProps } from './interfaces/QLearningAgentProps';

export class QLearningAgent<T> extends ReinforcementAgent<T> {
  constructor(agentProps: QLearningAgentProps<T>) {
    super(agentProps);
  }

  protected runSingleEpoch(player: ReinforcementPlayer<T>): void {
    player.model.reset();
    let state = player.model.copy();
    while (UTILS.isFalsy(state.isGameOver())) {
      const action = this.getAction(state);
      const nextState = player.controller.move(action);
      this.updateQValue(state, action, nextState.score, nextState);
      state = nextState.copy();
    }
  }

  protected getAction(state: ReinforcementModel): T {
    const possibleActions = this.getPossibleActions();
    const bestAction = this.getBestAction(state);
    let chosenAction = bestAction;
    if (possibleActions.length > 1 && MATH_UTILS.generateRandomNumber(0, 1) < this.exploreChance) {
      ARRAY_UTILS.removePrimitiveValue(possibleActions, bestAction);
      chosenAction = ARRAY_UTILS.getRandomValue(possibleActions);
    }
    return chosenAction;
  }

  private calculateQValue(state: ReinforcementModel, action: T, reward: number, nextState: ReinforcementModel): number {
    return (
      (1 - this.learningRate) * this.getQValue(state, action) + this.learningRate * (reward + this.adaptation * this.getMaxValue(nextState))
    );
  }

  private getBestAction(state: ReinforcementModel): T {
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

  private getQValue(state: ReinforcementModel, action: T): number {
    return this.qValues.get(state.hash())?.get(action) ?? 0;
  }

  private setQValue(state: ReinforcementModel, action: T, value: number): void {
    this.qValues.set(
      state.hash(),
      new Map<T, number>([[action, value]])
    );
  }

  private updateQValue(state: ReinforcementModel, action: T, reward: number, nextState: ReinforcementModel): void {
    this.setQValue(state, action, this.calculateQValue(state, action, reward, nextState));
  }
}
