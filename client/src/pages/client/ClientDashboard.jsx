import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { getMyGigs } from '../../services/gigService';
import toast from 'react-hot-toast';

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${color}`}>
        {icon}
      </div>
    </div>
  </div>
);

const ClientDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGigs = async () => {
      try {
        const data = await getMyGigs();
        setGigs(data.gigs);
      } catch {
        toast.error('Failed to load gigs');
      } finally {
        setLoading(false);
      }
    };
    fetchGigs();
  }, []);

  const openGigs = gigs.filter(g => g.status === 'open').length;
  const inProgressGigs = gigs.filter(g => g.status === 'in-progress').length;
  const completedGigs = gigs.filter(g => g.status === 'completed').length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Here's an overview of your projects</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <StatCard label="Total Gigs Posted" value={gigs.length} icon="📋" color="bg-blue-50" />
          <StatCard label="Open Gigs" value={openGigs} icon="🟢" color="bg-green-50" />
          <StatCard label="In Progress" value={inProgressGigs} icon="⚡" color="bg-yellow-50" />
          <StatCard label="Completed" value={completedGigs} icon="✅" color="bg-indigo-50" />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          <Link to="/client/post-gig"
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl p-6 flex items-center gap-4 transition">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">+</div>
            <div>
              <p className="font-semibold">Post a New Gig</p>
              <p className="text-indigo-200 text-sm">Find the right freelancer</p>
            </div>
          </Link>
          <Link to="/client/my-gigs"
            className="bg-white hover:shadow-md border border-gray-100 rounded-2xl p-6 flex items-center gap-4 transition">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-2xl">📋</div>
            <div>
              <p className="font-semibold text-gray-800">Manage Gigs</p>
              <p className="text-gray-400 text-sm">View all your posted gigs</p>
            </div>
          </Link>
          <Link to="/chat"
            className="bg-white hover:shadow-md border border-gray-100 rounded-2xl p-6 flex items-center gap-4 transition">
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-2xl">💬</div>
            <div>
              <p className="font-semibold text-gray-800">Messages</p>
              <p className="text-gray-400 text-sm">Chat with freelancers</p>
            </div>
          </Link>
        </div>

        {/* Recent Gigs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex justify-between items-center mb-5">
            <h2 className="text-lg font-semibold text-gray-800">Recent Gigs</h2>
            <Link to="/client/my-gigs" className="text-sm text-indigo-600 hover:underline">View all</Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>
          ) : gigs.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-gray-500 mb-4">No gigs posted yet</p>
              <Link to="/client/post-gig"
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
                Post Your First Gig
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-400 uppercase tracking-wide border-b border-gray-100">
                    <th className="pb-3">Title</th>
                    <th className="pb-3">Category</th>
                    <th className="pb-3">Budget</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3">Proposals</th>
                    <th className="pb-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {gigs.slice(0, 5).map((gig) => (
                    <tr key={gig._id} className="text-sm">
                      <td className="py-3 font-medium text-gray-800 max-w-[200px] truncate">{gig.title}</td>
                      <td className="py-3 text-gray-500">{gig.category}</td>
                      <td className="py-3 text-gray-700">₹{gig.budget?.min?.toLocaleString()}–{gig.budget?.max?.toLocaleString()}</td>
                      <td className="py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                          gig.status === 'open' ? 'bg-green-100 text-green-700' :
                          gig.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {gig.status}
                        </span>
                      </td>
                      <td className="py-3 text-gray-500">{gig.proposals?.length || 0}</td>
                      <td className="py-3">
                        <Link to={`/client/gig/${gig._id}/proposals`}
                          className="text-indigo-600 text-xs hover:underline">
                          View Proposals
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;
