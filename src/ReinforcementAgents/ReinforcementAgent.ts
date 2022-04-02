import { ARRAY_UTILS } from '../common/Utils/ARRAY_UTILS';
import { MATH_UTILS } from '../common/Utils/MATH_UTILS';
import { IReinforcementAgent } from './interfaces/IReinforcementAgent';
import { ReinforcementPlayer } from './interfaces/ReinforcementPlayer';
import { UTILS } from '../common/Utils/UTILS';
import { ReinforcementModel } from './interfaces/ReinforcementModel';
import { BaseReinforcementAgentProps } from './interfaces/ReinforcementAgentProps';

export abstract class ReinforcementAgent implements IReinforcementAgent {
  protected learningRate: number;
  protected currentEpsilon: number;

  protected readonly initialEpsilon: number;
  protected readonly adaptation: number;
  protected readonly getPossibleActions: () => number[];
  protected readonly player: ReinforcementPlayer;

  protected abstract runSingleEpoch(): Promise<void>;
  protected abstract getBestAction(state: ReinforcementModel): number;

  protected constructor({
    learningRate,
    initialEpsilon,
    adaptation,
    getPossibleActions,
    player
  }: BaseReinforcementAgentProps) {
    this.learningRate = learningRate;
    this.initialEpsilon = initialEpsilon;
    this.currentEpsilon = this.initialEpsilon;
    this.adaptation = adaptation;
    this.getPossibleActions = getPossibleActions;
    this.player = player;
  }

  public async fit(callback?: (action: number) => void, callbackDellyInMs = 500): Promise<void> {
    while (UTILS.isFalsy(this.player.model.isGameOver())) {
      const action = this.getAction(this.player.model);
      if (UTILS.isDefined(callback)) {
        callback(action);
        await UTILS.wait(callbackDellyInMs);
      } else {
        this.player.controller.move(action);
      }
    }
    if (UTILS.isNullOrUndefined(callback)) {
      console.info(`YOU FINISHED GAME WITH SCORE:${this.player.model.score}`);
    }
  }

  public async learn(epochs: number): Promise<void> {
    for (let i = 0; i < epochs; i++) {
      await this.runSingleEpoch();
    }
    this.turnOfLearning();
  }

  protected getAction(state: ReinforcementModel): number {
    const possibleActions = this.getPossibleActions();
    const bestAction = this.getBestAction(state);
    let chosenAction = bestAction;
    if (possibleActions.length > 1 && MATH_UTILS.generateRandomNumber(0, 1) < this.currentEpsilon) {
      ARRAY_UTILS.removePrimitiveValue(possibleActions, bestAction);
      chosenAction = ARRAY_UTILS.getRandomValue(possibleActions);
    }
    return chosenAction;
  }

  private turnOfLearning() {
    this.learningRate = 0;
    this.currentEpsilon = 0;
  }
}
