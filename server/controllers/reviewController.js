import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import User from '../models/User.js';

// POST /api/reviews/:freelancerId
export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment, tags, gigId } = req.body;

  const existing = await Review.findOne({
    reviewer: req.user._id,
    gig: gigId,
  });

  if (existing) {
    res.status(400);
    throw new Error('You already reviewed this gig');
  }

  const review = await Review.create({
    reviewer: req.user._id,
    freelancer: req.params.freelancerId,
    gig: gigId,
    rating,
    comment,
    tags: tags || [],
  });

  // Update freelancer reputation score
  const allReviews = await Review.find({ freelancer: req.params.freelancerId });
  const avgRating = allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await User.findByIdAndUpdate(req.params.freelancerId, {
    reputationScore: Math.round(avgRating * 10) / 10,
  });

  await review.populate('reviewer', 'name avatar');
  res.status(201).json({ success: true, review });
});

// GET /api/reviews/:freelancerId
export const getFreelancerReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ freelancer: req.params.freelancerId })
    .populate('reviewer', 'name avatar')
    .populate('gig', 'title')
    .sort({ createdAt: -1 });

  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  res.json({
    success: true,
    count: reviews.length,
    avgRating: Math.round(avgRating * 10) / 10,
    reviews,
  });
});