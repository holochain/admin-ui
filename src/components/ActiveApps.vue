<template>
  <div class="column">
    <span class="title" style="margin-bottom: 16px">Installed apps</span>

    <span v-if="$store.state.admin.activeApps.loading">Loading...</span>
    <div v-else>
      <span
        v-if="$store.getters[`${ADMIN_UI_MODULE}/allActiveApps`].length === 0"
        >You don't have any apps installed yet</span
      >
      <div
        v-else
        v-for="activeApp in $store.getters[`${ADMIN_UI_MODULE}/allActiveApps`]"
        :key="activeApp.installed_app_id"
        class="app-row column"
      >
        <div class="row">
          <span class="app-title">{{ activeApp.installed_app_id }}</span>
          <button @click="$emit('launchApp', activeApp.installed_app_id)">
            Launch
          </button>
        </div>

        <div
          class="cell-row"
          v-for="cellData in activeApp.cell_data"
          :key="[...cellData.cell_id[0], ...cellData.cell_id[0]]"
        >
          <span>{{ cellData.cell_nick }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { ActionTypes } from "@/store/actions";
import { ADMIN_UI_MODULE } from "@/constants";
import { deserializeHash } from "@holochain-open-dev/core-types";

export default defineComponent({
  name: "ActiveApps",
  data() {
    return {
      ADMIN_UI_MODULE,
    };
  },
  emits: ["launchApp"],
  created() {
    this.$store.dispatch(`${ADMIN_UI_MODULE}/${ActionTypes.fetchActiveApps}`);
  },
  methods: { deserializeHash },
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
</style>
