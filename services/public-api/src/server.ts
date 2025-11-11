import path from 'path';

import dotenv from 'dotenv';

console.log(`[CONFIG] NODE_ENV saat ini: ${process.env.NODE_ENV}`);

let envPath = path.resolve(__dirname, '../.env');
if (process.env.NODE_ENV === 'production') {
  console.log('[CONFIG] Mode produksi terdeteksi, memuat .env.prod...');
  envPath = path.resolve(__dirname, '../.env.prod');
} else {
  console.log('[CONFIG] Mode development, memuat .env...');
}

const result = dotenv.config({ path: envPath });

if (result.error) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[WARN] Tidak dapat memuat file env dari: ${envPath}`);
  }
}

console.log(`[CONFIG] Port dimuat: ${process.env.PORT}`);

const PORT = process.env.PORT || 3002;

// Import app setelah mengatur dotenv
import { app } from './app';
import { logger } from './configs/logger';

if (process.env.NODE_ENV === 'development') {
  app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);
    logger.info(`Swagger docs available at http://localhost:${PORT}/api-docs`);
  });
}

export default app;
