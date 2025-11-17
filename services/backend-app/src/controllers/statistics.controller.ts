import { NextFunction, Request, Response } from 'express';

import * as statisticsService from '../services/statistics.service';
import { UnauthorizedError } from '../utils/api-error';

/**
 * Get all dashboard statistics in one endpoint
 */
export const getDashboardStatistics = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    if (!user) {
      throw new UnauthorizedError({ message: 'User not authenticated' });
    }

    const statistics = await statisticsService.getDashboardStatistics(user.id);
    res.status(200).json(statistics);
  } catch (error) {
    next(error);
  }
};
