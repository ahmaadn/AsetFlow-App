import { Router } from 'express';

import createAssetRoutes from './asset.routes.js';
import createAuthRoute from './auth.routes.js';
import createFolderRoutes from './folder.routes.js';
import createStatisticsRoutes from './statistics.routes.js';
import createUploadRoutes from './upload.routes.js';
import createUserRoutes from './user.routes.js';

const router: Router = Router();

router.use('/auth', createAuthRoute());
router.use('/user', createUserRoutes());
router.use('/assets', createAssetRoutes());
router.use('/folders', createFolderRoutes());
router.use('/folders', createUploadRoutes());
router.use('/statistics', createStatisticsRoutes());

export default router;
