<script setup lang="ts">
import type { Asset } from '~/types';

const props = defineProps<{
  asset: Asset;
}>();
</script>

<template>
  <aside
    id="asset-detail-panel"
    class="fixed inset-0 z-50 bg-base-100 inset-y-0 right-0 left-auto w-96 flex-shrink-0 border-l border-base-200 flex flex-col overflow-y-auto"
    :class="{ open: props.asset }"
  >
    <div class="p-6">
      <h3 class="text-lg font-semibold text-neutral">Detail Aset</h3>
      <div class="mt-4 aspect-video rounded bg-base-200 overflow-hidden">
        <img
          :src="
            props.asset.assetUrl ||
            props.asset.thumbnail ||
            'https://placehold.co/400x225'
          "
          :alt="props.asset.name"
          class="w-full h-full object-contain"
        />
      </div>
    </div>
    <div class="flex-1 px-6 pb-6 space-y-4">
      <h4 class="text-xs font-semibold uppercase text-neutral tracking-wider">
        Informasi
      </h4>
      <dl class="space-y-3 text-sm">
        <div class="flex justify-between">
          <dt class="text-neutral/60">Nama</dt>
          <dd class="font-medium text-neutral text-right">
            {{ props.asset.name }}
          </dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-neutral/60">Slug</dt>
          <dd class="font-medium text-neutral text-right">
            {{ props.asset.slug }}
          </dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-neutral/60">Tipe Aset</dt>
          <dd class="font-medium text-neutral">
            {{ props.asset.type }}
          </dd>
        </div>
        <div class="flex justify-between">
          <dt class="text-neutral/60">Ukuran</dt>
          <dd class="font-medium text-neutral">
            {{ props.asset.size }}
          </dd>
        </div>
      </dl>

      <div class="pt-4 space-y-4">
        <clipboard-input
          id="publicUrl"
          title="URL Public"
          :value="props.asset.publicUrl"
        />

        <clipboard-input
          v-if="props.asset.claudinaryUrl"
          id="claudinaryUrl"
          title="URL Claudinary"
          :value="props.asset.claudinaryUrl"
        />
      </div>
    </div>

    <div class="p-6 border-t border-base-300 bg-base-100">
      <h4
        class="text-xs font-semibold uppercase text-neutral tracking-wider mb-4"
      >
        Aksi
      </h4>
      <div class="grid grid-cols-2 gap-3">
        <button class="btn btn-primary col-span-2">Download</button>
        <button class="btn btn-soft btn-warning border border-warning">
          Edit
        </button>
        <button class="btn btn-soft btn-error border border-error">
          Hapus
        </button>
      </div>
    </div>
  </aside>
</template>
