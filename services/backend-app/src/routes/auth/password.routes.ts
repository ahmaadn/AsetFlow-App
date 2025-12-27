import {
  httpRequestForgetPasswordValidation,
  httpResetPasswordValidation,
} from '@asetflow/validators';
import { Router } from 'express';

import { passwordController } from '../../controllers/auth/password.controller.js';
import { validate } from '../../middleware/validation.middleware.js';

const router: Router = Router();

router.post(
  '/forgot-password',
  validate(httpRequestForgetPasswordValidation),
  passwordController.forgetPassword.bind(passwordController)
);

router.post(
  '/reset-password',
  validate(httpResetPasswordValidation),
  passwordController.resetPassword.bind(passwordController)
);

export default router;
