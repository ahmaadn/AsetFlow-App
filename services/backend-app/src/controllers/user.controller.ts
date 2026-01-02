import type { NextFunction, Request, Response } from 'express';

export class UserController {
  constructor() {
    this.getUserProfile = this.getUserProfile.bind(this);
  }
  async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      res.status(200).json({ user: req.user });
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
export default userController;
