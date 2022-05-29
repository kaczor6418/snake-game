import { GameView } from './GameView';
import { webGLServiceMock } from '../../services/WebGLService/__mocks__/web-gl-service';
import { createGameModelMock } from '../../../test/src/core/SnakeGame/SnakeGameModel.spec';

describe(GameView.name, () => {
  let gameView: GameView;
  const fieldWidth = 10;
  const fieldHeight = 10;
  beforeEach(() => {
    gameView = new GameView({
      gameModel: createGameModelMock(),
      webGLService: webGLServiceMock,
      fieldSize: { width: fieldWidth, height: fieldHeight }
    });
  });
  describe(GameView.prototype['convertToPositionOnCanvas'].name, () => {
    test('should convert row and column index to canvas position', () => {
      const x = 2;
      const y = 3;
      const [xPosition, yPosition] = gameView['convertToPositionOnCanvas']({ x, y });
      expect(xPosition).toBe(x * fieldWidth);
      expect(yPosition).toBe(y * fieldHeight);
    });
    test('should return same position for row and column index 0', () => {
      const x = 0;
      const y = 0;
      const [xPosition, yPosition] = gameView['convertToPositionOnCanvas']({ x, y });
      expect(xPosition).toBe(x);
      expect(yPosition).toBe(y);
    });
  });
});
