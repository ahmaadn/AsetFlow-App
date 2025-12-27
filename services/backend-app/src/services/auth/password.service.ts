import { VerificationType } from '@asetflow/database';

import { logger } from '../../configs/logger.config.js';
import { IUserRepository } from '../../repositories/user.repository.js';
import { IVerificationRepository } from '../../repositories/verification.repository.js';
import { jwtService } from '../../utils/jwt.utils.js';
import { hashPassword } from '../../utils/password-helper.js';
import { emailService } from '../email/email.service.js';

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
    const genToken = await jwtService.generateVerificationToken(tokenType, {
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
    const isValid = await jwtService.verifyVerificationToken(
      token,
      VerificationType.PASSWORD_RESET
    );

    if (!isValid) {
      // throw new Error('Invalid or expired password reset token');
    }

    const isExpired = jwtService.isTokenExpired(token);
    if (isExpired) {
      // throw new Error('Password reset token has expired');
    }

    const payload = jwtService.decodeToken<{ userId: string; email: string }>(
      token
    );
    if (!payload) {
      // throw new Error('Invalid token payload');
    }

    const userId = payload!.userId;

    const hashedPassword = await hashPassword(newPassword);

    await this.userRepository.updatePassword(userId, hashedPassword);
  }
}
