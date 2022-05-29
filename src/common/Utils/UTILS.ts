export namespace UTILS {
  export function isNullOrUndefined(value: unknown): value is null | undefined {
    return value == null;
  }

  export function isDefined<T>(value: T | null | undefined): value is T {
    return value != null;
  }

  export function shallowCopy<T>(value: T): T {
    return { ...value };
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

  export function isObjectWithSameKeyValues<T extends Partial<Record<keyof T, unknown>>>(
    source: T,
    target: T,
    keys: Array<keyof T> = Object.keys(source) as Array<keyof T>
  ) {
    return keys.every((key) => source[key] === target[key]);
  }
}
