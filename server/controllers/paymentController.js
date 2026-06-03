import asyncHandler from 'express-async-handler';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import Payment from '../models/Payment.js';
import User from '../models/User.js';
import Gig from '../models/Gig.js';
import { sendNotification } from '../utils/sendNotification.js';

// Move inside a function — lazy initialization
const getRazorpay = () => {
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

// POST /api/payments/create-order
export const createOrder = asyncHandler(async (req, res) => {
  const { amount, gigId, freelancerId, milestone } = req.body;

  const options = {
    amount: amount * 100, // Razorpay needs paise
    currency: 'INR',
    receipt: `receipt_${Date.now()}`,
  };

  const razorpay = getRazorpay();
const order = await razorpay.orders.create(options);

  // Save pending payment
  const payment = await Payment.create({
    gig: gigId,
    client: req.user._id,
    freelancer: freelancerId,
    amount,
    razorpayOrderId: order.id,
    milestone: milestone || 'Full Payment',
  });

  res.json({
    success: true,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    paymentId: payment._id,
    keyId: process.env.RAZORPAY_KEY_ID,
  });
});

// POST /api/payments/verify
export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature, paymentId } = req.body;

  // Verify signature
  const body = razorpayOrderId + '|' + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  if (expectedSignature !== razorpaySignature) {
    res.status(400);
    throw new Error('Payment verification failed');
  }

  // Update payment
  const payment = await Payment.findByIdAndUpdate(
    paymentId,
    {
      status: 'completed',
      razorpayPaymentId,
      razorpaySignature,
    },
    { new: true }
  );

  // Update freelancer earnings
  await User.findByIdAndUpdate(payment.freelancer, {
    $inc: { totalEarnings: payment.amount },
  });

  // Update gig status
  await Gig.findByIdAndUpdate(payment.gig, { status: 'completed' });

  // Update client total spent
  await User.findByIdAndUpdate(payment.client, {
    $inc: { totalSpent: payment.amount },
  });

  // Notify freelancer
  const io = req.app.get('io');
  await sendNotification(io, {
    userId: payment.freelancer,
    type: 'payment_received',
    title: 'Payment Received! 💰',
    message: `You received ₹${payment.amount.toLocaleString()} for your work`,
    link: '/freelancer/dashboard',
  });

  res.json({ success: true, payment });
});

// GET /api/payments/history
export const getPaymentHistory = asyncHandler(async (req, res) => {
  const query = req.user.role === 'client'
    ? { client: req.user._id }
    : { freelancer: req.user._id };

  const payments = await Payment.find(query)
    .populate('gig', 'title')
    .populate('client', 'name')
    .populate('freelancer', 'name')
    .sort({ createdAt: -1 });

  const totalAmount = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0);

  res.json({ success: true, payments, totalAmount });
});