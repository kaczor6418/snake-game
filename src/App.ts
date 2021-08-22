import { CONSTANTS } from './common/CONSTANTS';
import { KKWebComponent } from './components/KKWebComponent/KKWebComponent';
import { MoveDirection } from './core/GameController/interfaces/MoveDirection';
import { ISnakeGame } from './core/SnakeGame/interfaces/ISnakeGame';
import { SnakeGame } from './core/SnakeGame/SnakeGame';
import { createReinforcementAgent } from './factories/ReinforcementAgentsFactory';
import { ReinforcementAgentsNames } from './factories/ReinforcementAgentsNames';
import { DeepQNetwork } from './ReinforcementAgents/DeepQLearningAgent/DeepQNetwork';
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
    const x = new DeepQNetwork(6, 6);
    console.dir(x);
    void this.runSnakeGameWithQLearningAgent();
  }

  public async runSnakeGameWithQLearningAgent(): Promise<void> {
    const snakeGame: ISnakeGame = new SnakeGame({
      boardConfiguration: { columnsCount: 6, foodCount: 11, rowsCount: 6 },
      canvas: this.canvas
    });
    const agent: IReinforcementAgent = createReinforcementAgent(ReinforcementAgentsNames.Q_LEARNING, {
      adaptation: 0.5,
      minEpsilon: 0.1,
      getPossibleActions: () => [MoveDirection.LEFT, MoveDirection.STRAIGHT, MoveDirection.RIGHT],
      learningRate: 0.1,
      player: snakeGame
    });
    agent.learn(10000);
    for (let i = 0; i < 5; i++) {
      await snakeGame.runSnakeWithAgent(agent);
    }
  }
}

customElements.define(App.TAG, App);
