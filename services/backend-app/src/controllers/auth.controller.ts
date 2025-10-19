import { NextFunction, Request, Response } from 'express';

import * as authService from '../services/auth.service';

/**
 * User Registrasi Controller
 * @param req
 * @param res
 * @param next
 */
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await authService.createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

/**
 * User Login Controller
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password } = req.body;
    const { accessToken, tokenType } = await authService.login({
      email,
      password,
    });
    res.status(200).json({ accessToken, tokenType });
  } catch (error) {
    next(error);
  }
};
