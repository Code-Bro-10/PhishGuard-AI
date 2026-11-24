import express from 'express';
import {
  scanUrl,
  scanEmail,
  getScanHistory,
  getScanById,
  deleteScan,
} from '../controllers/scanController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateUrlScan, validateEmailScan } from '../middleware/validationMiddleware.js';
import { scanLimiter } from '../middleware/rateLimitMiddleware.js';

const router = express.Router();

// All scan routes require authentication & rate limiting
router.use(protect);

router.post('/url', scanLimiter, validateUrlScan, scanUrl);
router.post('/email', scanLimiter, validateEmailScan, scanEmail);
router.get('/history', getScanHistory);
router.get('/:id', getScanById);
router.delete('/:id', deleteScan);

export default router;

