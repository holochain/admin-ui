import { Plugin } from "vue";

declare const HcAdminPlugin: Plugin;
export default HcAdminPlugin;

export { ActionTypes } from "./src/store/actions";
export * from "./src/processors/happ-bundle";
export { ADMIN_UI_MODULE } from "./src/constants";
