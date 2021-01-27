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
    const colorAttributeLocation = this.gl.getAttribLocation(this.program, 'a_color');
    const resolutionUniformLocation = <WebGLUniformLocation>this.gl.getUniformLocation(this.program, 'u_resolution');
    const colorLocation = <WebGLUniformLocation>this.gl.getUniformLocation(this.program, 'u_color');

    this.vao = <WebGLVertexArrayObject>this.gl.createVertexArray();
    this.gl.bindVertexArray(this.vao);

    this.positionBuffer = <WebGLBuffer>this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionBuffer); // 0 → default no buffer / unbind
    const pointA = [10, 20];
    const pointB = [80, 20];
    const pointC = [10, 30];
    const pointD = [10, 30];
    const pointE = [80, 20];
    const pointF = [80, 30];
    const positions = [...pointA, ...pointB, ...pointC, ...pointD, ...pointE, ...pointF];
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(positions), this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(this.positionAttributeLocation);
    this.gl.enableVertexAttribArray(colorAttributeLocation);
    this.gl.vertexAttribPointer(this.positionAttributeLocation, 2, this.gl.FLOAT, false, 0, 0); // size → how many parameters of each set should take 2 (means x and y) 3 (x y and z)

    const colors = [1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 0, 0, 1];
    const colorBuffer = <WebGLBuffer>this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, colorBuffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(colors), this.gl.STATIC_DRAW);
    this.gl.enableVertexAttribArray(colorAttributeLocation);
    this.gl.vertexAttribPointer(colorAttributeLocation, 4, this.gl.FLOAT, false, 0, 0);

    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    this.gl.bindVertexArray(null);

    this.resizeCanvasToDisplaySize(canvas);
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.clearCanvas();
    this.gl.useProgram(this.program);
    this.gl.bindVertexArray(this.vao);
    this.gl.uniform2f(resolutionUniformLocation, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.uniform4f(colorLocation, 1, 0.5, 0.5, 1);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 6); // count → how many points should draw
  }

  private clearCanvas(): void {
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
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
