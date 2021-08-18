/* eslint-disable */
// @ts-nocheck
import * as tf from '@tensorflow/tfjs';
import { BufferOverSize } from '../../errors/BufferOverSize';
import { MemoryItem } from './interfaces/MemoryItem';

export class ReplayMemory {
  private bufferIndex: number;
  private currentBufferSize: number;

  private readonly buffer: MemoryItem[];
  private readonly bufferMaxSize: number;
  private readonly bufferIndexesMap: number[];

  constructor(bufferMaxSize: number) {
    this.bufferMaxSize = bufferMaxSize;
    this.buffer = new Array<MemoryItem>(this.bufferMaxSize);
    this.bufferIndex = 0;
    this.currentBufferSize = 0;

    this.bufferIndexesMap = [];
    for (let i = 0; i < bufferMaxSize; i++) {
      this.bufferIndexesMap.push(i);
    }
  }

  public append(item: MemoryItem): void {
    this.buffer[this.bufferIndex] = item;
    this.currentBufferSize = Math.min(this.currentBufferSize + 1, this.bufferMaxSize);
    this.bufferIndex = (this.bufferIndex + 1) % this.bufferMaxSize;
  }

  public sample(batchSize: number): MemoryItem[] {
    if (batchSize > this.bufferMaxSize) {
      throw new BufferOverSize(batchSize, this.bufferMaxSize);
    }
    tf.util.shuffle(this.bufferIndexesMap);
    return this.bufferIndexesMap.map((mappedIndex) => this.buffer[mappedIndex]);
  }
}
