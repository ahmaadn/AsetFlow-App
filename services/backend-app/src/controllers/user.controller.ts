import type { NextFunction, Request, Response } from 'express';

import userRepository from '../repositories/user.repository';
import { UserService } from '../services/user.service';

export class UserController {
  private userService: UserService;
  constructor() {
    this.userService = new UserService(userRepository);

    this.getUserProfile = this.getUserProfile.bind(this);
  }

  /**
   * Get current user profile
   */
  async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const user = await this.userService.me(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ user: req.user });
    } catch (error) {
      return next(error);
    }
  }
}

export const userController = new UserController();
export default userController;
