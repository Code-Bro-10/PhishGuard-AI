import express from 'express';
import {
  getThreatIntelStatus,
  lookupThreatIntel,
} from '../controllers/threatIntelController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/status', getThreatIntelStatus);
router.post('/lookup', lookupThreatIntel);

export default router;

