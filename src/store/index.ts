import { createStore, Module } from "vuex";
import {
  AdminWebsocket,
  AppWebsocket,
  InstalledAppInfo,
} from "@holochain/conductor-api";
import { Dictionary } from "@/types";

export interface HcAdminState {
  activeApps: { loading: boolean; appsInfo: Dictionary<InstalledAppInfo> };
}

export function hcAdminVuexModule(
  adminWebsocket: AdminWebsocket,
  appWebsocket: AppWebsocket
): Module<HcAdminState, { admin: HcAdminState }> {
  return {
    state() {
      return {
        activeApps: {
          loading: false,
          appsInfo: {},
        },
      };
    },
    mutations: {
      loadAppsInfo(state) {
        state.activeApps.loading = true;
      },
      setAppsInfo(state, activeApps) {
        state.activeApps.appsInfo = activeApps;
        state.activeApps.loading = false;
      },
    },
    actions: {
      async fetchActiveHapps({ commit }) {
        commit("loadAppsInfo");
        const activeAppsIds = await adminWebsocket.listActiveApps();

        const promises = activeAppsIds.map((appId) =>
          appWebsocket.appInfo({ installed_app_id: appId })
        );

        const activeApps = await Promise.all(promises);

        const apps: Dictionary<InstalledAppInfo> = {};

        for (const app of activeApps) {
          apps[app.installed_app_id] = app;
        }

        commit("setAppsInfo", apps);
      },
    },
  };
}
