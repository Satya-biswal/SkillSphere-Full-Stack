import express from 'express';
import { addReview, getFreelancerReviews } from '../controllers/reviewController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/:freelancerId', protect, authorize('client'), addReview);
router.get('/:freelancerId', getFreelancerReviews);

export default router;