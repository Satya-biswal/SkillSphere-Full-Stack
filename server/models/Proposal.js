import mongoose from 'mongoose';

const proposalSchema = new mongoose.Schema({
  gig: { type: mongoose.Schema.Types.ObjectId, ref: 'Gig', required: true },
  freelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  coverLetter: { type: String, required: true },
  bidAmount: { type: Number, required: true },
  estimatedDays: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
    default: 'pending'
  },
}, { timestamps: true });

const Proposal = mongoose.model('Proposal', proposalSchema);
export default Proposal;