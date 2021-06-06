import { KKWebComponent } from './components/KKWebComponent/KKWebComponent';
import { CONSTANTS } from './common/CONSTANTS';
import { SnakeGame } from './core/SnakeGame/SnakeGame';
import { MoveDirection } from './core/GameController/interfaces/MoveDirection';
import { ISnakeGame } from './core/SnakeGame/interfaces/ISnakeGame';
import { IReinforcementAgent } from './services/ReinforcementAgents/interfaces/IReinforcementAgent';
import { createReinforcementAgent } from './factories/ReinforcementAgentsFactory';
import { ReinforcementAgentsNames } from './factories/ReinforcementAgentsNames';

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
      boardConfiguration: { columnsCount: 5, foodCount: 7, rowsCount: 5 },
      canvas: this.canvas
    });
    const agent: IReinforcementAgent<MoveDirection> = createReinforcementAgent(ReinforcementAgentsNames.Q_LEARNING, {
      adaptation: 0.5,
      exploreChance: 0.1,
      getPossibleActions: () => Object.values(MoveDirection),
      learningRate: 0.1
    });
    agent.learn(snakeGame, 10000);
    for (let i = 0; i < 5; i++) {
      await snakeGame.runSnakeWithAgent(agent);
    }
  }
}

customElements.define(App.TAG, App);
