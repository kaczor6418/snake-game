import { CONSTANTS } from './common/CONSTANTS';
import { KKWebComponent } from './components/KKWebComponent/KKWebComponent';
import { MoveDirection } from './games/SnakeGame/Controller/interfaces/MoveDirection';
import { ISnakeGame } from './games/SnakeGame/interfaces/ISnakeGame';
import { SnakeGame } from './games/SnakeGame/SnakeGame';
import { createReinforcementAgent } from './factories/ReinforcementAgentsFactory';
import { ReinforcementAgentsNames } from './factories/ReinforcementAgentsNames';
import { IReinforcementAgent } from './agents/interfaces/IReinforcementAgent';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgpu';

const template = `
  <h1>Snake Game</h1>
  <canvas width="640" height="640"></canvas>
`;

export class App extends KKWebComponent {
  public static TAG = `${CONSTANTS.TAG_PREFIX}-app`;

  private readonly canvas: HTMLCanvasElement = <HTMLCanvasElement>this.shadowRoot.querySelector('canvas');

  constructor() {
    super(template);
    // const snakeGame: ISnakeGame = new SnakeGame({
    //   boardConfiguration: { columnsCount: 6, rowsCount: 6, foodCount: 10 },
    //   canvas: this.canvas
    // });
    // snakeGame.start();
    // void this.runSnakeGameWithQLearningAgent();
    void this.runSnakeGameWithDDQLearningAgent();
  }

  public async runSnakeGameWithQLearningAgent(): Promise<void> {
    const snakeGame: ISnakeGame = new SnakeGame({
      boardConfiguration: { columnsCount: 6, rowsCount: 6, foodCount: 10 },
      canvas: this.canvas
    });
    const qAgent: IReinforcementAgent = createReinforcementAgent(ReinforcementAgentsNames.Q_LEARNING, {
      gamma: 0.5,
      initialEpsilon: 0.1,
      getPossibleActions: () => [MoveDirection.LEFT, MoveDirection.RIGHT, MoveDirection.STRAIGHT],
      player: snakeGame,
      learningRate: 0.1
    });
    await qAgent.learn(10000);
    for (let i = 0; i < 5; i++) {
      snakeGame.model.reset();
      await snakeGame.runSnakeWithAgent(qAgent);
    }
  }

  public async runSnakeGameWithDDQLearningAgent(): Promise<void> {
    await tf.setBackend('webgpu');
    const snakeGame: ISnakeGame = new SnakeGame({
      boardConfiguration: { columnsCount: 3, rowsCount: 3, foodCount: 3 },
      canvas: this.canvas
    });
    const ddqnAgent: IReinforcementAgent = createReinforcementAgent(ReinforcementAgentsNames.DOUBLE_DEEP_Q_LEARNING, {
      gamma: 0.99,
      initialEpsilon: 0.7,
      getPossibleActions: () => [MoveDirection.LEFT, MoveDirection.RIGHT, MoveDirection.STRAIGHT],
      learningRate: 0.001,
      player: snakeGame,
      batchSize: 200,
      epsilonDecay: 0.0001,
      replayUpdateIndicator: 25,
      replayMemorySize: 1000,
      minEpsilon: 0.01,
      cumulativeRewardThreshold: 150
    });
    await ddqnAgent.learn(10000);
    for (let i = 0; i < 5; i++) {
      snakeGame.model.reset();
      await snakeGame.runSnakeWithAgent(ddqnAgent);
    }
  }
}

customElements.define(App.TAG, App);
