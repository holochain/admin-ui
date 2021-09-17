import {
  CellId,
  AgentPubKeyB64,

  Dictionary,
  DHTOp,
  CapSecret,
  Timestamp,
  ValidationReceipt,
  Element,
  DnaHashB64,
  AnyDhtHashB64,
  EntryHashB64,
  DhtOpHashB64,
} from '@holochain-open-dev/core-types';
import { Conductor } from '../conductor';
import { genesis, genesis_task } from './workflows/genesis';
import { call_zome_fn_workflow } from './workflows/call_zome_fn';
import { P2pCell } from '../network/p2p-cell';
import { incoming_dht_ops_task } from './workflows/incoming_dht_ops';
import { CellState, query_dht_ops } from './state';
import { Workflow, WorkflowType, Workspace } from './workflows/workflows';
import { triggeredWorkflowFromType } from './workflows/trigger';
import { MiddlewareExecutor } from '../../executor/middleware-executor';
import { GetLinksResponse, GetResult } from './cascade/types';
import { Authority } from './cascade/authority';
import { getHashType, hash, HashType } from '../../processors/hash';
import { GetLinksOptions, GetOptions } from '../../types';
import { cloneDeep, uniq } from 'lodash-es';
import { DhtArc } from '../network/dht_arc';
import { getDHTOpBasis } from './utils';
import { GossipData } from '../network/gossip/types';
import { hasDhtOpBeenProcessed } from './dht/get';
import { putValidationReceipt } from './dht/put';
import { BadAction, getBadActions, getBadAgents } from '../network/utils';
import {
  app_validation_task,
  run_agent_validation_callback,
} from './workflows/app_validation';
import { getSourceChainElements } from './source-chain/get';

export type CellSignal = 'after-workflow-executed' | 'before-workflow-executed';
export type CellSignalListener = (payload: any) => void;

export class Cell {
  _triggers: Dictionary<{ running: boolean; triggered: boolean }> = {
    [WorkflowType.INTEGRATE_DHT_OPS]: { running: false, triggered: true },
    [WorkflowType.PRODUCE_DHT_OPS]: { running: false, triggered: true },
    [WorkflowType.PUBLISH_DHT_OPS]: { running: false, triggered: true },
    [WorkflowType.SYS_VALIDATION]: { running: false, triggered: true },
    [WorkflowType.APP_VALIDATION]: { running: false, triggered: true },
    [WorkflowType.VALIDATION_RECEIPT]: { running: false, triggered: true },
  };

  workflowExecutor = new MiddlewareExecutor<Workflow<any, any>>();

  constructor(public _state: CellState, public conductor: Conductor) {
    // Let genesis be run before actually joining
  }

  get cellId(): CellId {
    return [this._state.dnaHash, this._state.agentPubKey];
  }

  get agentPubKey(): AgentPubKeyB64 {
    return this.cellId[1];
  }

  get dnaHash(): DnaHashB64 {
    return this.cellId[0];
  }

  get p2p(): P2pCell {
    return this.conductor.network.p2pCells[this.cellId[0]][this.cellId[1]];
  }

  getState(): CellState {
    return cloneDeep(this._state);
  }

  getSimulatedDna() {
    return this.conductor.registeredDnas[this.dnaHash];
  }

  static async create(
    conductor: Conductor,
    cellId: CellId,
    membrane_proof: any
  ): Promise<Cell> {
    const newCellState: CellState = {
      dnaHash: cellId[0],
      agentPubKey: cellId[1],
      CAS: {},
      integrationLimbo: {},
      metadata: {
        link_meta: [],
        misc_meta: {},
        system_meta: {},
      },
      validationLimbo: {},
      integratedDHTOps: {},
      authoredDHTOps: {},
      validationReceipts: {},
      sourceChain: [],
      badAgents: [],
    };

    const cell = new Cell(newCellState, conductor);

    conductor.network.createP2pCell(cell);

    await cell._runWorkflow(genesis_task(cellId, membrane_proof));

    await cell.p2p.join(cell);

    return cell;
  }

  /** Workflows */

  callZomeFn(args: {
    zome: string;
    fnName: string;
    payload: any;
    cap: string;
    provenance: AgentPubKeyB64;
  }): Promise<any> {
    return this._runWorkflow(
      call_zome_fn_workflow(
        args.zome,
        args.fnName,
        args.payload,
        args.provenance
      )
    );
  }

  /** Network handlers */
  // https://github.com/holochain/holochain/blob/develop/crates/holochain/src/conductor/cell.rs#L429

  public handle_publish(
    from_agent: AgentPubKeyB64,
    request_validation_receipt: boolean,
    ops: Dictionary<DHTOp>
  ): Promise<void> {
    return this._runWorkflow(
      incoming_dht_ops_task(from_agent, request_validation_receipt, ops)
    );
  }

  public async handle_get(
    dht_hash: AnyDhtHashB64,
    options: GetOptions
  ): Promise<GetResult | undefined> {
    const authority = new Authority(this._state, this.p2p);

    const hashType = getHashType(dht_hash);
    if (hashType === HashType.ENTRY || hashType === HashType.AGENT) {
      return authority.handle_get_entry(dht_hash, options);
    } else if (hashType === HashType.HEADER) {
      return authority.handle_get_element(dht_hash, options);
    }
    return undefined;
  }

  public async handle_get_links(
    base_address: EntryHashB64,
    options: GetLinksOptions
  ): Promise<GetLinksResponse> {
    const authority = new Authority(this._state, this.p2p);
    return authority.handle_get_links(base_address, options);
  }

  public async handle_call_remote(
    from_agent: AgentPubKeyB64,
    zome_name: string,
    fn_name: string,
    cap: CapSecret | undefined,
    payload: any
  ): Promise<any> {
    return this.callZomeFn({
      zome: zome_name,
      cap: cap as CapSecret,
      fnName: fn_name,
      payload,
      provenance: from_agent,
    });
  }

  /** Gossips */

  public handle_fetch_op_hashes_for_constraints(
    dht_arc: DhtArc,
    since: number | undefined,
    until: number | undefined
  ): Array<DhtOpHashB64> {
    return query_dht_ops(this._state.integratedDHTOps, since, until, dht_arc);
  }

  public handle_fetch_op_hash_data(op_hashes: Array<DhtOpHashB64>): Dictionary<DHTOp> {
    const result: Dictionary<DHTOp> = {};
    for (const opHash of op_hashes) {
      const value = this._state.integratedDHTOps[opHash];
      if (value) {
        result[opHash] = value.op;
      }
    }
    return result;
  }

  public handle_gossip_ops(op_hashes: Array<DhtOpHashB64>): Dictionary<DHTOp> {
    const result: Dictionary<DHTOp> = {};
    for (const opHash of op_hashes) {
      const value = this._state.integratedDHTOps[opHash];
      if (value) {
        result[opHash] = value.op;
      }
    }
    return result;
  }

  async handle_gossip(from_agent: AgentPubKeyB64, gossip: GossipData) {
    const dhtOpsToProcess: Dictionary<DHTOp> = {};

    for (const badAction of gossip.badActions) {
      const dhtOpHash = hash(badAction.op, HashType.DHTOP);
      if (!hasDhtOpBeenProcessed(this._state, dhtOpHash)) {
        dhtOpsToProcess[dhtOpHash] = badAction.op;
      }

      for (const receipt of badAction.receipts) {
        putValidationReceipt(dhtOpHash, receipt)(this._state);
      }
    }

    for (const [dhtOpHash, validatedOp] of Object.entries(
      gossip.validated_dht_ops
    )) {
      for (const receipt of validatedOp.validation_receipts) {
        putValidationReceipt(dhtOpHash, receipt)(this._state);
      }

      // TODO: fix for when sharding is implemented
      if (this.p2p.shouldWeHold(getDHTOpBasis(validatedOp.op))) {
        dhtOpsToProcess[dhtOpHash] = validatedOp.op;
      }
    }

    if (Object.keys(dhtOpsToProcess).length > 0) {
      await this.handle_publish(from_agent, false, dhtOpsToProcess);
    }

    const previousCount = this._state.badAgents.length;

    const badAgents = getBadAgents(this._state);
    this._state.badAgents = uniq([...this._state.badAgents, ...badAgents]);

    if (this._state.badAgents.length > previousCount) {
      // We have added bad agents: resync the neighbors
      await this.p2p.syncNeighbors();
    }
  }

  // Check if the agent we are trying to connect with passes the membrane rules for this Dna
  async handle_check_agent(firstElements: Element[]): Promise<void> {
    const result = await this.workflowExecutor.execute(
      () => run_agent_validation_callback(this.buildWorkspace(), firstElements),
      app_validation_task(true)
    );

    if (!result.resolved) throw new Error('Unresolved in agent validate?');
    else if (!result.valid) throw new Error('Agent is invalid in this Dna');
  }

  /** Workflow internal execution */

  triggerWorkflow(workflow: Workflow<any, any>) {
    this._triggers[workflow.type].triggered = true;

    setTimeout(() => this._runPendingWorkflows());
  }

  async _runPendingWorkflows() {
    const pendingWorkflows: WorkflowType[] = Object.entries(this._triggers)
      .filter(([type, t]) => t.triggered && !t.running)
      .map(([type, t]) => type as WorkflowType);

    const workflowsToRun = pendingWorkflows.map(triggeredWorkflowFromType);

    const promises = Object.values(workflowsToRun).map(async w => {
      if (!this._triggers[w.type]) console.log(w);
      this._triggers[w.type].triggered = false;
      this._triggers[w.type].running = true;
      await this._runWorkflow(w);
      this._triggers[w.type].running = false;

      this._runPendingWorkflows();
    });

    await Promise.all(promises);
  }

  async _runWorkflow(workflow: Workflow<any, any>): Promise<any> {
    const result = await this.workflowExecutor.execute(
      () => workflow.task(this.buildWorkspace()),
      workflow
    );

    result.triggers.forEach(triggeredWorkflow =>
      this.triggerWorkflow(triggeredWorkflow)
    );
    return result.result;
  }

  /** Private helpers */

  private buildWorkspace(): Workspace {
    let badAgentConfig = undefined;
    let dna = this.getSimulatedDna();
    if (this.conductor.badAgent) {
      badAgentConfig = this.conductor.badAgent.config;
      if (
        this.conductor.badAgent.counterfeitDnas[this.cellId[0]] &&
        this.conductor.badAgent.counterfeitDnas[this.cellId[0]][this.cellId[1]]
      ) {
        dna = this.conductor.badAgent.counterfeitDnas[this.cellId[0]][
          this.cellId[1]
        ];
      }
    }

    return {
      state: this._state,
      p2p: this.p2p,
      dna,
      badAgentConfig,
    };
  }
}
