<script setup lang="ts">
interface Props {
  confirmDelay: number;
  immediateStart?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  immediateStart: true,
});

const countdown = ref(props.confirmDelay);
const immediateStart = toRef(props, 'immediateStart');
const canConfirm = ref(false);

const { pause } = useInterval(1000, {
  controls: true,
  immediate: immediateStart.value,
  callback: () => {
    countdown.value--;
    if (countdown.value <= 0) {
      canConfirm.value = true;
      pause();
    }
  },
});

onUnmounted(() => {
  pause();
});
</script>

<template>
  <slot :can-confirm="canConfirm" :countdown="countdown"></slot>
</template>
