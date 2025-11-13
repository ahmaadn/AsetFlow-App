<script setup lang="ts">
interface Props {
  modelValue?: boolean;
  teleportTo?: string | HTMLElement | null;
  zIndex?: number | string;
}

const props = withDefaults(defineProps<Props>(), {
  teleportTo: 'body',
  zIndex: 50,
  modelValue: false,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'close'): void;
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (v: boolean) => emit('update:modelValue', v),
});

function close() {
  isOpen.value = false;
  emit('close');
}
</script>

<template>
  <!-- Teleport ke body (default) untuk menghindari masalah z-index/overflow -->
  <Teleport v-if="isOpen && props.teleportTo" :to="props.teleportTo">
    <div class="fixed inset-0" :style="{ zIndex: String(props.zIndex) }">
      <div class="absolute inset-0" @click="close" />
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
    <div class="absolute inset-0 bg-neutral/30" @click="close" />
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
