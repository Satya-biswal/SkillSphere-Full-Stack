import express from 'express';
import {
  raiseDispute,
  getMyDisputes,
  getAllDisputes,
  resolveDispute,
} from '../controllers/disputeController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, raiseDispute);
router.get('/my', protect, getMyDisputes);
router.get('/', protect, authorize('admin'), getAllDisputes);
router.put('/:id/resolve', protect, authorize('admin'), resolveDispute);

export default router;