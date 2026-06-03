import express from 'express';
import {
  getUsers,
  suspendUser,
  getGigs,
  getDisputes,
  resolveDispute,
} from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/users', protect, authorize('admin'), getUsers);
router.put('/users/:id/suspend', protect, authorize('admin'), suspendUser);
router.get('/gigs', protect, authorize('admin'), getGigs);
router.get('/disputes', protect, authorize('admin'), getDisputes);
router.put('/disputes/:id/resolve', protect, authorize('admin'), resolveDispute);

export default router;