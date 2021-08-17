// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as tf from '@tensorflow/tfjs';
import { BufferOverSize } from '../../errors/BufferOverSize';

export class ReplayMemory {
  private bufferIndex: number;
  private currentBufferSize: number;

  private readonly buffer: Array<number[]>;
  private readonly bufferMaxSize: number;
  private readonly bufferIndexesMap: number[];

  constructor(bufferMaxSize: number) {
    this.bufferMaxSize = bufferMaxSize;
    this.buffer = new Array<number[]>(this.bufferMaxSize);
    this.bufferIndex = 0;
    this.currentBufferSize = 0;

    this.bufferIndexesMap = [];
    for (let i = 0; i < bufferMaxSize; i++) {
      this.bufferIndexesMap.push(i);
    }
  }
  public append(item: number[]): void {
    this.buffer[this.bufferIndex] = item;
    this.currentBufferSize = Math.min(this.currentBufferSize + 1, this.bufferMaxSize);
    this.bufferIndex = (this.bufferIndex + 1) % this.bufferMaxSize;
  }

  //random sample
  public sample(batchSize: number): Array<number[]> {
    if (batchSize > this.bufferMaxSize) {
      throw new BufferOverSize(batchSize, this.bufferMaxSize);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
    tf.util.shuffle(this.bufferIndexesMap);
    return this.bufferIndexesMap.map((mappedIndex) => this.buffer[mappedIndex]);
  }
}
