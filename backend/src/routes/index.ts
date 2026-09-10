import { Router } from 'express';
import reportRoutes from './reportRoutes';

const router = Router();

router.use('/reports', reportRoutes);

export default router;
