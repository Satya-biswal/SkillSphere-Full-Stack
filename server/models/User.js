import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
const bcrypt = bcryptjs;

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, minlength: 6 },
  role: { type: String, enum: ['client', 'freelancer', 'admin'], required: true },
  avatar: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  googleId: { type: String },
  emailVerificationToken: { type: String },
  resetPasswordToken: { type: String },
  resetPasswordExpire: { type: Date },

  // Freelancer specific
  skills: [{ skill: String, level: String }],
  bio: { type: String, default: '' },
  hourlyRate: { type: Number, default: 0 },
  portfolio: [{ title: String, url: String, image: String }],
  experience: [{ title: String, company: String, from: Date, to: Date, description: String }],
  certifications: [{ name: String, issuer: String, year: Number }],
  reputationScore: { type: Number, default: 0 },
  totalEarnings: { type: Number, default: 0 },
  completedJobs: { type: Number, default: 0 },

  // Client specific
  companyName: { type: String, default: '' },
  totalSpent: { type: Number, default: 0 },
  postedGigs: { type: Number, default: 0 },

}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;