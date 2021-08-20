/* eslint-disable */
// @ts-nocheck
// import { layers, LayersModel, sequential } from '@tensorflow/tfjs';
// import { Sequential } from '@tensorflow/tfjs-layers/src/models';
import * as tf from '@tensorflow/tfjs';
import { UTILS } from '../../common/Utils/UTILS';
import { CanNotCopyWeights } from '../../errors/CanNotCopyWeights';

export class DeepQNetwork {
  public readonly model: tf.LayersModel;

  private readonly outputSize: number;
  private readonly inputSize: number;

  constructor(inputSize: number, outputSize: number, trainable = true) {
    this.inputSize = inputSize;
    this.outputSize = outputSize;
    this.model = this.createNetwork();
    this.model.trainable = trainable;
  }

  private createNetwork(): tf.LayersModel {
    const model: tf.Sequential = tf.sequential();
    model.add(
      tf.layers.dense({
        units: this.inputSize,
        inputDim: this.inputSize,
        activation: 'relu'
      })
    );
    model.add(
      tf.layers.dense({
        units: 32,
        activation: 'relu'
      })
    );
    model.add(
      tf.layers.dense({
        units: 64,
        activation: 'relu'
      })
    );
    model.add(
      tf.layers.dense({
        units: 32,
        activation: 'relu'
      })
    );    model.add(
      tf.layers.dense({
        units: this.outputSize,
      })
    );
    model.compile({
      loss: 'meanSquaredError',
      optimizer: 'adam'
    });
    return model;
  }

  public copyWeightsToNetwork(targetModel: tf.LayersModel): void {
    if (UTILS.isNullOrUndefined(this.model)) {
      throw new CanNotCopyWeights();
    }
    let originalTargetTrainableState: boolean | null = null;
    if (this.model.trainable !== targetModel.trainable) {
      originalTargetTrainableState = targetModel.trainable;
      targetModel.trainable = this.model.trainable;
    }
    targetModel.setWeights(this.model.getWeights());
    if (UTILS.isDefined<boolean>(originalTargetTrainableState)) {
      targetModel.trainable = originalTargetTrainableState;
    }
  }
}
