import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  tags: [{ type: String }],
}, { timestamps: true });

reviewSchema.index({ reviewer: 1, gig: 1 }, { unique: true });

const Review = mongoose.model('Review', reviewSchema);
export default Review;