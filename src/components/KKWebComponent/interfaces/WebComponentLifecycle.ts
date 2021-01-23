export interface WebComponentLifecycle {
  connectedCallback(): void;
  disconnectedCallback(): void;
  adoptedCallback(): void;
  attributeChangedCallback(name: string, oldValue: string, newValue: string): void;
}
