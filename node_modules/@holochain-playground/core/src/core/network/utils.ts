import {
  AgentPubKeyB64,
  AnyDhtHashB64,
  DHTOp,
  ValidationReceipt,
  ValidationStatus,
} from '@holochain-open-dev/core-types';
import { uniq } from 'lodash-es';
import { distance, location, wrap } from '../../processors/hash';
import { CellState } from '../cell';

export function getClosestNeighbors(
  peers: AgentPubKeyB64[],
  targetHash: AnyDhtHashB64,
  numNeighbors: number
): AgentPubKeyB64[] {
  const sortedPeers = peers.sort(
    (agentA: AgentPubKeyB64, agentB: AgentPubKeyB64) => {
      const distanceA = distance(agentA, targetHash);
      const distanceB = distance(agentB, targetHash);
      return distanceA - distanceB;
    }
  );

  return sortedPeers.slice(0, numNeighbors);
}

export function getFarthestNeighbors(
  peers: AgentPubKeyB64[],
  targetHash: AnyDhtHashB64
): AgentPubKeyB64[] {
  const sortedPeers = peers.sort(
    (agentA: AgentPubKeyB64, agentB: AgentPubKeyB64) => {
      return (
        wrap(location(agentA) - location(targetHash)) -
        wrap(location(agentB) - location(targetHash))
      );
    }
  );

  const index35 = Math.floor(sortedPeers.length * 0.35);
  const index50 = Math.floor(sortedPeers.length / 2);
  const index65 = Math.floor(sortedPeers.length * 0.65);

  const neighbors = [
    sortedPeers[index35],
    sortedPeers[index50],
    sortedPeers[index65],
  ].filter(n => !!n);

  return uniq(neighbors);
}

export interface BadAction {
  badAgents: AgentPubKeyB64[];
  op: DHTOp;
  receipts: ValidationReceipt[];
}
export function getBadActions(state: CellState): Array<BadAction> {
  const badActions: Array<BadAction> = [];

  for (const [dhtOpHash, receipts] of Object.entries(
    state.validationReceipts
  )) {
    const myReceipt = receipts[state.agentPubKey];
    if (myReceipt) {
      const dhtOp = state.integratedDHTOps[dhtOpHash].op;
      const badAction: BadAction = {
        badAgents: [],
        op: dhtOp,
        receipts: Object.values(receipts),
      };

      if (myReceipt.validation_status === ValidationStatus.Rejected) {
        badAction.badAgents.push(dhtOp.header.header.content.author);
      }
      for (const [validatorAgent, receipt] of Object.entries(receipts)) {
        if (receipt.validation_status !== myReceipt.validation_status) {
          badAction.badAgents.push(receipt.validator);
        }
      }

      if (badAction.badAgents.length > 0) {
        badActions.push(badAction);
      }
    }
  }
  return badActions;
}

export function getBadAgents(state: CellState): AgentPubKeyB64[] {
  const actions = getBadActions(state);

  const badAgents: AgentPubKeyB64[] = actions.reduce(
    (acc, next) => [...acc, ...next.badAgents],
    [] as string[]
  );

  return uniq(badAgents);
}
