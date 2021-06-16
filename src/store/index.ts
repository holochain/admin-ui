import { createStore, Module } from "vuex";
import {
  AdminWebsocket,
  AppBundle,
  AppWebsocket,
  InstalledAppInfo,
} from "@holochain/conductor-api";
import { Dictionary } from "@/types";
import { ActionTypes } from "./actions";

export interface HcAdminState {
  installedApps: { loading: boolean; appsInfo: Dictionary<InstalledAppInfo> };
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
          appsInfo: {},
        },
      };
    },
    getters: {
      allApps(state) {
        return Object.values(state.installedApps.appsInfo);
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
        const activeAppsIds = await adminWebsocket.listActiveApps();
        const inactiveAppsIds = await adminWebsocket.listInactiveApps();

        const promises = [...activeAppsIds, ...inactiveAppsIds].map((appId) =>
          appWebsocket.appInfo({ installed_app_id: appId })
        );

        const installedApps = await Promise.all(promises);

        const apps: Dictionary<InstalledAppInfo> = {};
        for (const app of installedApps) {
          apps[app.installed_app_id] = app;
        }

        commit("setAppsInfo", apps);
      },
      async activateApp(context, appId: string) {
        await adminWebsocket.activateApp({ installed_app_id: appId });

        await context.dispatch(ActionTypes.fetchInstalledApps);
      },
      async deactivateApp(context, appId: string) {
        await adminWebsocket.deactivateApp({ installed_app_id: appId });
        context.dispatch(ActionTypes.fetchInstalledApps);
      },
      async installApp(context, appBundle: AppBundle) {
        const agentPubKey = await adminWebsocket.generateAgentPubKey();
        const installed_app_id = appBundle.manifest.name;
        await adminWebsocket.installAppBundle({
          bundle: appBundle,
          installed_app_id,
          membrane_proofs: {},
          agent_key: agentPubKey,
        });

        await adminWebsocket.activateApp({ installed_app_id });

        context.dispatch(ActionTypes.fetchInstalledApps);
      },
    },
  };
}
