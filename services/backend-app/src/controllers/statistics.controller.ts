import type { NextFunction, Request, Response } from 'express';

import statisticsRepository from '../repositories/statistics.repository.js';
import { StatisticsService } from '../services/statistics.service.js';
import { UnauthorizedError } from '../utils/api-error.js';

export class StatisticsController {
  private statisticsService: StatisticsService;

  constructor() {
    this.statisticsService = new StatisticsService(statisticsRepository);

    this.getUserDashboardStatistics =
      this.getUserDashboardStatistics.bind(this);
  }

  /**
   * Get all dashboard statistics in one endpoint
   */
  async getUserDashboardStatistics(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = req.user;
      if (!user) {
        throw new UnauthorizedError({ message: 'User not authenticated' });
      }

      const statistics =
        await this.statisticsService.getUserDashboardStatistics(user.id);
      res.status(200).json(statistics);
    } catch (error) {
      next(error);
    }
  }
}

export const statisticsController = new StatisticsController();
export default statisticsController;
