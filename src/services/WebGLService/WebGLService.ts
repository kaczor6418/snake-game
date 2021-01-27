import { UTILS } from '../../common/Utils/UTILS';

export class WebGLService {
  private readonly gl: WebGL2RenderingContext;

  private vertexShader: WebGLShader;
  private fragmentShader: WebGLShader;
  private program: WebGLProgram;
  private positionAttributeLocation: number;
  private positionBuffer: WebGLBuffer;
  private vao: WebGLVertexArrayObject;

  constructor(canvas: HTMLCanvasElement, vertexShaderSource: string, fragmentShaderSource: string) {
    this.gl = this.getWebGLContext(canvas);
    this.vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexShaderSource);
    this.fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentShaderSource);
    this.program = this.createProgram(this.vertexShader, this.fragmentShader);
    this.positionAttributeLocation = this.gl.getAttribLocation(this.program, 'a_position');
    this.positionBuffer = <WebGLBuffer>this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer);
    const pointA = [0, 0];
    const pointB = [0, 0.5];
    const pointC = [0.7, 0];
    const positions = [...pointA, ...pointB, ...pointC];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
    this.vao = <WebGLVertexArrayObject>this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vao);
    this.gl.enableVertexAttribArray(this.positionAttributeLocation);
    this.gl.vertexAttribPointer(this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.clearCanvas();
    this.gl.useProgram(this.program);
    this.gl.bindVertexArray(this.vao);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }

  private clearCanvas(): void {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
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

  private getWebGLContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
    const context = canvas.getContext('webgl2');
    if (UTILS.isNullOrUndefined(context)) {
      throw new Error('Unable to initialize WebGL. Your browser or machine may not support it.');
    }
    return context;
  }
}
