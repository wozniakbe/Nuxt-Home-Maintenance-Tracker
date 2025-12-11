<script lang="ts" setup>
const authStore = useAuthStore();
</script>

<template>
  <div>
    <h1>You are logged in, {{ authStore.user?.name }}!</h1>
  </div>
</template>

<style>

</style>
