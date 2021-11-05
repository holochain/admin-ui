import { Module } from "vuex";
import { AdminWebsocket, InstalledAppInfo } from "@holochain/conductor-api";

export interface HcAdminState {
  installedApps: { loading: boolean; appsInfo: Array<InstalledAppInfo> };
}

export function hcAdminVuexModule(
  adminWebsocket: AdminWebsocket
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
        // Sort apps alphabetically
        return state.installedApps.appsInfo.sort((app1, app2) => {
          if (app1.installed_app_id < app2.installed_app_id) {
            return -1;
          }
          if (app1.installed_app_id > app2.installed_app_id) {
            return 1;
          }
          return 0;
        });
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
