import { DHTOp, Dictionary } from '@holochain-open-dev/core-types';

import { getNonPublishedDhtOps } from '../source-chain/utils';
import { getDHTOpBasis } from '../utils';
import { Workflow, WorkflowReturn, WorkflowType, Workspace } from './workflows';

// From https://github.com/holochain/holochain/blob/develop/crates/holochain/src/core/workflow/publish_dht_ops_workflow.rs
export const publish_dht_ops = async (
  workspace: Workspace
): Promise<WorkflowReturn<void>> => {
  const dhtOps = getNonPublishedDhtOps(workspace.state);

  const dhtOpsByBasis: Dictionary<Dictionary<DHTOp>> = {};

  for (const dhtOpHash of Object.keys(dhtOps)) {
    const dhtOp = dhtOps[dhtOpHash];
    const basis = getDHTOpBasis(dhtOp);

    if (!dhtOpsByBasis[basis]) dhtOpsByBasis[basis] = {};

    dhtOpsByBasis[basis][dhtOpHash] = dhtOp;
  }

  const promises = Object.entries(dhtOpsByBasis).map(
    async ([basis, dhtOps]) => {
      // Publish the operations
      await workspace.p2p.publish(basis, dhtOps);

      for (const dhtOpHash of Object.keys(dhtOps)) {
        workspace.state.authoredDHTOps[
          dhtOpHash
        ].last_publish_time = Date.now();
      }
    }
  );

  await Promise.all(promises);

  return {
    result: undefined,
    triggers: [],
  };
};

export type PublishDhtOpsWorkflow = Workflow<void, void>;

export function publish_dht_ops_task(): PublishDhtOpsWorkflow {
  return {
    type: WorkflowType.PUBLISH_DHT_OPS,
    details: undefined,
    task: worskpace => publish_dht_ops(worskpace),
  };
}
