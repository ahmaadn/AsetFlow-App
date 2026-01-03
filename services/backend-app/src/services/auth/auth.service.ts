import type { UserModel } from '@asetflow/database';
import { ErrorCode } from '@asetflow/shared';
import type { PayloadTokenResponse } from '@asetflow/shared-types';
import type { RegisterInput } from '@asetflow/validators';

import logger from '../../configs/logger.config.js';
import type { IRefreshTokenRepository } from '../../repositories/refresh-token.repository.js';
import type { IUserRepository } from '../../repositories/user.repository.js';
import { BadRequestError } from '../../utils/api-error.js';
import * as JwtUtils from '../../utils/jwt.utils.js';
import { hashPassword, verifyPassword } from '../../utils/password-helper.js';

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
    user: Pick<UserModel, 'id' | 'email' | 'role' | 'name'>,
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

    // Generate JWT tokens with new payload structure
    const tokens = await JwtUtils.createTokenPair({
      access: {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      refresh: {
        userId: user.id,
        tokenId: refreshToken.id,
      },
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
        name: user.name,
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

    // First registered user becomes ADMIN
    const userRoleCount = await this.userRepository.userCount();
    let role: 'USER' | 'ADMIN' = 'USER';
    if (userRoleCount.ADMIN === 0 && userRoleCount.USER === 0) {
      role = 'ADMIN';
    }

    const newUser = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: passwordHashed,
      role: role || 'USER',
    });

    logger.info(`New user registered: ${newUser.email}`);
    return true;
  }
}
