<template>
  <div
    v-if="$store.state.admin.installedApps.loading"
    style="flex: 1; display: flex; align-items: center; justify-content: center"
  >
    <mwc-circular-progress></mwc-circular-progress>
  </div>
  <div v-else>
    <div class="column">
      <span class="title" style="margin-bottom: 16px">Installed apps</span>
      <span v-if="$store.getters[`${ADMIN_UI_MODULE}/allApps`].length === 0"
        >You don't have any apps installed yet</span
      >
      <div
        v-else
        v-for="app in $store.getters[`${ADMIN_UI_MODULE}/allApps`]"
        :key="app.installed_app_id"
        class="app-row column"
      >
        <mwc-card style="width: auto">
          <div class="row" style="flex: 1; padding: 8px">
            <div class="column" style="flex: 1">
              <span class="app-title">{{ app.installed_app_id }}</span>

              <div
                class="cell-row row"
                v-for="cellData in app.cell_data"
                :key="[...cellData.cell_id[0], ...cellData.cell_id[1]]"
                style="align-items: center"
              >
                <span>{{ cellData.cell_nick }}</span>
                <span style="opacity: 0.7; margin-left: 8px">Dna Hash:</span
                ><copyable-hash
                  style="margin-left: 8px"
                  :hash="serializeHash(cellData.cell_id[0])"
                ></copyable-hash>
              </div>
            </div>

            <div class="column">
              <div class="row center">
                <span style="margin-right: 8px; opacity: 0.7">Public Key:</span>
                <copyable-hash
                  :hash="serializeHash(app.cell_data[0].cell_id[1])"
                  style="margin-right: 16px"
                ></copyable-hash>

                <sl-tag type="success" v-if="isAppRunning(app)">Running</sl-tag>
                <sl-tag type="warning" v-if="isAppPaused(app)">Paused</sl-tag>
                <sl-tag type="danger" v-if="isAppDisabled(app)"
                  >Disabled</sl-tag
                >
              </div>
              <span
                v-if="getReason(app)"
                style="align-self: end; margin-top: 8px"
              >
                {{ getReason(app) }}</span
              >

              <div class="row center" style="align-self: end; margin-top: 8px">
                <mwc-button
                  v-if="isAppRunning(app)"
                  @click="$emit('openApp', app.installed_app_id)"
                  style="margin-left: 8px"
                  label="Open"
                >
                </mwc-button>
                <mwc-button
                  v-if="!isAppDisabled(app)"
                  @click="disableApp(app.installed_app_id)"
                  style="margin-left: 8px"
                  label="Disable"
                >
                </mwc-button>
                <mwc-button
                  v-if="isAppDisabled(app)"
                  @click="enableApp(app.installed_app_id)"
                  style="margin-left: 8px"
                  label="Enable"
                >
                </mwc-button>
                <mwc-button
                  v-if="isAppPaused(app)"
                  @click="startApp(app.installed_app_id)"
                  style="margin-left: 8px"
                  label="Start"
                >
                </mwc-button>
                <mwc-button
                  @click="uninstallApp(app.installed_app_id)"
                  style="margin-left: 8px"
                  label="Uninstall"
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.app-row {
  margin-bottom: 16px;
}

.app-title {
  font-size: 1.3em;
}

.cell-row {
  margin-top: 8px;
}

.column {
  display: flex;
  flex-direction: column;
}

.title {
  font-size: 1.5em;
}

.row {
  display: flex;
  flex-direction: row;
}

.center {
  align-items: center;
  justify-content: center;
}
</style>
