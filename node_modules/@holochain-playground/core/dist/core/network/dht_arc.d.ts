export interface DhtArc {
    center_loc: number;
    half_length: number;
}
export declare function contains(dht_arc: DhtArc, location: number): boolean;
