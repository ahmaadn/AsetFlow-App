<script setup lang="ts">
import type { Asset } from '~/types';

const { assets = [] } = defineProps<{ assets?: Asset[] }>();

// v-model untuk item terpilih (Asset | null)
const selected = defineModel<Asset | null>({ default: null });

function toggleSelect(asset: Asset) {
  if (!asset) return;
  selected.value =
    selected.value && selected.value.slug === asset.slug ? null : asset;
}
</script>
<template>
  <div class="flex-1 rounded-lg overflow-y-auto">
    <aset-grid class="p-4">
      <aset-item
        v-for="asset in assets"
        :key="asset.slug"
        :type="asset.type"
        :filename="asset.name"
        :selected="Boolean(selected && selected.slug === asset.slug)"
        @click="toggleSelect(asset)"
      >
        <template
          v-if="
            (asset.type === 'image' && asset.assetUrl) ||
            (asset.type === 'video' && asset.thumbnail)
          "
          #preview
        >
          <img
            :src="asset.type === 'video' ? asset.thumbnail : asset.assetUrl"
            :alt="asset.name"
            class="absolute inset-0 w-full h-full object-cover rounded opacity-100 transition-opacity duration-300"
          />
        </template>
      </aset-item>
    </aset-grid>
  </div>
</template>
