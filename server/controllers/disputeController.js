import asyncHandler from 'express-async-handler';
import Dispute from '../models/Dispute.js';
import { sendNotification } from '../utils/sendNotification.js';

// POST /api/disputes
export const raiseDispute = asyncHandler(async (req, res) => {
  const { gigId, againstId, reason, description } = req.body;

  const dispute = await Dispute.create({
    gig: gigId,
    raisedBy: req.user._id,
    against: againstId,
    reason,
    description,
  });

  // Notify admin — for now notify the other party
  const io = req.app.get('io');
  await sendNotification(io, {
    userId: againstId,
    type: 'dispute_raised',
    title: 'Dispute Raised Against You',
    message: `A dispute has been raised regarding your project: ${reason}`,
    link: '/disputes',
  });

  res.status(201).json({ success: true, dispute });
});

// GET /api/disputes/my
export const getMyDisputes = asyncHandler(async (req, res) => {
  const disputes = await Dispute.find({
    $or: [{ raisedBy: req.user._id }, { against: req.user._id }]
  })
    .populate('gig', 'title')
    .populate('raisedBy', 'name')
    .populate('against', 'name')
    .sort({ createdAt: -1 });

  res.json({ success: true, disputes });
});

// GET /api/disputes — admin only
export const getAllDisputes = asyncHandler(async (req, res) => {
  const disputes = await Dispute.find({})
    .populate('gig', 'title')
    .populate('raisedBy', 'name email')
    .populate('against', 'name email')
    .sort({ createdAt: -1 });

  res.json({ success: true, disputes });
});

// PUT /api/disputes/:id/resolve — admin only
export const resolveDispute = asyncHandler(async (req, res) => {
  const dispute = await Dispute.findByIdAndUpdate(
    req.params.id,
    {
      status: 'resolved',
      resolution: req.body.resolution,
      resolvedBy: req.user._id,
    },
    { new: true }
  );

  // Notify both parties
  const io = req.app.get('io');
  await sendNotification(io, {
    userId: dispute.raisedBy,
    type: 'dispute_raised',
    title: 'Dispute Resolved',
    message: `Your dispute has been resolved: ${req.body.resolution}`,
    link: '/disputes',
  });

  res.json({ success: true, dispute });
});