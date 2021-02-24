import { CanvasServiceContext, ICanvasService } from './interfaces/ICanvasService';
import { CanvasServiceProps } from './interfaces/CanvasServiceProps';
import { UTILS } from '../../common/Utils/UTILS';
import { CanvasContextType } from './interfaces/CanvasContext';
import { CanvasContextError } from '../../errors/CanvasContextError';

export class CanvasService implements ICanvasService {
  private readonly canvas: HTMLCanvasElement;

  constructor({ canvas }: CanvasServiceProps) {
    this.canvas = canvas;
  }

  public getContext(contextType: CanvasContextType.TWO_D): CanvasRenderingContext2D;
  public getContext(contextType: CanvasContextType.BITMAPRENDERER): ImageBitmapRenderingContext;
  public getContext(contextType: CanvasContextType.WEBGL): WebGLRenderingContext;
  public getContext(contextType: CanvasContextType.WEBGL2): WebGL2RenderingContext;
  public getContext(contextType: CanvasContextType): CanvasServiceContext {
    const context = this.canvas.getContext(contextType);
    if (UTILS.isNullOrUndefined(context)) {
      throw new CanvasContextError(`Unable to initialize ${contextType} context. Your browser or machine may not support it.`);
    }
    return context;
  }
}
