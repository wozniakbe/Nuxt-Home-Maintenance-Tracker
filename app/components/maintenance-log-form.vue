<script setup lang="ts">
import { InsertMaintenanceLog } from "~~/lib/db/schema";

const props = defineProps<{
  initialValues?: InsertMaintenanceLog;
  onSubmit: (houseComponent: InsertMaintenanceLog) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
}>();
</script>

<template>
  <HouseComponentBaseForm
    v-slot="{ errors, loading }"
    :initial-values="props.initialValues"
    :on-submit="props.onSubmit"
    :on-submit-complete="props.onSubmitComplete"
    :submit-label="props.submitLabel"
    :submit-icon="props.submitIcon"
    :schema="InsertMaintenanceLog"
  >
    <AppFormField
      :disabled="loading"
      name="name"
      label="Name"
      :error="errors.name"
    />
    <AppFormField
      :disabled="loading"
      name="description"
      label="Description"
      :error="errors.description"
      type="textarea"
    />
    <AppDateFormField
      :disabled="loading"
      name="startedAt"
      label="Started At"
      :value="Date.now() - (24 * 60 * 60 * 1000)"
      :error="errors.startedAt"
    />
    <AppDateFormField
      :disabled="loading"
      name="endedAt"
      label="Ended At"
      :value="Date.now() - (24 * 60 * 60 * 1000)"
      :error="errors.ended"
    />
  </HouseComponentBaseForm>
</template>
