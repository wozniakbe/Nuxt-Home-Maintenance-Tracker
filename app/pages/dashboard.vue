<script lang="ts" setup>
import { CURRENT_HOUSE_COMPONENT_PAGES, CURRENT_MAINTENANCE_LOG_PAGES, EDIT_PAGES, HOUSE_COMPONENT_PAGES } from "~~/lib/constants";

const isSidebarOpen = ref(true);
const route = useRoute();
const sidebarStore = useSidebarStore();
// TODO: wonder if this here is why I am getting the empty slug and hitting the /bug endpoint
// since this runs on every child page load and when it runs for this page, there is no slug
// seems weird to have SSR run 3 times for a child page 3 deep, need to investigate if I can prevent that
// or maybe they are just using the cached response and not duplicating the calls. Need to confirm
const houseComponentsStore = useHouseComponentsStore();

const { currentHouseComponent, currentHouseComponentStatus } = storeToRefs(houseComponentsStore);

if (HOUSE_COMPONENT_PAGES.has(route.name?.toString() || "")) {
  await houseComponentsStore.refreshHouseComponents();
}

if (CURRENT_HOUSE_COMPONENT_PAGES.has(route.name?.toString() || "") || CURRENT_MAINTENANCE_LOG_PAGES.has(route.name?.toString() || "")) {
  await houseComponentsStore.refreshCurrentHouseComponent();
}

if (CURRENT_MAINTENANCE_LOG_PAGES.has(route.name?.toString() || "")) {
  await houseComponentsStore.refreshCurrentMaintenanceLog();
}

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
});

effect(() => {
  if (HOUSE_COMPONENT_PAGES.has(route.name?.toString() || "")) {
    sidebarStore.sidebarTopItems = [{
      id: "link-dashboard",
      label: "Maintenance Tasks",
      icon: "tabler:tool",
      href: "/dashboard",
    }, {
      id: "link-add-maintenance-item",
      label: "Add Maintenance Item",
      icon: "tabler:circle-plus-filled",
      href: "/dashboard/add",
    }];
  }
  else if (CURRENT_HOUSE_COMPONENT_PAGES.has(route.name?.toString() || "")) {
    sidebarStore.sidebarTopItems = [
      {
        id: "link-dashboard",
        label: "Back To Dashboard",
        icon: "tabler:arrow-left",
        href: "/dashboard",
      },
    ];
    if (currentHouseComponent.value && currentHouseComponentStatus.value !== "pending") {
      sidebarStore.sidebarTopItems.push(
        {
          id: "link-dashboard",
          label: currentHouseComponent.value.name,
          icon: "tabler:tools",
          to: { name: "dashboard-house-component-slug", params: { slug: route.params.slug } },
        },
        {
          id: "link-house-component-edit",
          label: "Edit House Component",
          icon: "tabler:home-edit",
          to: { name: "dashboard-house-component-slug-edit", params: { slug: route.params.slug } },
        },
        {
          id: "link-add-maintenance-log",
          label: "Add Maintenance Log",
          icon: "tabler:circle-plus-filled",
          to: { name: "dashboard-house-component-slug-add", params: { slug: route.params.slug } },
        },
      );
    }
  }
  else if (CURRENT_MAINTENANCE_LOG_PAGES.has(route.name?.toString() || "")) {
    if (currentHouseComponent.value && currentHouseComponentStatus.value !== "pending") {
      sidebarStore.sidebarTopItems = [{
        id: "link-house-component",
        label: `Back to "${currentHouseComponent.value.name}"`,
        to: {
          name: "dashboard-house-component-slug",
          params: {
            slug: route.params.slug,
          },
        },
        icon: "tabler:arrow-left",
      }, {
        id: "link-view-maintenance-log",
        label: "View Log",
        to: {
          name: "dashboard-house-component-slug-id",
          params: {
            slug: route.params.slug,
            id: route.params.id,
          },
        },
        icon: "tabler:binoculars-filled",
      }, {
        id: "link-edit-maintenance-log",
        label: "Edit Log",
        to: {
          name: "dashboard-house-component-slug-id-edit",
          params: {
            slug: route.params.slug,
            id: route.params.id,
          },
        },
        icon: "tabler:home-edit",
      }, {
        id: "link-maintenance-log-images",
        label: "Manage Images",
        to: {
          name: "dashboard-house-component-slug-id-images",
          params: {
            slug: route.params.slug,
            id: route.params.id,
          },
        },
        icon: "tabler:photo-cog",
      }];
    }
  }
});

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value;
  localStorage.setItem("isSidebarOpen", isSidebarOpen.value.toString());
}
</script>

<template>
  <div class="flex flex-1">
    <div class="bg-base-100 transition-all duration-300" :class="{ 'w-64': isSidebarOpen, 'w-16': !isSidebarOpen }">
      <div
        class="hover:bg-base-200 mr-0.5 flex p-2 hover:cursor-pointer "
        :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }"
        @click="toggleSidebar"
      >
        <Icon
          v-if="isSidebarOpen"
          name="tabler:layout-sidebar-left-collapse"
          size="32"
        />
        <Icon
          v-else
          name="tabler:layout-sidebar-right-collapse-filled"
          size="32"
        />
      </div>
      <div v-if="route.path.startsWith('/dashboard/house-component') && currentHouseComponentStatus === 'pending'" class="flex items-center justify-center">
        <div class="loading loading-spinner" />
      </div>
      <div class="flex flex-col">
        <SidebarButton
          v-for="item in sidebarStore.sidebarTopItems"
          :key="item.id"
          :show-label="isSidebarOpen"
          :label="item.label"
          :icon="item.icon"
          :href="item.href"
          :to="item.to"
        />
        <div v-if="sidebarStore.loading || sidebarStore.sidebarItems.length" class="divider" />
        <div v-if="sidebarStore.loading" class="px-4">
          <div class="skeleton h-4 w-full" />
        </div>
        <div v-if="!sidebarStore.loading && sidebarStore.sidebarItems.length" class="flex flex-col">
          <SidebarButton
            v-for="item in sidebarStore.sidebarItems"
            :key="item.id"
            :show-label="isSidebarOpen"
            :label="item.label"
            :icon="item.icon"
            :to="item.to"
          />
        </div>
        <div class="divider" />
        <SidebarButton
          :show-label="isSidebarOpen"
          label="Sign Out"
          icon="tabler:logout-2"
          href="/sign-out"
        />
      </div>
    </div>
    <div class="bg-base-200 flex-1 overflow-auto">
      <div
        class="flex size-full"
        :class="{
          'flex-col': !EDIT_PAGES.has(route.name?.toString() || ''),
        }"
      >
        <NuxtPage
          :class="{
            'shrink-0': EDIT_PAGES.has(route.name?.toString() || ''),
            'w-96': EDIT_PAGES.has(route.name?.toString() || ''),
          }"
        />
        <AppRightPane class="flex-1" />
      </div>
    </div>
  </div>
</template>

<style>

</style>
