import { ARRAY_UTILS } from '../common/Utils/ARRAY_UTILS';
import { MATH_UTILS } from '../common/Utils/MATH_UTILS';
import { VariableDoesntExistsError } from '../errors/VariableDoesntExistsError';
import { IMovingAverage } from '../structures/MovingAverage/IMovingAverage';
import { MovingAverage } from '../structures/MovingAverage/MovingAverage';
import { IReinforcementAgent } from './interfaces/IReinforcementAgent';
import { ReinforcementPlayer } from './interfaces/ReinforcementPlayer';
import { UTILS } from '../common/Utils/UTILS';
import { ReinforcementModel } from './interfaces/ReinforcementModel';
import { BaseReinforcementAgentProps } from './interfaces/ReinforcementAgentProps';

export abstract class ReinforcementAgent implements IReinforcementAgent {
  protected learningRate: number;
  protected currentEpsilon: number;

  protected readonly initialEpsilon: number;
  private readonly minEpsilon: number;
  private readonly epsilonDecay: number;
  protected readonly gamma: number;
  protected readonly getPossibleActions: () => number[];
  protected readonly player: ReinforcementPlayer;
  protected readonly totalReward: IMovingAverage;

  private readonly cumulativeRewardThreshold: number | undefined;

  protected abstract runSingleEpoch(): Promise<void>;
  protected abstract getBestAction(state: ReinforcementModel): Promise<number>;

  protected constructor({
    learningRate,
    initialEpsilon,
    gamma,
    getPossibleActions,
    player,
    minEpsilon,
    epsilonDecay,
    cumulativeRewardThreshold,
  }: BaseReinforcementAgentProps) {
    this.learningRate = learningRate;
    this.initialEpsilon = initialEpsilon;
    this.currentEpsilon = this.initialEpsilon;
    this.minEpsilon = minEpsilon ?? this.initialEpsilon;
    this.epsilonDecay = epsilonDecay ?? 0;
    this.gamma = gamma;
    this.getPossibleActions = getPossibleActions;
    this.player = player;
    this.totalReward = new MovingAverage(100);
    this.cumulativeRewardThreshold = cumulativeRewardThreshold;
  }

  public async fit(callback?: (action: number) => void, callbackDellyInMs = 500): Promise<void> {
    while (UTILS.isFalsy(this.player.model.isGameOver())) {
      const action = await this.getAction(this.player.model);
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
    if (this.cumulativeRewardThreshold) {
      await this.learnUntilReachStopCondition(epochs);
    } else {
      await this.learnUntilFinishAllEpochs(epochs);
    }
    this.turnOfLearning();
  }

  protected async getAction(state: ReinforcementModel): Promise<number> {
    const possibleActions = this.getPossibleActions();
    const bestAction = await this.getBestAction(state);
    let chosenAction = bestAction;
    if (possibleActions.length > 1 && MATH_UTILS.generateRandomNumber(0, 1) < this.currentEpsilon) {
      ARRAY_UTILS.removePrimitiveValue(possibleActions, bestAction);
      chosenAction = ARRAY_UTILS.getRandomValue(possibleActions);
    }
    return chosenAction;
  }

  protected decreaseExplorationChance(): void {
    const decreaseEpsilonBy = this.currentEpsilon * this.epsilonDecay;
    const newEpsilon = this.currentEpsilon - decreaseEpsilonBy;
    if (newEpsilon >= this.minEpsilon) {
      this.currentEpsilon = newEpsilon;
    }
  }

  private async learnUntilReachStopCondition(epochs: number): Promise<void> {
    if (UTILS.isNullOrUndefined(this.cumulativeRewardThreshold)) {
      throw new VariableDoesntExistsError('cumulativeRewardThreshold');
    }
    let epoch = 0;
    while (this.totalReward.average() < this.cumulativeRewardThreshold && epoch !== epochs) {
      await this.runSingleEpoch();
      this.decreaseExplorationChance();
      epoch++;
    }
  }

  private async learnUntilFinishAllEpochs(epochs: number): Promise<void> {
    for (let i = 0; i < epochs; i++) {
      await this.runSingleEpoch();
      this.decreaseExplorationChance();
    }
  }

  private turnOfLearning() {
    this.learningRate = 0;
    this.currentEpsilon = 0;
    this.totalReward.reset();
  }
}
