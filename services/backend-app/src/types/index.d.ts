// Menggunakan 'declare namespace' untuk menggabungkan dengan namespace Express yang ada
declare namespace Express {
  // Menambahkan properti 'user' ke dalam interface Request
  export interface Request {
    user?: {
      email: string;
      name: string;
      id: string;
      role: string;
    };
  }
}

declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: string;
    DATABASE_URL: string;

    CORS_ORIGIN: string;

    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
    CLOUDINARY_ROOT_FOLDER: string;

    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;

    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;

    MAIL_SERVICE_PROVIDER: string; // Comma-separated list of email providers: 'google,smtp'

    GOOGLE_APP_MAIL: string;
    GOOGLE_APP_PASSWORD: string;

    SMTP_HOST: string;
    SMTP_PORT: string;
    SMTP_SECURE: string;
    SMTP_USER: string;
    SMTP_PASS: string;
    SMTP_FROM_NAME: string;
    SMTP_FROM_ADDRESS: string;
  }
}
