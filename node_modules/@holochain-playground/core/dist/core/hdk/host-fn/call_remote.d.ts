import { AgentPubKeyB64, CapSecret } from '@holochain-open-dev/core-types';
import { HostFn } from '../host-fn';
export declare type CallRemoteFn = (args: {
    agent: AgentPubKeyB64;
    zome: string;
    fn_name: string;
    cap_secret: CapSecret | undefined;
    payload: any;
}) => Promise<any>;
export declare const call_remote: HostFn<CallRemoteFn>;
