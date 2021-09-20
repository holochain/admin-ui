import { Module } from "vuex";
import {
  AdminWebsocket,
  AppWebsocket,
  InstalledAppInfo,
} from "@holochain/conductor-api";

export interface HcAdminState {
  installedApps: { loading: boolean; appsInfo: Array<InstalledAppInfo> };
}

export function hcAdminVuexModule(
  adminWebsocket: AdminWebsocket,
  appWebsocket: AppWebsocket
): Module<HcAdminState, { admin: HcAdminState }> {
  return {
    namespaced: true,
    state() {
      return {
        installedApps: {
          loading: false,
          appsInfo: [],
        },
      };
    },
    getters: {
      allApps(state) {
        return state.installedApps.appsInfo;
      },
    },
    mutations: {
      loadAppsInfo(state) {
        state.installedApps.loading = true;
      },
      setAppsInfo(state, activeApps) {
        state.installedApps.appsInfo = activeApps;
        state.installedApps.loading = false;
      },
    },
    actions: {
      async fetchInstalledApps({ commit }) {
        commit("loadAppsInfo");
        const appsInfos = await adminWebsocket.listApps({});

        commit("setAppsInfo", appsInfos);
      },
    },
  };
}
