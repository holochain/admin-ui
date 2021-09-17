import { AnyDhtHashB64 } from '@holochain-open-dev/core-types';
export declare enum HashType {
    AGENT = 0,
    ENTRY = 1,
    DHTOP = 2,
    HEADER = 3,
    DNA = 4
}
export declare const AGENT_PREFIX = "hCAk";
export declare const ENTRY_PREFIX = "hCEk";
export declare const DHTOP_PREFIX = "hCQk";
export declare const DNA_PREFIX = "hC0k";
export declare const HEADER_PREFIX = "hCkk";
export declare function hash(content: any, type: HashType): AnyDhtHashB64;
export declare function location(hash: string): number;
export declare function distance(hash1: AnyDhtHashB64, hash2: AnyDhtHashB64): number;
export declare function shortest_arc_distance(location1: number, location2: number): number;
export declare function wrap(uint: number): number;
export declare function getHashType(hash: AnyDhtHashB64): HashType;
