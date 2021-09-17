import { AgentPubKeyB64 } from '@holochain-open-dev/core-types';
import { HostFn } from '../host-fn';
export interface AgentInfo {
    agent_initial_pubkey: AgentPubKeyB64;
    agent_latest_pubkey: AgentPubKeyB64;
}
export declare type AgentInfoFn = () => Promise<AgentInfo>;
export declare const agent_info: HostFn<AgentInfoFn>;
