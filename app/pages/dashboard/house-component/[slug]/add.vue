<script lang="ts" setup>
import type { InsertMaintenanceLog } from "~~/lib/db/schema";

const route = useRoute();
const { $csrfFetch } = useNuxtApp();

async function onSubmit(values: InsertMaintenanceLog) {
  await $csrfFetch(`/api/house-components/${route.params.slug}/maintenance-logs`, {
    method: "post",
    body: values,
  });
}

async function onSubmitComplete() {
  navigateTo({
    name: "dashboard-house-component-slug",
    params: {
      slug: route.params.slug,
    },
  });
}
</script>

<template>
  <MaintenanceLogForm
    submit-label="Add Maintenance Log"
    submit-icon="tabler:circle-plus-filled"
    :on-submit
    :on-submit-complete
  />
</template>
