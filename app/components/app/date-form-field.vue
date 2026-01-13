<script lang="ts" setup>
import formatDateISO from "~~/utils/format-date";

const props = defineProps<{
  label: string;
  name: string;
  value: number;
  error?: string;
  disabled?: boolean;
}>();

const { handleBlur, value: inputValue, handleChange } = useField<number>(props.name, {
  initialValue: props.value,
});

function dateChanged(event: Event) {
  const target = event.target as HTMLInputElement;
  try {
    const value = new Date(target.value).getTime();
    handleChange(value);
  }
  catch {}
}
</script>

<template>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">
      {{ props.label }}
    </legend>
    <input
      :name="props.name"
      type="date"
      :disabled="disabled"
      class="input w-full"
      :class="{
        'input-error': props.error,
      }"
      :value="formatDateISO(inputValue)"
      @change="dateChanged"
      @blur="handleBlur"
    >
    <p v-if="props.error" class="fieldset-label text-error">
      {{ props.error }}
    </p>
  </fieldset>
</template>
