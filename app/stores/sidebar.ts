import type { RouteLocationRaw } from "vue-router";

export type SidebarItem = {
  id: string;
  label: string;
  icon: string;
  href?: string;
  to?: RouteLocationRaw;
};

export const useSidebarStore = defineStore("useSidebarStore", () => {
  const sidebarItems = ref<SidebarItem[]>([]);
  const loading = ref(false);

  return {
    loading,
    sidebarItems,
  };
});
