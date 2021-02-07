export namespace UTILS {
  export function isNullOrUndefined(value: unknown): value is null | undefined {
    return value == null;
  }

  export function isDefined<T>(value: T | null | undefined): value is T {
    return value != null;
  }

  export function shellCopy<T>(value: T): T {
    return <T>JSON.parse(JSON.stringify(value));
  }

  export function isTruthy(value: unknown): boolean {
    return value == true;
  }

  export function isFalsy(value: unknown): boolean {
    return value == false;
  }
}
