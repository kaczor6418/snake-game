import { SnakeGameProps } from './interfaces/SnakeGameProps';
import { ISnakeGame } from './interfaces/ISnakeGame';
import { IGameController } from '../GameController/interfaces/IGameController';
import { IGameView } from '../GameView/interfaces/IGameView';
import { GameController } from '../GameController/GameController';
import { GameModel } from '../GameModel/GameModel';
import { IGameModel } from '../GameModel/interfaces/IGameModel';
import { IWebGLService } from '../../services/WebGLService/interfaces/IWebGLService';
import { WebGLService } from '../../services/WebGLService/WebGLService';
import { GameView } from '../GameView/GameView';
import { KeyName } from '../../common/Enums/KeyName';
import { MoveDirection } from '../GameController/interfaces/MoveDirection';
import { UTILS } from '../../common/Utils/UTILS';
import { ReinforcementPlayer } from '../../services/ReinforcementAgents/interfaces/ReinforcementPlayer';
import { IReinforcementAgent } from '../../services/ReinforcementAgents/interfaces/IReinforcementAgent';

export class SnakeGame implements ISnakeGame, ReinforcementPlayer<MoveDirection> {
  public readonly model: IGameModel;
  public readonly controller: IGameController;

  private readonly webGLService: IWebGLService;
  private readonly gameView: IGameView;

  private pause: boolean;
  private chosenMove: MoveDirection;

  constructor({ boardConfiguration, canvas }: SnakeGameProps) {
    this.pause = false;
    this.chosenMove = MoveDirection.STRAIGHT;
    this.webGLService = new WebGLService(canvas);
    this.model = new GameModel(boardConfiguration);
    this.controller = new GameController(this.model);
    this.gameView = new GameView({
      fieldSize: { width: canvas.width / boardConfiguration.columnsCount, height: canvas.height / boardConfiguration.rowsCount },
      webGLService: this.webGLService,
      gameModel: this.model
    });
  }

  public fullScreen(): void {
    this.webGLService.fullScreen();
  }

  public runSnakeWithAgent(agent: IReinforcementAgent<MoveDirection>): void {
    void agent.fit(
      this,
      (action) => {
        this.controller.move(action);
        this.gameView.render();
      },
      1000
    );
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
