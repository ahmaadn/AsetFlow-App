export {
  EmailService,
  createEmailService,
  emailService,
} from './email.service.js';

export { BaseLayout } from './layouts/base.layout.js';

export * from './templates/index.js';

export type {
  EmailData,
  EmailResult,
  ForgotPasswordEmailData,
  WelcomeEmailData,
  EmailVerificationData,
} from './email.service.js';
