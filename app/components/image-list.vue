<script lang="ts" setup>
import type { SelectMaintenanceLogImage } from "~~/lib/db/schema";

const props = defineProps<{
  images: SelectMaintenanceLogImage[];
}>();

const config = useRuntimeConfig();
</script>

<template>
  <div class="mt-2 flex gap-2 overflow-auto">
    <div
      v-for="image in props.images"
      :key="image.id"
      class="card card-compact bg-base-300 flex h-40 w-64 shrink-0 items-center justify-center"
    >
      <div class="card-body size-full">
        <img
          class="size-full object-cover"
          :src="`${config.public.s3BucketUrl}/${image.key}`"
        >
      </div>
    </div>
  </div>
</template>
