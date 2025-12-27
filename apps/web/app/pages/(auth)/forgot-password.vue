<script setup lang="ts">
import { z } from 'zod';

definePageMeta({
  layout: 'auth',
});

interface ResendState {
  timestamp: number;
  email?: string;
}

const { auth: authService } = useApi();
const toast = useToast();
const isLoading = ref(false);
const RESEND_COOLDOWN = 60;
const resendCooldown = ref(0);
const canSend = computed(() => resendCooldown.value === 0 && !isLoading.value);
const lastEmailSent = ref('');

const resendState = useLocalStorage<ResendState | null>(
  'forgot-password-cooldown',
  null,
  {
    serializer: {
      read: (value: string) => {
        try {
          return JSON.parse(value);
        } catch {
          return null;
        }
      },
      write: (value: unknown) => JSON.stringify(value),
    },
  }
);

const {
  counter: countdown,
  pause,
  resume,
} = useInterval(1000, {
  controls: true,
  immediate: false,
});

// Watch countdown for resend timer
watch(countdown, () => {
  if (resendCooldown.value > 0) {
    resendCooldown.value--;
    if (resendCooldown.value <= 0) {
      pause();
      resendState.value = null;
      isLoading.value = false;
    }
  }
});

// Load cooldown state on client-side mount
onMounted(() => {
  const stored = resendState.value;
  if (stored?.timestamp) {
    const now = Date.now();
    const timePassed = Math.floor((now - stored.timestamp) / 1000);
    const remainingTime = Math.max(0, RESEND_COOLDOWN - timePassed);

    if (remainingTime > 0) {
      resendCooldown.value = remainingTime;
      isLoading.value = true;
      if (stored.email) {
        lastEmailSent.value = stored.email;
      }
      resume();
    } else {
      resendState.value = null;
    }
  }
});

// Save cooldown state (global, not email-specific)
const saveCooldownState = (email?: string) => {
  resendState.value = {
    timestamp: Date.now(),
    ...(email && { email }), // Save email only if provided
  };
};

// Start countdown timer
const startCountdown = () => {
  if (resendCooldown.value > 0) {
    resume();
  }
};

const forgotPasswordSchema = z.object({
  email: z.email({ message: 'Invalid email address' }),
});

// Send password reset function
const sendPasswordReset = async (email: string) => {
  try {
    await authService.forgetPassword({
      email: email,
      redirectUrl: `${useRequestURL().origin}/reset-password`,
    });
    toast.success('Password reset link has been sent to your email address.');
    // Start global cooldown timer
    resendCooldown.value = RESEND_COOLDOWN;
    lastEmailSent.value = email;
    saveCooldownState(email);
    startCountdown();
  } catch (error) {
    console.error('Forgot password error:', error);
    toast.error('Failed to send reset link. Please try again.');
    isLoading.value = false;
  }
};

const { values, errors, handleSubmit } = useForm({
  initialValues: {
    email: '',
  },
  validationSchema: forgotPasswordSchema,
  onSubmit: async (values) => {
    await sendPasswordReset(values.email);
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
            :disabled="!canSend"
            loading-text="Sending Reset Link..."
            button-text="Send Reset Link"
            button-icon="ri:mail-send-line"
          />

          <!-- Cooldown status section -->
          <div v-if="resendCooldown > 0" class="mt-4">
            <div class="alert alert-warning mb-4">
              <Icon name="ri:time-line" class="w-5 h-5" />
              <div>
                <p class="font-medium">Please wait before sending again</p>
                <p class="text-sm opacity-80">
                  You can send another reset link in
                  {{ resendCooldown }} seconds
                  <span v-if="lastEmailSent"
                    >(last sent to <strong>{{ lastEmailSent }}</strong
                    >)</span
                  >
                </p>
              </div>
            </div>
          </div>

          <!-- Success message when email was sent -->
          <div v-else-if="lastEmailSent" class="mt-4">
            <div class="alert alert-success mb-4">
              <Icon name="ri:check-line" class="w-5 h-5" />
              <div>
                <p class="font-medium">Reset link sent!</p>
                <p class="text-sm opacity-80">
                  Password reset link was sent to
                  <strong>{{ lastEmailSent }}</strong>
                </p>
              </div>
            </div>
          </div>

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
