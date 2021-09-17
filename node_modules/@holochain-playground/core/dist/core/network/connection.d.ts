import { AgentPubKeyB64 } from '@holochain-open-dev/core-types';
import { Cell } from '../cell';
import { NetworkRequest } from './network-request';
export declare class Connection {
    opener: Cell;
    receiver: Cell;
    private _closed;
    get closed(): boolean;
    close(): void;
    constructor(opener: Cell, receiver: Cell);
    sendRequest<T>(fromAgent: AgentPubKeyB64, networkRequest: NetworkRequest<T>): Promise<T>;
    getPeer(myAgentPubKeyB64: AgentPubKeyB64): Cell;
}
