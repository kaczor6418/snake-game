import { AdamOptimizer, layers, LayersModel, sequential, Sequential, train } from '@tensorflow/tfjs';
import { UTILS } from '../../common/Utils/UTILS';
import { CanNotCopyWeights } from '../../errors/CanNotCopyWeights';

export class DeepQNetwork {
  public readonly model: LayersModel;

  private readonly outputSize: number;
  private readonly inputSize: number = 0;

  constructor(inputSize: number, outputSize: number, learningRate: number, trainable = true) {
    this.inputSize = inputSize;
    this.outputSize = outputSize;
    this.model = this.createNetwork(learningRate);
    this.model.trainable = trainable;
  }

  public createNetwork(learningRate: number): LayersModel {
    const adamOptimizer: AdamOptimizer = train.adam(learningRate);
    const model: Sequential = sequential();
    model.add(
      layers.dense({
        units: 1,
        inputShape: [this.inputSize],
        activation: 'relu'
      })
    );
    // model.add(layers.batchNormalization());
    model.add(
      layers.dense({
        units: 32,
        activation: 'relu'
      })
    );
    // model.add(layers.batchNormalization());
    model.add(
      layers.dense({
        units: 64,
        activation: 'relu'
      })
    );
    model.add(
      layers.dense({
        units: 32,
        activation: 'relu'
      })
    );
    model.add(layers.dropout({ rate: 0.25 }));
    model.add(
      layers.dense({
        units: this.outputSize
      })
    );
    model.compile({
      optimizer: adamOptimizer,
      loss: 'meanSquaredError'
    });
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
