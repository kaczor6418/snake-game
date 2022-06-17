export interface IWebGLService {
  clearCanvas(): void;
  drawRectangle([x, y]: [number, number], width: number, height: number, [r, g, b, a]: [number, number, number, number]): void;
  drawTriangle(
    left: [x: number, y: number],
    right: [x: number, y: number],
    top: [x: number, y: number],
    [r, g, b, a]: [number, number, number, number]
  ): void;
  fullScreen(): void;
}
