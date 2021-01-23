import { KKWebComponent } from './components/KKWebComponent/KKWebComponent';
import { CONSTANTS } from './common/CONSTANTS';

const template = `
  <h1>Snake Game</h1>
`;

export class App extends KKWebComponent {
  public static TAG = `${CONSTANTS.TAG_PREFIX}-app`;

  constructor() {
    super(template);
  }
}

customElements.define(App.TAG, App);
