import 'jest';
import { App } from './App';

describe(App.name, () => {
  test(`should render app component`, () => {
    const app: App = new App();
    document.body.appendChild(app);
    expect(document.body.innerHTML).toContain(App.TAG);
  });
});
