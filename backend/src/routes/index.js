const { Router } = require('express');
const authRoutes = require('./authRoutes');
const reportRoutes = require('./reportRoutes');
const dashboardRoutes = require('./dashboardRoutes');
const safetyReportMongoRoutes = require('./safetyReportMongoRoutes');

const router = Router();

router.use('/auth', authRoutes);
router.use('/reports', reportRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/mongo/reports', safetyReportMongoRoutes);

module.exports = router;
