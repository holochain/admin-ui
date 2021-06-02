<template>
  <span v-if="$store.admin.activeApps.loading">Loading...</span>
  <div v-else>{{ Object.keys($store.admin.activeApps.appsInfo).length }}</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Actions } from "@/store/actions";

export default defineComponent({
  name: "ActiveApps",
  props: {
    msg: String,
  },
  created() {
    this.$store.dispatch(Actions.fetchActiveHapps);
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
