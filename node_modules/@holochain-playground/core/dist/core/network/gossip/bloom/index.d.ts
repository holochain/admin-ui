import { P2pCell } from '../../p2p-cell';
export declare const GOSSIP_INTERVAL_MS = 500;
export declare class SimpleBloomMod {
    protected p2pCell: P2pCell;
    gossip_on: boolean;
    lastBadActions: number;
    constructor(p2pCell: P2pCell);
    loop(): Promise<void>;
    run_one_iteration(): Promise<void>;
}
