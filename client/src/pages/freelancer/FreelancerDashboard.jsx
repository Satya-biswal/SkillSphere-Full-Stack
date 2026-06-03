import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { getMyProposals } from '../../services/gigService';
import toast from 'react-hot-toast';

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>{icon}</div>
    </div>
  </div>
);

const FreelancerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const pending = proposals.filter(p => p.status === 'pending').length;
  const accepted = proposals.filter(p => p.status === 'accepted').length;
  const rejected = proposals.filter(p => p.status === 'rejected').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Welcome, {user?.name}! 👋</h1>
          <p className="text-gray-500 mt-1">Here's your freelance activity overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <StatCard label="Total Proposals" value={proposals.length} icon="📩" color="bg-blue-50" />
          <StatCard label="Pending" value={pending} icon="⏳" color="bg-yellow-50" />
          <StatCard label="Accepted" value={accepted} icon="✅" color="bg-green-50" />
          <StatCard label="Completed Jobs" value={user?.completedJobs || 0} icon="🏆" color="bg-indigo-50" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <Link to="/gigs"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl p-6 flex items-center gap-4 transition">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">🔍</div>
            <div>
              <p className="font-semibold">Browse Gigs</p>
              <p className="text-indigo-200 text-sm">Find your next project</p>
            </div>
          </Link>
          <Link to="/freelancer/proposals"
            className="bg-white hover:shadow-md border border-gray-100 rounded-2xl p-6 flex items-center gap-4 transition">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">📩</div>
            <div>
              <p className="font-semibold text-gray-800">My Proposals</p>
              <p className="text-gray-400 text-sm">Track your applications</p>
            </div>
          </Link>
          <Link to="/chat"
            className="bg-white hover:shadow-md border border-gray-100 rounded-2xl p-6 flex items-center gap-4 transition">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">💬</div>
            <div>
              <p className="font-semibold text-gray-800">Messages</p>
              <p className="text-gray-400 text-sm">Chat with clients</p>
            </div>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Proposals */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-semibold text-gray-800">Recent Proposals</h2>
              <Link to="/freelancer/proposals" className="text-sm text-indigo-600 hover:underline">View all</Link>
            </div>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              </div>
            ) : proposals.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-4xl mb-3">📩</p>
                <p className="text-gray-500 mb-4">No proposals submitted yet</p>
                <Link to="/gigs" className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
                  Browse Gigs
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {proposals.slice(0, 5).map((p) => (
                  <div key={p._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 text-sm truncate">{p.gig?.title}</p>
                      <p className="text-xs text-gray-400">{p.gig?.category} · ₹{p.bidAmount?.toLocaleString()}</p>
                    </div>
                    <span className={`ml-3 px-2.5 py-1 rounded-full text-xs font-medium capitalize flex-shrink-0 ${
                      p.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      p.status === 'accepted' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Your Profile</h2>
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <p className="font-semibold text-gray-800">{user?.name}</p>
              <p className="text-gray-400 text-sm">{user?.email}</p>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Reputation</span>
                <span className="font-medium">⭐ {user?.reputationScore || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Jobs Done</span>
                <span className="font-medium">{user?.completedJobs || 0}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-50">
                <span className="text-gray-500">Hourly Rate</span>
                <span className="font-medium">₹{user?.hourlyRate || 0}/hr</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-gray-500">Total Earned</span>
                <span className="font-medium text-green-600">₹{user?.totalEarnings?.toLocaleString() || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FreelancerDashboard;
