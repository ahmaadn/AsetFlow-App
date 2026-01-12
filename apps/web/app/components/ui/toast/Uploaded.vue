<script setup lang="ts">
const { $uploadQueue } = useNuxtApp();

const isCollapsed = ref(false);
const showToast = ref(false);
const autoCloseTimer = ref(0);

const { pause: pauseAutoClose, resume: resumeAutoClose } = useInterval(1000, {
  controls: true,
  immediate: false,
  callback: () => {
    autoCloseTimer.value--;

    if (autoCloseTimer.value <= 0) {
      closeToast();
    }
  },
});

const headerText = computed(() => {
  const stats = $uploadQueue.uploadStats.value;

  if ($uploadQueue.isCompleted.value) {
    if (stats.error > 0) {
      return `Upload completed with ${stats.error} error${stats.error > 1 ? 's' : ''}`;
    }
    return 'All uploads completed';
  }

  if (stats.uploading > 0) {
    return `Uploading ${stats.uploading} file${stats.uploading > 1 ? 's' : ''}...`;
  }

  return 'Preparing uploads...';
});

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const closeToast = () => {
  showToast.value = false;
  pauseAutoClose();

  // Clear queue setelah toast ditutup
  setTimeout(() => {
    $uploadQueue.clearAll();
  }, 300);
};

const startAutoCloseTimer = () => {
  autoCloseTimer.value = 60;
  resumeAutoClose();
};

// Watch untuk menampilkan toast saat ada file dalam queue
watch(
  () => $uploadQueue.queue.value.length,
  (newLength) => {
    if (newLength > 0 && !showToast.value) {
      showToast.value = true;
      isCollapsed.value = false;
      autoCloseTimer.value = 0;
      pauseAutoClose();
    }
  }
);

// Watch untuk auto close saat semua selesai
watch(
  () => $uploadQueue.isCompleted.value,
  (completed) => {
    if (completed && showToast.value) {
      startAutoCloseTimer();
    }
  }
);

// Cleanup saat component unmount
onUnmounted(pauseAutoClose);
</script>

<template>
  <ClientOnly>
    <Teleport to="#toast-upload">
      <div
        :class="[
          'z-50 w-full max-w-md md:w-96',
          'left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 px-4 md:px-0 pointer-events-auto',
        ]"
      >
        <Transition
          enter-active-class="transition ease-out duration-300"
          enter-from-class="translate-y-full md:translate-y-0 md:translate-x-full opacity-0"
          enter-to-class="translate-y-0 md:translate-x-0 opacity-100"
          leave-active-class="transition ease-in duration-200"
          leave-from-class="translate-y-0 md:translate-x-0 opacity-100"
          leave-to-class="translate-y-full md:translate-y-0 md:translate-x-full opacity-0"
        >
          <div
            v-if="showToast"
            class="bg-base-100 shadow-xl rounded-lg border border-gray-200 overflow-hidden"
          >
            <!-- Header - Always Visible -->
            <div
              class="flex items-center justify-between p-4 cursor-pointer hover:bg-base-200 transition-colors"
              @click="toggleCollapse"
            >
              <div class="flex items-center gap-3 flex-1">
                <div class="flex-shrink-0">
                  <Icon
                    v-if="!$uploadQueue.isCompleted.value"
                    name="ri:loader-5-line"
                    class="animate-spin h-5 w-5 text-blue-600"
                  />
                  <Icon
                    v-else-if="$uploadQueue.uploadStats.value.error > 0"
                    name="ri:error-warning-line"
                    class="h-5 w-5 text-red-600"
                  />
                  <Icon
                    v-else
                    name="ri:checkbox-circle-line"
                    class="h-5 w-5 text-green-600"
                  />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium text-gray-900">
                    {{ headerText }}
                  </p>
                  <p class="text-xs text-gray-500 mt-0.5">
                    {{ $uploadQueue.uploadStats.value.completed }}/{{
                      $uploadQueue.uploadStats.value.total
                    }}
                    completed
                    <span
                      v-if="
                        $uploadQueue.isCompleted.value && autoCloseTimer > 0
                      "
                      class="text-gray-400"
                    >
                      • closes in {{ autoCloseTimer }}s
                    </span>
                  </p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <button
                  class="p-1 hover:bg-gray-200 rounded transition-colors"
                  title="Close"
                  @click.stop="closeToast"
                >
                  <Icon name="ri:close-line" class="size-4"></Icon>
                </button>
                <button
                  class="p-1 hover:bg-gray-200 rounded transition-colors"
                  @click.stop="toggleCollapse"
                >
                  <Icon
                    name="ri:arrow-down-s-line"
                    class="w-4 h-4 text-gray-500 transition-transform"
                    :class="{ 'rotate-180': !isCollapsed }"
                  ></Icon>
                </button>
              </div>
            </div>

            <!-- Expanded Content -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="max-h-0 opacity-0"
              enter-to-class="opacity-100"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100"
              leave-to-class="max-h-0 opacity-0"
              :style="{ maxHeight: isCollapsed ? '0' : '60vh' }"
            >
              <div v-show="!isCollapsed" class="border-t border-gray-200">
                <!-- Scrollable List -->
                <div class="overflow-y-auto" style="max-height: 60vh">
                  <div class="p-3 space-y-2">
                    <div
                      v-for="upload in $uploadQueue.queue.value"
                      :key="upload.id"
                      class="group"
                    >
                      <div class="flex items-center gap-2">
                        <!-- Status Icon -->
                        <div class="mt-1 h-full flex">
                          <Icon
                            v-if="upload.status === 'uploading'"
                            name="ri:loader-5-line"
                            class="animate-spin h-5 w-5 text-blue-600"
                          />
                          <Icon
                            v-else-if="upload.status === 'completed'"
                            name="ri:file-check-line"
                            class="size-5 text-green-600"
                          />
                          <Icon
                            v-else-if="upload.status === 'failed'"
                            name="ri:file-close-line"
                            class="size-5 text-red-600"
                          />
                          <Icon
                            v-else-if="upload.status === 'cancelled'"
                            name="ri:prohibited-line"
                            class="size-5 text-gray-400"
                          />
                          <Icon
                            v-else
                            name="ri:timer-2-line"
                            class="size-5 text-gray-400"
                          />
                        </div>
                        <!-- File Info -->
                        <div class="flex-1 min-w-0">
                          <p
                            class="text-xs font-medium truncate"
                            :class="{
                              'text-gray-900': upload.status !== 'failed',
                              'text-red-600': upload.status === 'failed',
                            }"
                          >
                            {{ upload.filename }}
                          </p>

                          <!-- Error Message -->
                          <p
                            v-if="upload.error"
                            class="text-xs text-red-500 mt-0.5"
                          >
                            {{ upload.error }}
                          </p>

                          <!-- Progress Bar -->
                          <div
                            v-if="upload.status === 'uploading'"
                            class="mt-1.5 flex items-center gap-2"
                          >
                            <div class="flex-1 bg-gray-200 rounded-full h-1">
                              <div
                                class="bg-blue-600 h-1 rounded-full transition-all"
                                :style="{ width: `${upload.progress}%` }"
                              />
                            </div>
                            <span class="text-xs text-gray-500 tabular-nums">
                              {{ upload.progress }}%
                            </span>
                          </div>
                        </div>

                        <!-- Cancel Button -->
                        <button
                          v-if="
                            upload.status === 'uploading' ||
                            upload.status === 'pending'
                          "
                          class="flex-shrink-0 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded transition-all"
                          title="Cancel upload"
                          @click="$uploadQueue.cancelUpload(upload.id)"
                        >
                          <Icon
                            name="ri:close-line"
                            class="size-4 text-red-600"
                          ></Icon>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Transition>
          </div>
        </Transition>
      </div>
    </Teleport>
  </ClientOnly>
</template>
