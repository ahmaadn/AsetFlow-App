import { VerificationType } from '@asetflow/database';

import logger from '../../configs/logger.config.js';
import { emailService } from '../../mail/index.js';
import { IUserRepository } from '../../repositories/user.repository.js';
import { IVerificationRepository } from '../../repositories/verification.repository.js';
import * as JwtUtils from '../../utils/jwt.utils.js';
import { hashPassword } from '../../utils/password-helper.js';

export class PasswordService {
  public userRepository: IUserRepository;
  public verificationRepository: IVerificationRepository;
  constructor(
    userRepository: IUserRepository,
    verificationRepository: IVerificationRepository
  ) {
    this.userRepository = userRepository;
    this.verificationRepository = verificationRepository;
  }

  async sendResetPasswordEmail(
    email: string,
    redirectUrl: string
  ): Promise<void> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      logger.warn(`Password reset requested for non-existing email: ${email}`);
      // For security, do not reveal that the email does not exist
      return;
    }

    // Generate reset token and send email logic goes here
    const tokenType = VerificationType.PASSWORD_RESET;
    const genToken = await JwtUtils.generateVerificationToken(tokenType, {
      userId: user.id,
      email: user.email,
    });

    await this.verificationRepository.create({
      email: user.email,
      userId: user.id,
      token: genToken,
      type: tokenType,
      expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour expiration
    });

    logger.info(`Sending password reset email to ${email}`);
    await emailService.sendForgotPasswordEmail(user.email, {
      resetUrl: `${redirectUrl}?token=${genToken}`,
      userName: user.name,
      expirationTime: '1 hour',
    });
    logger.info(`Password reset email sent to ${email}`);

    return;
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const isValid = await JwtUtils.verifyVerificationToken(
        token,
        VerificationType.PASSWORD_RESET
      );

      if (!isValid) {
        logger.warn('Invalid or expired password reset token used');
        return;
      }

      const isExpired = JwtUtils.isTokenExpired(token);
      if (isExpired) {
        logger.warn('Expired password reset token used');
        return;
      }

      const payload = JwtUtils.decodeToken<{ userId: string; email: string }>(
        token
      );
      if (!payload) {
        logger.error('Failed to decode password reset token payload');
        return;
      }

      const isUsed = await this.verificationRepository.isTokenUsed(token);
      if (isUsed) {
        logger.warn('Attempt to reuse password reset token');
        return;
      }

      const userId = payload!.userId;

      const hashedPassword = await hashPassword(newPassword);
      await this.verificationRepository.revoke(token);

      await this.userRepository.updatePassword(userId, hashedPassword);
    } catch (error) {
      logger.error(
        `Error resetting password with token: ${error instanceof Error ? error.message : String(error)}`
      );
      return;
    }
  }
}
