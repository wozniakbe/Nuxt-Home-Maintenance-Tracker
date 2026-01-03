import type { SelectHouseComponentWithLogs } from "~~/lib/db/schema";

import { CURRENT_HOUSE_COMPONENT_PAGES, HOUSE_COMPONENT_PAGES } from "~~/lib/constants";

export const useHouseComponentsStore = defineStore("useHouseComponentsStore", () => {
  const route = useRoute();

  const {
    data: houseComponents,
    status: houseComponentsStatus,
    refresh: refreshHouseComponents,
  } = useFetch("/api/house-components", {
    lazy: true,
  });
  const componentUrlWithSlug = computed(() => {
    if (!route.params.slug)
      return "/api/bug";
    return `/api/house-components/${route.params.slug}`;
  });
  const {
    data: currentHouseComponent,
    status: currentHouseComponentStatus,
    error: currentHouseComponentError,
    refresh: refreshCurrentHouseComponent,
  } = useFetch<SelectHouseComponentWithLogs>(componentUrlWithSlug, {
    lazy: true,
    immediate: false,
  });

  const sidebarStore = useSidebarStore();

  effect(() => {
    if (houseComponents.value && HOUSE_COMPONENT_PAGES.has(route.name?.toString() || "")) {
      sidebarStore.loading = false;
      sidebarStore.sidebarItems = houseComponents.value.map(comp => ({
        id: `component-${comp.id}`,
        label: comp.name,
        icon: "tabler:binoculars-filled",
        to: { name: "dashboard-house-component-slug", params: { slug: comp.slug } },
      }));
    }
    else if (currentHouseComponent.value && CURRENT_HOUSE_COMPONENT_PAGES.has(route.name?.toString() || "")) {
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
