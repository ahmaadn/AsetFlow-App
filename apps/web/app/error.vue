<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{
  error: NuxtError;
}>();

const router = useRouter();
const auth = useAuth();

const getErrorConfig = (statusCode: number) => {
  const configs: Record<
    number,
    {
      title: string;
      message: string;
      icon: string;
      color: string;
      suggestion: string;
    }
  > = {
    400: {
      title: 'Bad Request',
      message: 'The request could not be understood by the server.',
      icon: 'ri:error-warning-line',
      color: 'text-warning',
      suggestion: 'Please check your request and try again.',
    },
    401: {
      title: 'Unauthorized',
      message: 'You need to be authenticated to access this resource.',
      icon: 'ri:lock-line',
      color: 'text-warning',
      suggestion: 'Please log in to continue.',
    },
    403: {
      title: 'Forbidden',
      message: "You don't have permission to access this resource.",
      icon: 'ri:forbid-line',
      color: 'text-error',
      suggestion: 'Contact support if you believe this is a mistake.',
    },
    404: {
      title: 'Page Not Found',
      message: 'The page you are looking for does not exist.',
      icon: 'ri:compass-3-line',
      color: 'text-primary',
      suggestion: 'Check the URL or go back to the homepage.',
    },
    500: {
      title: 'Internal Server Error',
      message: 'Something went wrong on our end.',
      icon: 'ri:server-line',
      color: 'text-error',
      suggestion: 'Please try again later or contact support.',
    },
    503: {
      title: 'Service Unavailable',
      message: 'The service is temporarily unavailable.',
      icon: 'ri:tools-line',
      color: 'text-warning',
      suggestion: 'Please try again in a few moments.',
    },
  };

  return (
    configs[statusCode] || {
      title: 'Something Went Wrong',
      message: 'An unexpected error occurred.',
      icon: 'ri:error-warning-line',
      color: 'text-error',
      suggestion: 'Please try again or contact support.',
    }
  );
};

const handleError = (error: NuxtError) => {
  const statusCode = error.statusCode || 500;
  return getErrorConfig(statusCode);
};

const goHome = () => {
  if (!auth.isAuthenticated.value) {
    router.push('/login');
    return;
  }
  router.push('/dashboard');
};

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    goHome();
  }
};

const reloadPage = () => {
  window.location.reload();
};

onMounted(() => {
  console.error('Error Page:', props.error);
});
</script>

<template>
  <div class="min-h-screen flex items-center justify-center p-4 overflow-auto">
    <div class="max-w-2xl w-full">
      <!-- Error Card -->
      <div class="card">
        <div class="card-body items-center text-center p-8 md:p-12">
          <!-- Error Icon & Status Code -->
          <div class="relative mb-4 overflow-auto">
            <div
              class="absolute inset-0 blur-3xl"
              :class="handleError(error).color"
            />
            <Icon
              :name="handleError(error).icon"
              :class="['size-24 md:size-32 relative', handleError(error).color]"
            />
          </div>

          <!-- Status Code -->
          <div
            class="text-6xl md:text-8xl font-bold mb-4"
            :class="handleError(error).color"
          >
            {{ error.statusCode || 500 }}
          </div>

          <!-- Error Title -->
          <h1 class="text-2xl md:text-4xl font-bold text-base-content mb-4">
            {{ handleError(error).title }}
          </h1>

          <!-- Error Message -->
          <p class="text-base md:text-lg text-base-content/70 mb-2 max-w-md">
            {{ handleError(error).message }}
          </p>

          <!-- Suggestion -->
          <p class="text-sm text-base-content/50 mb-8">
            {{ handleError(error).suggestion }}
          </p>

          <!-- Error Details (Development Only) -->
          <div v-if="error.stack" class="alert alert-error w-full mb-6">
            <Icon name="ri:bug-line" class="size-5" />
            <div class="text-left flex-1">
              <h3 class="font-semibold text-sm mb-1">Error Details:</h3>
              <code class="text-xs break-all">{{ error.stack }}</code>
            </div>
          </div>

          <!-- Action Buttons -->
          <div
            v-if="auth.isAuthenticated.value"
            class="flex flex-wrap gap-3 justify-center w-full"
          >
            <button class="btn btn-primary" @click="goHome">
              <Icon name="ri:home-line" class="size-5" />
              Go to Homepage
            </button>

            <button class="btn btn-outline" @click="goBack">
              <Icon name="ri:arrow-left-line" class="size-5" />
              Go Back
            </button>

            <button
              v-if="error.statusCode && error.statusCode >= 500"
              class="btn btn-ghost"
              @click="reloadPage"
            >
              <Icon name="ri:restart-line" class="size-5" />
              Reload Page
            </button>
          </div>
          <div v-else>
            <button class="btn btn-primary" @click="goHome">
              <Icon name="ri:home-line" class="size-5" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
