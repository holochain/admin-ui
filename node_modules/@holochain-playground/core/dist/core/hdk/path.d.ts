import { Hdk } from './context';
export declare const ensure: (hdk: Hdk) => (path: string) => Promise<void>;
export interface Path {
    ensure: (path: string) => Promise<void>;
}
