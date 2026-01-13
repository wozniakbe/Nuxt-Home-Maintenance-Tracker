<script lang="ts" setup>
const houseComponentsStore = useHouseComponentsStore();
const { houseComponents, houseComponentsStatus: status } = storeToRefs(houseComponentsStore);

onMounted(() => {
  houseComponentsStore.refreshHouseComponents();
});
</script>

<template>
  <div class="page-context-top">
    <h2 class="text-2xl">
      Maintenance Tasks
    </h2>
    <div v-if="status === 'pending'">
      <span class="loading loading-spinner loading-xl" />
    </div>
    <div v-else-if="houseComponents && houseComponents.length > 0" class="component-list">
      <ComponentCard
        v-for="houseComponent in houseComponents"
        :id="houseComponent.id"
        :key="houseComponent.id"
        :to="{ name: 'dashboard-house-component-slug', params: { slug: houseComponent.slug } }"
        :name="houseComponent.name"
        :description="houseComponent.description"
      />
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
