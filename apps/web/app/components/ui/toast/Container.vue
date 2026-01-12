<script setup lang="ts">
const { remove, toasts } = useToast();

const props = withDefaults(
  defineProps<{
    position?: ToastPosition;
  }>(),
  {
    position: 'top-right',
  }
);

// CSS classes untuk setiap posisi
const positionClasses: Record<ToastPosition, string> = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4',
};

// CSS classes untuk setiap tipe
const typeClasses = {
  success: 'alert-success border border-success/20',
  error: 'alert-error border border-error/20 ',
  warning: 'alert-warning border border-warning/20 ',
  info: 'alert-info border border-info/20 ',
  default: 'bg-base-100 text-base-content',
};

const btnColor = {
  success: 'btn-success ',
  error: 'btn-error',
  warning: 'btn-warning',
  info: 'btn-info',
  default: '',
};
</script>

<template>
  <div class="toast-container fixed z-50 pointer-events-none">
    <div
      :class="[
        'fixed z-50 flex flex-col gap-2 pointer-events-none',
        positionClasses[props.position],
      ]"
    >
      <div id="toast-upload">
        <UiToastUploaded />
      </div>
      <TransitionGroup name="toast" tag="div" class="flex flex-col gap-2">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'max-w-md md:w-96 alert  pointer-events-auto animate-in slide-in-from-top-2 z-100 relative shadow-sm',
            typeClasses[toast.type],
          ]"
        >
          <Icon v-if="toast.icon" :name="toast.icon" class="size-5"> </Icon>

          <!-- Content -->
          <div class="flex-1 min-w-0 pr-2">
            <div v-if="toast.title" class="font-semibold">
              {{ toast.title }}
            </div>
            <div class="text-sm opacity-90">
              {{ toast.message }}
            </div>
          </div>

          <button
            v-if="toast.closable"
            :class="[
              'shrink-0 hover:opacity-80 transition-opacity btn btn-square btn-ghost btn-xs absolute top-1 right-1',
              btnColor[toast.type],
            ]"
            aria-label="Close"
            @click="remove(toast.id)"
          >
            <Icon name="ri:close-line" class="size-5"></Icon>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
/* Toast animation */
.toast-enter-active {
  animation: toast-in 0.3s ease-out;
}

.toast-leave-active {
  animation: toast-out 0.3s ease-in;
}

@keyframes toast-in {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes toast-out {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-12px);
  }
}
</style>
