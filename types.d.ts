import { AppBundle } from "@holochain/client";
import { Plugin } from "vue";

declare const HcAdminPlugin: Plugin & {
  ActionTypes: { [key: string]: string };
  processors: {
    fileToHappBundle: (file: File) => Promise<AppBundle>;
  };
  ADMIN_UI_MODULE: string;
};
export default HcAdminPlugin;
