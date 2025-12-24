<script lang="ts" setup>
const props = defineProps<{
  label: string;
  name: string;
  error?: string;
  type?: "text" | "textarea" | "number";
  disabled?: boolean;
}>();
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <Field
      :as="props.type === 'number' ? 'input' : props.type || 'input'"
      :name="props.name"
      :type="props.type || 'text'"
      :disabled="disabled"
      class="w-full"
      :class="{
        'input-error': props.error,
        'input': !type || type === 'text' || type === 'number',
        'textarea': type === 'textarea',
      }"
    />
    <p v-if="props.error" class="fieldset-label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>

<style>

</style>
