<template>
  <div
    v-if="$store.state.admin.installedApps.loading"
    style="flex: 1; display: flex; align-items: center; justify-content: center"
  >
    <mwc-circular-progress indeterminate></mwc-circular-progress>
  </div>
  <div v-else>
    <div style="display: flex; flex: 1; flex-direction: column">
      <span style="margin-bottom: 16px; font-size: 1.5em">Installed apps</span>
      <div
        v-if="$store.getters[`${ADMIN_UI_MODULE}/allApps`].length === 0"
        style="
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        "
      >
        <span>You don't have any apps installed yet</span>
      </div>
      <div
        v-else
        v-for="app in $store.getters[`${ADMIN_UI_MODULE}/allApps`]"
        :key="app.installed_app_id"
        style="display: flex; flex-direction: column; margin-bottom: 16px"
      >
        <mwc-card style="width: auto">
          <div
            style="display: flex; flex-direction: row; flex: 1; padding: 8px"
          >
            <div style="flex: 1; display: flex; flex-direction: column">
              <span style="font-size: 1.3em">{{ app.installed_app_id }}</span>

              <table style="width: 350px; text-align: left; margin-top: 12px">
                <tr>
                  <th>Cell Nick</th>
                  <th>Dna Hash</th>
                </tr>

                <tr
                  style=""
                  v-for="cellData in app.cell_data"
                  :key="[...cellData.cell_id[0], ...cellData.cell_id[1]]"
                >
                  <td>
                    <span>{{ cellData.cell_nick }}</span>
                  </td>
                  <td>
                    <span style="opacity: 0.7; font-family: monospace;">{{
                      serializeHash(cellData.cell_id[0]).substring(0,  14)
                    }}</span>
                  </td>
                </tr>
              </table>
            </div>

            <div
              style="
                display: flex;
                flex-direction: column;
                align-items: flex-end;
              "
            >
              <div
                style="
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: center;
                "
              >
                <span style="margin-right: 8px; opacity: 0.9"
                  >Your Public Key:</span
                >
                <span style="margin-right: 16px; opacity: 0.7; font-family: monospace;">{{
                  serializeHash(app.cell_data[0].cell_id[1]).substring(0,  14)
                }}</span>

                <sl-tag type="success" v-if="isAppRunning(app)">Running</sl-tag>
                <sl-tag type="warning" v-if="isAppPaused(app)">Paused</sl-tag>
                <sl-tag type="danger" v-if="isAppDisabled(app)"
                  >Disabled</sl-tag
                >
              </div>
              <div style="flex: 1">
                <span
                  v-if="getReason(app)"
                  style="margin-top: 8px; max-width: 600px"
                >
                  {{ getReason(app) }}</span
                >
              </div>

              <div
                style="
                  display: flex;
                  flex-direction: row;
                  align-items: center;
                  justify-content: center;
                  margin-top: 8px;
                  --mdc-theme-primary: rgb(90, 90, 90);
                "
              >
                <mwc-button
                  @click="uninstallApp(app.installed_app_id)"
                  style="margin-left: 8px"
                  label="Uninstall"
                  icon="delete"
                >
                </mwc-button>

                <mwc-button
                  v-if="!isAppDisabled(app)"
                  @click="disableApp(app.installed_app_id)"
                  style="margin-left: 8px"
                  label="Disable"
                  icon="archive"
                >
                </mwc-button>
                <mwc-button
                  v-if="isAppDisabled(app)"
                  @click="enableApp(app.installed_app_id)"
                  style="margin-left: 8px"
                  label="Enable"
                  icon="unarchive"
                >
                </mwc-button>
                <mwc-button
                  v-if="isAppPaused(app)"
                  @click="startApp(app.installed_app_id)"
                  style="margin-left: 8px"
                  label="Start"
                  icon="play_arrow"
                >
                </mwc-button>

                <mwc-button
                  v-if="isAppRunning(app)"
                  @click="$emit('openApp', app.installed_app_id)"
                  style="margin-left: 8px"
                  label="Open"
                  icon="launch"
                >
                </mwc-button>
              </div>
            </div>
          </div>
        </mwc-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ActionTypes } from "../store/actions";
import { ADMIN_UI_MODULE } from "../constants";
import { deserializeHash, serializeHash } from "@holochain-open-dev/core-types";
import { DisabledAppReason, InstalledAppInfo } from "@holochain/conductor-api";
import "@shoelace-style/shoelace/dist/themes/light.css";
import "@shoelace-style/shoelace/dist/components/tag/tag.js";

export default defineComponent({
  name: "InstalledApps",
  data() {
    return {
      ADMIN_UI_MODULE,
    };
  },
  emits: ["openApp", "disableApp", "enableApp", "startApp", "uninstallApp"],
  created() {
    this.$store.dispatch(
      `${ADMIN_UI_MODULE}/${ActionTypes.fetchInstalledApps}`
    );
  },
  methods: {
    deserializeHash,
    serializeHash,
    isAppRunning(appInfo: InstalledAppInfo): boolean {
      return Object.keys(appInfo.status).includes("running");
    },
    isAppDisabled(appInfo: InstalledAppInfo): boolean {
      return Object.keys(appInfo.status).includes("disabled");
    },
    isAppPaused(appInfo: InstalledAppInfo): boolean {
      return Object.keys(appInfo.status).includes("paused");
    },
    getReason(appInfo: InstalledAppInfo): string | undefined {
      if (this.isAppRunning(appInfo)) return undefined;
      if (this.isAppDisabled(appInfo)) {
        const reason = (
          appInfo.status as unknown as {
            disabled: {
              reason: DisabledAppReason;
            };
          }
        ).disabled.reason;

        if (Object.keys(reason).includes("never_started")) {
          return "This app was never started";
        } else if (Object.keys(reason).includes("user")) {
          return "This app was disabled by the user";
        } else {
          return `There was an error with this app: ${
            (
              reason as {
                error: string;
              }
            ).error
          }`;
        }
      } else {
        return (
          appInfo.status as unknown as { paused: { reason: { error: string } } }
        ).paused.reason.error;
      }
    },
    async enableApp(appId: string) {
      this.$emit("enableApp", appId);
    },
    async disableApp(appId: string) {
      this.$emit("disableApp", appId);
    },
    async startApp(appId: string) {
      this.$emit("startApp", appId);
    },
    async uninstallApp(appId: string) {
      this.$emit("uninstallApp", appId);
    },
  },
});
</script>
<!-- We don't have scoped styles with classes because it becomes harder to export a reusable library -->