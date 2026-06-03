import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { createGig } from '../../services/gigService';
import toast from 'react-hot-toast';

const CATEGORIES = [
  'Web Development', 'Mobile Development', 'Design',
  'Writing', 'Marketing', 'Data Science', 'DevOps', 'Other'
];

const PostGig = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    skills: [],
    budget: { type: 'fixed', min: '', max: '' },
    experienceLevel: 'intermediate',
    deadline: '',
    location: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'budgetMin') return setForm({ ...form, budget: { ...form.budget, min: value } });
    if (name === 'budgetMax') return setForm({ ...form, budget: { ...form.budget, max: value } });
    if (name === 'budgetType') return setForm({ ...form, budget: { ...form.budget, type: value } });
    setForm({ ...form, [name]: value });
  };

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault();
      if (!form.skills.includes(skillInput.trim())) {
        setForm({ ...form, skills: [...form.skills, skillInput.trim()] });
      }
      setSkillInput('');
    }
  };

  const removeSkill = (skill) => {
    setForm({ ...form, skills: form.skills.filter(s => s !== skill) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.category) return toast.error('Fill all required fields');
    if (!form.budget.min || !form.budget.max) return toast.error('Enter budget range');
    if (Number(form.budget.min) > Number(form.budget.max)) return toast.error('Min budget must be less than max');
    if (form.skills.length === 0) return toast.error('Add at least one skill');

    setLoading(true);
    try {
      await createGig({
        ...form,
        budget: { ...form.budget, min: Number(form.budget.min), max: Number(form.budget.max) }
      });
      toast.success('Gig posted successfully!');
      navigate('/client/my-gigs');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post gig');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Post a New Gig</h1>
          <p className="text-gray-500 mt-1">Fill in the details to find the right freelancer</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Project Title <span className="text-red-500">*</span>
                </label>
                <input type="text" name="title" value={form.title} onChange={handleChange}
                  placeholder="e.g. Build a React E-commerce Website"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea name="description" value={form.description} onChange={handleChange}
                  rows={5} placeholder="Describe your project in detail..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select name="category" value={form.category} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Experience Level</label>
                  <select name="experienceLevel" value={form.experienceLevel} onChange={handleChange}
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-4">Required Skills</h2>
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={addSkill}
              placeholder="Type a skill and press Enter (e.g. React, Node.js)"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <div className="flex flex-wrap gap-2 mt-3">
              {form.skills.map((skill) => (
                <span key={skill}
                  className="bg-indigo-50 text-indigo-600 text-sm px-3 py-1 rounded-full flex items-center gap-1.5">
                  {skill}
                  <button type="button" onClick={() => removeSkill(skill)}
                    className="text-indigo-400 hover:text-indigo-600 font-bold">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-4">Budget</h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <label className={`flex-1 border-2 rounded-xl p-3 text-center cursor-pointer transition ${form.budget.type === 'fixed' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}>
                  <input type="radio" name="budgetType" value="fixed" checked={form.budget.type === 'fixed'}
                    onChange={handleChange} className="hidden" />
                  <p className="font-medium text-sm">Fixed Price</p>
                </label>
                <label className={`flex-1 border-2 rounded-xl p-3 text-center cursor-pointer transition ${form.budget.type === 'hourly' ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'}`}>
                  <input type="radio" name="budgetType" value="hourly" checked={form.budget.type === 'hourly'}
                    onChange={handleChange} className="hidden" />
                  <p className="font-medium text-sm">Hourly Rate</p>
                </label>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Min Budget (₹) *</label>
                  <input type="number" name="budgetMin" value={form.budget.min} onChange={handleChange}
                    placeholder="500" min="0"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1.5">Max Budget (₹) *</label>
                  <input type="number" name="budgetMax" value={form.budget.max} onChange={handleChange}
                    placeholder="5000" min="0"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Extra Details */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-4">Additional Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Deadline</label>
                <input type="date" name="deadline" value={form.deadline} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1.5">Location (optional)</label>
                <input type="text" name="location" value={form.location} onChange={handleChange}
                  placeholder="e.g. Bhubaneswar or Remote"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-50">
            {loading ? 'Posting Gig...' : 'Post Gig 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostGig;
