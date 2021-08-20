export class BufferOverSize extends Error {
  constructor(size: number, maxSize: number) {
    super(`Value: ${size}, exceeds buffer total size (${maxSize})`);
    this.name = BufferOverSize.name;
  }
}
