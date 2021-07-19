import { createStore, Module } from "vuex";
import {
  AdminWebsocket,
  AppBundle,
  AppWebsocket,
  InstalledAppInfo,
} from "@holochain/conductor-api";
import { ActionTypes } from "./actions";

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
      async enableApp(context, appId: string) {
        await adminWebsocket.enableApp({ installed_app_id: appId });

        await context.dispatch(ActionTypes.fetchInstalledApps);
      },
      async disableApp(context, appId: string) {
        await adminWebsocket.disableApp({ installed_app_id: appId });
        await context.dispatch(ActionTypes.fetchInstalledApps);
      },
      async startApp(context, appId: string) {
        await adminWebsocket.startApp({ installed_app_id: appId });
        await context.dispatch(ActionTypes.fetchInstalledApps);
      },
      async installApp(
        context,
        { appBundlePath, appId }: { appId: string; appBundlePath: string }
      ) {
        const agentPubKey = await adminWebsocket.generateAgentPubKey();

        await adminWebsocket.installAppBundle({
          path: appBundlePath,
          installed_app_id: appId,
          membrane_proofs: {},
          agent_key: agentPubKey,
        });

        await adminWebsocket.activateApp({ installed_app_id: appId });

        context.dispatch(ActionTypes.fetchInstalledApps);
      },
    },
  };
}
