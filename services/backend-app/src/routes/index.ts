import { Router } from 'express';

import authRoute from './auth.routes';
import folderRoute from './folder.routes';
import userRoute from './user.routes';

const router = Router();

router.use('/auth', authRoute);
router.use('/user', userRoute);
router.use('/folders', folderRoute);

export default router;
