<template>
  <UiHeader>
    <template #left>
      <div class="flex items-center space-x-4">
        <button class="btn btn-sm btn-square btn-ghost">
          <Icon
            name="ri:restart-line"
            class="size-5 opacity-80 hover:opacity-100"
          />
        </button>
        <div role="tablist" class="tabs tabs-box tabs-sm">
          <a role="tab" class="tab">
            <Icon name="ri:layout-grid-line" class="size-5 opacity-50" />
          </a>
          <a role="tab" class="tab tab-active">
            <Icon name="ri:list-check" class="size-5" />
          </a>
        </div>
      </div>
    </template>
    <template #right>
      <div class="flex items-center space-x-4">
        <select class="select w-36">
          <option disabled selected>Type Asset</option>
          <option>
            <Icon name="ri:layout-grid-line" class="size-5" />
            All
          </option>
          <option>
            <Icon name="ri:image-line" class="size-5" />
            Image
          </option>
          <option>
            <Icon name="ri:video-line" class="size-5" />
            Video
          </option>
          <option>
            <Icon name="ri:file-text-line" class="size-5" />
            Document
          </option>
          <option>
            <Icon name="ri:music-line" class="size-5" />
            Audio
          </option>
        </select>

        <!-- Search Input -->
        <label class="input w-72">
          <Icon name="ri:search-line" class="size-5 opacity-50" />
          <input type="search" class="grow" placeholder="Search" />
        </label>
      </div>
    </template>
  </UiHeader>
</template>
