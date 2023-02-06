import { UTILS } from '../../common/Utils/UTILS';
import { CanvasService } from '../CanvasService/CanvasService';
import { CanvasContextType } from '../CanvasService/interfaces/CanvasContext';
import { IWebGLService } from './interfaces/IWebGLService';
import DefaultFragmentShaderSource from './Shaders/FragmentShaderSource.frag';
import DefaultVertexShaderSource from './Shaders/VertextShaderSource.vert';
import { TEXTURES } from './textures/textures';
import { TextureID } from './textures/textures.types';

export class WebGLService implements IWebGLService {
  private readonly gl: WebGL2RenderingContext;
  private readonly canvas: HTMLCanvasElement;
  private readonly vertexShader: WebGLShader;
  private readonly fragmentShader: WebGLShader;
  private readonly program: WebGLProgram;
  private readonly positionAttributeLocation: number;
  private readonly colorUniformLocation: WebGLUniformLocation;
  private readonly resolutionUniformLocation: WebGLUniformLocation;
  private readonly positionBuffer: WebGLBuffer;
  private readonly ebo: WebGLBuffer;
  private readonly vao: WebGLVertexArrayObject;

  constructor(
    canvas: HTMLCanvasElement,
    vertexShaderSource: string = DefaultVertexShaderSource,
    fragmentShaderSource: string = DefaultFragmentShaderSource
  ) {
    this.gl = new CanvasService({ canvas }).getContext(CanvasContextType.WEBGL2);
    this.gl.enable(this.gl.CULL_FACE);
    this.canvas = canvas;
    this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    this.fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
    this.program = this.createProgram(this.vertexShader, this.fragmentShader);
    this.positionAttributeLocation = this.gl.getAttribLocation(this.program, 'a_position');
    this.resolutionUniformLocation = <WebGLUniformLocation>this.gl.getUniformLocation(this.program, 'u_resolution');
    this.colorUniformLocation = <WebGLUniformLocation>this.gl.getUniformLocation(this.program, 'u_color');

    this.vao = <WebGLVertexArrayObject>this.gl.createVertexArray();
    this.ebo = <WebGLBuffer>this.gl.createBuffer();
    this.positionBuffer = <WebGLBuffer>this.gl.createBuffer();
    this.gl.bindVertexArray(this.vao);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.ebo);
    this.gl.enableVertexAttribArray(this.positionAttributeLocation);
    this.gl.vertexAttribPointer(this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0); // size → how many parameters of each set should take 2 (means x and y) 3 (x y and z)

    this.resizeCanvasToDisplaySize(canvas);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.useProgram(this.program);
    this.gl.uniform2f(this.resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);
    this.clearCanvas();

    const texture = TEXTURES.get(TextureID.SNAKE_SKIN);
    texture?.addEventListener('load', () => {
      document.body.append(texture);
    });
  }

  public clearCanvas(): void {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
  }

  public drawRectangle([x, y]: [number, number], width: number, height: number, [r, g, b, a]: [number, number, number, number]): void {
    this.gl.bindVertexArray(this.vao);
    const topLeft = [x, y];
    const topRight = [x + width, y];
    const bottomRight = [x + width, y + height];
    const bottomLeft = [x, y + height];
    const positions = new Float32Array([...topLeft, ...topRight, ...bottomRight, ...bottomLeft]);
    const vertexIndices = [3, 1, 0, 3, 2, 1];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
    this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(vertexIndices), this.gl.STATIC_DRAW);
    this.gl.uniform4f(this.colorUniformLocation, r, g, b, a);
    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_INT, 0); // count → rectangle points numbers 6 because of 2 triangles
    this.gl.bindVertexArray(null);
  }

  public drawTriangle(
    left: [x: number, y: number],
    right: [x: number, y: number],
    top: [x: number, y: number],
    [r, g, b, a]: [number, number, number, number]
  ): void {
    this.gl.bindVertexArray(this.vao);
    const positions = new Float32Array([...left, ...top, ...right]);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
    this.gl.uniform4f(this.colorUniformLocation, r, g, b, a);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
    this.gl.bindVertexArray(null);
  }

  public fullScreen(): void {
    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100vw';
    this.canvas.style.height = '100vh';
  }

  private createShader(type: GLenum, source: string): WebGLShader {
    const shader = <WebGLShader>this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    if (UTILS.isTruthy(this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS))) {
      return shader;
    } else {
      this.gl.deleteShader(shader);
      throw Error('An error occurred while creating shader');
    }
  }

  private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader): WebGLProgram {
    const program = <WebGLProgram>this.gl.createProgram();
    this.gl.attachShader(program, vertexShader);
    this.gl.attachShader(program, fragmentShader);
    this.gl.linkProgram(program);
    if (UTILS.isTruthy(this.gl.getProgramParameter(program, this.gl.LINK_STATUS))) {
      return program;
    } else {
      this.gl.deleteProgram(program);
      throw Error('An error occurred while creating shader program');
    }
  }

  private resizeCanvasToDisplaySize(canvas: HTMLCanvasElement, multiplier = 1): boolean {
    const width = (canvas.clientWidth * multiplier) | 0;
    const height = (canvas.clientHeight * multiplier) | 0;
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      return true;
    }
    return false;
  }
}
