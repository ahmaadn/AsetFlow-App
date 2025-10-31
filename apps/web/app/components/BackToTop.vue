<script setup lang="ts">
interface Props {
  threshold?: number;
  bottom?: number;
  right?: number;
}

const props = withDefaults(defineProps<Props>(), {
  threshold: 300,
  bottom: 24,
  right: 24,
});

const isVisible = ref(false);
const scrollProgress = ref(0);

const { y } = useWindowScroll();

watch(y, (newY) => {
  isVisible.value = newY > props.threshold;

  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const maxScroll = documentHeight - windowHeight;
  scrollProgress.value = Math.min((newY / maxScroll) * 100, 100);
});

// Smooth scroll to top
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

const buttonStyle = computed(() => ({
  bottom: `${props.bottom}px`,
  right: `${props.right}px`,
}));
</script>

<template>
  <ClientOnly>
    <Transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="translate-y-2 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-2 opacity-0 "
    >
      <button
        v-if="isVisible"
        class="fixed z-40 group"
        :style="buttonStyle"
        title="Back to top"
        @click="scrollToTop"
      >
        <div class="relative">
          <div
            class="relative size-12 flex items-center justify-center bg-primary text-primary-content rounded-full shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-200"
          >
            <Icon name="ri:arrow-up-line" class="size-6" />
          </div>
        </div>
      </button>
    </Transition>
  </ClientOnly>
</template>
