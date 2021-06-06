import { CanvasServiceContext, ICanvasService } from './interfaces/ICanvasService';
import { CanvasServiceProps } from './interfaces/CanvasServiceProps';
import { UTILS } from '../../common/Utils/UTILS';
import { CanvasContextType } from './interfaces/CanvasContext';
import { CanvasContextError } from '../../errors/CanvasContextError';

export class CanvasService implements ICanvasService {
  private readonly _canvas: HTMLCanvasElement;

  constructor({ canvas }: CanvasServiceProps) {
    this._canvas = canvas;
  }

  get canvas() {
    return this._canvas;
  }

  public getContext(contextType: CanvasContextType.TWO_D): CanvasRenderingContext2D;
  public getContext(contextType: CanvasContextType.BITMAPRENDERER): ImageBitmapRenderingContext;
  public getContext(contextType: CanvasContextType.WEBGL): WebGLRenderingContext;
  public getContext(contextType: CanvasContextType.WEBGL2): WebGL2RenderingContext;
  public getContext(contextType: CanvasContextType): CanvasServiceContext {
    const context = this._canvas.getContext(contextType);
    if (UTILS.isNullOrUndefined(context)) {
      throw new CanvasContextError(
        `Unable to initialize ${contextType} context. Your browser or machine may not support it.`
      );
    }
    return context;
  }
}
