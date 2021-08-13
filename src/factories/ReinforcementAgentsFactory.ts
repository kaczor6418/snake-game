import { ReinforcementAgentsNames } from './ReinforcementAgentsNames';
import { IReinforcementAgent } from '../ReinforcementAgents/interfaces/IReinforcementAgent';
import { QLearningAgent } from '../ReinforcementAgents/QLearningAgent/QLearningAgent';
import { ReinforcementAgentProps } from '../ReinforcementAgents/interfaces/ReinforcementAgentProps';
import { ThisSituationShouldNeverHappenError } from '../errors/ThisSituationShouldNeverHappenError';

export function createReinforcementAgent<T>(
  agentName: ReinforcementAgentsNames,
  props: ReinforcementAgentProps<T>
): IReinforcementAgent<T> {
  let agent: IReinforcementAgent<T>;
  switch (agentName) {
    case ReinforcementAgentsNames.Q_LEARNING:
      agent = new QLearningAgent(props);
      break;
    default:
      throw new ThisSituationShouldNeverHappenError('agentName');
  }
  return agent;
}
