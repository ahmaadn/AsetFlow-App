import { Router } from 'express';

import assetRoute from './asset.routes';
import authRoute from './auth.routes';
import folderRoute from './folder.routes';
import statisticsRoute from './statistics.routes';
import uploadRoute from './upload.routes';
import userRoute from './user.routes';

const router = Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/assets', assetRoute);
router.use('/folders', folderRoute);
router.use('/folders', uploadRoute);
router.use('/statistics', statisticsRoute);

export default router;
