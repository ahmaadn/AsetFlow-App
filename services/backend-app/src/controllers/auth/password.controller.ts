import type { forgetPasswordInput } from '@asetflow/validators';
import type { NextFunction, Request, Response } from 'express';

import logger from '../../configs/logger.config.js';
import { userRepository } from '../../repositories/user.repository.js';
import { verificationRepository } from '../../repositories/verification.repository.js';
import { PasswordService } from '../../services/auth/password.service.js';

/**
 * Controller for handling password-related operations such as
 */
export class PasswordController {
  public passwordService: PasswordService;
  constructor() {
    this.passwordService = new PasswordService(
      userRepository,
      verificationRepository
    );

    this.forgetPassword = this.forgetPassword.bind(this);
    this.resetPassword = this.resetPassword.bind(this);
  }

  /**
   * Handle reset password request
   */
  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      await this.passwordService.resetPassword(token, newPassword);
      res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle forget password request
   */
  async forgetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, redirectUrl } = req.body as forgetPasswordInput;
      logger.info(`Password reset requested for email: ${email}`);
      await this.passwordService.sendResetPasswordEmail(
        email,
        redirectUrl || req.baseUrl
      );
      res.status(200).json({
        success: true,
        message: 'If the email exists, a reset link has been sent',
      });
    } catch (error) {
      next(error);
    }
  }
}

const passwordController = new PasswordController();
export { passwordController };
