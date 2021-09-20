import { createApp } from "vue";
import { createStore } from "vuex";
import App from "./App.vue";
import { AdminWebsocket, AppWebsocket } from "@holochain/conductor-api";
import HcAdminPlugin from "./index";

async function setup() {
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
