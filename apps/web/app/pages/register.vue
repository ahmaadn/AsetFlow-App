<script setup lang="ts">
import { registerSchema } from '@asetflow/validators';

definePageMeta({
  layout: 'auth',
});

const { authClient } = useAuth();
const toast = useToast();
const isLoading = ref(false);

const { values, errors, handleSubmit } = useForm({
  initialValues: {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  },
  validationSchema: registerSchema,
  onSubmit: async (values) => {
    if (isLoading.value) return;

    isLoading.value = true;
    try {
      await authClient.signUp.email({
        name: values.name,
        email: values.email,
        password: values.password,
        fetchOptions: {
          cache: 'no-cache',
        },
        callbackURL: `${window.location.origin}/login`,
      });
      toast.success('Registration successful!');
      await navigateTo('/login');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('Registration failed. Please try again.');
    } finally {
      isLoading.value = false;
    }
  },
});

const registerFeatures = [
  {
    icon: 'ri:user-add-line',
    title: 'Quick Setup',
    description: 'Get started in under 2 minutes with our simple onboarding',
  },
  {
    icon: 'ri:shield-check-line',
    title: 'Secure by Default',
    description: 'Your data is encrypted and protected from day one',
  },
  {
    icon: 'ri:rocket-2-line',
    title: 'Instant Access',
    description: 'Start uploading and organizing your assets immediately',
  },
];
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-5 h-full w-full">
    <auth-sidebar
      title="Join AsetFlow Today"
      subtitle="Start managing your digital assets with our powerful platform. Create your account and get organized in minutes."
      :features="registerFeatures"
      class="lg:col-span-2"
    />

    <div class="flex items-center justify-center bg-base-200 lg:col-span-3">
      <auth-form-card title="Create Account">
        <form class="space-y-4" @submit="handleSubmit">
          <UiFormField
            v-model="values.name"
            label="Full Name"
            placeholder="John Doe"
            icon="ri:user-line"
            :error="errors.name"
            autocomplete="name"
          />

          <UiFormField
            v-model="values.email"
            label="Email Address"
            type="email"
            placeholder="john@example.com"
            icon="ri:mail-line"
            :error="errors.email"
            autocomplete="email"
          />

          <UiFormPassword
            v-model="values.password"
            label="Password"
            placeholder="Enter a strong password"
            :error="errors.password"
            autocomplete="new-password"
          />

          <UiFormPassword
            v-model="values.confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            :error="errors.confirmPassword"
            autocomplete="new-password"
          />

          <UiSubmitButton
            :loading="isLoading"
            loading-text="Creating Account..."
            button-text="Create Account"
            button-icon="ri:user-add-line"
          />
        </form>

        <auth-link
          message="Already have an account?"
          link-text="Sign In Instead"
          link-to="/login"
          link-icon="ri:login-box-line"
        />
      </auth-form-card>
    </div>
  </div>
</template>

<style scoped>
body {
  background-color: var(--color-base-200);
}
</style>
