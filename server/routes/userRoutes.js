import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Proposal from '../models/Proposal.js';
import Payment from '../models/Payment.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ SPECIFIC ROUTES FIRST
router.get('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json({ success: true, user });
}));

router.get('/analytics', protect, asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const proposals = await Proposal.find({ freelancer: userId })
    .populate('gig', 'title category');

  const payments = await Payment.find({ freelancer: userId, status: 'completed' })
    .sort({ createdAt: 1 });

  const monthlyEarnings = {};
  payments.forEach(p => {
    const month = new Date(p.createdAt).toLocaleString('default', { month: 'short', year: '2-digit' });
    monthlyEarnings[month] = (monthlyEarnings[month] || 0) + p.amount;
  });

  const proposalStats = {
    total: proposals.length,
    pending: proposals.filter(p => p.status === 'pending').length,
    accepted: proposals.filter(p => p.status === 'accepted').length,
    rejected: proposals.filter(p => p.status === 'rejected').length,
  };

  const categoryMap = {};
  proposals.forEach(p => {
    const cat = p.gig?.category || 'Other';
    categoryMap[cat] = (categoryMap[cat] || 0) + 1;
  });

  const user = await User.findById(userId)
    .select('reputationScore completedJobs totalEarnings');

  res.json({
    success: true,
    analytics: {
      proposalStats,
      monthlyEarnings,
      categoryBreakdown: categoryMap,
      totalEarnings: user.totalEarnings || 0,
      completedJobs: user.completedJobs || 0,
      reputationScore: user.reputationScore || 0,
      successRate: proposals.length
        ? Math.round((proposalStats.accepted / proposals.length) * 100)
        : 0,
    },
  });
}));

router.put('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, bio, skills, hourlyRate, location, phone, companyName } = req.body;
  if (name) user.name = name;
  if (bio) user.bio = bio;
  if (skills) user.skills = skills;
  if (hourlyRate) user.hourlyRate = hourlyRate;
  if (location) user.location = location;
  if (phone) user.phone = phone;
  if (companyName) user.companyName = companyName;
  await user.save();
  res.json({ success: true, user });
}));

router.put('/profile/full', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, bio, skills, hourlyRate, location, phone, companyName, portfolio, experience, certifications } = req.body;
  if (name) user.name = name;
  if (bio) user.bio = bio;
  if (skills) user.skills = skills;
  if (hourlyRate) user.hourlyRate = hourlyRate;
  if (location) user.location = location;
  if (phone) user.phone = phone;
  if (companyName) user.companyName = companyName;
  if (portfolio) user.portfolio = portfolio;
  if (experience) user.experience = experience;
  if (certifications) user.certifications = certifications;
  await user.save();
  res.json({ success: true, user });
}));

// ✅ WILDCARD ROUTES LAST
router.get('/', asyncHandler(async (req, res) => {
  const freelancers = await User.find({ role: 'freelancer', isActive: true })
    .select('-password')
    .sort({ reputationScore: -1 });
  res.json({ success: true, freelancers });
}));

router.get('/:id', asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.json({ success: true, user });
}));

export default router;