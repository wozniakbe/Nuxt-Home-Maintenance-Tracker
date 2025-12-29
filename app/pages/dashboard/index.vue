<script lang="ts" setup>
const houseComponentsStore = useHouseComponentsStore();
const { houseComponents, status } = storeToRefs(houseComponentsStore);

onMounted(() => {
  houseComponentsStore.refresh();
});
</script>

<template>
  <div class="min-h-64 p-4">
    <h2 class="text-2xl">
      Maintenance Tasks
    </h2>
    <div v-if="status === 'pending'">
      <span class="loading loading-spinner loading-xl" />
    </div>
    <div v-else-if="houseComponents && houseComponents.length > 0" class="mt-4 flex flex-wrap gap-2">
      <NuxtLink
        v-for="houseComponent in houseComponents"
        :key="houseComponent.id"
        :to="{ name: 'dashboard-house-component-slug', params: { slug: houseComponent.slug } }"
        class="card card-compact bg-base-300 h-40 w-72"
      >
        <div class="card-body">
          <h3 class="text-xl">
            {{ houseComponent.name }}
          </h3>
          <p>{{ houseComponent.description }}</p>
        </div>
      </NuxtLink>
    </div>
    <div v-else class="mt-4 flex flex-col gap-2">
      <p>Add a maintenance item to get started</p>
      <NuxtLink to="/dashboard/add" class="btn btn-primary w-40">
        Add Item
        <Icon name="tabler:circle-plus-filled" size="24" />
      </NuxtLink>
    </div>
  </div>
</template>
