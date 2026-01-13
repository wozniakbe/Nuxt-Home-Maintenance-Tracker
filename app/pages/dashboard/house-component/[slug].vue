<script lang="ts" setup>
import type { FetchError } from "ofetch";

import formatDateISO from "~~/utils/format-date";

const route = useRoute();
const houseComponentsStore = useHouseComponentsStore();
const {
  currentHouseComponent: houseComponent,
  currentHouseComponentStatus: status,
  currentHouseComponentError: error,
} = storeToRefs(houseComponentsStore);

const isOpen = ref(false);
const deleteError = ref("");
const isDeleting = ref(false);

const loading = computed(() => status.value === "pending" || isDeleting.value);
const errorMessage = computed(() => error.value?.statusMessage || deleteError.value);

onMounted(() => {
  houseComponentsStore.refreshCurrentHouseComponent();
});

function openDialog() {
  isOpen.value = true;
  (document.activeElement as HTMLElement).blur();
}

async function confirmDelete() {
  try {
    isOpen.value = false;
    deleteError.value = "";
    isDeleting.value = true;
    await $fetch(`/api/house-components/${route.params.slug}`, {
      method: "DELETE",
    });

    navigateTo("/dashboard");
  }
  catch (e) {
    const error = e as FetchError;
    deleteError.value = error.data?.statusMessage || error.statusMessage || "An unknown error occurred.";
  }
  isDeleting.value = false;
}

onBeforeRouteUpdate((to) => {
  if (to.name === "dashboard-house-component-slug") {
    houseComponentsStore.refreshCurrentHouseComponent();
  }
});
</script>

<template>
  <div class="page-context-top">
    <div v-if="loading">
      <div class="loading" />
    </div>
    <div v-if="errorMessage && !loading" class="alert alert-error">
      <h2 class="text-lg">
        {{ errorMessage }}
      </h2>
    </div>

    <div v-if="route.name === 'dashboard-house-component-slug' && houseComponent && !loading">
      <h2 class="text-xl">
        {{ houseComponent?.name }}
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
              <NuxtLink :to="{ name: 'dashboard-house-component-slug-edit', params: { slug: route.params.slug } }">
                <Icon name="tabler:home-edit" size="20" />
                Edit
              </NuxtLink>
            </li>
          </ul>
        </div>
      </h2>
      <p class="text-sm">
        {{ houseComponent?.description }}
      </p>
      <p class="text-sm">
        Floor: {{ houseComponent?.floor }}
      </p>
      <p class="text-sm">
        Room: {{ houseComponent?.room }}
      </p>
      <div v-if="!houseComponent.maintenanceLogs.length" class="mt-4">
        <p class="text-sm italic">
          Add a maintenance log to get started.
        </p>
        <NuxtLink
          class="btn btn-primary mt-2"
          :to="{
            name: 'dashboard-house-component-slug-add',
            params: { slug: route.params.slug },
          }"
        >
          Add Maintenance Log
          <Icon name="tabler:circle-plus-filled" size="24" />
        </NuxtLink>
      </div>
      <div
        v-if="route.name === 'dashboard-house-component-slug' && houseComponent?.maintenanceLogs.length"
        class="component-list"
      >
        <ComponentCard
          v-for="maintenanceLog in houseComponent.maintenanceLogs"
          :id="maintenanceLog.id"
          :key="maintenanceLog.id"
          :to="{ name: 'dashboard-house-component-slug-id', params: { id: maintenanceLog.id } }"
          :name="maintenanceLog.name"
          :description="maintenanceLog.description"
        >
          <template #top>
            <span v-if="maintenanceLog.endedAt && maintenanceLog.startedAt !== maintenanceLog.endedAt">
              <p class="text-sm text-gray-500 italic">
                {{ formatDateISO(maintenanceLog.startedAt) }} to {{ formatDateISO(maintenanceLog.endedAt) }}
              </p>
            </span>
            <span v-else>
              <p class="text-sm text-gray-500 italic">
                {{ formatDateISO(maintenanceLog.startedAt) }}
              </p>
            </span>
          </template>
        </ComponentCard>
      </div>
    </div>
    <div v-if="route.name !== 'dashboard-house-component-slug'">
      <NuxtPage />
    </div>
    <AppDialog
      title="Are you sure?"
      description="Deleting this house component will also delete all of the associated logs. This cannot be undone. Do you really want to do this?"
      confirm-label="Yes, delete"
      confirm-class="btn-error"
      :is-open="isOpen"
      @on-closed="isOpen = false"
      @on-confirmed="confirmDelete"
    />
  </div>
</template>
