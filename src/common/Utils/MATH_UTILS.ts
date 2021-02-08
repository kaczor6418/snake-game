export namespace MATH_UTILS {
  export function generateRandomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  export function generateRandomNumber(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
