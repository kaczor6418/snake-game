export class InvalidPositionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = InvalidPositionError.name;
  }
}
