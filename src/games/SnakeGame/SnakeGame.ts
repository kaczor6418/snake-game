import { SnakeGameProps } from './interfaces/SnakeGameProps';
import { ISnakeGame } from './interfaces/ISnakeGame';
import { ISnakeGameController } from './Controller/interfaces/ISnakeGameController';
import { ISnakeGameView } from './View/interfaces/ISnakeGameView';
import { SnakeGameController } from './Controller/SnakeGameController';
import { SnakeGameModel } from './Model/SnakeGameModel';
import { ISnakeGameModel } from './Model/interfaces/ISnakeGameModel';
import { IWebGLService } from '../../services/WebGLService/interfaces/IWebGLService';
import { WebGLService } from '../../services/WebGLService/WebGLService';
import { SnakeGameView } from './View/SnakeGameView';
import { KeyName } from '../../common/Enums/KeyName';
import { MoveDirection } from './Controller/interfaces/MoveDirection';
import { UTILS } from '../../common/Utils/UTILS';
import { ReinforcementPlayer } from '../../agents/interfaces/ReinforcementPlayer';
import { IReinforcementAgent } from '../../agents/interfaces/IReinforcementAgent';

export class SnakeGame implements ISnakeGame, ReinforcementPlayer {
  public readonly model: ISnakeGameModel;
  public readonly controller: ISnakeGameController;

  private readonly webGLService: IWebGLService;
  private readonly gameView: ISnakeGameView;

  private pause: boolean;
  private chosenMove: MoveDirection;

  constructor({ boardConfiguration, canvas }: SnakeGameProps) {
    this.pause = false;
    this.chosenMove = MoveDirection.STRAIGHT;
    this.webGLService = new WebGLService(canvas);
    this.model = new SnakeGameModel(boardConfiguration);
    this.controller = new SnakeGameController(this.model);
    this.gameView = new SnakeGameView({
      fieldSize: {
        width: canvas.width / boardConfiguration.columnsCount,
        height: canvas.height / boardConfiguration.rowsCount,
      },
      webGLService: this.webGLService,
      gameModel: this.model,
    });
    this.gameView.render();
  }

  public fullScreen(): void {
    this.webGLService.fullScreen();
  }

  public async runSnakeWithAgent(agent: IReinforcementAgent): Promise<void> {
    if (this.model.isGameOver()) {
      this.restart();
      return void 0;
    }
    await agent.fit((action) => {
      this.controller.move(action);
      this.gameView.render();
    }, 1000);
    await this.runSnakeWithAgent(agent);
  }

  public restart(): void {
    this.model.reset();
  }

  public start(): void {
    document.addEventListener('keydown', this.userInputHandler);
    this.runSnake();
  }

  public stop(): void {
    document.removeEventListener('keydown', this.userInputHandler);
    this.pause = true;
  }

  private runSnake: () => void = (): void => {
    if (this.model.isGameOver()) {
      console.log(`GAME OVER! YOUR SCORE: ${this.model.score}`);
      return void 0;
    } else if (UTILS.isTruthy(this.pause)) {
      console.log('PAUSE');
      return void 0;
    }
    this.controller.move(this.chosenMove);
    this.gameView.render();
    this.chosenMove = MoveDirection.STRAIGHT;
    window.setTimeout(() => window.requestAnimationFrame(this.runSnake), 500);
  };

  private userInputHandler: (e: KeyboardEvent) => void = ({ key }: KeyboardEvent): void => {
    if (key === KeyName.SPACE || key === KeyName.ESCAPE) {
      this.pause = !this.pause;
      if (UTILS.isFalsy(this.pause)) {
        this.runSnake();
      }
      return void 0;
    }
    if (this.chosenMove !== MoveDirection.STRAIGHT) {
      return void 0;
    } else if (key === KeyName.ARROW_LEFT) {
      this.chosenMove = MoveDirection.LEFT;
    } else if (key === KeyName.ARROW_RIGHT) {
      this.chosenMove = MoveDirection.RIGHT;
    }
  };
}
