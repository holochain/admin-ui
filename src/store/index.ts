import { createStore, Module } from "vuex";
import {
  AdminWebsocket,
  AppBundle,
  AppWebsocket,
  InstalledAppInfo,
} from "@holochain/conductor-api";
import { Dictionary } from "@/types";
import { Actions } from "./actions";
import { VUEX_MODULE } from "@/constants";

export interface HcAdminState {
  activeApps: { loading: boolean; appsInfo: Dictionary<InstalledAppInfo> };
}

export function hcAdminVuexModule(
  adminWebsocket: AdminWebsocket,
  appWebsocket: AppWebsocket
): Module<HcAdminState, { admin: HcAdminState }> {
  return {
    namespaced: true,
    state() {
      return {
        activeApps: {
          loading: false,
          appsInfo: {},
        },
      };
    },
    getters: {
      allActiveApps(state) {
        return Object.values(state.activeApps.appsInfo);
      },
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
      async fetchActiveApps({ commit }) {
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
        console.log(apps, activeAppsIds);

        commit("setAppsInfo", apps);
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

        context.dispatch(`${Actions.fetchActiveApps}`);
      },
    },
  };
}
