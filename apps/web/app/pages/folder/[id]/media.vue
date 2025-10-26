<script setup lang="ts">
import { checkFolderIdApi } from '~/lib/api/folder';
import type { Asset } from '~/types';

definePageMeta({
  title: 'Media Library',
  async validate(route) {
    const auth = useAuth();
    if (!auth.isAuthenticated.value) return false;

    // Mencoba mendapatkan folder dari store terlebih dahulu
    const folderStore = useFolderStore();
    const existingFolder = folderStore.findFolderById(
      route.params.id as string
    );
    if (existingFolder) return true;

    try {
      await checkFolderIdApi(route.params.id as string);
      return true;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_) {
      return false;
    }
  },
});

const assets: Asset[] = [
  {
    name: 'hero-banner-v2.png',
    slug: 'hero-banner-v2',
    type: 'image',
    size: '1.2 MB',
    assetUrl: 'https://placehold.co/600x400?text=Hero+Banner',
    publicUrl: '/laporan-bulanan/hero-banner-v2',
    claudinaryUrl: '/laporan-bulanan/hero-banner-v2',
  },
  {
    name: 'product-hero.jpg',
    slug: 'product-hero',
    type: 'image',
    size: '850 KB',
    assetUrl: 'https://placehold.co/600x400?text=Product',
    publicUrl: '/product/product-hero',
    claudinaryUrl: '/laporan-bulanan/hero-banner-v2',
  },
  {
    name: 'library-thumb.png',
    slug: 'library-thumb',
    type: 'image',
    size: '450 KB',
    assetUrl: 'https://placehold.co/600x400?text=Library',
    publicUrl: '/media/library-thumb',
    claudinaryUrl: '/laporan-bulanan/hero-banner-v2',
  },
  {
    name: 'office-photo.jpg',
    slug: 'office-photo',
    type: 'image',
    size: '2.1 MB',
    assetUrl: 'https://placehold.co/600x400?text=Office',
    publicUrl: '/media/office-photo',
    claudinaryUrl: '/laporan-bulanan/hero-banner-v2',
  },
  {
    name: 'intro-video.mp4',
    slug: 'intro-video',
    type: 'video',
    size: '12.4 MB',
    assetUrl: 'https://placehold.co/600x400',
    thumbnail: 'https://placehold.co/600x400?text=Thumb',
    publicUrl: '/media/intro-video',
    claudinaryUrl: '/laporan-bulanan/hero-banner-v2',
  },
  {
    name: 'presentation.pdf',
    slug: 'presentation',
    type: 'document',
    size: '320 KB',
    assetUrl: 'https://placehold.co/600x400',
    publicUrl: '/media/presentation',
    claudinaryUrl: '/laporan-bulanan/hero-banner-v2',
  },
  {
    name: 'podcast-ep1.mp3',
    slug: 'podcast-ep1',
    type: 'audio',
    size: '5.6 MB',
    assetUrl: 'https://placehold.co/600x400',
    publicUrl: '/media/podcast-ep1',
    claudinaryUrl: '/laporan-bulanan/hero-banner-v2',
  },
  {
    name: 'gallery-01.jpg',
    slug: 'gallery-01',
    type: 'image',
    size: '780 KB',
    assetUrl: 'https://placehold.co/600x400?text=Gallery+1',
    publicUrl: '/media/gallery-01',
    claudinaryUrl: '/laporan-bulanan/hero-banner-v2',
  },
  {
    name: 'gallery-02.jpg',
    slug: 'gallery-02',
    type: 'image',
    size: '910 KB',
    assetUrl: 'https://placehold.co/600x400?text=Gallery+2',
    publicUrl: '/media/gallery-02',
    claudinaryUrl: '/laporan-bulanan/hero-banner-v2',
  },
  {
    name: 'product-demo.mp4',
    slug: 'product-demo',
    type: 'video',
    size: '24.8 MB',
    assetUrl: 'https://placehold.co/600x400',
    thumbnail: 'https://placehold.co/600x400?text=Demo+Thumb',
    publicUrl: '/media/product-demo',
    claudinaryUrl: '/laporan-bulanan/hero-banner-v2',
  },
];

// selection state: null = hidden
const selectedAsset = ref<Asset | null>(null);
</script>

<template>
  <UiContent>
    <MediaHeader />
    <div class="flex-1 p-2 flex">
      <!-- Galeri Aset -->
      <MediaGrid v-model="selectedAsset" :assets="assets" />
    </div>
    <template v-if="selectedAsset">
      <!-- mobile-only overlay: click to close -->
      <div
        class="fixed inset-0 bg-black/30 z-40"
        @click="selectedAsset = null"
      />

      <aset-panel :asset="selectedAsset" />
    </template>
  </UiContent>
</template>
