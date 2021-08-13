export class BufferOverSize extends Error {
  constructor(batchSize: number, maxSize: number) {
    super(`Current batch size (${batchSize}) exceeds buffer total size (${maxSize})`);
    this.name = BufferOverSize.name;
  }
}
