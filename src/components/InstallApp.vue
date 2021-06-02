<template>
  <input
    type="file"
    name="Install App"
    @change="installApp($event.target.name, $event.target.files[0])"
    accept=".happ"
    class="input-file"
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Actions } from "@/store/actions";
import { fileToHappBundle } from "@/processors/happ-bundle";
import { VUEX_MODULE } from "@/constants";

export default defineComponent({
  name: "InstallApp",
  methods: {
    async installApp(name: string, app: File) {
      const appBundle = await fileToHappBundle(app);
      this.$store.dispatch(`${VUEX_MODULE}/${Actions.installApp}`, appBundle);
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
  font-size: 24px;
}

.cell-row {
  margin-top: 8px;
}
</style>
