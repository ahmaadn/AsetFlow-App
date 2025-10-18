// @ts-check
import { createConfigForNuxt } from '@nuxt/eslint-config';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';

export default [
  ...(await createConfigForNuxt()),

  // Tambahkan konfigurasi Prettier di akhir
  eslintPluginPrettierRecommended,
];
