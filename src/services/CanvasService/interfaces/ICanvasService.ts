import { CanvasContextType } from './CanvasContext';

export interface ICanvasService {
  getContext(contextType: CanvasContextType): CanvasServiceContext;
}

export type CanvasServiceContext = CanvasRenderingContext2D | ImageBitmapRenderingContext | WebGLRenderingContext | WebGL2RenderingContext;
