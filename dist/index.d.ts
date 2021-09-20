import { AdminWebsocket, AppWebsocket } from "@holochain/conductor-api";
import { App } from "vue";
import { Store } from "vuex";
import "@material/mwc-button";
import "@authentic/mwc-card";
import "@material/mwc-circular-progress";
import "@material/mwc-snackbar";
declare const _default: {
    ActionTypes: {
        fetchInstalledApps: string;
    };
    ADMIN_UI_MODULE: string;
    install(app: App, options: {
        appWebsocket: AppWebsocket;
        adminWebsocket: AdminWebsocket;
        store: Store<any>;
    }): void;
};
export default _default;
