import { Module } from "vuex";
import { AdminWebsocket, AppWebsocket, InstalledAppInfo } from "@holochain/conductor-api";
export interface HcAdminState {
    installedApps: {
        loading: boolean;
        appsInfo: Array<InstalledAppInfo>;
    };
}
export declare function hcAdminVuexModule(adminWebsocket: AdminWebsocket, appWebsocket: AppWebsocket): Module<HcAdminState, {
    admin: HcAdminState;
}>;
