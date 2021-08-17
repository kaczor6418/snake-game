import { IReinforcementAgent } from './interfaces/IReinforcementAgent';
import { ReinforcementPlayer } from './interfaces/ReinforcementPlayer';
import { UTILS } from '../common/Utils/UTILS';
import { ReinforcementModel } from './interfaces/ReinforcementModel';
import { ReinforcementAgentProps } from './interfaces/ReinforcementAgentProps';

export abstract class ReinforcementAgent<T> implements IReinforcementAgent<T> {
  protected learningRate: number;
  protected initialEpsilon: number;

  protected readonly adaptation: number;
  protected readonly getPossibleActions: () => T[];

  protected abstract runSingleEpoch(player: ReinforcementPlayer<T>): void;
  protected abstract getAction(state: ReinforcementModel): T;

  protected constructor({ learningRate, initialEpsilon, adaptation, getPossibleActions }: ReinforcementAgentProps<T>) {
    this.learningRate = learningRate;
    this.initialEpsilon = initialEpsilon;
    this.adaptation = adaptation;
    this.getPossibleActions = getPossibleActions;
  }

  public async fit(
    player: ReinforcementPlayer<T>,
    callback?: (action: T) => void,
    callbackDellyInMs = 500
  ): Promise<void> {
    player.model.reset();
    while (UTILS.isFalsy(player.model.isGameOver())) {
      const action = this.getAction(player.model);
      if (UTILS.isDefined(callback)) {
        callback(action);
        await UTILS.wait(callbackDellyInMs);
      } else {
        player.controller.move(action);
      }
    }
    if (UTILS.isNullOrUndefined(callback)) {
      console.info(`YOU FINISHED GAME WITH SCORE:${player.model.score}`);
    }
  }

  public learn(player: ReinforcementPlayer<T>, epochs: number): void {
    player.model.reset();
    for (let i = 0; i < epochs; i++) {
      this.runSingleEpoch(player);
    }
    this.turnOfLearning();
  }

  private turnOfLearning() {
    this.learningRate = 0;
    this.initialEpsilon = 0;
  }
}
