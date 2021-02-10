export namespace UTILS {
  export function isNullOrUndefined(value: unknown): value is null | undefined {
    return value == null;
  }

  export function isDefined<T>(value: T | null | undefined): value is T {
    return value != null;
  }

  export function shellCopy<T>(value: T): T {
    return Object.assign({}, value);
  }

  export function isTruthy(value: unknown): boolean {
    return value == true;
  }

  export function isFalsy(value: unknown): boolean {
    return value == false;
  }

  export function wait(ms: number): Promise<void> {
    return new Promise<void>((resolve) => window.setTimeout(resolve, ms));
  }
}
