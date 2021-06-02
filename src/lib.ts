import { AdminWebsocket, AppWebsocket } from "@holochain/conductor-api";
import { App, createApp } from "vue";
import { Store } from "vuex";
import ActiveApps from "@/components/ActiveApps.vue"; // @ is an alias to /src
import InstallApp from "@/components/InstallApp.vue"; // @ is an alias to /src
import { hcAdminVuexModule } from "./store";
import { VUEX_MODULE } from "./constants";

//createApp(App).use(store).use(router).mount("#app");

export default {
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
      VUEX_MODULE,
      hcAdminVuexModule(options.adminWebsocket, options.appWebsocket)
    );

    app.component("ActiveApps", ActiveApps);
    app.component("InstallApp", InstallApp);
  },
};
