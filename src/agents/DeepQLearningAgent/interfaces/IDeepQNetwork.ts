import { LayersModel } from '@tensorflow/tfjs';

export interface IDeepQNetwork {
  copyWeightsToNetwork(targetModel: LayersModel): void;
  readonly model: LayersModel;
}
