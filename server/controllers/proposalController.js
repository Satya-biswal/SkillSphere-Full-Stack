import asyncHandler from 'express-async-handler';
import Proposal from '../models/Proposal.js';
import Gig from '../models/Gig.js';
import { sendNotification } from '../utils/sendNotification.js';

// Make io available — update your server.js to attach io to app
// In server.js add: app.set('io', io);

// POST /api/proposals/:gigId
export const submitProposal = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.gigId).populate('client');

  if (!gig) {
    res.status(404);
    throw new Error('Gig not found');
  }

  const alreadyApplied = await Proposal.findOne({
    gig: req.params.gigId,
    freelancer: req.user._id,
  });

  if (alreadyApplied) {
    res.status(400);
    throw new Error('You already applied to this gig');
  }

  const proposal = await Proposal.create({
    gig: req.params.gigId,
    freelancer: req.user._id,
    coverLetter: req.body.coverLetter,
    bidAmount: req.body.bidAmount,
    estimatedDays: req.body.estimatedDays,
  });

  gig.proposals.push(proposal._id);
  await gig.save();

  // Notify client
  const io = req.app.get('io');
  await sendNotification(io, {
    userId: gig.client._id,
    type: 'new_proposal',
    title: 'New Proposal Received',
    message: `${req.user.name} submitted a proposal for "${gig.title}"`,
    link: `/client/gig/${gig._id}/proposals`,
  });

  res.status(201).json({ success: true, proposal });
});

// GET /api/proposals/gig/:gigId
export const getGigProposals = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.gigId);

  if (!gig) {
    res.status(404);
    throw new Error('Gig not found');
  }

  if (gig.client.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const proposals = await Proposal.find({ gig: req.params.gigId })
    .populate('freelancer', 'name avatar skills bio reputationScore completedJobs hourlyRate')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: proposals.length, proposals });
});

// GET /api/proposals/my
export const getMyProposals = asyncHandler(async (req, res) => {
  const proposals = await Proposal.find({ freelancer: req.user._id })
    .populate('gig', 'title budget status category')
    .sort({ createdAt: -1 });

  res.json({ success: true, count: proposals.length, proposals });
});

// PUT /api/proposals/:id/status
export const updateProposalStatus = asyncHandler(async (req, res) => {
  const proposal = await Proposal.findById(req.params.id).populate('gig');

  if (!proposal) {
    res.status(404);
    throw new Error('Proposal not found');
  }

  if (proposal.gig.client.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  proposal.status = req.body.status;
  await proposal.save();

  if (req.body.status === 'accepted') {
    await Gig.findByIdAndUpdate(proposal.gig._id, {
      status: 'in-progress',
      assignedFreelancer: proposal.freelancer,
    });
  }

  // Notify freelancer
  const io = req.app.get('io');
  await sendNotification(io, {
    userId: proposal.freelancer,
    type: req.body.status === 'accepted' ? 'proposal_accepted' : 'proposal_rejected',
    title: req.body.status === 'accepted' ? 'Proposal Accepted! 🎉' : 'Proposal Rejected',
    message: req.body.status === 'accepted'
      ? `Your proposal for "${proposal.gig.title}" was accepted!`
      : `Your proposal for "${proposal.gig.title}" was not accepted.`,
    link: '/freelancer/proposals',
  });

  res.json({ success: true, proposal });
});