import { ThisSituationShouldNeverHappenError } from '../../errors/ThisSituationShouldNeverHappenError';
import { ISnakeGame } from '../../games/SnakeGame/interfaces/ISnakeGame';
import { SnakeGameProps } from '../../games/SnakeGame/interfaces/SnakeGameProps';
import { SnakeGame } from '../../games/SnakeGame/SnakeGame';
import { GameType } from './GameType';

export function createGame(gameType: GameType, props: SnakeGameProps): ISnakeGame {
  let game: ISnakeGame;
  switch (gameType) {
    case GameType.SNAKE:
      game = new SnakeGame(props);
      break;
    default:
      throw new ThisSituationShouldNeverHappenError('gameType');
  }
  return game;
}
