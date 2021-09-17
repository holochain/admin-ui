import { createApp } from "vue";
import { createStore } from "vuex";
import App from "./App.vue";
import { AdminWebsocket, AppWebsocket } from "@holochain/conductor-api";
import HcAdminPlugin from "./lib";
import { CopyableHash } from "@holochain-playground/elements";
import "@material/mwc-button";
import "@authentic/mwc-card";
import "@material/mwc-circular-progress";

async function setup() {
  customElements.define("copyable-hash", CopyableHash);
  const adminWebsocket = await AdminWebsocket.connect(`ws://localhost:8889`);

  const appWebsocket = await connectAppWebsocket(adminWebsocket);

  const store = createStore({
    state: {},
    mutations: {},
    actions: {},
    modules: {},
  });

  createApp(App)
    .use(store)
    .use(HcAdminPlugin, { store, appWebsocket, adminWebsocket })
    .mount("#app");
}

async function connectAppWebsocket(adminWebsocket: AdminWebsocket) {
  const appInterfaces = await adminWebsocket.listAppInterfaces();

  let port = appInterfaces[0];
  if (appInterfaces.length === 0) {
    await adminWebsocket.attachAppInterface({ port: 8888 });
    port = 8888;
  }

  return AppWebsocket.connect(`ws://localhost:${port}`);
}

setup();
