<script setup lang="ts">
import type { ApiErrorResponse } from '@asetflow/shared';
import { PasswordValidationSchema } from '@asetflow/validators';

definePageMeta({
  layout: 'auth',
});

const FEATURES = [
  {
    icon: 'ri:lock-password-line',
    title: 'New Password',
    description: 'Create a strong password to secure your account',
  },
  {
    icon: 'ri:shield-check-line',
    title: 'Secure Reset',
    description: 'Your password reset is encrypted and secure',
  },
  {
    icon: 'ri:checkbox-circle-line',
    title: 'Almost Done',
    description: 'Just one more step to regain access to your account',
  },
];
const route = useRoute();
const toast = useToast();
const token = route.query.token as string;

if (!token) {
  throw createError({
    statusCode: 400,
    statusMessage:
      'Invalid reset token. Please request a new password reset link.',
  });
}

const { values, errors, handleSubmit, getFieldProps } = useForm({
  initialValues: {
    password: '',
    confirmPassword: '',
  },
  validationSchema: PasswordValidationSchema,
  onSubmit: async () => {
    await execute();
  },
});

const { execute, pending: isLoading } = useFetchAPI('/v1/auth/reset-password', {
  method: 'POST',
  immediate: false,
  watch: false,
  body: {
    newPassword: getFieldProps('password').value,
    token,
  },
  async onResponse({ response }) {
    if (response.ok) {
      toast.success(
        'Password has been successfully reset! You can now login with your new password.'
      );
      await navigateTo('/login');
    }
  },
  onResponseError({ response }) {
    const errorData = response._data as unknown as ApiErrorResponse;
    if (errorData && errorData.message) {
      toast.error(
        errorData.message ||
          'Failed to reset password. The link may be expired or invalid.'
      );
    }
  },
});
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-5 h-full w-full">
    <auth-sidebar
      title="Create New Password"
      subtitle="Your password reset link is valid. Please enter your new password below to complete the reset process."
      :features="FEATURES"
      class="lg:col-span-2"
    />

    <div class="flex items-center justify-center bg-base-200 lg:col-span-3">
      <auth-form-card
        title="Set New Password"
        subtitle="Enter your new password to complete the reset process"
        class="mx-2"
      >
        <form class="space-y-4" @submit="handleSubmit">
          <UiFormPassword
            v-model="values.password"
            label="New Password"
            placeholder="Enter your new password"
            :error="errors.password"
            autocomplete="new-password"
            hint="Must be at least 8 characters long"
          />

          <UiFormPassword
            v-model="values.confirmPassword"
            label="Confirm New Password"
            placeholder="Confirm your new password"
            :error="errors.confirmPassword"
            autocomplete="new-password"
          />

          <UiSubmitButton
            :loading="isLoading"
            loading-text="Updating Password..."
            button-text="Update Password"
            button-icon="ri:lock-password-line"
          />

          <div class="text-center text-sm text-base-content/60 mt-4">
            <p>
              Remember your password?
              <NuxtLink to="/login" class="link link-primary font-medium">
                Back to Login
              </NuxtLink>
            </p>
          </div>
        </form>
      </auth-form-card>
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: var(--color-base-200);
}
</style>
