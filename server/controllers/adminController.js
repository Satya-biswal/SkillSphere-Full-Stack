import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Gig from '../models/Gig.js';
import Dispute from '../models/Dispute.js';

// GET /api/admin/users
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json({ success: true, users });
});

// PUT /api/admin/users/:id/suspend
export const suspendUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { isActive: req.body.isActive },
    { new: true }
  );
  res.json({ success: true, user });
});

// GET /api/admin/gigs
export const getGigs = asyncHandler(async (req, res) => {
  const gigs = await Gig.find({})
    .populate('client', 'name')
    .sort({ createdAt: -1 });
  res.json({ success: true, gigs });
});

// GET /api/admin/disputes
export const getDisputes = asyncHandler(async (req, res) => {
  const disputes = await Dispute.find({})
    .populate('gig', 'title')
    .populate('raisedBy', 'name email')
    .populate('against', 'name email')
    .sort({ createdAt: -1 });
  res.json({ success: true, disputes });
});

// PUT /api/admin/disputes/:id/resolve
export const resolveDispute = asyncHandler(async (req, res) => {
  const dispute = await Dispute.findByIdAndUpdate(
    req.params.id,
    { status: 'resolved', resolution: req.body.resolution },
    { new: true }
  );
  res.json({ success: true, dispute });
});