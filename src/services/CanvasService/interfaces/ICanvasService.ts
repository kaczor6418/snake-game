import { CanvasContextType } from './CanvasContext';

export interface ICanvasService {
  readonly canvas: HTMLCanvasElement;

  getContext(contextType: CanvasContextType.TWO_D): CanvasRenderingContext2D;
  getContext(contextType: CanvasContextType.BITMAPRENDERER): ImageBitmapRenderingContext;
  getContext(contextType: CanvasContextType.WEBGL): WebGLRenderingContext;
  getContext(contextType: CanvasContextType.WEBGL2): WebGL2RenderingContext;
}

export type CanvasServiceContext = CanvasRenderingContext2D | ImageBitmapRenderingContext | WebGLRenderingContext | WebGL2RenderingContext;
