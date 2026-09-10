import { Router } from 'express';
import reportRoutes from './reportRoutes';
import dashboardRoutes from './dashboardRoutes';

const router = Router();

router.use('/reports', reportRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
