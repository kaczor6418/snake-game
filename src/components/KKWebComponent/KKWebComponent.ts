import { WebComponentLifecycle } from './interfaces/WebComponentLifecycle';
import { KKWebComponentObservedAttributes } from './interfaces/KKWebComponentObservedAttributes';
import { UTILS } from '../../common/Utils/UTILS';
import { CONSTANTS } from '../../common/CONSTANTS';

export abstract class KKWebComponent<T = unknown> extends HTMLElement implements WebComponentLifecycle {
  public readonly shadowRoot: ShadowRoot;

  private readonly props: KKWebComponentObservedAttributes<T> | undefined = undefined;

  protected constructor(template: string, styles?: string, props?: KKWebComponentObservedAttributes<T>) {
    super();
    this.shadowRoot = this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = template;
    this.injectStyles(styles);
    this.props = props;
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
    return void 0;
  }

  public connectedCallback(): void {
    this.initialize();
  }

  public disconnectedCallback(): void {
    return void 0;
  }

  public adoptedCallback(): void {
    return void 0;
  }

  protected initialize(): void {
    if (UTILS.isDefined(this.props)) {
      for (const [key, value] of Object.entries(this.props)) {
        this.setAttribute(key.toLowerCase().replace(CONSTANTS.ENUM_DELIMITER, CONSTANTS.COMPONENT_TAG_DELIMITER), <string>value);
      }
    }
  }

  private injectStyles(styles: string | undefined): void {
    if (UTILS.isNullOrUndefined(styles)) {
      return void 0;
    }
    const styleWrapper: HTMLStyleElement = document.createElement('style');
    styleWrapper.innerHTML = styles;
    this.shadowRoot.appendChild(styleWrapper);
  }
}
