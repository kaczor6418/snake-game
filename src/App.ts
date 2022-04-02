import { CONSTANTS } from './common/CONSTANTS';
import { KKWebComponent } from './components/KKWebComponent/KKWebComponent';
import { MoveDirection } from './core/GameController/interfaces/MoveDirection';
import { ISnakeGame } from './core/SnakeGame/interfaces/ISnakeGame';
import { SnakeGame } from './core/SnakeGame/SnakeGame';
import { createReinforcementAgent } from './factories/ReinforcementAgentsFactory';
import { ReinforcementAgentsNames } from './factories/ReinforcementAgentsNames';
import { IReinforcementAgent } from './ReinforcementAgents/interfaces/IReinforcementAgent';

const template = `
  <h1>Snake Game</h1>
  <canvas width="640" height="640"></canvas>
`;

export class App extends KKWebComponent {
  public static TAG = `${CONSTANTS.TAG_PREFIX}-app`;

  private readonly canvas: HTMLCanvasElement = <HTMLCanvasElement>this.shadowRoot.querySelector('canvas');

  constructor() {
    super(template);
    void this.runSnakeGameWithQLearningAgent();
  }

  public async runSnakeGameWithQLearningAgent(): Promise<void> {
    const snakeGame: ISnakeGame = new SnakeGame({
      boardConfiguration: { columnsCount: 2, foodCount: 3, rowsCount: 2 },
      canvas: this.canvas
    });
    const qAgent: IReinforcementAgent = createReinforcementAgent(ReinforcementAgentsNames.Q_LEARNING, {
      adaptation: 0.5,
      initialEpsilon: 0.1,
      getPossibleActions: () => [MoveDirection.LEFT, MoveDirection.RIGHT, MoveDirection.STRAIGHT],
      player: snakeGame,
      learningRate: 0.1
    });
    const ddqnAgent: IReinforcementAgent = createReinforcementAgent(ReinforcementAgentsNames.DOUBLE_DEEP_Q_LEARNING, {
      adaptation: 0.5,
      initialEpsilon: 0.1,
      getPossibleActions: () => [MoveDirection.LEFT, MoveDirection.STRAIGHT, MoveDirection.RIGHT],
      learningRate: 0.1,
      player: snakeGame,
      batchSize: 64,
      epsilonDecay: 0.95,
      replayUpdateIndicator: 10,
      minEpsilon: 0.01,
      minScore: 100
    });
    console.log(qAgent);
    qAgent.learn(10000);
    for (let i = 0; i < 5; i++) {
      snakeGame.model.reset();
      await snakeGame.runSnakeWithAgent(ddqnAgent);
    }
  }
}

customElements.define(App.TAG, App);
