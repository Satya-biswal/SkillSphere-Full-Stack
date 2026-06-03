import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { getMyProposals } from '../../services/gigService';
import toast from 'react-hot-toast';

const MyProposals = () => {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const data = await getMyProposals();
        setProposals(data.proposals);
      } catch {
        toast.error('Failed to load proposals');
      } finally {
        setLoading(false);
      }
    };
    fetchProposals();
  }, []);

  const filtered = filter === 'all' ? proposals : proposals.filter(p => p.status === filter);

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    withdrawn: 'bg-gray-100 text-gray-600',
  };

  const counts = {
    all: proposals.length,
    pending: proposals.filter(p => p.status === 'pending').length,
    accepted: proposals.filter(p => p.status === 'accepted').length,
    rejected: proposals.filter(p => p.status === 'rejected').length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">My Proposals</h1>
          <p className="text-gray-500 mt-1">Track all your job applications</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {Object.entries(counts).map(([key, count]) => (
            <button key={key}
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition capitalize ${
                filter === key
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}>
              {key} ({count})
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-5xl mb-4">📩</p>
            <p className="text-gray-500 text-lg">No proposals yet</p>
            <Link to="/gigs" className="mt-4 inline-block bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
              Browse Gigs
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((proposal) => (
              <div key={proposal._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {proposal.gig?.title || 'Gig Deleted'}
                    </h3>
                    <p className="text-gray-400 text-sm">{proposal.gig?.category}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ml-3 ${statusColor[proposal.status]}`}>
                    {proposal.status}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2 bg-gray-50 rounded-lg p-3">
                  {proposal.coverLetter}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex gap-5 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">Your Bid</p>
                      <p className="font-bold text-indigo-600">₹{proposal.bidAmount?.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Delivery</p>
                      <p className="font-medium text-gray-700">{proposal.estimatedDays} days</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Applied</p>
                      <p className="font-medium text-gray-700">{new Date(proposal.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  {proposal.status === 'accepted' && (
                    <Link to="/chat"
                      className="bg-green-50 text-green-600 hover:bg-green-100 px-4 py-2 rounded-xl text-sm font-medium transition">
                      💬 Chat with Client
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProposals;
