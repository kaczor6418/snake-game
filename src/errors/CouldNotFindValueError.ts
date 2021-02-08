export class CouldNotFindValueError extends Error {
  constructor(message: string) {
    super(message);
    this.name = CouldNotFindValueError.name;
  }
}
