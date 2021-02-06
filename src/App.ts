import { KKWebComponent } from './components/KKWebComponent/KKWebComponent';
import { CONSTANTS } from './common/CONSTANTS';

const template = `
  <h1>Snake Game</h1>
  <canvas width="640" height="480"></canvas>
`;

export class App extends KKWebComponent {
  public static TAG = `${CONSTANTS.TAG_PREFIX}-app`;

  // private readonly canvas: HTMLCanvasElement = <HTMLCanvasElement>this.shadowRoot.querySelector('canvas');

  constructor() {
    super(template);
  }
}

customElements.define(App.TAG, App);
