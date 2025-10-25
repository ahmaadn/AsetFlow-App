<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type CloseReason = 'backdrop' | 'esc' | 'programmatic';

const props = withDefaults(
  defineProps<{
    modelValue: boolean;
    closeOnBackdrop?: boolean;
    closeOnEsc?: boolean;
    lockScroll?: boolean;
    teleportTo?: string | HTMLElement | null;
    zIndex?: number | string;
  }>(),
  {
    closeOnBackdrop: true,
    closeOnEsc: true,
    lockScroll: true,
    teleportTo: 'body',
    zIndex: 50,
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close', reason: CloseReason): void;
  (e: 'open' | 'backdrop'): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
});

const lastCloseReason = ref<CloseReason>('programmatic');

function close(reason: CloseReason = 'programmatic') {
  lastCloseReason.value = reason;
  isOpen.value = false;
}

function onBackdropClick() {
  emit('backdrop');
  if (props.closeOnBackdrop) close('backdrop');
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.closeOnEsc && isOpen.value) {
    e.stopPropagation();
    close('esc');
  }
}

let previousBodyOverflow: string | null = null;
function lockBodyScroll() {
  if (!props.lockScroll) return;
  previousBodyOverflow = document.body.style.overflow || '';
  document.body.style.overflow = 'hidden';
}
function unlockBodyScroll() {
  if (!props.lockScroll) return;
  document.body.style.overflow = previousBodyOverflow ?? '';
  previousBodyOverflow = null;
}

watch(
  () => props.modelValue,
  (open) => {
    if (open) {
      emit('open');
      window.addEventListener('keydown', onKeydown);
      lockBodyScroll();
    } else {
      window.removeEventListener('keydown', onKeydown);
      unlockBodyScroll();
      emit('close', lastCloseReason.value);
      lastCloseReason.value = 'programmatic';
    }
  },
  { immediate: true }
);
</script>

<template>
  <!-- Teleport ke body (default) untuk menghindari masalah z-index/overflow -->
  <Teleport v-if="isOpen && props.teleportTo" :to="props.teleportTo">
    <div class="fixed inset-0" :style="{ zIndex: String(props.zIndex) }">
      <div class="absolute inset-0 bg-neutral/30" @click="onBackdropClick" />
      <div class="modal modal-open pointer-events-none">
        <div
          class="modal-box pointer-events-auto shadow"
          role="dialog"
          aria-modal="true"
        >
          <slot></slot>
        </div>
      </div>
    </div>
  </Teleport>

  <!-- Fallback tanpa teleport -->
  <div
    v-else-if="isOpen"
    class="fixed inset-0"
    :style="{ zIndex: String(props.zIndex) }"
  >
    <div class="absolute inset-0 bg-neutral/30" @click="onBackdropClick" />
    <div class="modal modal-open pointer-events-none">
      <div
        class="modal-box pointer-events-auto shadow"
        role="dialog"
        aria-modal="true"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>
