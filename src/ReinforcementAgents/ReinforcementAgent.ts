import { IReinforcementAgent } from './interfaces/IReinforcementAgent';
import { ReinforcementPlayer } from './interfaces/ReinforcementPlayer';
import { UTILS } from '../common/Utils/UTILS';
import { ReinforcementModel } from './interfaces/ReinforcementModel';
import { ReinforcementAgentProps } from './interfaces/ReinforcementAgentProps';

export abstract class ReinforcementAgent<T> implements IReinforcementAgent<T> {
  protected learningRate: number;
  protected minEpsilon: number;

  protected readonly adaptation: number;
  protected readonly getPossibleActions: () => T[];
  protected readonly player: ReinforcementPlayer<T>;

  protected abstract runSingleEpoch(): void;
  protected abstract getAction(state: ReinforcementModel<T>): T;

  protected constructor({
    learningRate,
    minEpsilon,
    adaptation,
    getPossibleActions,
    player
  }: ReinforcementAgentProps<T>) {
    this.learningRate = learningRate;
    this.minEpsilon = minEpsilon;
    this.adaptation = adaptation;
    this.getPossibleActions = getPossibleActions;
    this.player = player;
  }

  public async fit(callback?: (action: T) => void, callbackDellyInMs = 500): Promise<void> {
    this.player.model.reset();
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

  public learn(epochs: number): void {
    this.player.model.reset();
    for (let i = 0; i < epochs; i++) {
      this.runSingleEpoch();
    }
    this.turnOfLearning();
  }

  private turnOfLearning() {
    this.learningRate = 0;
    this.minEpsilon = 0;
  }
}
