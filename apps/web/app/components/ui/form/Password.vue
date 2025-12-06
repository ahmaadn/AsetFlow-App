<script setup lang="ts">
interface Props {
  modelValue: string;
  label: string;
  placeholder?: string;
  error?: string | null;
  autocomplete?: string;
  hint?: string;
  required?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter your password',
  required: false,
  error: null,
  autocomplete: 'off',
  hint: undefined,
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const showPassword = ref(false);

const value = computed({
  get: () => props.modelValue,
  set: (val: string) => emit('update:modelValue', val),
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="form-control">
    <label class="label">
      <span class="label-text font-medium text-sm text-neutral">{{
        props.label
      }}</span>
    </label>
    <label
      class="input input-bordered flex items-center gap-2 w-full"
      :class="{ 'input-error': props.error }"
    >
      <Icon name="ri:lock-password-line" class="size-5 opacity-70" />
      <input
        v-model="value"
        :type="showPassword ? 'text' : 'password'"
        :placeholder="props.placeholder"
        :autocomplete="props.autocomplete"
        :required="props.required"
        class="grow"
      />
      <button
        type="button"
        class="btn btn-ghost btn-sm btn-circle"
        @click="togglePassword"
      >
        <Icon
          :name="showPassword ? 'ri:eye-off-line' : 'ri:eye-line'"
          class="size-5"
        />
      </button>
    </label>
    <label v-if="error" class="label">
      <span class="label-text-alt text-error text-sm">
        <Icon name="ri:error-warning-line" class="size-3 inline" />
        {{ props.error }}
      </span>
    </label>
    <label v-if="props.hint && !props.error" class="label">
      <span class="label-text-alt text-base-content/50 text-sm">
        {{ props.hint }}
      </span>
    </label>
  </div>
</template>
