import { AgentPubKeyB64, AnyDhtHashB64, DnaHashB64 } from '@holochain-open-dev/core-types';
import { Cell } from '../cell/cell';
import { Network } from './network';
import { NetworkRequest } from './network-request';
export declare class KitsuneP2p {
    protected network: Network;
    discover: Discover;
    constructor(network: Network);
    rpc_single<T>(dna_hash: DnaHashB64, from_agent: AgentPubKeyB64, to_agent: AgentPubKeyB64, networkRequest: NetworkRequest<T>): Promise<T>;
    rpc_multi<T>(dna_hash: DnaHashB64, from_agent: AgentPubKeyB64, basis: AnyDhtHashB64, remote_agent_count: number, filtered_agents: AgentPubKeyB64[], networkRequest: NetworkRequest<T>): Promise<Array<T>>;
}
export declare class Discover {
    protected network: Network;
    constructor(network: Network);
    peer_discover(dna_hash: DnaHashB64, from_agent: AgentPubKeyB64, to_agent: AgentPubKeyB64): Promise<Cell>;
    message_neighborhood<T>(dna_hash: DnaHashB64, from_agent: AgentPubKeyB64, basis: AnyDhtHashB64, remote_agent_count: number, filtered_agents: AgentPubKeyB64[], networkRequest: NetworkRequest<T>): Promise<Array<T>>;
    private search_for_agents;
}
