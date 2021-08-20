import { UTILS } from './UTILS';
import { CouldNotFindValueError } from '../../errors/CouldNotFindValueError';

export namespace ARRAY_UTILS {
  export function shellCopy<T>(array: T[]): T[] {
    return array.map((element) => UTILS.shellCopy(element));
  }

  export function isEmpty(array: Array<unknown>): boolean {
    return array.length === 0;
  }

  export function isNotEmpty(array: Array<unknown>): boolean {
    return array.length > 0;
  }

  export function getLastElementReference<T>(array: T[]): T {
    return array[array.length - 1];
  }

  export function getLastElementCopy<T>(array: T[]): T {
    return UTILS.shellCopy(array[array.length - 1]);
  }

  export function removeElement<T>(array: T[], index: number): T {
    return array.splice(index, 1)[0];
  }

  export function getRandomValue<T>(array: T[]): T {
    return array[~~(Math.random() * array.length)];
  }

  export function removePrimitiveValue<T>(array: T[], value: T): T {
    const indexOfValueToRemove = array.findIndex((v) => v === value);
    if (indexOfValueToRemove < 0) {
      throw new CouldNotFindValueError('Could not find value in array');
    }
    return array.splice(array.findIndex((v) => v === value) ?? array.length, 1)[0];
  }

  export function hasObjectWithSameShape<T extends Record<string, unknown>>(arr: T[], value: T): boolean {
    return arr.some((element) => {
      let hasSameShape = true;
      for (const key of Object.keys(element)) {
        if (element[key] !== value[key]) {
          hasSameShape = false;
        }
      }
      return hasSameShape;
    });
  }

  export function resetValuesToEmpty(arr: unknown[]): void {
    const arrSize = arr.length;
    arr.length = 0;
    arr.length = arrSize;
  }
}
