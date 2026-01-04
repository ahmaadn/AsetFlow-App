import { ErrorCode } from '@asetflow/shared';
import { RegisterInput } from '@asetflow/validators';
import type { NextFunction, Request, Response } from 'express';

import { refreshTokenRepository } from '../../repositories/refresh-token.repository.js';
import { userRepository } from '../../repositories/user.repository.js';
import { AuthService } from '../../services/auth/auth.service.js';
import { AuthTokenService } from '../../services/auth/token.service.js';
import { ForbiddenError, UnauthorizedError } from '../../utils/api-error.js';

export class AuthController {
  public authServive: AuthService;
  public tokenService: AuthTokenService;
  constructor() {
    this.authServive = new AuthService(userRepository, refreshTokenRepository);
    this.tokenService = new AuthTokenService(refreshTokenRepository);

    // bind methods
    this.login = this.login.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.logout = this.logout.bind(this);
  }

  /**
   * User login
   */
  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;
      const userAgent = req.headers['user-agent'] || '';
      const tokens = await this.authServive.login({
        email,
        password,
        userAgent,
      });
      if (!tokens) {
        throw new UnauthorizedError({
          message: 'Invalid email or password',
          errorCode: ErrorCode.INVALID_CREDENTIALS,
        });
      }

      // for not we dont send refresh token as httpOnly cookie, because we dont have domain set up
      // Set refresh token as httpOnly cookie
      // res.cookie('auth.refresh_token', tokens.refreshToken, {
      //   httpOnly: true,
      //   secure: true,
      //   sameSite: 'strict',
      //   maxAge: tokens.refreshExpiresIn * 1000, // 7 days in ms
      // });

      // send access token in response
      res.status(200).json(tokens);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      // Get refresh token from cookie or body
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

      if (!refreshToken) {
        throw new ForbiddenError({
          message: 'Refresh token is required',
          errorCode: ErrorCode.UNAUTHORIZED,
        });
      }

      const result = await this.tokenService.refreshAccessToken(refreshToken);
      if (!result) {
        throw new UnauthorizedError({
          message: 'Not valid refresh token',
          errorCode: ErrorCode.TOKEN_EXPIRED,
        });
      }

      res.status(200).json({
        accessToken: result.accessToken,
        expiresIn: 15 * 60, // 15 minutes
        user: result.user,
      });
    } catch (error) {
      console.error('Refresh token error:', error);
      throw new ForbiddenError({
        message: 'Invalid or expired refresh token',
        errorCode: ErrorCode.TOKEN_EXPIRED,
      });
    }
  }

  /**
   * User logout (revoke refresh token)
   */
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

      if (refreshToken) {
        await this.tokenService.revokeRefreshToken(refreshToken);
      }

      // Clear refresh token cookie
      // for now we dont implement cookie
      // res.clearCookie('refreshToken');

      res.status(200).json({
        success: true,
        message: 'Logout successful',
      });
    } catch (error) {
      // handle error by middleware
      next(error);
    }
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password, name, confirmPassword } =
        req.body as RegisterInput;
      await this.authServive.register({
        email,
        password,
        name,
        confirmPassword,
      });
      res.status(201).json({
        success: true,
        message: 'Registration successful',
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
export default authController;
