import { AdminWebsocket } from "@holochain/conductor-api";
import { App } from "vue";
import { Store } from "vuex";
import "@material/mwc-button";
import "@material/mwc-icon-button";
import "@material/mwc-dialog";
import "@material/mwc-circular-progress";
import "@ui5/webcomponents/dist/Card.js";
declare const _default: {
    ActionTypes: {
        fetchInstalledApps: string;
    };
    ADMIN_UI_MODULE: string;
    install(app: App, options: {
        adminWebsocket: AdminWebsocket;
        store: Store<any>;
    }): void;
};
export default _default;
