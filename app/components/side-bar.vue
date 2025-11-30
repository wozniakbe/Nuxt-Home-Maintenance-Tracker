<script lang="ts" setup>

</script>

<template>
  <div>
    <div class="flex justify-center">
      <h3 class="px-2 py-2 font-semibold">
        Side Bar
      </h3>
    </div>
    <svg
      v-for="item in 3"
      :key="item"
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      class="m-2.5 fill-gray-300"
    >
      <circle
        cx="20"
        cy="20"
        r="20"
        fill="#D9D9D9"
      />
    </svg>
  </div>
</template>
