<script lang="ts" setup>
import type { FetchError } from "ofetch";

const route = useRoute();
const houseComponentsStore = useHouseComponentsStore();
const {
  currentMaintenanceLog: maintenanceLog,
  currentMaintenanceLogStatus: status,
  currentMaintenanceLogError: error,
} = storeToRefs(houseComponentsStore);

const isOpen = ref(false);
const deleteError = ref("");
const isDeleting = ref(false);

const loading = computed(() => isDeleting.value || status.value === "pending");
const errorMessage = computed(() => deleteError.value || error.value?.statusMessage);

async function confirmDelete() {
  try {
    isOpen.value = false;
    deleteError.value = "";
    isDeleting.value = true;
    await $fetch(`/api/house-components/${route.params.slug}/${route.params.id}`, {
      method: "DELETE",
    });

    navigateTo(({
      name: "dashboard-house-component-slug",
      params: { slug: route.params.slug },
    }));
  }
  catch (e) {
    const error = e as FetchError;
    deleteError.value = error.data?.statusMessage || error.statusMessage || "An unknown error occurred.";
  }
  isDeleting.value = false;
}

function openDialog() {
  isOpen.value = true;
  (document.activeElement as HTMLElement).blur();
}

onMounted(() => {
  houseComponentsStore.refreshCurrentMaintenanceLog();
});

onBeforeRouteUpdate((to) => {
  if (to.name === "dashboard-house-component-slug-id") {
    houseComponentsStore.refreshCurrentMaintenanceLog();
  }
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
        <div class="dropdown dropdown-bottom">
          <div
            tabindex="0"
            role="button"
            class="btn btn-sm m-1 p-0"
          >
            <Icon name="tabler:dots-vertical" size="20" />
          </div>
          <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
            <li>
              <NuxtLink @click="openDialog">
                <Icon name="tabler:trash-x-filled" size="20" />
                Delete
              </NuxtLink>
            </li>
            <li>
              <NuxtLink :to="{ name: 'dashboard-house-component-slug-id-edit', params: { slug: route.params.slug, id: route.params.id } }">
                <Icon name="tabler:home-edit" size="20" />
                Edit
              </NuxtLink>
            </li>
          </ul>
        </div>
      </h2>
      <p class="text-sm">
        {{ maintenanceLog.description }}
      </p>
    </div>
    <div v-else>
      <NuxtPage />
    </div>
    <AppDialog
      title="Are you sure?"
      description="Deleting this maintenance log cannot be undone. Do you really want to do this?"
      confirm-label="Yes, delete"
      confirm-class="btn-error"
      :is-open="isOpen"
      @on-closed="isOpen = false"
      @on-confirmed="confirmDelete"
    />
  </div>
</template>
