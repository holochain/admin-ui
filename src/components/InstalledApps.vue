<template>
  <div class="column">
    <span v-if="$store.state.admin.installedApps.loading">Loading...</span>
    <span class="title" style="margin-bottom: 16px">Installed apps</span>

    <span v-if="$store.state.admin.installedApps.loading">Loading...</span>
    <div v-else>
      <span v-if="$store.getters[`${ADMIN_UI_MODULE}/allApps`].length === 0"
        >You don't have any apps installed yet</span
      >
      <div
        v-else
        v-for="app in $store.getters[`${ADMIN_UI_MODULE}/allApps`]"
        :key="app.installed_app_id"
        class="app-row column"
      >
        <div class="row center">
          <span class="app-title">{{ app.installed_app_id }}</span>
          <span style="margin-left: 8px"
            >{{ getStatus(app)
            }}<span v-if="getReason(app)">: {{ getReason(app) }}</span></span
          >

          <button
            v-if="isAppRunning(app)"
            @click="$emit('openApp', app.installed_app_id)"
            style="margin-left: 8px"
          >
            Open
          </button>
          <button
            v-if="!isAppDisabled(app)"
            @click="disableApp(app.installed_app_id)"
            style="margin-left: 8px"
          >
            Disable
          </button>
          <button
            v-if="isAppDisabled(app)"
            @click="enableApp(app.installed_app_id)"
            style="margin-left: 8px"
          >
            Enable
          </button>
          <button
            v-if="isAppPaused(app)"
            @click="startApp(app.installed_app_id)"
            style="margin-left: 8px"
          >
            Start
          </button>
          <button
            @click="uninstallApp(app.installed_app_id)"
            style="margin-left: 8px"
          >
            Uninstall
          </button>
        </div>

        <div
          class="cell-row row"
          v-for="cellData in app.cell_data"
          :key="[...cellData.cell_id[0], ...cellData.cell_id[1]]"
        >
          <span>Cell Nick: {{ cellData.cell_nick }}</span>
          <span style="opacity: 0.6; margin-left: 8px"
            >Dna: {{ serializeHash(cellData.cell_id[0]) }}</span
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ActionTypes } from "@/store/actions";
import { ADMIN_UI_MODULE } from "@/constants";
import { deserializeHash, serializeHash } from "@holochain-open-dev/core-types";
import { DisabledAppReason, InstalledAppInfo } from "@holochain/conductor-api";

export default defineComponent({
  name: "InstalledApps",
  data() {
    return {
      ADMIN_UI_MODULE,
    };
  },
  emits: ["openApp", "appDisabled", "appEnabled", "appStarted", "uninstallApp"],
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
    getStatus(appInfo: InstalledAppInfo) {
      if (this.isAppRunning(appInfo)) return "Running";
      if (this.isAppDisabled(appInfo)) return "Disabled";
      if (this.isAppPaused(appInfo)) return "Paused";
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
          return "this app was never started";
        } else if (Object.keys(reason).includes("user")) {
          return "this app was disabled by the user";
        } else {
          return `there was an error with this app: ${
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
      await this.$store.dispatch(
        `${ADMIN_UI_MODULE}/${ActionTypes.enableApp}`,
        appId
      );
      this.$emit("appEnabled", appId);
    },
    async disableApp(appId: string) {
      await this.$store.dispatch(
        `${ADMIN_UI_MODULE}/${ActionTypes.disableApp}`,
        appId
      );

      this.$emit("appDisabled", appId);
    },
    async startApp(appId: string) {
      await this.$store.dispatch(
        `${ADMIN_UI_MODULE}/${ActionTypes.startApp}`,
        appId
      );
      this.$emit("appStarted", appId);
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
  flex: 1;
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
