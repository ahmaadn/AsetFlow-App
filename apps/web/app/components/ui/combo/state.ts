// Types
export type ComboBoxOption = {
  label: string;
  value: string | number;
  [key: string]: unknown;
};

export type ComboBoxValue = ComboBoxOption | ComboBoxOption[] | null;

export interface ComboBoxProps {
  options: Array<string | ComboBoxOption>;
  multiple?: boolean;
  placeholder?: string;
  id?: string;
  name?: string;
}

export interface ComboBoxDisplaySlotProps {
  modelValue: ComboBoxValue;
  isOpen: boolean;
  open: () => void;
  clear: () => void;
  toggle: () => void;
  query: string;
}

export interface ComboBoxOptionSlotProps {
  option: ComboBoxOption;
}

// Composables
export function useComboBoxState(
  modelValue: Ref<ComboBoxValue>,
  multiple: boolean
) {
  const query = ref('');
  const isOpen = ref(false);
  const highlightedIndex = ref(-1);

  function open() {
    isOpen.value = true;
  }

  function close() {
    isOpen.value = false;
    highlightedIndex.value = -1;
  }

  function toggle() {
    isOpen.value = !isOpen.value;
  }

  function clear() {
    modelValue.value = multiple ? [] : null;
    query.value = '';
  }

  function selectOption(option: ComboBoxOption) {
    if (!multiple) {
      if (
        !Array.isArray(modelValue.value) &&
        modelValue.value?.value === option.value
      ) {
        modelValue.value = null;
      } else {
        modelValue.value = option;
      }
      isOpen.value = false;
      query.value = '';
      return;
    }

    if (!Array.isArray(modelValue.value)) {
      modelValue.value = [option];
      isOpen.value = false;
      query.value = '';
      return;
    }

    const exists = modelValue.value.find((item) => item.value === option.value);
    if (exists) {
      modelValue.value.splice(
        modelValue.value.findIndex((item) => item.value === option.value),
        1
      );
    } else {
      modelValue.value.push(option);
    }
    isOpen.value = false;
    query.value = '';
  }

  function removeOption(option: ComboBoxOption) {
    if (!Array.isArray(modelValue.value)) return;

    const arr = modelValue.value.slice();
    arr.splice(
      arr.findIndex((item) => item.value === option.value),
      1
    );
    modelValue.value = arr;
  }

  function isSelected(option: ComboBoxOption): boolean {
    if (multiple) {
      return (
        Array.isArray(modelValue.value) &&
        !!modelValue.value.find((item) => item.value === option.value)
      );
    }

    return (
      !Array.isArray(modelValue.value) &&
      modelValue.value?.value === option.value
    );
  }

  return {
    query,
    isOpen,
    highlightedIndex,
    open,
    close,
    toggle,
    clear,
    selectOption,
    removeOption,
    isSelected,
  };
}

export function useComboBoxKeyboard(
  isOpen: Ref<boolean>,
  highlightedIndex: Ref<number>,
  filteredOptions: ComputedRef<ComboBoxOption[]>,
  open: () => void,
  close: () => void,
  selectOption: (option: ComboBoxOption) => void,
  dropdownRef: Ref<HTMLElement | null>
) {
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
    if (['ArrowDown', 'ArrowUp', 'Enter', 'Escape'].includes(e.key)) {
      e.preventDefault();
    }

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

  return {
    onKeydown,
  };
}

export function useComboBoxDropdown(
  root: Ref<HTMLElement | null>,
  close: () => void
) {
  function onDocumentClick(e: MouseEvent) {
    if (!root.value) return;
    if (!(e.target instanceof Node)) return;
    if (!root.value.contains(e.target)) close();
  }

  onMounted(() => document.addEventListener('click', onDocumentClick));
  onBeforeUnmount(() => document.removeEventListener('click', onDocumentClick));
}
