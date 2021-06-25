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
        <div class="row">
          <span class="app-title">{{ app.installed_app_id }}</span>
          <button
            v-if="isAppActive(app)"
            @click="$emit('openApp', app.installed_app_id)"
            style="margin-left: 8px"
          >
            Open
          </button>
          <button
            v-if="isAppActive(app)"
            @click="deactivateApp(app.installed_app_id)"
            style="margin-left: 8px"
          >
            Deactivate
          </button>
          <div v-else class="row center">
            <span style="margin-left: 8px"
              >Inactive: {{ getDeactivationReason(app) }}</span
            >
            <button
              @click="activateApp(app.installed_app_id)"
              style="margin-left: 8px"
            >
              Activate
            </button>
          </div>
        </div>

        <div
          class="cell-row row"
          v-for="cellData in app.cell_data"
          :key="[...cellData.cell_id[0], ...cellData.cell_id[1]]"
        >
          <span>{{ cellData.cell_nick }}</span>
          <span style="opacity: 0.6"
            >Dna: {{ serializeHash(cellData.cell_id[0]) }}, PubKey:
            {{ serializeHash(cellData.cell_id[1]) }}</span
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
import { DeactivationReason, InstalledAppInfo } from "@holochain/conductor-api";

export default defineComponent({
  name: "InstalledApps",
  data() {
    return {
      ADMIN_UI_MODULE,
    };
  },
  emits: ["openApp", "appDeactivated", "appActivated"],
  created() {
    this.$store.dispatch(
      `${ADMIN_UI_MODULE}/${ActionTypes.fetchInstalledApps}`
    );
  },
  methods: {
    deserializeHash,
    serializeHash,
    isAppActive(appInfo: InstalledAppInfo): boolean {
      return Object.keys(appInfo.status).includes("active");
    },
    getDeactivationReason(appInfo: InstalledAppInfo): string {
      const reason = (
        appInfo.status as {
          inactive: {
            reason: DeactivationReason;
          };
        }
      ).inactive.reason;

      if (Object.keys(reason).includes("never_activated")) {
        return "this app was never activated";
      } else if (Object.keys(reason).includes("normal")) {
        return "this app was deactivated by the user";
      } else {
        return `there was an error with this app: ${
          (
            reason as {
              quarantined: {
                error: string;
              };
            }
          ).quarantined.error
        }`;
      }
    },
    async activateApp(appId: string) {
      await this.$store.dispatch(
        `${ADMIN_UI_MODULE}/${ActionTypes.activateApp}`,
        appId
      );
      this.$emit("appActivated", appId);
    },
    async deactivateApp(appId: string) {
      await this.$store.dispatch(
        `${ADMIN_UI_MODULE}/${ActionTypes.deactivateApp}`,
        appId
      );

      this.$emit("appDeactivated", appId);
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
