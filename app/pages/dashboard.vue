<script lang="ts" setup>
const isSidebarOpen = ref(true);
const route = useRoute();
const sidebarStore = useSidebarStore();
const houseComponentsStore = useHouseComponentsStore();

const { currentHouseComponent } = storeToRefs(houseComponentsStore);

onMounted(() => {
  isSidebarOpen.value = localStorage.getItem("isSidebarOpen") === "true";
  if (route.path !== "/dashboard") {
    houseComponentsStore.refreshHouseComponents();
  }
});

watchEffect(() => {
  if (route.name === "dashboard") {
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
  else if (route.name === "dashboard-house-component-slug") {
    sidebarStore.sidebarTopItems = [
      {
        id: "link-dashboard",
        label: "Back To Dashboard",
        icon: "tabler:arrow-left",
        href: "/dashboard",
      },
      {
        id: "link-dashboard",
        label: currentHouseComponent.value ? currentHouseComponent.value.name : "View Logs",
        icon: "tabler:tools",
        to: { name: "dashboard-house-component-slug", params: { slug: currentHouseComponent.value?.slug } },
      },
      {
        id: "link-house-component-edit",
        label: "Edit House Component",
        icon: "tabler:home-edit",
        to: { name: "dashboard-house-component-slug-edit", params: { slug: currentHouseComponent.value?.slug } },
      },
      {
        id: "link-add-maintenance-log",
        label: "Add Maintenance Log",
        icon: "tabler:circle-plus-filled",
        to: { name: "dashboard-house-component-slug-add", params: { slug: currentHouseComponent.value?.slug } },
      },
    ];
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
        class="hover:bg-base-200 flex p-2 hover:cursor-pointer"
        :class="{ 'justify-center': !isSidebarOpen, 'justify-end': isSidebarOpen }"
        @click="toggleSidebar"
      >
        <Icon
          v-if="isSidebarOpen"
          name="tabler:chevron-left"
          size="32"
        />
        <Icon
          v-else
          name="tabler:chevron-right"
          size="32"
        />
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
    <div class="flex-1">
      <NuxtPage />
    </div>
  </div>
</template>

<style>

</style>
