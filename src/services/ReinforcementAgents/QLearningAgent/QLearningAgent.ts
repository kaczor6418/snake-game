import { ARRAY_UTILS } from '../../../common/Utils/ARRAY_UTILS';
import { MATH_UTILS } from '../../../common/Utils/MATH_UTILS';
import { ReinforcementModel } from '../interfaces/ReinforcementModel';
import { ReinforcementPlayer } from '../interfaces/ReinforcementPlayer';
import { UTILS } from '../../../common/Utils/UTILS';
import { ReinforcementAgent } from '../interfaces/ReinforcementAgent';

export class QLearningAgent<T extends string> implements ReinforcementAgent<T> {
  private learningRate: number;
  private exploreChance: number;
  private qValues: Map<string, Map<T, number>>;

  private readonly adaptation: number;
  private readonly getPossibleActions: () => T[];

  constructor(learningRate: number, epsilon: number, discount: number, getPossibleActions: () => T[]) {
    this.qValues = new Map<string, Map<T, number>>();
    this.learningRate = learningRate;
    this.exploreChance = epsilon;
    this.adaptation = discount;
    this.getPossibleActions = getPossibleActions;
  }

  public async train(player: ReinforcementPlayer<T>): Promise<number> {
    player.getModel().reset();
    let state = player.getModel().copy();
    while (UTILS.isFalsy(state.isGameOver())) {
      const action = this.getAction(state);
      const nextState = player.move(action);
      this.updateQValue(state, action, nextState.score, nextState);
      state = nextState.copy();
    }
    this.turnOfLearning();
    return Promise.resolve(state.score);
  }

  public test(player: ReinforcementPlayer<T>): void {
    player.getModel().reset();
    while (UTILS.isFalsy(player.getModel().isGameOver())) {
      player.move(this.getAction(player.getModel()));
    }
    console.info(`Finished with score: ${player.getModel().score}`);
  }

  private calculateQValue(state: ReinforcementModel, action: T, reward: number, nextState: ReinforcementModel): number {
    return (
      (1 - this.learningRate) * this.getQValue(state, action) + this.learningRate * (reward + this.adaptation * this.getMaxValue(nextState))
    );
  }

  private getAction(state: ReinforcementModel): T {
    const possibleActions = this.getPossibleActions();
    const bestAction = this.getBestAction(state);
    let chosenAction = bestAction;
    if (possibleActions.length > 1 && MATH_UTILS.generateRandomNumber(0, 1) < this.exploreChance) {
      ARRAY_UTILS.removePrimitiveValue(possibleActions, bestAction);
      chosenAction = ARRAY_UTILS.getRandomValue(possibleActions);
    }
    return chosenAction;
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

  /**
   * This method will return a value for specified state and action
   * I used eslint ignore here because it is performance critical place
   * If this method will return `undefined` it means that sth went wrong before this method call
   * @param state → state of q values table
   * @param action → action executed on given `state`
   * @private
   */
  private getQValue(state: ReinforcementModel, action: T): number {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.qValues.get(state.hash())!.get(action)!;
  }

  private setQValue(state: ReinforcementModel, action: T, value: number): void {
    this.qValues.set(
      state.hash(),
      new Map<T, number>([[action, value]])
    );
  }

  private turnOfLearning() {
    this.learningRate = 0;
    this.exploreChance = 0;
  }

  private updateQValue(state: ReinforcementModel, action: T, reward: number, nextState: ReinforcementModel): void {
    this.setQValue(state, action, this.calculateQValue(state, action, reward, nextState));
  }
}
