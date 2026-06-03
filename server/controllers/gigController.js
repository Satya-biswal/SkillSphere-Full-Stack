import asyncHandler from 'express-async-handler';
import Gig from '../models/Gig.js';

// GET /api/gigs
export const getGigs = asyncHandler(async (req, res) => {
  const { search, category, level, sort } = req.query;
  let query = { status: 'open', isApproved: true };

  if (category) query.category = category;
  if (level) query.experienceLevel = level;

  let sortOption = { createdAt: -1 };
  if (sort === 'budget_high') sortOption = { 'budget.max': -1 };
  if (sort === 'budget_low') sortOption = { 'budget.min': 1 };

  const gigs = await Gig.find(query)
    .populate('client', 'name avatar location companyName')
    .sort(sortOption);

  res.json({ success: true, count: gigs.length, gigs });
});

// GET /api/gigs/my-gigs
export const getMyGigs = asyncHandler(async (req, res) => {
  const gigs = await Gig.find({ client: req.user._id })
    .sort({ createdAt: -1 });
  res.json({ success: true, count: gigs.length, gigs });
});

// GET /api/gigs/:id
export const getGigById = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id)
    .populate('client', 'name avatar location companyName')
    .populate('proposals');

  if (!gig) {
    res.status(404);
    throw new Error('Gig not found');
  }
  res.json({ success: true, gig });
});

// POST /api/gigs
export const createGig = asyncHandler(async (req, res) => {
  const { title, description, category, skills, budget, deadline, location, experienceLevel } = req.body;

  if (!title || !description || !category) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  const gig = await Gig.create({
    title, description, category, skills,
    budget, deadline, location, experienceLevel,
    client: req.user._id,
  });

  res.status(201).json({ success: true, gig });
});

// PUT /api/gigs/:id
export const updateGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig) {
    res.status(404);
    throw new Error('Gig not found');
  }

  if (gig.client.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const updated = await Gig.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true
  });

  res.json({ success: true, gig: updated });
});

// DELETE /api/gigs/:id
export const deleteGig = asyncHandler(async (req, res) => {
  const gig = await Gig.findById(req.params.id);

  if (!gig) {
    res.status(404);
    throw new Error('Gig not found');
  }

  if (gig.client.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  await gig.deleteOne();
  res.json({ success: true, message: 'Gig deleted' });
});