<script lang="ts" setup>
import type { InsertHouseComponent } from "~~/lib/db/schema";

const { $csrfFetch } = useNuxtApp();
async function onSubmit(values: InsertHouseComponent) {
  console.log(values);
  const result = await $csrfFetch("/api/house-components", {
    method: "post",
    body: values,
  });
  console.log(result);
}

function onSubmitComplete() {
  navigateTo("/dashboard");
}
</script>

<template>
  <div class="container mx-auto max-w-md p-4">
    <div class="my-4">
      <h1 class="text-lg">
        Add Maintenance Item
      </h1>
      <p class="text-sm">
        A maintenance item is something in your form that needs some form of recurring maintenance. Add one here to track tasks and maintenance over time.
      </p>
    </div>
    <HouseComponentForm
      :on-submit
      :on-submit-complete
      submit-label="Add"
      submit-icon="tabler:circle-plus-filled"
    />
  </div>
</template>

<style>

</style>
