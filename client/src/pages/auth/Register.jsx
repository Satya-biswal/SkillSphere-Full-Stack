import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { setCredentials } from '../../redux/slices/authSlice';
import { registerUser } from '../../services/authService';
import toast from 'react-hot-toast';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'freelancer' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
    setLoading(true);
    try {
      const data = await registerUser(form);
      dispatch(setCredentials(data));
      toast.success('Account created successfully!');
      if (data.user.role === 'client') navigate('/client/dashboard');
      else navigate('/freelancer/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-indigo-600 flex-col justify-center items-center p-12 text-white">
        <h1 className="text-4xl font-bold mb-4">Join SkillSphere</h1>
        <p className="text-indigo-200 text-lg text-center max-w-sm">
          Whether you're a freelancer or a client, we have the tools to help you succeed
        </p>
        <div className="mt-10 space-y-4 w-full max-w-sm">
          <div className="bg-indigo-500 rounded-xl p-4">
            <p className="font-semibold mb-1">💼 For Freelancers</p>
            <p className="text-indigo-200 text-sm">Find gigs, build your portfolio, get paid securely</p>
          </div>
          <div className="bg-indigo-500 rounded-xl p-4">
            <p className="font-semibold mb-1">🏢 For Clients</p>
            <p className="text-indigo-200 text-sm">Post projects, hire top talent, track progress</p>
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Create Account</h2>
            <p className="text-gray-500 mt-2">Get started for free</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
              <input type="text" name="name" value={form.name} onChange={handleChange}
                placeholder="John Doe" required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input type="email" name="email" value={form.email} onChange={handleChange}
                placeholder="you@example.com" required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input type="password" name="password" value={form.password} onChange={handleChange}
                placeholder="Min 6 characters" required
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I want to...</label>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" onClick={() => setForm({ ...form, role: 'freelancer' })}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition ${
                    form.role === 'freelancer'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}>
                  💼 Work as Freelancer
                </button>
                <button type="button" onClick={() => setForm({ ...form, role: 'client' })}
                  className={`py-3 px-4 rounded-xl border-2 text-sm font-medium transition ${
                    form.role === 'client'
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-600'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}>
                  🏢 Hire Freelancers
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-xl transition disabled:opacity-50 text-sm">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
