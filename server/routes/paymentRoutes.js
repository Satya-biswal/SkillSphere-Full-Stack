import express from 'express';
import {
  createOrder,
  verifyPayment,
  getPaymentHistory,
} from '../controllers/paymentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-order', protect, authorize('client'), createOrder);
router.post('/verify', protect, verifyPayment);
router.get('/history', protect, getPaymentHistory);

export default router;