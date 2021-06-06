import { IWebGLService } from '../interfaces/IWebGLService';

export const webGLServiceMock: IWebGLService = {
  drawTriangle(
    _left: [x: number, y: number],
    _right: [x: number, y: number],
    _top: [x: number, y: number],
    [_r, _g, _b, _a]: [number, number, number, number]
  ): void {
    return void 0;
  },
  drawRectangle(
    [_x, _y]: [number, number],
    _width: number,
    _height: number,
    [_r, _g, _b, _a]: [number, number, number, number]
  ): void {
    return void 0;
  },
  clearCanvas(): void {
    return void 0;
  },
  fullScreen() {
    return void 0;
  }
};
