import { ReinforcementAgentsNames } from './ReinforcementAgentsNames';
import { IReinforcementAgent } from '../ReinforcementAgents/interfaces/IReinforcementAgent';
import { QLearningAgent } from '../ReinforcementAgents/QLearningAgent/QLearningAgent';
import { ReinforcementAgentProps } from '../ReinforcementAgents/interfaces/ReinforcementAgentProps';
import { ThisSituationShouldNeverHappenError } from '../errors/ThisSituationShouldNeverHappenError';

export function createReinforcementAgent(
  agentName: ReinforcementAgentsNames,
  props: ReinforcementAgentProps
): IReinforcementAgent {
  let agent: IReinforcementAgent;
  switch (agentName) {
    case ReinforcementAgentsNames.Q_LEARNING:
      agent = new QLearningAgent(props);
      break;
    default:
      throw new ThisSituationShouldNeverHappenError('agentName');
  }
  return agent;
}
