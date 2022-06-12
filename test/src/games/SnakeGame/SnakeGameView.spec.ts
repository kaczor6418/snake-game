import { ISnakeGameModel } from '../../../../src/games/SnakeGame/Model/interfaces/ISnakeGameModel';
import { ISnakeGameView } from '../../../../src/games/SnakeGame/View/interfaces/ISnakeGameView';
import { SnakeGameView } from '../../../../src/games/SnakeGame/View/SnakeGameView';
import { IWebGLService } from '../../../../src/services/WebGLService/interfaces/IWebGLService';
import { createManualMock } from '../../../createManualMock';

describe(SnakeGameView.name, () => {
  const fieldWidth = 10;
  const fieldHeight = 10;
  const webGLServiceMock = createManualMock<IWebGLService>({
    clearCanvas: jest.fn(),
    drawRectangle: jest.fn(),
    drawTriangle: jest.fn()
  });
  const gameModelMock = createManualMock<ISnakeGameModel>({
    allFoods: [],
    allSnakeBodyParts: []
  });
  const gameView: ISnakeGameView = new SnakeGameView({
    gameModel: gameModelMock,
    webGLService: webGLServiceMock,
    fieldSize: { width: fieldWidth, height: fieldHeight }
  });
  describe(SnakeGameView.prototype.render.name, () => {
    it('should clear canvas before render', () => {
      const clearCanvasSpy = jest.spyOn(webGLServiceMock, 'clearCanvas');
      gameView.render();
      expect(clearCanvasSpy).toBeCalledTimes(1);
      clearCanvasSpy.mockClear();
    });
    describe('Draw snake body parts', () => {
      let drawRectangleSpy: jest.SpyInstance;
      beforeEach(() => {
        drawRectangleSpy = jest.spyOn(webGLServiceMock, 'drawRectangle');
      });
      it('should NOT draw any rectangle, if there is no snake body parts', () => {
        gameModelMock.allSnakeBodyParts = [];
        gameView.render();
        expect(drawRectangleSpy).not.toHaveBeenCalled();
      });
      it('should draw one rectangle for each snake body part', () => {
        gameModelMock.allSnakeBodyParts = [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          { x: 2, y: 2 }
        ];
        gameView.render();
        expect(drawRectangleSpy).toBeCalledTimes(gameModelMock.allSnakeBodyParts.length);
      });
      afterEach(() => {
        drawRectangleSpy.mockClear();
      });
    });
  });
  describe(SnakeGameView.prototype.render.name, () => {
    describe('Draw food', () => {
      let drawTriangleSpy: jest.SpyInstance;
      beforeEach(() => {
        drawTriangleSpy = jest.spyOn(webGLServiceMock, 'drawTriangle');
      });
      it('should NOT draw any triangle, if there is no food', () => {
        gameModelMock.allFoods = [];
        gameView.render();
        expect(drawTriangleSpy).not.toHaveBeenCalled();
      });
      it('should draw one triangle for each food', () => {
        gameModelMock.allFoods = [
          { x: 0, y: 0 },
          { x: 1, y: 1 },
          { x: 2, y: 2 }
        ];
        gameView.render();
        expect(drawTriangleSpy).toBeCalledTimes(gameModelMock.allSnakeBodyParts.length);
      });
      afterEach(() => {
        drawTriangleSpy.mockClear();
      });
    });
  });
});
