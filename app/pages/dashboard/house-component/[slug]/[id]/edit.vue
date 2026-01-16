<script lang="ts" setup>
import type { InsertMaintenanceLog } from "~~/lib/db/schema";

const route = useRoute();
const houseComponentsStore = useHouseComponentsStore();
const {
  currentMaintenanceLog: maintenanceLog,
} = storeToRefs(houseComponentsStore);
const { $csrfFetch } = useNuxtApp();

async function onSubmit(values: InsertMaintenanceLog) {
  await $csrfFetch(`/api/house-components/${route.params.slug}/${route.params.id}`, {
    method: "put",
    body: values,
  });
}

async function onSubmitComplete() {
  navigateTo({
    name: "dashboard-house-component-slug-id",
    params: {
      slug: route.params.slug,
      id: route.params.id,
    },
  });
}
</script>

<template>
  <MaintenanceLogForm
    v-if="maintenanceLog"
    submit-label="Update Maintenance Log"
    submit-icon="tabler:home-up"
    :on-submit
    :on-submit-complete
    :initial-values="maintenanceLog"
  />
</template>
