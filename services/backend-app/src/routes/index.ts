import { Router } from 'express';

import asetRoute from './aset.routes';
import authRoute from './auth.routes';
import folderRoute from './folder.routes';
import uploadRoute from './upload.routes';
import userRoute from './user.routes';

const router = Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/folders', asetRoute);
router.use('/folders', folderRoute);
router.use('/folders', uploadRoute);

export default router;
