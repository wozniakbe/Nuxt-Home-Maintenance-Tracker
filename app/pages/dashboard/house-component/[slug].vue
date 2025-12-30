<script lang="ts" setup>
const houseComponentsStore = useHouseComponentsStore();
const {
  currentHouseComponent: houseComponent,
  currentHouseComponentStatus: status,
  currentHouseComponentError: error,
} = storeToRefs(houseComponentsStore);

onMounted(() => {
  houseComponentsStore.refreshCurrentHouseComponent();
});
</script>

<template>
  <div class="min-h-64 p-4">
    <div v-if="status === 'pending'">
      <div class="loading" />
    </div>
    <div v-if="houseComponent && status !== 'pending'">
      <h2 class="text-xl">
        {{ houseComponent?.name }}
      </h2>
      <p class="text-sm">
        {{ houseComponent?.description }}
      </p>
      <div v-if="!houseComponent.maintenanceLogs.length" class="mt-4">
        <p v-if="!houseComponent.maintenanceLogs.length" class="text-sm italic">
          Add a maintenance log to get started.
        </p>
      </div>
      <button class="btn btn-primary mt-2">
        Add Maintenance Log
        <Icon name="tabler:circle-plus-filled" size="24" />
      </button>
    </div>
    <div v-if="error && status !== 'pending'" class="alert alert-error">
      <h2 class="text-lg">
        {{ error.statusMessage }}
      </h2>
    </div>
  </div>
</template>
