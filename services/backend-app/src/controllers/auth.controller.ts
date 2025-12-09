import { fromNodeHeaders } from 'better-auth/node';
import { Request, Response, NextFunction } from 'express';

import { BadRequestError } from '../utils/api-error.js';
import { auth } from '../utils/auth.js';

export class AuthController {
  /**
   * Get current user session
   */
  async getSession(req: Request, res: Response) {
    try {
      const session = await auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });

      if (!session || !session.user) {
        return res.status(401).json({
          session: null,
          user: null,
        });
      }

      return res.json({
        session: session.session,
        user: {
          id: session.user.id,
          email: session.user.email,
          name: session.user.name,
          image: session.user.image,
          createdAt: session.user.createdAt,
          updatedAt: session.user.updatedAt,
          emailVerified: session.user.emailVerified,
        },
      });
    } catch (error) {
      console.error('Get session error:', error);
      return res.status(401).json({
        session: null,
        user: null,
      });
    }
  }

  /**
   * Sign in with email and password
   */
  async signIn(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return next(
          new BadRequestError({ message: 'Email and password are required' })
        );
      }

      const result = await auth.api.signInEmail({
        body: { email, password },
        headers: fromNodeHeaders(req.headers),
      });

      // Better-auth API doesn't return error property in success cases
      // It throws on errors, so if we reach here, it's successful

      return res.json({
        success: true,
        message: 'Sign in successful',
        user: result.user,
        session: result.token ? { token: result.token } : null,
      });
    } catch (error) {
      console.error('Sign in error:', error);
      next(error);
    }
  }

  /**
   * Sign up with email and password
   */
  async signUp(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return next(
          new BadRequestError({
            message: 'Name, email, and password are required',
          })
        );
      }

      const result = await auth.api.signUpEmail({
        body: { name, email, password },
        headers: fromNodeHeaders(req.headers),
      });

      return res.status(201).json({
        success: true,
        message: 'Sign up successful',
        user: result.user,
      });
    } catch (error) {
      console.error('Sign up error:', error);
      next(error);
    }
  }

  /**
   * Sign out current user
   */
  async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      await auth.api.signOut({
        headers: fromNodeHeaders(req.headers),
      });

      return res.json({
        success: true,
        message: 'Sign out successful',
      });
    } catch (error) {
      console.error('Sign out error:', error);
      return next(error);
    }
  }

  // Note: forgot-password and reset-password are handled directly by better-auth
  // They are available at /v1/auth/forget-password and /v1/auth/reset-password
}
