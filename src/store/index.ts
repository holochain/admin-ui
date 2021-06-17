import { createStore, Module } from "vuex";
import {
  AdminWebsocket,
  AppBundle,
  AppWebsocket,
  InstalledAppInfo,
  ListAppsResponse,
} from "@holochain/conductor-api";
import { ActionTypes } from "./actions";

export interface HcAdminState {
  installedApps: { loading: boolean; appsInfo: ListAppsResponse };
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
          appsInfo: {
            inactive_apps: [],
            active_apps: [],
          },
        },
      };
    },
    getters: {
      activeApps(state) {
        return state.installedApps.appsInfo.active_apps;
      },
      inactiveApps(state) {
        return state.installedApps.appsInfo.inactive_apps;
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
        const appsInfos = await adminWebsocket.listApps();

        commit("setAppsInfo", appsInfos);
      },
      async activateApp(context, appId: string) {
        await adminWebsocket.activateApp({ installed_app_id: appId });

        await context.dispatch(ActionTypes.fetchInstalledApps);
      },
      async deactivateApp(context, appId: string) {
        await adminWebsocket.deactivateApp({ installed_app_id: appId });
        await context.dispatch(ActionTypes.fetchInstalledApps);
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
