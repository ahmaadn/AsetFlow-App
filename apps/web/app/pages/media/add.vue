<script setup lang="ts">
type UploadFile = {
  name: string;
  slug: string;
  mimeType: string;
  assetType: GeneralAssetType;
  size: number;
  previewUrl?: string;
  file?: File;
};

type FolderOption = {
  label: string;
  value: string;
  [key: string]: unknown;
};

const folderStore = useFolderStore();
const toast = useToast();
const { $uploadQueue } = useNuxtApp();

const folderTarget = ref<FolderOption | null>(null);
const files = ref<File[] | null>(null);
const stagingFiles = ref<UploadFile[]>([]);

// Opsi folder untuk ComboBox
const folders = computed<FolderOption[]>(() =>
  folderStore.folders.map((f) => ({
    label: f.name,
    value: f.id,
    slug: f.slug,
  }))
);

// Detect duplicate names/slugs across staging files
const duplicateNames = computed<Set<string>>(() => {
  const counts = new Map<string, number>();
  for (const f of stagingFiles.value) {
    const key = (f.name || '').trim().toLowerCase();
    if (!key) continue;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return new Set(
    [...counts.entries()].filter(([, c]) => c > 1).map(([k]) => k)
  );
});

const duplicateSlugs = computed<Set<string>>(() => {
  const counts = new Map<string, number>();
  for (const f of stagingFiles.value) {
    const key = (f.slug || '').trim().toLowerCase();
    if (!key) continue;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return new Set(
    [...counts.entries()].filter(([, c]) => c > 1).map(([k]) => k)
  );
});

const hasDuplicate = computed(
  () => duplicateNames.value.size > 0 || duplicateSlugs.value.size > 0
);

function isNameDuplicate(item: UploadFile) {
  const key = (item.name || '').trim().toLowerCase();
  return key && duplicateNames.value.has(key);
}

function isSlugDuplicate(item: UploadFile) {
  const key = (item.slug || '').trim().toLowerCase();
  return key && duplicateSlugs.value.has(key);
}

// Remove extension from a filename (e.g., "photo.png" -> "photo")
function stripExtension(filename: string) {
  const lastDot = filename.lastIndexOf('.');
  if (lastDot <= 0) return filename; // no extension or hidden file like .env
  return filename.slice(0, lastDot);
}

watch(
  files,
  (newFiles) => {
    if (newFiles) {
      const newStagingFiles: UploadFile[] = Array.from(newFiles).map(
        (file) => ({
          name: stripExtension(file.name),
          slug: generateSlug(stripExtension(file.name)),
          mimeType: file.type,
          assetType: getAssetTypeFromMime(file.type) as GeneralAssetType,
          size: file.size,
          previewUrl: URL.createObjectURL(file),
          file,
        })
      );
      stagingFiles.value.push(...newStagingFiles);
    }
  },
  { immediate: true }
);

function onNameInput(item: UploadFile) {
  item.slug = generateSlug(item.name || '');
}

function deleteStagingFile(index: number) {
  const item = stagingFiles.value[index];
  if (item && item.previewUrl) {
    URL.revokeObjectURL(item.previewUrl);
  }
  stagingFiles.value.splice(index, 1);
}

async function uploadFiles() {
  if (hasDuplicate.value || stagingFiles.value.length === 0) {
    return;
  }

  if (!folderTarget.value) {
    toast.error('Please select a target folder before uploading.');
    return;
  }

  const uploadItems: UploadItem[] = stagingFiles.value
    .filter((item) => item.file)
    .map((item) => ({
      file: item.file!,
      filename: item.name,
      slug: item.slug,
      apiEndpoint: `/folders/${folderTarget.value!.value}/upload`,
      url: item.previewUrl,
    }));

  $uploadQueue.addFiles(uploadItems);
  stagingFiles.value = [];

  await $uploadQueue.startUpload();
}

onMounted(async () => {
  if (folderStore.folders.length === 0) {
    await folderStore.loadFolders();
  }
});
</script>

<template>
  <div class="p-6 md:p-8 space-y-8">
    <!-- Step 1: Select Folder -->
    <section>
      <h2 class="text-lg font-semibold text-neutral mb-2">
        Langkah 1: Pilih Folder Tujuan
      </h2>
      <p class="text-sm text-neutral/60 mb-4">
        Pilih folder di mana aset baru akan disimpan.
      </p>
      <div class="bg-base-100 rounded-lg">
        <ui-tabs
          :tabs="['Pilih Folder', 'Buat Folder Baru']"
          class=""
          class-tabs="px-2"
        >
          <template #default="{ selected, select }">
            <div class="p-6">
              <UiComboBox
                v-if="selected === 0"
                v-model="folderTarget"
                :options="folders"
                placeholder="Pilih folder"
              >
                <template #option="{ option }">
                  <p>{{ option.label }}</p>
                  <p class="text-sm text-neutral/60">{{ option.slug }}</p>
                </template>
              </UiComboBox>
              <FolderForm
                v-else
                size="md"
                @close="select(0)"
                @submit="
                  async (name: string) => {
                    await folderStore.createFolder(name);
                    select(0);
                  }
                "
              />
            </div>
          </template>
        </ui-tabs>
      </div>
    </section>

    <!-- Step 2: Add Assets -->
    <section v-if="folderTarget">
      <h2 class="text-lg font-semibold text-slate-800 mb-2">
        Langkah 2: Tambahkan Aset
      </h2>
      <p class="text-sm text-slate-500 mb-4">
        Unggah file dari komputer Anda atau impor dari URL.
      </p>

      <div class="px-6">
        <ui-file-select v-model="files" :accepts="supportedMimeTypes" />
      </div>
    </section>

    <!-- Step 3: Review & Upload -->
    <section
      v-if="folderTarget && stagingFiles.length"
      id="staging-section"
      class=""
    >
      <h2 class="text-lg font-semibold text-slate-800 mb-2">
        Langkah 3: Tinjau & Unggah
      </h2>
      <p class="text-sm text-slate-500 mb-4">
        Ganti nama file jika perlu, lalu mulai proses unggah.
      </p>
      <div class="space-y-4">
        <template v-if="stagingFiles.length === 0">
          <div
            class="p-6 mx-6 border-2 border-dashed border-base-300 rounded-lg text-center text-neutral/60"
          >
            Tidak ada file yang siap diunggah. Silakan tambahkan aset di atas.
          </div>
        </template>
        <template v-else>
          <div class="divide-y divide-base-300 space-y-4">
            <div
              v-for="(item, index) in stagingFiles"
              :key="index"
              class="bg-base-100 px-4 pb-8 pt-4 rounded flex items-start gap-4"
            >
              <div
                class="flex-shrink-0 h-24 w-24 bg-base-200 rounded-md flex items-center justify-center shadow-sm"
              >
                <img
                  v-if="isImageMimeType(item.mimeType)"
                  :src="item.previewUrl"
                  alt="Preview"
                  class="h-full w-full object-cover rounded-md"
                />

                <div
                  v-else
                  class="bg-base-200 h-full w-full flex items-center justify-center rounded-md"
                >
                  <Icon
                    :name="iconMapping[item.assetType]"
                    class="size-8 text-neutral"
                  />
                </div>
              </div>
              <div class="flex-1 space-y-2">
                <label
                  class="input w-full"
                  for="name-{{ index }}"
                  :class="{
                    'input-error':
                      isNameDuplicate(item) || isSlugDuplicate(item),
                  }"
                >
                  <span class="font-semibold"> Name </span>
                  <input
                    :id="`name-${index}`"
                    v-model="item.name"
                    type="text"
                    class="grow"
                    placeholder="Nama file"
                    :name="`name-${index}`"
                    required
                    @input="onNameInput(item)"
                  />
                  <span
                    v-if="isNameDuplicate(item)"
                    class="badge badge-error badge-xs"
                    >Name duplicate</span
                  >
                  <span
                    v-if="isSlugDuplicate(item)"
                    class="badge badge-error badge-xs"
                    >Slug duplicate</span
                  >
                </label>

                <p class="text-xs text-neutral/60">{{ item.slug || ' ' }}</p>
                <p class="text-xs text-neutral/60">
                  {{ item.mimeType }} <span>&middot;</span>
                  {{ (item.size / 1024).toFixed(2) }} KB
                </p>
              </div>
              <button
                class="btn btn-ghost btn-error btn-square"
                type="button"
                aria-label="Hapus file"
                @click="deleteStagingFile(index)"
              >
                <Icon name="ri:close-circle-line" class="size-5" />
              </button>
            </div>
          </div>
        </template>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          class="btn btn-primary gap-2 w-full"
          :disabled="hasDuplicate || stagingFiles.length === 0"
          @click="uploadFiles"
        >
          <Icon name="ri:upload-cloud-2-line" class="size-5" />
          <span>Unggah {{ stagingFiles.length }} Asset</span>
        </button>
      </div>
    </section>
    <BackToTop></BackToTop>
  </div>
</template>
