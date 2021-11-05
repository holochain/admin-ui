import { Module } from "vuex";
import { AdminWebsocket, InstalledAppInfo } from "@holochain/conductor-api";
export interface HcAdminState {
    installedApps: {
        loading: boolean;
        appsInfo: Array<InstalledAppInfo>;
    };
}
export declare function hcAdminVuexModule(adminWebsocket: AdminWebsocket): Module<HcAdminState, {
    admin: HcAdminState;
}>;
