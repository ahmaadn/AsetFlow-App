import { UserModel } from '@asetflow/database';
import { ErrorCode } from '@asetflow/shared';
import { RegisterInput } from '@asetflow/validators';

import { logger } from '../../configs/logger.config.js';
import { IRefreshTokenRepository } from '../../repositories/refresh-token.repository.js';
import { IUserRepository } from '../../repositories/user.repository.js';
import { BadRequestError } from '../../utils/api-error.js';
import { jwtService } from '../../utils/jwt.utils.js';
import { hashPassword, verifyPassword } from '../../utils/password-helper.js';
import { PayloadTokenResponse } from '@asetflow/shared-types';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  refreshExpiresIn: number;
}
/**
 * Authentication Service
 */
export class AuthService {
  public userRepository: IUserRepository;
  public tokenRepository: IRefreshTokenRepository;

  constructor(
    userRepository: IUserRepository,
    tokenRepository: IRefreshTokenRepository
  ) {
    this.userRepository = userRepository;
    this.tokenRepository = tokenRepository;
  }

  async createTokenPair(
    user: Pick<UserModel, 'id' | 'email' | 'role'>,
    userAgent?: string
  ): Promise<TokenPair> {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    const refreshToken = await this.tokenRepository.create({
      userId: user.id,
      token: '', // Will be updated after JWT generation
      expiresAt,
      userAgent,
    });

    // Generate JWT tokens
    const tokens = await jwtService.generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
      tokenId: refreshToken.id,
    });

    await this.tokenRepository.update({
      tokenId: refreshToken.id,
      token: tokens.refreshToken,
      expiresAt,
    });

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: 15 * 60, // 15 minutes in seconds
      refreshExpiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    };
  }

  async login({
    email,
    password,
    userAgent,
  }: {
    email: string;
    password: string;
    userAgent?: string;
  }): Promise<PayloadTokenResponse> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new BadRequestError({
        message: 'Invalid credentials',
        errorCode: ErrorCode.INVALID_CREDENTIALS,
      });
    }

    const isPasswordValid = await verifyPassword(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestError({
        message: 'Invalid credentials',
        errorCode: ErrorCode.INVALID_CREDENTIALS,
      });
    }

    const tokens = await this.createTokenPair(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      userAgent
    );

    return {
      ...tokens,
      tokenType: 'Bearer',
    };
  }

  async register(data: RegisterInput) {
    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new BadRequestError({
        message: 'Email already in use',
        errorCode: ErrorCode.EMAIL_ALREADY_EXISTS,
      });
    }

    const passwordHashed = await hashPassword(data.password);

    const newUser = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: passwordHashed,
      role: 'USER',
    });

    logger.info(`New user registered: ${newUser.email}`);
    return true;
  }
}
