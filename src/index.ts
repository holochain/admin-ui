import { AdminWebsocket } from "@holochain/client";
import { App } from "vue";
import { Store } from "vuex";
import InstalledApps from "./components/InstalledApps.vue"; // @ is an alias to /src
import { hcAdminVuexModule } from "./store";
import { ADMIN_UI_MODULE } from "./constants";
import { ActionTypes } from "./store/actions";
import "@material/mwc-button";
import "@material/mwc-icon-button";
import "@material/mwc-dialog";
import "@material/mwc-circular-progress";
import "@ui5/webcomponents/dist/Card.js";

export default {
  ActionTypes: ActionTypes,
  ADMIN_UI_MODULE,
  install(
    app: App,
    options: {
      adminWebsocket: AdminWebsocket;
      store: Store<any>;
    }
  ) {
    if (!options.adminWebsocket)
      throw new Error(
        `Failed to load the plugin: no "adminWebsocket" was provided in the plugin options`
      );
    if (!options.store)
      throw new Error(
        `Failed to load the plugin: no Vuex "store" was provided in the plugin options`
      );

    options.store.registerModule(
      ADMIN_UI_MODULE,
      hcAdminVuexModule(options.adminWebsocket)
    );

    app.component("InstalledApps", InstalledApps);
  },
};
