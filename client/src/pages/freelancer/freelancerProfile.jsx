import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Navbar from '../../components/common/Navbar';
import { setCredentials } from '../../redux/slices/authSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';

const SKILL_LEVELS = ['Beginner', 'Intermediate', 'Expert'];

const FreelancerProfile = () => {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState({ skill: '', level: 'Intermediate' });
  const [form, setForm] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    location: user?.location || '',
    phone: user?.phone || '',
    hourlyRate: user?.hourlyRate || '',
    skills: user?.skills || [],
    portfolio: user?.portfolio || [],
    experience: user?.experience || [],
    certifications: user?.certifications || [],
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const addSkill = () => {
    if (!skillInput.skill.trim()) return;
    const exists = form.skills.find(s => s.skill === skillInput.skill.trim());
    if (exists) return toast.error('Skill already added');
    setForm({ ...form, skills: [...form.skills, { skill: skillInput.skill.trim(), level: skillInput.level }] });
    setSkillInput({ skill: '', level: 'Intermediate' });
  };

  const removeSkill = (index) => {
    setForm({ ...form, skills: form.skills.filter((_, i) => i !== index) });
  };

  const addPortfolio = () => {
    setForm({
      ...form,
      portfolio: [...form.portfolio, { title: '', url: '', image: '' }]
    });
  };

  const updatePortfolio = (index, field, value) => {
    const updated = [...form.portfolio];
    updated[index][field] = value;
    setForm({ ...form, portfolio: updated });
  };

  const removePortfolio = (index) => {
    setForm({ ...form, portfolio: form.portfolio.filter((_, i) => i !== index) });
  };

  const addExperience = () => {
    setForm({
      ...form,
      experience: [...form.experience, { title: '', company: '', from: '', to: '', description: '' }]
    });
  };

  const updateExperience = (index, field, value) => {
    const updated = [...form.experience];
    updated[index][field] = value;
    setForm({ ...form, experience: updated });
  };

  const removeExperience = (index) => {
    setForm({ ...form, experience: form.experience.filter((_, i) => i !== index) });
  };

  const addCertification = () => {
    setForm({
      ...form,
      certifications: [...form.certifications, { name: '', issuer: '', year: '' }]
    });
  };

  const updateCertification = (index, field, value) => {
    const updated = [...form.certifications];
    updated[index][field] = value;
    setForm({ ...form, certifications: updated });
  };

  const removeCertification = (index) => {
    setForm({ ...form, certifications: form.certifications.filter((_, i) => i !== index) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put('/users/profile', form);
      dispatch(setCredentials({ user: res.data.user, token }));
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>
          <p className="text-gray-500 mt-1">Update your professional profile</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-4">Basic Information</h2>
            <div className="flex items-center gap-5 mb-5">
              <div className="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-800">{user?.name}</p>
                <p className="text-gray-400 text-sm">{user?.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-yellow-400 text-sm">⭐ {user?.reputationScore || 0}</span>
                  <span className="text-gray-400 text-sm">· {user?.completedJobs || 0} jobs done</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
                <input type="text" name="phone" value={form.phone} onChange={handleChange}
                  placeholder="+91 9999999999"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Location</label>
                <input type="text" name="location" value={form.location} onChange={handleChange}
                  placeholder="Bhubaneswar, Odisha"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Hourly Rate (₹)</label>
                <input type="number" name="hourlyRate" value={form.hourlyRate} onChange={handleChange}
                  placeholder="500"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                <textarea name="bio" value={form.bio} onChange={handleChange} rows={3}
                  placeholder="Tell clients about yourself, your expertise and experience..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-4">Skills</h2>
            <div className="flex gap-2 mb-3">
              <input type="text" value={skillInput.skill}
                onChange={(e) => setSkillInput({ ...skillInput, skill: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                placeholder="e.g. React.js"
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <select value={skillInput.level}
                onChange={(e) => setSkillInput({ ...skillInput, level: e.target.value })}
                className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {SKILL_LEVELS.map(l => <option key={l}>{l}</option>)}
              </select>
              <button type="button" onClick={addSkill}
                className="bg-indigo-600 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {form.skills.map((s, i) => (
                <span key={i} className="bg-indigo-50 text-indigo-700 text-sm px-3 py-1.5 rounded-full flex items-center gap-2">
                  {s.skill}
                  <span className="text-xs text-indigo-400">({s.level})</span>
                  <button type="button" onClick={() => removeSkill(i)}
                    className="text-indigo-300 hover:text-indigo-600 font-bold">×</button>
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800">Portfolio</h2>
              <button type="button" onClick={addPortfolio}
                className="text-sm text-indigo-600 hover:underline">+ Add Project</button>
            </div>
            <div className="space-y-4">
              {form.portfolio.map((p, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4">
                  <div className="grid grid-cols-2 gap-3 mb-2">
                    <input type="text" placeholder="Project Title"
                      value={p.title} onChange={(e) => updatePortfolio(i, 'title', e.target.value)}
                      className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <input type="text" placeholder="Project URL"
                      value={p.url} onChange={(e) => updatePortfolio(i, 'url', e.target.value)}
                      className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <button type="button" onClick={() => removePortfolio(i)}
                    className="text-red-400 text-xs hover:text-red-600">Remove</button>
                </div>
              ))}
              {form.portfolio.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">No portfolio items yet</p>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800">Work Experience</h2>
              <button type="button" onClick={addExperience}
                className="text-sm text-indigo-600 hover:underline">+ Add Experience</button>
            </div>
            <div className="space-y-4">
              {form.experience.map((exp, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" placeholder="Job Title"
                      value={exp.title} onChange={(e) => updateExperience(i, 'title', e.target.value)}
                      className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <input type="text" placeholder="Company"
                      value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)}
                      className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <input type="date" placeholder="From"
                      value={exp.from} onChange={(e) => updateExperience(i, 'from', e.target.value)}
                      className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <input type="date" placeholder="To"
                      value={exp.to} onChange={(e) => updateExperience(i, 'to', e.target.value)}
                      className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <textarea placeholder="Description" rows={2}
                    value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)}
                    className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
                  <button type="button" onClick={() => removeExperience(i)}
                    className="text-red-400 text-xs hover:text-red-600">Remove</button>
                </div>
              ))}
              {form.experience.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">No experience added yet</p>
              )}
            </div>
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-semibold text-gray-800">Certifications</h2>
              <button type="button" onClick={addCertification}
                className="text-sm text-indigo-600 hover:underline">+ Add Certification</button>
            </div>
            <div className="space-y-3">
              {form.certifications.map((cert, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4">
                  <div className="grid grid-cols-3 gap-3">
                    <input type="text" placeholder="Certification Name"
                      value={cert.name} onChange={(e) => updateCertification(i, 'name', e.target.value)}
                      className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <input type="text" placeholder="Issuer (e.g. Google)"
                      value={cert.issuer} onChange={(e) => updateCertification(i, 'issuer', e.target.value)}
                      className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                    <input type="number" placeholder="Year"
                      value={cert.year} onChange={(e) => updateCertification(i, 'year', e.target.value)}
                      className="border border-gray-300 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <button type="button" onClick={() => removeCertification(i)}
                    className="text-red-400 text-xs hover:text-red-600 mt-2">Remove</button>
                </div>
              ))}
              {form.certifications.length === 0 && (
                <p className="text-gray-400 text-sm text-center py-4">No certifications added yet</p>
              )}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl transition disabled:opacity-50">
            {loading ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FreelancerProfile;