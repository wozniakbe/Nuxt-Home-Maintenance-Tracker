<script lang="ts" setup>
import type { RouteLocationRaw } from "vue-router";

const props = defineProps<{
  to: RouteLocationRaw;
  name: string;
  description: string | null;
  id: number;
}>();
</script>

<template>
  <NuxtLink
    :key="props.id"
    :to="props.to"
    class="card card-compact bg-base-300 hover:border-accent mb-2 h-40 w-72 shrink-0 border-2 border-transparent hover:cursor-pointer"
  >
    <div class="card-body">
      <slot name="top" />
      <h3 class="text-xl">
        {{ props.name }}
      </h3>
      <p>{{ props.description }}</p>
    </div>
  </NuxtLink>
</template>
