<template>
  <span v-if="$store.state.admin.activeApps.loading">Loading...</span>
  <div v-else>
    <div
      v-for="activeApp in $store.getters[`${VUEX_MODULE}/allActiveApps`]"
      :key="activeApp.installed_app_id"
      class="app-row"
    >
      <span class="app-title">{{ activeApp.installed_app_id }}</span>

      <div
        class="cell-row"
        v-for="cellData in activeApp.cell_data"
        :key="
          deserializeHash(cellData.cell_id[0]) +
          deserializeHash(cellData.cell_id[1])
        "
      >
        <span>{{ cellData.cell_nick }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Actions } from "@/store/actions";
import { VUEX_MODULE } from "@/constants";
import { deserializeHash } from "@holochain-open-dev/core-types";

export default defineComponent({
  name: "ActiveApps",
  data() {
    return {
      VUEX_MODULE,
    };
  },
  created() {
    this.$store.dispatch(`${VUEX_MODULE}/${Actions.fetchActiveApps}`);
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
  font-size: 24px;
}

.cell-row {
  margin-top: 8px;
}
</style>
