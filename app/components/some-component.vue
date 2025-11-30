<script lang="ts" setup>

</script>

<template>
  <div>
    <div class="flex justify-center">
      <h3 class="px-2 py-2 font-semibold">
        Some Component
      </h3>
    </div>
    <div class="grid grid-cols-3 gap-4">
      <div
        v-for="score in 2"
        :key="score"
        class="border border-gray-300"
      >
        999 - 999
      </div>
    </div>
  </div>
</template>

<style>

</style>
