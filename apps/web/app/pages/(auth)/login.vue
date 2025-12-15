<script setup lang="ts">
import { loginSchema } from '@asetflow/validators';

definePageMeta({
  layout: 'auth',
});

const { auth: authApi } = useApi();
const auth = useAuth();
const toast = useToast();
const isLoading = ref(false);
const route = useRoute();

const { values, errors, handleSubmit } = useForm({
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema: loginSchema,
  onSubmit: async (values) => {
    console.log('Submitting login form with values:', values);
    try {
      isLoading.value = true;
      const response = await authApi.login(values.email, values.password);
      console.log('Login response:', response);
      auth.setTokens(response);
      toast.success('Login successful! Redirecting...');
      navigateTo('/');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(
        error.response?.data?.message ||
          'An error occurred during login. Please try again.'
      );
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

onMounted(async () => {
  if (route.query.error) {
    const errorMessages: Record<string, string> = {
      google_signin_failed: 'Google sign-in failed. Please try again.',
      // Add more error codes and messages here as needed
    };
    const errorMessage =
      errorMessages[route.query.error as string] ||
      'An unknown error occurred during login.';
    toast.error(errorMessage);
  }
});
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

          <div class="text-right">
            <NuxtLink to="/forgot-password" class="text-sm link link-primary">
              Forgot your password?
            </NuxtLink>
          </div>

          <UiSubmitButton
            :loading="isLoading"
            loading-text="Signing in..."
            button-text="Login"
            button-icon="ri:login-box-line"
          />
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
