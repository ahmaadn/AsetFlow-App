<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    default: 'my-drawer-2',
  },
});

const menu = [
  {
    title: 'Recently',
    items: [{ label: 'Overview', icon: 'ri:search-eye-line', to: '' }],
  },
  {
    title: 'Dashboard',
    items: [{ label: 'Dashboard', icon: 'ri:function-line', to: '/dashboard' }],
  },
  {
    title: 'Files',
    items: [
      { label: 'Folder', icon: 'ri:folder-line', to: '/folder' },
      { label: 'Media Library', icon: 'ri:stack-line', to: '/media' },
      { label: 'Dokumen', icon: 'ri:file-2-line', to: '' },
      { label: 'Photo', icon: 'ri:multi-image-line', to: '' },
      { label: 'Videos', icon: 'ri:video-on-line', to: '' },
      { label: 'Music', icon: 'ri:music-line', to: '' },
    ],
  },
  {
    title: 'Files',
    items: [
      { label: 'Setting', icon: 'ri:settings-line', to: '' },
      { label: 'Logout', icon: 'ri:logout-box-line', to: '' },
    ],
  },
];

const route = useRoute();
</script>

<template>
  <div class="drawer lg:drawer-open">
    <input :id="props.id" type="checkbox" class="drawer-toggle" />
    <main class="drawer-content">
      <slot />
    </main>
    <div class="drawer-side">
      <label
        :for="props.id"
        aria-label="close sidebar"
        class="drawer-overlay"
      />

      <div
        class="min-h-full w-72 bg-base-100 shadow shadow-base-300 border-r border-base-300 text-base-content"
      >
        <div class="p-4 inline-flex items-center gap-x-2 font-brand">
          <UiLogo class="h-11 w-11" />
          <span class="font-bold md:text-3xl text-2xl">AsetFlow</span>
        </div>

        <template v-for="(section, _) in menu" :key="_">
          <ul class="menu px-4 py-2 w-full">
            <h2 class="menu-title">{{ section.title }}</h2>
            <li v-for="(item, iIndex) in section.items" :key="iIndex">
              <NuxtLink
                :to="item.to"
                :class="{
                  'text-primary bg-base-200 hover:bg-base-300 border-l-4 border-primary is-active':
                    item.to &&
                    item.to !== '' &&
                    route.fullPath.startsWith(item.to),
                }"
              >
                <Icon :name="item.icon" class="h-5 w-5" />
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </template>
      </div>
    </div>
  </div>
</template>
