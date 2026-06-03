import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../../components/common/Navbar';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Disputes = () => {
  const { user } = useSelector((state) => state.auth);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [myGigs, setMyGigs] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    gigId: '',
    againstId: '',
    reason: '',
    description: '',
  });

  useEffect(() => {
    fetchDisputes();
    fetchGigs();
  }, []);

  const fetchDisputes = async () => {
    try {
      const res = await api.get('/disputes/my');
      setDisputes(res.data.disputes);
    } catch {
      toast.error('Failed to load disputes');
    } finally {
      setLoading(false);
    }
  };

  const fetchGigs = async () => {
    try {
      if (user?.role === 'client') {
        const res = await api.get('/gigs/my-gigs');
        setMyGigs(res.data.gigs.filter(g => g.status === 'in-progress'));
      } else {
        const res = await api.get('/proposals/my');
        const accepted = res.data.proposals.filter(p => p.status === 'accepted');
        setMyGigs(accepted.map(p => p.gig));
      }
    } catch {}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.gigId || !form.reason || !form.description) {
      return toast.error('Fill all fields');
    }
    setSubmitting(true);
    try {
      await api.post('/disputes', form);
      toast.success('Dispute raised successfully');
      setShowForm(false);
      fetchDisputes();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to raise dispute');
    } finally {
      setSubmitting(false);
    }
  };

  const statusColor = {
    open: 'bg-red-100 text-red-700',
    under_review: 'bg-yellow-100 text-yellow-700',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-600',
  };

  const REASONS = [
    'Payment not received',
    'Work not delivered',
    'Poor quality work',
    'Missed deadline',
    'Unprofessional behavior',
    'Scope creep',
    'Other',
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Disputes</h1>
            <p className="text-gray-500 mt-1">Raise and track project disputes</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition">
            + Raise Dispute
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : disputes.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-5xl mb-4">⚖️</p>
            <p className="text-gray-500 text-lg">No disputes raised</p>
            <p className="text-gray-400 text-sm mt-2">
              Raise a dispute if you have issues with a project
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {disputes.map((dispute) => (
              <div key={dispute._id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-semibold text-gray-800">{dispute.gig?.title}</h3>
                    <p className="text-gray-400 text-sm mt-0.5">
                      Raised by: {dispute.raisedBy?.name} · Against: {dispute.against?.name}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor[dispute.status]}`}>
                    {dispute.status.replace('_', ' ')}
                  </span>
                </div>

                <div className="bg-red-50 rounded-xl p-4 mb-3">
                  <p className="text-xs text-red-400 mb-1">Reason</p>
                  <p className="text-red-700 text-sm font-medium">{dispute.reason}</p>
                </div>

                <p className="text-gray-600 text-sm mb-3">{dispute.description}</p>

                {dispute.resolution && (
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="text-xs text-green-400 mb-1">Resolution</p>
                    <p className="text-green-700 text-sm">{dispute.resolution}</p>
                  </div>
                )}

                <p className="text-xs text-gray-400 mt-3">
                  Raised on {new Date(dispute.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Raise Dispute Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">Raise a Dispute</h2>
              <button onClick={() => setShowForm(false)}
                className="text-gray-400 text-xl hover:text-gray-600">×</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Select Project *
                </label>
                <select value={form.gigId}
                  onChange={(e) => {
                    const selected = myGigs.find(g => g._id === e.target.value);
                    setForm({
                      ...form,
                      gigId: e.target.value,
                      againstId: selected?.assignedFreelancer || selected?.client || '',
                    });
                  }}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select a project</option>
                  {myGigs.map(g => (
                    <option key={g._id} value={g._id}>{g.title}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Reason *
                </label>
                <select value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select reason</option>
                  {REASONS.map(r => <option key={r}>{r}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description *
                </label>
                <textarea value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  placeholder="Describe the issue in detail..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl text-sm font-medium">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Raise Dispute'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Disputes;