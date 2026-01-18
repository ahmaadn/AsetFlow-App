# UI Combo Box Components

A flexible and accessible combobox component with support for single/multiple selection, search, keyboard navigation, and infinite scroll.

## Components

### UiComboBox

Main combo box component with all features.

#### Basic Usage

```vue
<script setup lang="ts">
const selected = ref(null);
const options = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
</script>

<template>
  <UiComboBox
    v-model="selected"
    :options="options"
    placeholder="Select fruit..."
  />
</template>
```

#### With Objects

```vue
<script setup lang="ts">
const selected = ref(null);
const options = [
  { label: 'Apple', value: 'apple', color: 'red' },
  { label: 'Banana', value: 'banana', color: 'yellow' },
  { label: 'Cherry', value: 'cherry', color: 'red' },
];
</script>

<template>
  <UiComboBox
    v-model="selected"
    :options="options"
    placeholder="Select fruit..."
  >
    <template #option="{ option }">
      <span class="badge" :class="`badge-${option.color}`">{{
        option.label
      }}</span>
    </template>
  </UiComboBox>
</template>
```

#### Multiple Selection

```vue
<script setup lang="ts">
const selected = ref([]);
const options = ['React', 'Vue', 'Angular', 'Svelte'];
</script>

<template>
  <UiComboBox
    v-model="selected"
    :options="options"
    multiple
    placeholder="Select frameworks..."
  />
</template>
```

### Infinite Scroll

#### Client-Side Pagination

For large datasets that are already loaded:

```vue
<script setup lang="ts">
const selected = ref(null);
const allOptions = ref([
  // ... 1000+ options
]);
</script>

<template>
  <UiComboBox
    v-model="selected"
    :options="allOptions"
    infinite-scroll
    :page-size="50"
    placeholder="Select from 1000+ options..."
  />
</template>
```

#### Server-Side Pagination

For dynamic data loading from API:

```vue
<script setup lang="ts">
import { useInfiniteScroll } from '~/components/ui/combo/useInfiniteScroll';

const selected = ref(null);
const loading = ref(false);

// Fetch data from API
async function fetchUsers(page: number, pageSize: number, query: string) {
  const response = await $fetch('/api/users', {
    params: { page, pageSize, search: query },
  });
  return response.data.map((user) => ({
    label: user.name,
    value: user.id,
    email: user.email,
  }));
}

// Use infinite scroll composable
const {
  items,
  loading: loadingState,
  loadMore,
} = useInfiniteScroll({
  fetchData: fetchUsers,
  pageSize: 20,
});

watch(loadingState, (val) => {
  loading.value = val;
});
</script>

<template>
  <UiComboBox
    v-model="selected"
    :options="items"
    :loading="loading"
    infinite-scroll
    :page-size="20"
    placeholder="Search users..."
    @load-more="loadMore"
  >
    <template #option="{ option }">
      <div class="flex flex-col">
        <span class="font-medium">{{ option.label }}</span>
        <span class="text-xs text-base-content/60">{{ option.email }}</span>
      </div>
    </template>
  </UiComboBox>
</template>
```

#### With Search Integration

```vue
<script setup lang="ts">
import { useInfiniteScroll } from '~/components/ui/combo/useInfiniteScroll';

const selected = ref(null);

const { items, loading, search, loadMore } = useInfiniteScroll({
  fetchData: async (page, pageSize, query) => {
    const { data } = await $fetch('/api/search', {
      params: { q: query, page, limit: pageSize },
    });
    return data;
  },
  pageSize: 25,
  debounceSearch: true,
  debounceDelay: 300,
});

// Trigger search when query changes
function handleQueryChange(query: string) {
  search(query);
}
</script>

<template>
  <UiComboBox
    v-model="selected"
    :options="items"
    :loading="loading"
    infinite-scroll
    placeholder="Search..."
    @update:query="handleQueryChange"
    @load-more="loadMore"
  />
</template>
```

## Props

### UiComboBox

| Prop             | Type                              | Default       | Description                        |
| ---------------- | --------------------------------- | ------------- | ---------------------------------- |
| `modelValue`     | `ComboBoxValue`                   | `null`        | Selected value(s)                  |
| `options`        | `Array<string \| ComboBoxOption>` | `[]`          | Available options                  |
| `multiple`       | `boolean`                         | `false`       | Enable multiple selection          |
| `placeholder`    | `string`                          | `'Select...'` | Placeholder text                   |
| `infiniteScroll` | `boolean`                         | `false`       | Enable infinite scroll             |
| `pageSize`       | `number`                          | `20`          | Items per page for infinite scroll |
| `loading`        | `boolean`                         | `false`       | Show loading indicator             |
| `id`             | `string`                          | -             | Input ID attribute                 |
| `name`           | `string`                          | -             | Input name attribute               |

### UiComboDropdown

| Prop               | Type               | Default | Description                             |
| ------------------ | ------------------ | ------- | --------------------------------------- |
| `options`          | `ComboBoxOption[]` | `[]`    | Options to display                      |
| `highlightedIndex` | `number`           | `-1`    | Currently highlighted index             |
| `isSelected`       | `Function`         | -       | Function to check if option is selected |
| `infiniteScroll`   | `boolean`          | `false` | Enable infinite scroll                  |
| `pageSize`         | `number`           | `20`    | Items per page                          |
| `loading`          | `boolean`          | `false` | Show loading state                      |

## Events

| Event               | Payload         | Description                                           |
| ------------------- | --------------- | ----------------------------------------------------- |
| `update:modelValue` | `ComboBoxValue` | Emitted when selection changes                        |
| `load-more`         | -               | Emitted when user scrolls to bottom (infinite scroll) |
| `update:query`      | `string`        | Emitted when search query changes                     |

## Types

```typescript
type ComboBoxOption = {
  label: string;
  value: string | number;
  [key: string]: unknown;
};

type ComboBoxValue = ComboBoxOption | ComboBoxOption[] | null;
```

## Slots

### `display`

Customize the display/trigger component.

```vue
<template>
  <UiComboBox v-model="selected" :options="options">
    <template #display="{ modelValue, isOpen, toggle }">
      <button @click="toggle">
        {{ modelValue?.label || 'Select...' }}
        <Icon :name="isOpen ? 'ri:arrow-up-line' : 'ri:arrow-down-line'" />
      </button>
    </template>
  </UiComboBox>
</template>
```

### `option`

Customize option rendering.

```vue
<template>
  <UiComboBox v-model="selected" :options="options">
    <template #option="{ option }">
      <div class="flex items-center gap-2">
        <img :src="option.avatar" class="w-6 h-6 rounded-full" />
        <span>{{ option.label }}</span>
      </div>
    </template>
  </UiComboBox>
</template>
```

## Keyboard Navigation

- `ArrowDown` - Open dropdown and move to next option
- `ArrowUp` - Open dropdown and move to previous option
- `Enter` - Select highlighted option
- `Escape` - Close dropdown
- Type to search - Filter options by typing

## Accessibility

- Full keyboard navigation support
- ARIA attributes for screen readers
- Focus management
- Proper role attributes

## Features

✅ Single and multiple selection
✅ Search/filter options
✅ Keyboard navigation
✅ Custom option rendering
✅ Infinite scroll (client & server-side)
✅ Loading states
✅ Accessible (ARIA)
✅ Click outside to close
✅ Responsive design

## Examples

### Async Data with Pagination

```vue
<script setup lang="ts">
const selected = ref(null);
const page = ref(1);
const options = ref([]);
const loading = ref(false);
const hasMore = ref(true);

async function loadMore() {
  if (loading.value || !hasMore.value) return;

  loading.value = true;
  try {
    const { data, pagination } = await $fetch('/api/items', {
      params: { page: page.value, limit: 20 },
    });

    options.value = [...options.value, ...data];
    hasMore.value = pagination.hasNext;
    page.value++;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  loadMore();
});
</script>

<template>
  <UiComboBox
    v-model="selected"
    :options="options"
    :loading="loading"
    infinite-scroll
    placeholder="Select item..."
    @load-more="loadMore"
  />
</template>
```

### With Categories

```vue
<script setup lang="ts">
const selected = ref(null);
const options = [
  { label: 'Apple', value: 'apple', category: 'Fruits' },
  { label: 'Banana', value: 'banana', category: 'Fruits' },
  { label: 'Carrot', value: 'carrot', category: 'Vegetables' },
  { label: 'Broccoli', value: 'broccoli', category: 'Vegetables' },
];
</script>

<template>
  <UiComboBox v-model="selected" :options="options">
    <template #option="{ option }">
      <div class="flex items-center justify-between w-full">
        <span>{{ option.label }}</span>
        <span class="badge badge-sm">{{ option.category }}</span>
      </div>
    </template>
  </UiComboBox>
</template>
```
