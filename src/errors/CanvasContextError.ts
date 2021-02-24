export class CanvasContextError extends Error {
  constructor(message: string) {
    super(message);
    this.name = CanvasContextError.name;
  }
}
