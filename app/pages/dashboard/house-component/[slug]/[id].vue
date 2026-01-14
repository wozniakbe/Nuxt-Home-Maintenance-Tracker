<script lang="ts" setup>
const route = useRoute();
const houseComponentsStore = useHouseComponentsStore();
const {
  currentMaintenanceLog: maintenanceLog,
  currentMaintenanceLogStatus: status,
  currentMaintenanceLogError: error,
} = storeToRefs(houseComponentsStore);

const loading = computed(() => status.value === "pending");
const errorMessage = computed(() => error.value?.statusMessage);

onMounted(() => {
  houseComponentsStore.refreshCurrentMaintenanceLog();
});
</script>

<template>
  <div class="page-content-top">
    <div v-if="loading">
      <div class="loading" />
    </div>
    <div v-if="errorMessage && !loading" class="alert alert-error">
      <h2 class="text-lg">
        {{ errorMessage }}
      </h2>
    </div>
    <div v-if="route.name === 'dashboard-house-component-slug-id' && maintenanceLog && !loading">
      <p class="text-sm text-gray-500 italic">
        <span v-if="maintenanceLog.endedAt && maintenanceLog.startedAt !== maintenanceLog.endedAt">
          {{ formatDate(maintenanceLog.startedAt) }} / {{ formatDate(maintenanceLog.endedAt) }}
        </span>
        <span v-else>
          {{ formatDate(maintenanceLog.startedAt) }}
        </span>
      </p>
      <h2 class="text-xl">
        {{ maintenanceLog.name }}
      </h2>
      <p class="text-sm">
        {{ maintenanceLog.description }}
      </p>
    </div>
  </div>
</template>
