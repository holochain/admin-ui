import { AgentPubKeyB64, AnyDhtHashB64, DnaHashB64 } from '@holochain-open-dev/core-types';
import { Cell } from '../cell/cell';
import { Network } from './network';
import { NetworkRequest } from './network-request';

export class KitsuneP2p {
  discover: Discover;
  constructor(protected network: Network) {
    this.discover = new Discover(network);
  }

  async rpc_single<T>(
    dna_hash: DnaHashB64,
    from_agent: AgentPubKeyB64,
    to_agent: AgentPubKeyB64,
    networkRequest: NetworkRequest<T>
  ): Promise<T> {
    const peer = await this.discover.peer_discover(
      dna_hash,
      from_agent,
      to_agent
    );
    return networkRequest(peer);
  }

  async rpc_multi<T>(
    dna_hash: DnaHashB64,
    from_agent: AgentPubKeyB64,
    basis: AnyDhtHashB64,
    remote_agent_count: number,
    filtered_agents: AgentPubKeyB64[],
    networkRequest: NetworkRequest<T>
  ): Promise<Array<T>> {
    // Discover neighbors
    return this.discover.message_neighborhood(
      dna_hash,
      from_agent,
      basis,
      remote_agent_count,
      filtered_agents,
      networkRequest
    );
  }

}

// From https://github.com/holochain/holochain/blob/develop/crates/kitsune_p2p/kitsune_p2p/src/spawn/actor/discover.rs
export class Discover {
  constructor(protected network: Network) {}

  // TODO fix this
  async peer_discover(
    dna_hash: DnaHashB64,
    from_agent: AgentPubKeyB64,
    to_agent: AgentPubKeyB64
  ): Promise<Cell> {
    return this.network.bootstrapService.cells[dna_hash][to_agent];
  }

  async message_neighborhood<T>(
    dna_hash: DnaHashB64,
    from_agent: AgentPubKeyB64,
    basis: AnyDhtHashB64,
    remote_agent_count: number,
    filtered_agents: AgentPubKeyB64[],
    networkRequest: NetworkRequest<T>
  ): Promise<Array<T>> {
    const agents = await this.search_for_agents(
      dna_hash,
      basis,
      remote_agent_count,
      filtered_agents
    );

    const promises = agents.map(cell => networkRequest(cell));
    return Promise.all(promises);
  }

  private async search_for_agents(
    dna_hash: DnaHashB64,
    basis: AnyDhtHashB64,
    remote_agent_count: number,
    filtered_agents: AgentPubKeyB64[]
  ): Promise<Cell[]> {
    return this.network.bootstrapService.getNeighborhood(
      dna_hash,
      basis,
      remote_agent_count,
      filtered_agents
    );
  }
}
