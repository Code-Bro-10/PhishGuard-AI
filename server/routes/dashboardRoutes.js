import express from 'express';
import {
  getDashboardStats,
  getDashboardActivity,
  getThreatDistribution,
} from '../controllers/dashboardController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/stats', getDashboardStats);
router.get('/activity', getDashboardActivity);
router.get('/threat-distribution', getThreatDistribution);

export default router;

