/* eslint-disable */
// @ts-nocheck
// import { layers, LayersModel, sequential } from '@tensorflow/tfjs';
// import { Sequential } from '@tensorflow/tfjs-layers/src/models';
import * as tf from '@tensorflow/tfjs';
import { UTILS } from '../../common/Utils/UTILS';
import { CanNotCopyWeights } from '../../errors/CanNotCopyWeights';

export class DeepQNetwork {
  private readonly environmentHeight: number;
  private readonly environmentWidth: number;
  private readonly actionsCount: number;
  private readonly model: tf.LayersModel;

  constructor(environmentHeight: number, environmentWidth: number, actionsCount: number) {
    this.environmentWidth = environmentWidth;
    this.environmentHeight = environmentHeight;
    this.actionsCount = actionsCount;
    this.model = this.createNetwork();
  }

  private createNetwork(): tf.LayersModel {
    const model: tf.Sequential = tf.sequential();
    model.add(
      tf.layers.conv2d({
        filters: 128,
        kernelSize: 3,
        strides: 1,
        activation: 'relu',
        inputShape: [this.environmentHeight, this.environmentWidth, 2]
      })
    );
    model.add(tf.layers.batchNormalization());
    model.add(
      tf.layers.conv2d({
        filters: 256,
        kernelSize: 3,
        strides: 1,
        activation: 'relu'
      })
    );
    model.add(tf.layers.batchNormalization());
    model.add(
      tf.layers.conv2d({
        filters: 256,
        kernelSize: 3,
        strides: 1,
        activation: 'relu'
      })
    );
    model.add(tf.layers.flatten());
    model.add(tf.layers.dense({ units: 100, activation: 'relu' }));
    model.add(tf.layers.dropout({ rate: 0.25 }));
    model.add(tf.layers.dense({ units: this.actionsCount }));
    return model;
  }

  public copyWeightsToNetwork(targetModel: LayersModel): void {
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
