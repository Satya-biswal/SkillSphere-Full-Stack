import mongoose from 'mongoose';

const gigSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Web Development', 'Mobile Development', 'Design', 'Writing',
           'Marketing', 'Data Science', 'DevOps', 'Other']
  },
  skills: [{ type: String }],
  budget: {
    type: { type: String, enum: ['fixed', 'hourly'], default: 'fixed' },
    min: { type: Number, required: true },
    max: { type: Number, required: true },
  },
  deadline: { type: Date },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'completed', 'cancelled'],
    default: 'open'
  },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assignedFreelancer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  proposals: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Proposal' }],
  location: { type: String, default: '' },
  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'expert'],
    default: 'intermediate'
  },
  isApproved: { type: Boolean, default: true },
}, { timestamps: true });

gigSchema.index({ title: 'text', description: 'text', skills: 'text' });

const Gig = mongoose.model('Gig', gigSchema);
export default Gig;