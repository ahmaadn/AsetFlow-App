<script setup lang="ts">
definePageMeta({
  layout: 'auth',
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
    >
      <div class="space-y-4">
        <div>
          <fieldset class="fieldset w-full">
            <legend class="fieldset-legend text-base">Email</legend>
            <input
              type="email"
              class="input w-full"
              placeholder="leroy@jenkins.com"
            />
          </fieldset>
        </div>
        <div>
          <fieldset class="fieldset w-full">
            <legend class="fieldset-legend text-base">Password</legend>
            <input type="password" class="input w-full" placeholder="*******" />
          </fieldset>
        </div>
      </div>
      <div class="space-y-2">
        <div>
          <button
            type="button"
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
