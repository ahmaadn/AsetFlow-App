<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue';
type Option = { label: string; value: string | number };

const props = defineProps({
  options: {
    type: Array as () => Array<string | Option>,
    default: () => [],
  },
  multiple: { type: Boolean, default: false },
  placeholder: { type: String, default: 'Select...' },
  id: { type: String, default: '' },
  name: { type: String, default: '' },
});

const modelValue = defineModel<Option | Array<Option> | null>({
  default: null,
  required: false,
});

const root = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);
const dropdownRef = ref<HTMLElement | null>(null);
const query = ref('');
const isOpen = ref(false);
const highlightedIndex = ref(-1);

// Unique fallback so id/name never collide between instances
const localId = Math.random().toString(36).slice(2, 9);

const normalizedOptions = computed(() =>
  props.options.map((opt) =>
    typeof opt === 'string' ? { label: opt, value: opt } : opt
  )
);

// filter opsi berdasarkan query (input dari user)
const filteredOptions = computed(() => {
  if (!query.value) return normalizedOptions.value;
  return normalizedOptions.value.filter((opt) =>
    opt.label.toLowerCase().includes(query.value.toLowerCase())
  );
});

const selectOption = (option: Option) => {
  // Jika bukan multiple, langsung set modelValue dan tutup dropdown
  if (!props.multiple) {
    modelValue.value = option;
    isOpen.value = false;
    query.value = '';
    return;
  }

  // Jika multiple, tambahkan atau hapus dari array modelValue
  if (!Array.isArray(modelValue.value)) {
    modelValue.value = [option as Option];
    isOpen.value = false;
    query.value = '';
    return;
  }

  // Jika multiple, tambahkan atau hapus dari array modelValue
  const exists = modelValue.value.find((item) => item.value === option.value);
  if (exists) {
    modelValue.value.splice(
      modelValue.value.findIndex((item) => item.value === option.value),
      1
    );
  } else {
    modelValue.value.push(option as Option);
  }
  isOpen.value = false;
  query.value = '';
};

// Hapus opsi yang telah dipilih (untuk multiple)
function removeOption(option: Option) {
  if (!Array.isArray(modelValue.value)) return;

  // buat array baru untuk memastikan perubahan terdeteksi
  const arr = modelValue.value.slice();
  arr.splice(
    arr.findIndex((item) => item.value === option.value),
    1
  );
  modelValue.value = arr;
}

// Tutup dropdown jika klik di luar
function open() {
  isOpen.value = true;
  // focus input
  setTimeout(() => inputRef.value?.focus(), 0);
}

// Tutup dropdown
function close() {
  isOpen.value = false;
  highlightedIndex.value = -1;
}

// Bersihkan pilihan
function clear() {
  if (props.multiple) {
    modelValue.value = [];
  } else {
    modelValue.value = null;
  }
  query.value = '';
}

// Toggle dropdown
function toggleDropdown() {
  isOpen.value = !isOpen.value;
  if (isOpen.value) {
    setTimeout(() => inputRef.value?.focus(), 0);
  }
}

// Buka dropdown saat input di fokus
function onInput() {
  if (!isOpen.value) open();
}

// Cek apakah opsi sudah dipilih
function isSelected(opt: Option) {
  if (props.multiple) {
    return (
      Array.isArray(modelValue.value) &&
      !!modelValue.value.find((item) => item.value === opt.value)
    );
  }

  return !Array.isArray(modelValue.value) && modelValue.value === opt;
}

function onDocumentClick(e: MouseEvent) {
  if (!root.value) return;
  if (!(e.target instanceof Node)) return;
  if (!root.value.contains(e.target)) close();
}

async function ensureHighlightedVisible() {
  const container = dropdownRef.value;
  if (!container) return;
  await nextTick();
  const el = container.querySelector(
    `[data-index="${highlightedIndex.value}"]`
  ) as HTMLElement | null;
  if (!el) return;
  const cTop = container.scrollTop;
  const cBottom = cTop + container.clientHeight;
  const eTop = el.offsetTop;
  const eBottom = eTop + el.offsetHeight;
  if (eTop < cTop) {
    container.scrollTop = eTop;
  } else if (eBottom > cBottom) {
    container.scrollTop = eBottom - container.clientHeight;
  }
}

function onKeydown(e: KeyboardEvent) {
  if (!isOpen.value && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
    open();
    const len = filteredOptions.value.length;
    highlightedIndex.value = e.key === 'ArrowDown' ? 0 : Math.max(0, len - 1);
    ensureHighlightedVisible();
    return;
  }
  if (!isOpen.value) return;
  const len = filteredOptions.value.length;
  if (e.key === 'ArrowDown') {
    highlightedIndex.value = Math.min(len - 1, highlightedIndex.value + 1);
    ensureHighlightedVisible();
  } else if (e.key === 'ArrowUp') {
    highlightedIndex.value = Math.max(0, highlightedIndex.value - 1);
    ensureHighlightedVisible();
  } else if (e.key === 'Enter') {
    const opt = filteredOptions.value[highlightedIndex.value];
    if (opt) selectOption(opt);
  } else if (e.key === 'Escape') {
    close();
  }
}

onMounted(() => document.addEventListener('click', onDocumentClick));
onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick));
</script>

<template>
  <div ref="root" class="relative w-full" @keydown.stop.prevent="onKeydown">
    <div
      class="input flex items-center justify-between w-full h-auto min-h-[var(--size)]"
      role="combobox"
      :aria-expanded="isOpen"
      @click="open"
    >
      <div
        class="inline-flex w-full gap-2 items-center flex-wrap"
        :class="{ 'py-2': props.multiple }"
      >
        <div
          v-if="props.multiple && Array.isArray(modelValue)"
          class="contents"
        >
          <div
            v-for="(item, index) in modelValue"
            :key="index"
            class="join shadow"
          >
            <span class="badge badge-sm join-item">{{ item.label }}</span>
            <button
              type="button"
              class="badge badge-sm join-item badge-error px-1 pointer-events-auto"
              aria-label="Remove option"
              @mousedown.prevent="removeOption(item)"
              @click.stop
            >
              <Icon name="ri:close-line" class="h-4 w-4" />
            </button>
          </div>
        </div>
        <div class="flex-1 min-w-[100px]">
          <input
            :id="`combo-box-input-${localId}`"
            ref="inputRef"
            v-model="query"
            :name="`combo-box-input-${localId}`"
            :placeholder="
              props.multiple
                ? props.placeholder
                : modelValue
                  ? (modelValue as Option).label
                  : props.placeholder
            "
            :class="{
              '': props.multiple,
              'placeholder:text-neutral': !props.multiple,
            }"
            @input="onInput"
          />
        </div>
      </div>

      <div class="inline-flex gap-1 flex-nowrap">
        <button
          v-if="
            query ||
            (modelValue &&
              (Array.isArray(modelValue) ? modelValue.length > 0 : true))
          "
          type="button"
          class="flex h-full items-center"
          @click.stop="clear"
        >
          <Icon name="ri:close-line" class="h-5 w-5" />
        </button>
        <button
          type="button"
          class="flex h-full items-center"
          @click.stop="toggleDropdown"
        >
          <Icon
            name="ri:arrow-drop-up-fill"
            class="h-5 w-5"
            :class="{ 'rotate-180': isOpen }"
          />
        </button>
      </div>
    </div>

    <div
      v-if="isOpen"
      ref="dropdownRef"
      class="max-h-64 shadow-sm absolute left-0 right-0 top-full overflow-auto z-50 w-full mt-2 bg-base-100"
      role="listbox"
    >
      <ul class="menu menu-vertical rounded-box w-full">
        <li
          v-for="(opt, index) in filteredOptions"
          :key="opt.value ?? index"
          class="w-full"
          :data-index="index"
          :class="{ 'bg-base-200': highlightedIndex === index }"
          :aria-selected="isSelected(opt)"
        >
          <div
            @click.prevent="selectOption(opt)"
            @mouseenter="highlightedIndex = index"
            @mouseleave="highlightedIndex = -1"
          >
            <span v-if="isSelected(opt)">✓</span>
            <span v-else class="w-4 inline-block">&nbsp;</span>
            {{ opt.label }}
          </div>
        </li>
        <li v-if="filteredOptions.length === 0" class="opacity-50 italic">
          No options found.
        </li>
      </ul>
    </div>
  </div>
</template>
<style scoped>
.user-select {
  user-select: all;
}
</style>
