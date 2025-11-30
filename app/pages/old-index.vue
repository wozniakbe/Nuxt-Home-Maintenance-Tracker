<script lang="ts" setup>
import { ref } from "vue";

const tableHtml = ref("");
const isLoading = ref(true);
// const { data, error } = await useFetch("/api/table", {
//   query: {
//     person_ids: "buzelma01",
//     date_span: "200",
//   },
// });
// if (error.value) {
//   console.error("Error fetching data:", error.value);
//   tableHtml.value = "<p>Could not load player stats.</p>";
// }
// else if (data.value?.success) {
//   tableHtml.value = data.value.html;
// }

isLoading.value = false;
</script>

<template>
  <div class="flex w-full">
    <div class="w-48 p-4">
      <side-bar />
    </div>

    <div class="flex-1 p-4">
      <some-component class="" />
      <h1 class="mt-6">
        Some data
      </h1>
      <button class="btn btn-primary">
        Primary!
      </button>
      <button class="btn btn-secondary">
        Secondary!
      </button>
      <button class="btn btn-secondary">
        Explore House <Icon name="tabler:home-bolt" size="32" />
      </button>
      <div v-if="isLoading">
        <p>Loading...</p>
      </div>
      <div v-else v-html="tableHtml" />
    </div>
  </div>
</template>

<style>

</style>
