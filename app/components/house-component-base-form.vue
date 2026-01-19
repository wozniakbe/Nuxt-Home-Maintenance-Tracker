<script lang="ts" setup generic="T">
import type { FetchError } from "ofetch";
import type { ZodSchema } from "zod";

import getFetchErrorMessage from "~/utils/get-fetch-error-message";

const props = defineProps<{
  initialValues?: T | null;
  schema: ZodSchema;
  onSubmit: (houseComponent: T) => Promise<any>;
  onSubmitComplete: () => void;
  submitLabel: string;
  submitIcon: string;
}>();

const { handleSubmit, errors, meta, setErrors } = useForm({
  validationSchema: toTypedSchema(props.schema),
  initialValues: props.initialValues,
});

const router = useRouter();

const loading = ref(false);
const submitted = ref(false);
const submitError = ref("");

const onSubmit = handleSubmit(async (values: T) => {
  try {
    submitError.value = "";
    loading.value = true;
    await props.onSubmit(values);
    submitted.value = true;
    props.onSubmitComplete();
  }
  catch (e) {
    const error = e as FetchError;
    if (error.data?.data) {
      setErrors(error.data.data);
    }
    submitError.value = getFetchErrorMessage(error);
  }
  loading.value = false;
});

onBeforeRouteLeave(() => {
  if (meta.value.dirty && !submitted.value) {
    // eslint-disable-next-line no-alert
    const confirm = globalThis.confirm("Are you sure you want to leave? All unsaved changes will be lost.");
    if (!confirm) {
      return false;
    }
  }
  return true;
});
</script>

<template>
  <div
    v-if="submitError"
    role="alert"
    class="alert alert-error"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-6 w-6 shrink-0 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
    <span>{{ submitError }}</span>
  </div>
  <form class="flex flex-col gap-2" @submit.prevent="onSubmit">
    <slot :errors="errors" :loading="loading" />
    <div class="flex justify-end gap-2">
      <button
        :disabled="loading"
        type="button"
        class="btn btn-outline"
      >
        <Icon
          name="tabler:arrow-left"
          size="24"
          @click="router.back()"
        />
        Cancel
      </button>
      <button
        :disabled="loading"
        type="submit"
        class="btn btn-primary"
      >
        {{ props.submitLabel }}
        <span v-if="loading" class="loading loading-spinner loading-sm" />
        <Icon
          v-else
          :name="props.submitIcon"
          size="24"
        />
      </button>
    </div>
  </form>
</template>
