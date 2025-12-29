export const useHouseComponentsStore = defineStore("useHouseComponentsStore", () => {
  const { data, status, refresh } = useFetch("/api/house-components", {
    lazy: true,
  });

  const sidebarStore = useSidebarStore();

  watchEffect(() => {
    if (data.value) {
      sidebarStore.loading = false;
      sidebarStore.sidebarItems = data.value.map(comp => ({
        id: `component-${comp.id}`,
        label: comp.name,
        icon: "tabler:binoculars-filled",
        to: { name: "dashboard-house-component-slug", params: { slug: comp.slug } },
      }));
    }
    sidebarStore.loading = status.value === "pending";
  });
  return {
    houseComponents: data,
    status,
    refresh,
  };
});
