import { Router } from 'express';
import userRoutes from './user.routes';

const router = Router({ mergeParams: true });

// Mount all user-related routes
router.use('/', userRoutes);

export default router;
