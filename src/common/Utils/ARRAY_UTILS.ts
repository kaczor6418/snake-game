import { UTILS } from './UTILS';

export namespace ARRAY_UTILS {
  export function deepCopy<T>(array: T[]): T[] {
    return array.map((element) => UTILS.shellCopy(element));
  }

  export function isEmpty(array: Array<unknown>): boolean {
    return array.length === 0;
  }

  export function isNotEmpty(array: Array<unknown>): boolean {
    return array.length > 0;
  }

  export function getLastElementReference<T>(array: Array<T>): T {
    return array[array.length - 1];
  }

  export function getLastElementCopy<T>(array: Array<T>): T {
    return UTILS.shellCopy(array[array.length - 1]);
  }

  export function removeElement<T>(array: T[], index: number): T {
    return array.splice(index, 1)[0];
  }
}
