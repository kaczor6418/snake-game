export class IncorrectBufferSizeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = IncorrectBufferSizeError.name;
  }
}
