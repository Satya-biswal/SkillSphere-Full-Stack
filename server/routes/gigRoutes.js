import express from 'express';
import {
  getGigs, getGigById, createGig,
  updateGig, deleteGig, getMyGigs
} from '../controllers/gigController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// ⚠️ my-gigs MUST be before /:id
router.get('/my-gigs', protect, authorize('client'), getMyGigs);
router.get('/', getGigs);
router.get('/:id', getGigById);
router.post('/', protect, authorize('client'), createGig);
router.put('/:id', protect, authorize('client'), updateGig);
router.delete('/:id', protect, authorize('client'), deleteGig);

export default router;