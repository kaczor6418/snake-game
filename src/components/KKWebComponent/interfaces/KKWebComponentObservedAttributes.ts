export type KKWebComponentObservedAttributes<T> = {
  [K in keyof T]: T[K];
};
