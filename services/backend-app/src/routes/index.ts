import { Router } from 'express';

import assetRoute from './asset.routes.js';
import authRoute from './auth.routes.js';
import folderRoute from './folder.routes.js';
import statisticsRoute from './statistics.routes.js';
import uploadRoute from './upload.routes.js';
import userRoute from './user.routes.js';

const router: Router = Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/assets', assetRoute);
router.use('/folders', folderRoute);
router.use('/folders', uploadRoute);
router.use('/statistics', statisticsRoute);

export default router;
