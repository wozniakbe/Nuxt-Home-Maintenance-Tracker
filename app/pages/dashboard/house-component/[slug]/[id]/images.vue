<script lang="ts" setup>
import { FetchError } from "ofetch";

const image = ref<File | null>(null);
const previewUrl = ref<string | null>(null);
const loading = ref(false);
const errorMessage = ref("");
const imageInput = useTemplateRef("imageInput");

const route = useRoute();
const { $csrfFetch } = useNuxtApp();

const houseComponentStore = useHouseComponentsStore();
const {
  currentMaintenanceLog: maintenanceLog,
} = storeToRefs(houseComponentStore);

function selectImage(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    image.value = file;
    previewUrl.value = URL.createObjectURL(file);
  }
}

async function getChecksum(blob: Blob) {
  const arrayBuffer = await blob.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", arrayBuffer);
  return btoa(String.fromCharCode(...new Uint8Array(hashBuffer)));
}

async function uploadImage() {
  if (!image.value || !previewUrl.value) {
    return;
  }

  loading.value = true;
  errorMessage.value = "";
  const previewImage = new Image();
  previewImage.addEventListener("load", async () => {
    const width = Math.min(1000, previewImage.width);
    const resized = await createImageBitmap(previewImage, {
      resizeWidth: width,
    });
    const canvas = new OffscreenCanvas(width, resized.height);
    canvas.getContext("bitmaprenderer")?.transferFromImageBitmap(resized);
    const blob = await canvas.convertToBlob({ type: "image/jpeg", quality: 0.9 });

    const checksum = await getChecksum(blob);

    try {
      const { fields, key, url } = await $csrfFetch(`/api/house-components/${route.params.slug}/${route.params.id}/sign-image`, {
        method: "post",
        body: {
          contentLength: blob.size,
          checksum,
        },
      });

      const formData = new FormData();

      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append("file", blob);

      await $fetch(url, {
        method: "POST",
        body: formData,
        headers: {
          "x-amz-checksum-algorithm": "SHA256",
        },
      });

      await $csrfFetch(`/api/house-components/${route.params.slug}/${route.params.id}/image`, {
        method: "POST",
        body: {
          key,
        },
      });
      await houseComponentStore.refreshCurrentMaintenanceLog();
      image.value = null;
      previewUrl.value = null;
      if (imageInput.value) {
        imageInput.value.value = "";
      }
    }
    catch (e) {
      if (e instanceof FetchError) {
        errorMessage.value = (e as FetchError).statusMessage || "Unknown error";
      }
      else if (e instanceof Error) {
        errorMessage.value = e.message;
      }
      else {
        errorMessage.value = "Unknown error";
      }
    }
    loading.value = false;
  });

  previewImage.src = previewUrl.value;
}
</script>

<template>
  <div>
    <h2 class="mb-2">
      Manage "{{ maintenanceLog?.name || "Loading..." }}" Images
    </h2>
    <div class="flex">
      <div class="flex w-72 flex-col gap-2">
        <div class="flex h-30 w-full items-center justify-center bg-gray-500 p-1">
          <p v-if="!previewUrl" class="text-center text-white">
            Select an image
          </p>
          <img
            v-else
            :src="previewUrl"
            alt="upload preview"
            class="h-full object-cover"
          >
          <div v-if="loading || errorMessage" class="absolute flex size-full items-center justify-center bg-black opacity-50">
            <div v-if="loading" class="loading loading-lg" />
            <div v-else-if="errorMessage" class="error">
              {{ errorMessage }}
            </div>
          </div>
        </div>
        <input
          ref="imageInput"
          type="file"
          class="file-input"
          :disabled="loading"
          @change="selectImage"
        >
        <button
          class="btn btn-primary"
          :disabled="!image || loading"
          @click="uploadImage"
        >
          Upload
          <Icon name="tabler:photo-share" size="24" />
        </button>
      </div>
      <ImageList class="ml-2" :images="maintenanceLog?.images || []" />
    </div>
  </div>
</template>
