import { AdminWebsocket, AppWebsocket } from "@holochain/conductor-api";
import { App } from "vue";
import { Store } from "vuex";
import ActiveApps from "@/components/ActiveApps.vue"; // @ is an alias to /src
import { hcAdminVuexModule } from "./store";
import { ADMIN_UI_MODULE } from "./constants";
import { ActionTypes } from "./store/actions";
import { fileToHappBundle } from "./processors/happ-bundle";

export default {
  ActionTypes: ActionTypes,
  processors: { fileToHappBundle },
  ADMIN_UI_MODULE,
  install(
    app: App,
    options: {
      appWebsocket: AppWebsocket;
      adminWebsocket: AdminWebsocket;
      store: Store<any>;
    }
  ) {
    if (!options.adminWebsocket)
      throw new Error(
        `Failed to load the plugin: no "adminWebsocket" was provided in the plugin options`
      );
    if (!options.appWebsocket)
      throw new Error(
        `Failed to load the plugin: no "appWebsocket" was provided in the plugin options`
      );
    if (!options.store)
      throw new Error(
        `Failed to load the plugin: no Vuex "store" was provided in the plugin options`
      );

    options.store.registerModule(
      ADMIN_UI_MODULE,
      hcAdminVuexModule(options.adminWebsocket, options.appWebsocket)
    );

    app.component("ActiveApps", ActiveApps);
  },
};
