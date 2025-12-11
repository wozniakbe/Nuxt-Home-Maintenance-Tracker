<script lang="ts" setup>
const authStore = useAuthStore();

onMounted(async () => {
  await authStore.signOut();
});
</script>

<template>
  <div class="card bg-base-300 container mx-auto mt-4 flex min-h-72 flex-col items-center justify-center gap-4 text-center">
    <span class="loading loading-spinner loading-xl" />
  </div>
</template>
