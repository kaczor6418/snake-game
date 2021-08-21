import { layers, LayersModel, sequential, Sequential } from '@tensorflow/tfjs';
import { UTILS } from '../../common/Utils/UTILS';
import { CanNotCopyWeights } from '../../errors/CanNotCopyWeights';

export class DeepQNetwork {
  public readonly model: LayersModel;

  private readonly outputSize: number;
  private readonly inputSize: number;

  constructor(inputSize: number, outputSize: number, trainable = true) {
    this.inputSize = inputSize;
    this.outputSize = outputSize;
    this.model = this.createNetwork();
    this.model.trainable = trainable;
  }

  private createNetwork(): LayersModel {
    const model: Sequential = sequential();
    model.add(
      layers.dense({
        units: this.inputSize,
        inputDim: this.inputSize,
        activation: 'relu'
      })
    );
    model.add(
      layers.dense({
        units: 32,
        activation: 'relu'
      })
    );
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
    model.add(
      layers.dense({
        units: this.outputSize
      })
    );
    model.compile({
      loss: 'meanSquaredError',
      optimizer: 'adam'
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
