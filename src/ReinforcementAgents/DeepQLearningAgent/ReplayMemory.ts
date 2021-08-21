import { util } from '@tensorflow/tfjs';
import { ARRAY_UTILS } from '../../common/Utils/ARRAY_UTILS';
import { BufferOverSize } from '../../errors/BufferOverSize';
import { MemoryItem } from './interfaces/MemoryItem';

export class ReplayMemory {
  private currentBufferIndex: number;

  private readonly buffer: MemoryItem[];
  private readonly bufferMaxSize: number;
  private readonly bufferIndexesMap: number[];

  constructor(bufferMaxSize: number) {
    this.bufferMaxSize = bufferMaxSize;
    this.buffer = new Array<MemoryItem>(this.bufferMaxSize);
    this.currentBufferIndex = 0;
    this.bufferIndexesMap = [];
    for (let i = 0; i < bufferMaxSize; i++) {
      this.bufferIndexesMap.push(i);
    }
  }

  public append(item: MemoryItem): void {
    if (this.isFull()) {
      throw new BufferOverSize(this.currentBufferIndex, this.bufferMaxSize);
    }
    this.buffer[this.currentBufferIndex] = item;
    this.currentBufferIndex++;
  }

  public sample(batchSize: number): MemoryItem[] {
    if (batchSize > this.bufferMaxSize) {
      throw new BufferOverSize(batchSize, this.bufferMaxSize);
    }
    util.shuffle(this.bufferIndexesMap);
    return this.bufferIndexesMap.map((mappedIndex) => this.buffer[mappedIndex]);
  }

  public reset(): void {
    ARRAY_UTILS.resetValuesToEmpty(this.buffer);
    this.currentBufferIndex = 0;
  }

  public isFull(): boolean {
    return this.currentBufferIndex === this.bufferMaxSize;
  }
}
