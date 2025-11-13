<script setup lang="ts">
import { loginSchema } from '@asetflow/validators';
import type { AuthTokens } from '@asetflow/shared-types';

definePageMeta({
  layout: 'auth',
});

const { setToken } = useAuth();
const { loading, execute } = useApiState<AuthTokens>('/auth/login');
const toast = useToast();
const showPassword = ref(false);

const { values, errors, handleSubmit } = useForm({
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema: loginSchema,
  onSubmit: async (values) => {
    await execute({
      method: 'POST',
      body: {
        email: values.email,
        password: values.password,
      },
      onSuccess: (data) => {
        setToken(data.accessToken);
        toast.success('Login successful! Welcome back.');
        navigateTo('/dashboard');
      },
      onError: (_) => {
        toast.error('Login failed. Please check your credentials.');
      },
    });
  },
});

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 h-full w-full">
    <div
      class="hidden lg:flex flex-col justify-between p-12 relative bg-primary text-primary-content overflow-hidden"
    >
      <!-- Decorative circles -->
      <div
        class="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"
      />
      <div
        class="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"
      />

      <div class="relative z-10">
        <div class="flex items-center gap-3 mb-8">
          <ui-logo class="size-12 text-white" />
          <span class="text-2xl font-bold">AsetFlow</span>
        </div>
        <h2 class="text-4xl font-bold mb-4">
          Manage Your Digital Assets with Ease
        </h2>
        <p class="text-lg text-primary-content/80 max-w-md">
          Organize, store, and share your media files efficiently with our
          powerful asset management platform.
        </p>
      </div>

      <div class="relative z-10 space-y-4">
        <div class="flex items-start gap-3">
          <Icon name="ri:checkbox-circle-fill" class="size-6 mt-0.5" />
          <div>
            <h3 class="font-semibold mb-1">Secure Storage</h3>
            <p class="text-sm text-primary-content/70">
              Your assets are protected with enterprise-grade security
            </p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <Icon name="ri:checkbox-circle-fill" class="size-6 mt-0.5" />
          <div>
            <h3 class="font-semibold mb-1">Easy Organization</h3>
            <p class="text-sm text-primary-content/70">
              Intuitive folder structure and tagging system
            </p>
          </div>
        </div>
        <div class="flex items-start gap-3">
          <Icon name="ri:checkbox-circle-fill" class="size-6 mt-0.5" />
          <div>
            <h3 class="font-semibold mb-1">Fast Access</h3>
            <p class="text-sm text-primary-content/70">
              Quick search and instant previews for all your files
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center bg-base-200">
      <div class="w-full max-w-md">
        <!-- Mobile Logo -->
        <div class="lg:hidden flex flex-col items-center mb-8">
          <ui-logo class="size-16 mb-4" />
          <h1 class="text-2xl font-bold">AsetFlow</h1>
        </div>

        <!-- Form Card -->
        <div
          class="bg-base-100 rounded-lg shadow-xl p-8 border border-base-300"
        >
          <div class="mb-8">
            <h2 class="text-3xl font-bold text-base-content mb-2">
              Welcome Back
            </h2>
            <p class="text-base-content/60">Sign in to access your dashboard</p>
          </div>

          <form class="space-y-6" @submit="handleSubmit">
            <!-- Email Field -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Email Address</span>
              </label>
              <label
                class="input input-bordered flex items-center gap-2 w-full"
                :class="{ 'input-error': errors.email }"
              >
                <Icon name="ri:mail-line" class="size-5 opacity-70" />
                <input
                  v-model="values.email"
                  type="email"
                  class="grow w-full"
                  placeholder="leroy@jenkins.com"
                  autocomplete="email"
                />
              </label>
              <label v-if="errors.email" class="label">
                <span class="label-text-alt text-error">
                  <Icon name="ri:error-warning-line" class="size-3 inline" />
                  {{ errors.email }}
                </span>
              </label>
            </div>

            <!-- Password Field -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-medium">Password</span>
              </label>
              <label
                class="input input-bordered flex items-center gap-2 w-full"
                :class="{ 'input-error': errors.password }"
              >
                <Icon name="ri:lock-password-line" class="size-5 opacity-70" />
                <input
                  v-model="values.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="grow"
                  placeholder="Enter your password"
                  autocomplete="current-password"
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
              <label v-if="errors.password" class="label">
                <span class="label-text-alt text-error">
                  <Icon name="ri:error-warning-line" class="size-3 inline" />
                  {{ errors.password }}
                </span>
              </label>
            </div>
            <!-- Submit Button -->
            <button
              type="submit"
              class="btn btn-primary w-full"
              :disabled="loading"
            >
              <span v-if="loading" class="loading loading-spinner loading-sm" />
              <Icon v-else name="ri:login-box-line" class="size-5" />
              {{ loading ? 'Signing in...' : 'Sign In' }}
            </button>

            <!-- TODO : WIP Auth bisa menggunakan google -->
            <!-- Divider -->
            <!-- <div class="divider">OR</div> -->
            <!-- Social Login -->
            <!-- <div class="grid grid-cols-2 gap-3">
              <button type="button" class="btn btn-outline">
                <Icon name="ri:google-fill" class="size-5" />
                Google
              </button>
              <button type="button" class="btn btn-outline">
                <Icon name="ri:github-fill" class="size-5" />
                GitHub
              </button>
            </div> -->
          </form>
        </div>

        <!-- Footer -->
        <p class="text-center text-sm text-base-content/50 mt-8">
          © {{ new Date().getFullYear() }} AsetFlow. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>
<style scoped>
body {
  background-color: var(--color-base-200);
}
</style>
