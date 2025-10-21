<script setup lang="ts">
import { loginSchema } from '@asetflow/validators';

definePageMeta({
  layout: 'auth',
});

const { values, errors, handleSubmit } = useForm({
  initialValues: {
    email: '',
    password: '',
  },
  validationSchema: loginSchema,
  onSubmit: async (values) => {
    window.alert(`Logged in as: ${values.email}`);
  },
});
</script>

<template>
  <div class="flex flex-col w-full items-center max-w-md mx-auto my-16">
    <div class="mb-8 flex flex-col items-center">
      <ui-logo class="size-16"></ui-logo>
      <h1 class="my-3 text-4xl font-bold">Selamat Datang Kembali</h1>
      <p class="text-sm dark:text-gray-600">Login ke akun Asetflow Anda</p>
    </div>
    <form
      class="space-y-12 p-6 sm:p-8 w-full bg-base-100 shadow-lg rounded-lg border border-base-300"
      @submit="handleSubmit"
    >
      <div class="space-y-4">
        <div>
          <fieldset class="fieldset w-full">
            <legend class="fieldset-legend text-base">Email</legend>
            <input
              v-model="values.email"
              type="text"
              class="input w-full"
              placeholder="leroy@jenkins.com"
              name="email1"
            />
            <p v-if="errors.email" class="text-sm text-red-500">
              {{ errors.email }}
            </p>
          </fieldset>
        </div>
        <div>
          <fieldset class="fieldset w-full">
            <legend class="fieldset-legend text-base">Password</legend>
            <input
              v-model="values.password"
              type="password"
              class="input w-full"
              placeholder="*******"
              name="password"
            />
            <p v-if="errors.password" class="text-sm text-red-500">
              {{ errors.password }}
            </p>
          </fieldset>
        </div>
      </div>
      <div class="space-y-2">
        <div>
          <button
            type="submit"
            class="btn btn-primary btn-block btn-soft border border-primary border-dashed"
          >
            Sign in
          </button>
        </div>
      </div>
    </form>
    <p class="mt-8 text-center text-sm text-gray-500">Asetflow &copy; 2025</p>
  </div>
</template>
<style>
body {
  background-color: var(--color-base-200);
}
</style>
