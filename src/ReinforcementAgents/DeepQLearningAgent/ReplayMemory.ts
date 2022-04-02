import { util } from '@tensorflow/tfjs';
import { ARRAY_UTILS } from '../../common/Utils/ARRAY_UTILS';
import { UTILS } from '../../common/Utils/UTILS';
import { BufferOverSize } from '../../errors/BufferOverSize';
import { MemoryItem } from './interfaces/MemoryItem';

export class ReplayMemory {
  private bufferIndex: number;

  private readonly buffer: MemoryItem[];
  private readonly bufferMaxSize: number;
  private readonly bufferIndexesMap: number[];

  constructor(bufferMaxSize: number) {
    this.bufferMaxSize = bufferMaxSize;
    this.buffer = new Array<MemoryItem>(this.bufferMaxSize);
    this.bufferIndex = 0;
    this.bufferIndexesMap = [];
    for (let i = 0; i < bufferMaxSize; i++) {
      this.bufferIndexesMap.push(i);
    }
  }

  get size(): number {
    return this.buffer.length;
  }

  public addOrReplace(item: MemoryItem): void {
    if (this.buffer.length === this.bufferIndex) {
      this.bufferIndex = 0;
    }
    this.buffer[this.bufferIndex] = item;
    this.bufferIndex++;
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
    this.bufferIndex = 0;
  }

  public isFull(): boolean {
    return UTILS.isDefined(this.buffer[this.bufferMaxSize - 1]);
  }
}
