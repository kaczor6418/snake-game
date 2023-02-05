import * as tf from '@tensorflow/tfjs';
import { IReinforcementAgent } from './agents/interfaces/IReinforcementAgent';
import { ReinforcementPlayer } from './agents/interfaces/ReinforcementPlayer';
import { CONSTANTS } from './common/CONSTANTS';
import { KKWebComponent } from './components/KKWebComponent/KKWebComponent';
import { createGame } from './factories/GamesFactory/GamesFactory';
import { GameType } from './factories/GamesFactory/GameType';
import { createReinforcementAgent } from './factories/ReinforcementAgentsFactory/ReinforcementAgentsFactory';
import { ReinforcementAgentType } from './factories/ReinforcementAgentsFactory/ReinforcementAgentType';
import { MoveDirection } from './games/SnakeGame/Controller/interfaces/MoveDirection';
import { ISnakeGame } from './games/SnakeGame/interfaces/ISnakeGame';
import { SnakeGameModelProps } from './games/SnakeGame/Model/interfaces/SnakeGameModelProps';

const template = `
  <h1>Snake Game</h1>
  <canvas width="640" height="640"></canvas>
`;

export class App extends KKWebComponent {
  public static TAG = `${CONSTANTS.TAG_PREFIX}-app`;

  private game: ReinforcementPlayer;

  private readonly canvas: HTMLCanvasElement = <HTMLCanvasElement>this.shadowRoot.querySelector('canvas');

  constructor() {
    super(template);
    this.game = this.createEnvironment({ columnsCount: 6, rowsCount: 6, foodCount: 10 });
    void this.runSnakeGameWithQLearningAgent(10000, 0.0001);
  }

  createEnvironment(boardConfiguration: SnakeGameModelProps): ISnakeGame {
    return createGame(GameType.SNAKE, {
      boardConfiguration: boardConfiguration,
      canvas: this.canvas,
    });
  }

  private async runSnakeGameWithQLearningAgent(epochs: number, epsilonDecay: number): Promise<void> {
    const qAgent: IReinforcementAgent = createReinforcementAgent(ReinforcementAgentType.Q_LEARNING, {
      gamma: 0.5,
      initialEpsilon: 0.7,
      epsilonDecay: epsilonDecay,
      minEpsilon: 0.01,
      getPossibleActions: () => [MoveDirection.LEFT, MoveDirection.RIGHT, MoveDirection.STRAIGHT],
      player: this.game,
      learningRate: 0.1,
    });
    await qAgent.learn(epochs);
    this.game.model.reset();
    await this.game.runGameWithAgent(qAgent, 500);
    this.game.restart();
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private async runSnakeGameWithDDQLearningAgent(epochs: number, backend: string, epsilonDecay: number): Promise<void> {
    await tf.setBackend(backend);
    const ddqnAgent: IReinforcementAgent = createReinforcementAgent(ReinforcementAgentType.DOUBLE_DEEP_Q_LEARNING, {
      gamma: 0.99,
      initialEpsilon: 0.7,
      getPossibleActions: () => [MoveDirection.LEFT, MoveDirection.RIGHT, MoveDirection.STRAIGHT],
      learningRate: 0.001,
      player: this.game,
      batchSize: 300,
      epsilonDecay: epsilonDecay,
      replayUpdateIndicator: 25,
      replayMemorySize: 1000,
      minEpsilon: 0.01,
    });
    await ddqnAgent.learn(epochs);
    this.game.model.reset();
    await this.game.runGameWithAgent(ddqnAgent);
    this.game.restart();
  }
}

customElements.define(App.TAG, App);
