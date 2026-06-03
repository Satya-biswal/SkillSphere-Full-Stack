import express from 'express';
import {
  submitProposal, getGigProposals,
  getMyProposals, updateProposalStatus
} from '../controllers/proposalController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();


router.get('/my', protect, authorize('freelancer'), getMyProposals);
router.get('/gig/:gigId', protect, authorize('client'), getGigProposals);
router.post('/:gigId', protect, authorize('freelancer'), submitProposal);
router.put('/:id/status', protect, authorize('client'), updateProposalStatus);

export default router;