import { deserializeHash, serializeHash } from "@holochain-open-dev/core-types";
import { InstalledAppInfo } from "@holochain/client";
import "@shoelace-style/shoelace/dist/themes/light.css";
import "@shoelace-style/shoelace/dist/components/tag/tag.js";
declare const _default: import("vue").DefineComponent<{}, {}, {
    ADMIN_UI_MODULE: string;
    showInfoDialogForAppId: string | undefined;
}, {}, {
    deserializeHash: typeof deserializeHash;
    serializeHash: typeof serializeHash;
    isAppRunning(appInfo: InstalledAppInfo): boolean;
    isAppDisabled(appInfo: InstalledAppInfo): boolean;
    isAppPaused(appInfo: InstalledAppInfo): boolean;
    getReason(appInfo: InstalledAppInfo): string | undefined;
    enableApp(appId: string): Promise<void>;
    disableApp(appId: string): Promise<void>;
    startApp(appId: string): Promise<void>;
    uninstallApp(appId: string): Promise<void>;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("openApp" | "disableApp" | "enableApp" | "startApp" | "uninstallApp")[], "openApp" | "disableApp" | "enableApp" | "startApp" | "uninstallApp", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<{} & {} & {}> & {
    onOpenApp?: ((...args: any[]) => any) | undefined;
    onDisableApp?: ((...args: any[]) => any) | undefined;
    onEnableApp?: ((...args: any[]) => any) | undefined;
    onStartApp?: ((...args: any[]) => any) | undefined;
    onUninstallApp?: ((...args: any[]) => any) | undefined;
}, {}>;
export default _default;
