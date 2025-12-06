<script setup lang="ts">
import { z } from 'zod';

definePageMeta({
  layout: 'auth',
});

const toast = useToast();
const isLoading = ref(false);

// Schema for forgot password form
const forgotPasswordSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
});

const { values, errors, handleSubmit } = useForm({
  initialValues: {
    email: '',
  },
  validationSchema: forgotPasswordSchema,
  onSubmit: async (values) => {
    if (isLoading.value) return;

    isLoading.value = true;
    try {
      // TODO: Implement forgot password logic with Better Auth
      // await authClient.forgetPassword({ email: values.email });

      toast.success('Password reset link has been sent to your email address.');
      console.log('Forgot password request for:', values.email);

      // Redirect to login page after successful request
      setTimeout(() => {
        navigateTo('/login');
      }, 2000);
    } catch (error) {
      console.error('Forgot password error:', error);
      toast.error('Failed to send reset link. Please try again.');
    } finally {
      isLoading.value = false;
    }
  },
});

const forgotPasswordFeatures = [
  {
    icon: 'ri:mail-send-line',
    title: 'Email Recovery',
    description: 'Receive a secure password reset link in your email',
  },
  {
    icon: 'ri:shield-check-line',
    title: 'Secure Process',
    description: 'Your account security is protected throughout the process',
  },
  {
    icon: 'ri:time-line',
    title: 'Quick Recovery',
    description: 'Reset your password in just a few simple steps',
  },
];
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-5 h-full w-full">
    <auth-sidebar
      title="Forgot Your Password?"
      subtitle="Don't worry! It happens to the best of us. Enter your email address and we'll send you a link to reset your password."
      :features="forgotPasswordFeatures"
      class="lg:col-span-2"
    />

    <div class="flex items-center justify-center bg-base-200 lg:col-span-3">
      <auth-form-card
        title="Reset Password"
        subtitle="Enter your email address to receive a password reset link"
        class="mx-2"
      >
        <form class="space-y-4" @submit="handleSubmit">
          <UiFormField
            v-model="values.email"
            label="Email Address"
            type="email"
            placeholder="Enter your registered email"
            icon="ri:mail-line"
            :error="errors.email"
            autocomplete="email"
          />

          <UiSubmitButton
            :loading="isLoading"
            loading-text="Sending Reset Link..."
            button-text="Send Reset Link"
            button-icon="ri:mail-send-line"
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
