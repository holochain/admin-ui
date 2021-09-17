import { AgentPubKeyB64, AnyDhtHashB64, DHTOp, Dictionary, DnaHashB64 } from '@holochain-open-dev/core-types';
import { GetOptions } from '../../types';
import { Cell } from '../cell/cell';
export declare enum NetworkRequestType {
    CALL_REMOTE = "Call Remote",
    PUBLISH_REQUEST = "Publish Request",
    GET_REQUEST = "Get Request",
    WARRANT = "Warrant",
    GOSSIP = "Gossip",
    CONNECT = "Connect"
}
export declare type NetworkRequest<T> = (cell: Cell) => Promise<T>;
export interface NetworkRequestInfo<T extends NetworkRequestType, D> {
    dnaHash: DnaHashB64;
    fromAgent: AgentPubKeyB64;
    toAgent: AgentPubKeyB64;
    type: T;
    details: D;
}
export declare type PublishRequestInfo = NetworkRequestInfo<NetworkRequestType.PUBLISH_REQUEST, {
    dhtOps: Dictionary<DHTOp>;
}>;
export declare type GetRequestInfo = NetworkRequestInfo<NetworkRequestType.GET_REQUEST, {
    hash: AnyDhtHashB64;
    options: GetOptions;
}>;
export declare type CallRemoteRequestInfo = NetworkRequestInfo<NetworkRequestType.CALL_REMOTE, {}>;
