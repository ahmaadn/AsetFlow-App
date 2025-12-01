<script setup lang="ts">
import { loginSchema } from '@asetflow/validators';

definePageMeta({
  layout: 'auth',
});

const { login } = useAuth();
const toast = useToast();
const isLoading = ref(false);

const { values, errors, handleSubmit } = useForm({
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema: loginSchema,
  onSubmit: async (values) => {
    if (isLoading.value) return;

    isLoading.value = true;
    try {
      await login(values);
      toast.success('Login successful! Welcome back.');
      await navigateTo('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed. Please check your credentials.');
    } finally {
      isLoading.value = false;
    }
  },
});

const loginFeatures = [
  {
    icon: 'ri:checkbox-circle-fill',
    title: 'Secure Storage',
    description: 'Your assets are protected with enterprise-grade security',
  },
  {
    icon: 'ri:checkbox-circle-fill',
    title: 'Easy Organization',
    description: 'Intuitive folder structure and tagging system',
  },
  {
    icon: 'ri:checkbox-circle-fill',
    title: 'Fast Access',
    description: 'Quick search and instant previews for all your files',
  },
];
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-5 h-full w-full">
    <auth-sidebar
      title="Manage Your Digital Assets with Ease"
      subtitle="Organize, store, and share your media files efficiently with our powerful asset management platform."
      :features="loginFeatures"
      class="lg:col-span-2"
    />

    <div class="flex items-center justify-center bg-base-200 lg:col-span-3">
      <auth-form-card title="Welcome Back" class="mx-2">
        <form class="space-y-3" @submit="handleSubmit">
          <UiFormField
            v-model="values.email"
            label="Email Address"
            type="email"
            placeholder="leroy@jenkins.com"
            icon="ri:mail-line"
            :error="errors.email"
            autocomplete="email"
          />

          <UiFormPassword
            v-model="values.password"
            label="Password"
            placeholder="Enter your password"
            :error="errors.password"
            autocomplete="current-password"
          />

          <UiSubmitButton
            :loading="isLoading"
            loading-text="Signing in..."
            button-text="Login"
            button-icon="ri:login-box-line"
          />

          <!--TODO : WIP Auth bisa menggunakan google -->
          <button type="button" class="btn w-full bg-white text-black">
            <Icon name="logos:google-icon" class="size-5" />
            Login with Google
          </button>
          <button
            type="button"
            class="btn w-full bg-black text-white border-black"
          >
            <Icon name="ri:github-fill" class="size-5" />
            Login with GitHub
          </button>
        </form>

        <auth-link
          message="Don't have an account?"
          link-text="Create Account"
          link-to="/register"
          link-icon="ri:user-add-line"
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
