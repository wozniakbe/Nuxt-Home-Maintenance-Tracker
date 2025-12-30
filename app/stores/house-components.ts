import type { SelectHouseComponentWithLogs } from "~~/lib/db/schema";

const listHouseComponentsInSidebar = new Set(["dashboard", "dashboard-add"]);
const listCurrentHouseComponentInSidebar = new Set(["dashboard-house-component-slug", "dashboard-house-component-add", "dashboard-house-component-edit"]);

export const useHouseComponentsStore = defineStore("useHouseComponentsStore", () => {
  const route = useRoute();

  const { data: houseComponents, status: houseComponentsStatus, refresh: refreshHouseComponents } = useFetch("/api/house-components", {
    lazy: true,
  });
  const componentUrlWithSlug = computed(() => `/api/house-components/${route.params.slug}`);
  const {
    data: currentHouseComponent,
    status: currentHouseComponentStatus,
    error: currentHouseComponentError,
    refresh: refreshCurrentHouseComponent,
  } = useFetch<SelectHouseComponentWithLogs>(componentUrlWithSlug, {
    lazy: true,
    immediate: false,
    watch: false,
  });

  const sidebarStore = useSidebarStore();

  watchEffect(() => {
    if (houseComponents.value && listHouseComponentsInSidebar.has(route.name?.toString() || "")) {
      sidebarStore.loading = false;
      sidebarStore.sidebarItems = houseComponents.value.map(comp => ({
        id: `component-${comp.id}`,
        label: comp.name,
        icon: "tabler:binoculars-filled",
        to: { name: "dashboard-house-component-slug", params: { slug: comp.slug } },
      }));
    }
    else if (currentHouseComponent.value && listCurrentHouseComponentInSidebar.has(route.name?.toString() || "")) {
      sidebarStore.sidebarItems = [];
    }
    sidebarStore.loading = houseComponentsStatus.value === "pending";
  });
  return {
    houseComponents,
    houseComponentsStatus,
    refreshHouseComponents,
    currentHouseComponent,
    currentHouseComponentStatus,
    currentHouseComponentError,
    refreshCurrentHouseComponent,
  };
});
