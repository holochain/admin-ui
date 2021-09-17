import {
  AgentPubKeyB64,
  CellId,
  Dictionary,
  DnaHashB64,
} from '@holochain-open-dev/core-types';
import { Cell, getCellId } from '../core/cell';
import { hash, HashType } from '../processors/hash';
import { Network, NetworkState } from './network/network';

import {
  InstalledHapps,
  SimulatedDna,
  SimulatedHappBundle,
} from '../dnas/simulated-dna';
import { CellState } from './cell/state';
import { BootstrapService } from '../bootstrap/bootstrap-service';
import { BadAgent, BadAgentConfig } from './bad-agent';

export interface ConductorState {
  // DnaHash / AgentPubKeyB64
  cellsState: Dictionary<Dictionary<CellState>>;
  networkState: NetworkState;
  registeredDnas: Dictionary<SimulatedDna>;
  installedHapps: Dictionary<InstalledHapps>;
  name: string;
  badAgent: BadAgent | undefined;
}

export class Conductor {
  readonly cells: Dictionary<Dictionary<Cell>>;
  registeredDnas!: Dictionary<SimulatedDna>;
  installedHapps!: Dictionary<InstalledHapps>;

  network: Network;
  name: string;

  badAgent: BadAgent | undefined; // If undefined, this is an honest agent

  constructor(state: ConductorState, bootstrapService: BootstrapService) {
    this.network = new Network(state.networkState, this, bootstrapService);
    this.registeredDnas = state.registeredDnas;
    this.installedHapps = state.installedHapps;
    this.name = state.name;

    this.cells = {};
    for (const [dnaHash, dnaCellsStates] of Object.entries(state.cellsState)) {
      if (!this.cells[dnaHash]) this.cells[dnaHash] = {};

      for (const [agentPubKey, cellState] of Object.entries(dnaCellsStates)) {
        this.cells[dnaHash][agentPubKey] = new Cell(cellState, this);
      }
    }
  }

  static async create(
    bootstrapService: BootstrapService,
    name: string
  ): Promise<Conductor> {
    const state: ConductorState = {
      cellsState: {},
      networkState: {
        p2pCellsState: {},
      },
      registeredDnas: {},
      installedHapps: {},
      name,
      badAgent: undefined,
    };

    return new Conductor(state, bootstrapService);
  }

  getState(): ConductorState {
    const cellsState: Dictionary<Dictionary<CellState>> = {};

    for (const [dnaHash, dnaCells] of Object.entries(this.cells)) {
      if (!cellsState[dnaHash]) cellsState[dnaHash];

      for (const [agentPubKey, cell] of Object.entries(dnaCells)) {
        cellsState[dnaHash][agentPubKey] = cell.getState();
      }
    }

    return {
      name: this.name,
      networkState: this.network.getState(),
      cellsState,
      registeredDnas: this.registeredDnas,
      installedHapps: this.installedHapps,
      badAgent: this.badAgent,
    };
  }

  getAllCells(): Cell[] {
    const nestedCells = Object.values(this.cells).map(dnaCells =>
      Object.values(dnaCells)
    );

    return ([] as Cell[]).concat(...nestedCells);
  }

  getCells(dnaHash: DnaHashB64): Cell[] {
    const dnaCells = this.cells[dnaHash];
    return dnaCells ? Object.values(dnaCells) : [];
  }

  getCell(dnaHash: DnaHashB64, agentPubKey: AgentPubKeyB64): Cell | undefined {
    return this.cells[dnaHash] ? this.cells[dnaHash][agentPubKey] : undefined;
  }

  /** Bad agents */

  setBadAgent(badAgentConfig: BadAgentConfig) {
    if (!this.badAgent)
      this.badAgent = { config: badAgentConfig, counterfeitDnas: {} };
    this.badAgent.config = badAgentConfig;
  }

  setCounterfeitDna(cellId: CellId, dna: SimulatedDna) {
    if (!this.badAgent) throw new Error('This is not a bad agent');

    if (!this.badAgent.counterfeitDnas[cellId[0]])
      this.badAgent.counterfeitDnas[cellId[0]] = {};
    this.badAgent.counterfeitDnas[cellId[0]][cellId[1]] = dna;
  }

  /** Admin API */
  /* 
  async registerDna(dna_template: SimulatedDna): Promise<Hash> {
    const templateHash = hash(dna_template, HashType.DNA);

    this.registeredDnas[templateHash] = dna_template;
    return templateHash;
  } */

  async cloneCell(
    installedAppId: string,
    slotNick: string,
    uid?: string,
    properties?: Dictionary<any>,
    membraneProof?: any
  ): Promise<Cell> {
    if (!this.installedHapps[installedAppId])
      throw new Error(`Given app id doesn't exist`);

    const installedApp = this.installedHapps[installedAppId];
    if (!installedApp.slots[slotNick])
      throw new Error(`The slot nick doesn't exist for the given app id`);

    const slotToClone = installedApp.slots[slotNick];

    const hashOfDnaToClone = slotToClone.base_cell_id[0];
    const dnaToClone = this.registeredDnas[hashOfDnaToClone];

    if (!dnaToClone) {
      throw new Error(
        `The dna to be cloned is not registered on this conductor`
      );
    }

    const dna: SimulatedDna = { ...dnaToClone };

    if (uid) dna.uid = uid;
    if (properties) dna.properties = properties;

    const newDnaHash = hash(dna, HashType.DNA);

    if (newDnaHash === hashOfDnaToClone)
      throw new Error(
        `Trying to clone a dna would create exactly the same DNA`
      );
    this.registeredDnas[newDnaHash] = dna;

    const cell = await this.createCell(
      dna,
      installedApp.agent_pub_key,
      membraneProof
    );
    this.installedHapps[installedAppId].slots[slotNick].clones.push(
      cell.cellId
    );

    return cell;
  }

  async installHapp(
    happ: SimulatedHappBundle,
    membrane_proofs: Dictionary<any> // segmented by CellNick
  ): Promise<void> {
    const rand = `${Math.random().toString()}/${Date.now()}`;
    const agentId = hash(rand, HashType.AGENT);

    this.installedHapps[happ.name] = {
      agent_pub_key: agentId,
      app_id: happ.name,
      slots: {},
    };

    for (const [cellNick, dnaSlot] of Object.entries(happ.slots)) {
      let dnaHash: string | undefined = undefined;
      if (typeof dnaSlot.dna === 'string') {
        dnaHash = dnaSlot.dna;
        if (!this.registeredDnas[dnaHash])
          throw new Error(
            `Trying to reference a Dna that this conductor doesn't have registered`
          );
      } else if (typeof dnaSlot.dna === 'object') {
        dnaHash = hash(dnaSlot.dna, HashType.DNA);
        this.registeredDnas[dnaHash] = dnaSlot.dna;
      } else {
        throw new Error(
          'Bad DNA Slot: you must pass in the hash of the dna or the simulated Dna object'
        );
      }

      this.installedHapps[happ.name].slots[cellNick] = {
        base_cell_id: [dnaHash, agentId],
        is_provisioned: !dnaSlot.deferred,
        clones: [],
      };

      if (!dnaSlot.deferred) {
        const cell = await this.createCell(
          this.registeredDnas[dnaHash],
          agentId,
          membrane_proofs[cellNick]
        );
      }
    }
  }

  private async createCell(
    dna: SimulatedDna,
    agentPubKey: string,
    membraneProof?: any
  ): Promise<Cell> {
    const newDnaHash = hash(dna, HashType.DNA);

    const cellId: CellId = [newDnaHash, agentPubKey];
    const cell = await Cell.create(this, cellId, membraneProof);

    if (!this.cells[cell.dnaHash]) this.cells[cell.dnaHash] = {};

    this.cells[cell.dnaHash][cell.agentPubKey] = cell;

    return cell;
  }

  /** App API */

  callZomeFn(args: {
    cellId: CellId;
    zome: string;
    fnName: string;
    payload: any;
    cap: string;
  }): Promise<any> {
    const dnaHash = args.cellId[0];
    const agentPubKey = args.cellId[1];
    const cell = this.cells[dnaHash][agentPubKey];

    if (!cell)
      throw new Error(`No cells existst with cellId ${dnaHash}:${agentPubKey}`);

    return cell.callZomeFn({
      zome: args.zome,
      cap: args.cap,
      fnName: args.fnName,
      payload: args.payload,
      provenance: agentPubKey,
    });
  }
}
