<script setup lang="ts">
import type { AssetResponse } from '@asetflow/shared-types';

interface Props {
  asset: AssetResponse;
}

const props = defineProps<Props>();

const isDropdownOpen = ref(false);
const dropdownRef = useTemplateRef<HTMLDivElement>('dropdownRef');

// Close dropdown when clicking outside
onClickOutside(dropdownRef, () => {
  isDropdownOpen.value = false;
});

function toggleDropdown(event: Event): void {
  event.stopPropagation();
  isDropdownOpen.value = !isDropdownOpen.value;
}

function handleAction(action: string, event: Event): void {
  event.stopPropagation();
  isDropdownOpen.value = false;

  switch (action) {
    case 'download':
      window.open(props.asset.url, '_blank');
      break;
    case 'copy-link':
      navigator.clipboard.writeText(props.asset.url);
      break;
    case 'preview':
      // Emit event for preview - handled by parent
      break;
    default:
      break;
  }
}
</script>

<template>
  <div ref="dropdownRef" class="relative">
    <button
      class="btn btn-ghost btn-sm btn-square"
      title="More actions"
      @click="toggleDropdown"
    >
      <Icon name="ri:more-2-fill" class="size-5" />
    </button>

    <Transition
      enter-active-class="transition ease-out duration-100"
      enter-from-class="transform opacity-0 scale-95"
      enter-to-class="transform opacity-100 scale-100"
      leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100"
      leave-to-class="transform opacity-0 scale-95"
    >
      <div
        v-if="isDropdownOpen"
        class="absolute right-0 top-full z-50 mt-1 min-w-40 rounded-lg border border-base-300 bg-base-100 py-1 shadow-lg"
      >
        <ul class="menu menu-sm p-0">
          <li>
            <a @click="handleAction('download', $event)">
              <Icon name="ri:download-line" class="size-4" />
              Download
            </a>
          </li>
          <li>
            <a @click="handleAction('copy-link', $event)">
              <Icon name="ri:link" class="size-4" />
              Copy link
            </a>
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>
