import { ReinforcementAgentsNames } from './ReinforcementAgentsNames';
import { IReinforcementAgent } from '../agents/interfaces/IReinforcementAgent';
import { QLearningAgent } from '../agents/QLearningAgent/QLearningAgent';
import { ThisSituationShouldNeverHappenError } from '../errors/ThisSituationShouldNeverHappenError';
import { DoubleDeepQLearningAgent } from '../agents/DeepQLearningAgent/DoubleDeepQLearningAgent';
import { ReinforcementAgentProps } from '../agents/interfaces/ReinforcementAgentProps';
import { isDoubleDeepQLearningAgentProps } from '../agents/DeepQLearningAgent/interfaces/DoubleDeepQLearningAgentProps';

export function createReinforcementAgent(agentName: ReinforcementAgentsNames, props: ReinforcementAgentProps): IReinforcementAgent {
  let agent: IReinforcementAgent;
  switch (agentName) {
    case ReinforcementAgentsNames.Q_LEARNING:
      agent = new QLearningAgent(props);
      break;
    case ReinforcementAgentsNames.DOUBLE_DEEP_Q_LEARNING:
      if (isDoubleDeepQLearningAgentProps(props)) {
        agent = new DoubleDeepQLearningAgent(props);
      } else {
        throw new Error('Incorrect agent config object');
      }
      break;
    default:
      throw new ThisSituationShouldNeverHappenError('agentName');
  }
  return agent;
}
