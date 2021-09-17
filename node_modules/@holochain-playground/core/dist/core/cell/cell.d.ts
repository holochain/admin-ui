import { CellId, AgentPubKeyB64, Dictionary, DHTOp, CapSecret, Element, DnaHashB64, AnyDhtHashB64, EntryHashB64, DhtOpHashB64 } from '@holochain-open-dev/core-types';
import { Conductor } from '../conductor';
import { P2pCell } from '../network/p2p-cell';
import { CellState } from './state';
import { Workflow } from './workflows/workflows';
import { MiddlewareExecutor } from '../../executor/middleware-executor';
import { GetLinksResponse, GetResult } from './cascade/types';
import { GetLinksOptions, GetOptions } from '../../types';
import { DhtArc } from '../network/dht_arc';
import { GossipData } from '../network/gossip/types';
export declare type CellSignal = 'after-workflow-executed' | 'before-workflow-executed';
export declare type CellSignalListener = (payload: any) => void;
export declare class Cell {
    _state: CellState;
    conductor: Conductor;
    _triggers: Dictionary<{
        running: boolean;
        triggered: boolean;
    }>;
    workflowExecutor: MiddlewareExecutor<Workflow<any, any>>;
    constructor(_state: CellState, conductor: Conductor);
    get cellId(): CellId;
    get agentPubKey(): AgentPubKeyB64;
    get dnaHash(): DnaHashB64;
    get p2p(): P2pCell;
    getState(): CellState;
    getSimulatedDna(): import("../..").SimulatedDna;
    static create(conductor: Conductor, cellId: CellId, membrane_proof: any): Promise<Cell>;
    /** Workflows */
    callZomeFn(args: {
        zome: string;
        fnName: string;
        payload: any;
        cap: string;
        provenance: AgentPubKeyB64;
    }): Promise<any>;
    /** Network handlers */
    handle_publish(from_agent: AgentPubKeyB64, request_validation_receipt: boolean, ops: Dictionary<DHTOp>): Promise<void>;
    handle_get(dht_hash: AnyDhtHashB64, options: GetOptions): Promise<GetResult | undefined>;
    handle_get_links(base_address: EntryHashB64, options: GetLinksOptions): Promise<GetLinksResponse>;
    handle_call_remote(from_agent: AgentPubKeyB64, zome_name: string, fn_name: string, cap: CapSecret | undefined, payload: any): Promise<any>;
    /** Gossips */
    handle_fetch_op_hashes_for_constraints(dht_arc: DhtArc, since: number | undefined, until: number | undefined): Array<DhtOpHashB64>;
    handle_fetch_op_hash_data(op_hashes: Array<DhtOpHashB64>): Dictionary<DHTOp>;
    handle_gossip_ops(op_hashes: Array<DhtOpHashB64>): Dictionary<DHTOp>;
    handle_gossip(from_agent: AgentPubKeyB64, gossip: GossipData): Promise<void>;
    handle_check_agent(firstElements: Element[]): Promise<void>;
    /** Workflow internal execution */
    triggerWorkflow(workflow: Workflow<any, any>): void;
    _runPendingWorkflows(): Promise<void>;
    _runWorkflow(workflow: Workflow<any, any>): Promise<any>;
    /** Private helpers */
    private buildWorkspace;
}
