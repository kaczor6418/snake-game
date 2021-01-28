import { KKWebComponent } from './components/KKWebComponent/KKWebComponent';
import { CONSTANTS } from './common/CONSTANTS';
import VertexShaderSource from './services/WebGLService/Shaders/VertextShaderSource.vert';
import FragmentShaderSource from './services/WebGLService/Shaders/FragmentShaderSource.frag';
import { WebGLService } from './services/WebGLService/WebGLService';

const template = `
  <h1>Snake Game</h1>
  <canvas width="640" height="480"></canvas>
`;

export class App extends KKWebComponent {
  public static TAG = `${CONSTANTS.TAG_PREFIX}-app`;

  private readonly canvas: HTMLCanvasElement = <HTMLCanvasElement>this.shadowRoot.querySelector('canvas');

  constructor() {
    super(template);
    const webGlService = new WebGLService(this.canvas, VertexShaderSource, FragmentShaderSource);
    console.log(webGlService.toString());
  }
}

customElements.define(App.TAG, App);
