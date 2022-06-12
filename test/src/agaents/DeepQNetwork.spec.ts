import { DeepQNetwork } from '../../../src/agents/DeepQLearningAgent/DeepQNetwork';
import { IDeepQNetwork } from '../../../src/agents/DeepQLearningAgent/interfaces/IDeepQNetwork';

const copyCheck = (srcDQN: IDeepQNetwork, targetDQN: IDeepQNetwork) => {
  const srcWeights = srcDQN.model
    .getWeights()
    .map((tensor) => Array.from(tensor.bufferSync().values))
    .flat();
  const targetWeightBeforeCopy = targetDQN.model
    .getWeights()
    .map((tensor) => Array.from(tensor.bufferSync().values))
    .flat();
  srcDQN.copyWeightsToNetwork(targetDQN.model);
  const targetWeightAfter = targetDQN.model
    .getWeights()
    .map((tensor) => Array.from(tensor.bufferSync().values))
    .flat();
  for (let i = 0; i < srcWeights.length; i++) {
    expect(srcWeights[0]).not.toBe(targetWeightBeforeCopy[0]);
  }
  for (let i = 0; i < srcWeights.length; i++) {
    expect(srcWeights[0]).toBe(targetWeightAfter[0]);
  }
};

describe(DeepQNetwork.name, () => {
  describe(DeepQNetwork.prototype.copyWeightsToNetwork.name, () => {
    it('should copy weights from one network to given network', () => {
      const srcDQN = new DeepQNetwork(2, 1, 0.5);
      const targetDQN = new DeepQNetwork(2, 1, 0.5);
      copyCheck(srcDQN, targetDQN);
    });
    it('should copy weights from one network to given network even if target network is not trainable', () => {
      const srcDQN = new DeepQNetwork(2, 1, 0.5);
      const targetDQN = new DeepQNetwork(2, 1, 0.5, false);
      copyCheck(srcDQN, targetDQN);
    });
  });
});
