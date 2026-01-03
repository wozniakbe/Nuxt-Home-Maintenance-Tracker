<script lang="ts" setup>
import type { InsertHouseComponent } from "~~/lib/db/schema";

const route = useRoute();

const houseComponentsStore = useHouseComponentsStore();
const { $csrfFetch } = useNuxtApp();

async function onSubmit(values: InsertHouseComponent) {
  await $csrfFetch(`/api/house-components/${route.params.slug}`, {
    method: "put",
    body: values,
  });
}

function onSubmitComplete() {
  navigateTo({
    name: "dashboard-house-component-slug",
    params: { slug: route.params.slug },
  });
}
</script>

<template>
  <HouseComponentForm
    v-if="houseComponentsStore.currentHouseComponentStatus !== 'pending'"
    :on-submit
    :on-submit-complete
    :initial-values="houseComponentsStore.currentHouseComponent"
    submit-label="Update"
    submit-icon="tabler:home-up"
  />
</template>
