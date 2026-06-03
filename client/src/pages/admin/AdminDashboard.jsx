import { useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [gigs, setGigs] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('users');
  const [resolutionText, setResolutionText] = useState('');
  const [resolvingId, setResolvingId] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [usersRes, gigsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/gigs'),
      ]);
      setUsers(usersRes.data.users);
      setGigs(gigsRes.data.gigs);

      // Disputes — separate try so it doesn't break if route missing
      try {
        const disputesRes = await api.get('/admin/disputes');
        setDisputes(disputesRes.data.disputes || []);
      } catch {}

    } catch {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async (userId, isActive) => {
    try {
      await api.put(`/admin/users/${userId}/suspend`, { isActive: !isActive });
      toast.success(isActive ? 'User suspended' : 'User activated');
      fetchData();
    } catch {
      toast.error('Action failed');
    }
  };

  const handleResolveDispute = async (disputeId) => {
    if (!resolutionText.trim()) return toast.error('Enter resolution text');
    try {
      await api.put(`/admin/disputes/${disputeId}/resolve`, {
        resolution: resolutionText,
      });
      toast.success('Dispute resolved!');
      setResolvingId(null);
      setResolutionText('');
      fetchData();
    } catch {
      toast.error('Failed to resolve dispute');
    }
  };

  const stats = {
    totalUsers: users.length,
    freelancers: users.filter(u => u.role === 'freelancer').length,
    clients: users.filter(u => u.role === 'client').length,
    totalGigs: gigs.length,
    openGigs: gigs.filter(g => g.status === 'open').length,
  };

  const statusColor = {
    open: 'bg-red-100 text-red-700',
    under_review: 'bg-yellow-100 text-yellow-700',
    resolved: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Platform overview and management</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'bg-blue-50' },
            { label: 'Freelancers', value: stats.freelancers, icon: '💼', color: 'bg-indigo-50' },
            { label: 'Clients', value: stats.clients, icon: '🏢', color: 'bg-purple-50' },
            { label: 'Total Gigs', value: stats.totalGigs, icon: '📋', color: 'bg-green-50' },
            { label: 'Open Gigs', value: stats.openGigs, icon: '🟢', color: 'bg-yellow-50' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center text-lg mb-3`}>
                {s.icon}
              </div>
              <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          <button onClick={() => setTab('users')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              tab === 'users' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}>
            Users ({stats.totalUsers})
          </button>
          <button onClick={() => setTab('gigs')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              tab === 'gigs' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}>
            Gigs ({stats.totalGigs})
          </button>
          <button onClick={() => setTab('disputes')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              tab === 'disputes' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}>
            Disputes ({disputes.length})
          </button>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>

          ) : tab === 'users' ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Name', 'Email', 'Role', 'Status', 'Joined', 'Action'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-800">{u.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        u.role === 'freelancer' ? 'bg-blue-100 text-blue-700' :
                        u.role === 'client' ? 'bg-purple-100 text-purple-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        u.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {u.isActive ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-400">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-4">
                      {u.role !== 'admin' && (
                        <button onClick={() => handleSuspend(u._id, u.isActive)}
                          className={`text-xs px-3 py-1.5 rounded-lg font-medium transition ${
                            u.isActive
                              ? 'bg-red-50 text-red-500 hover:bg-red-100'
                              : 'bg-green-50 text-green-600 hover:bg-green-100'
                          }`}>
                          {u.isActive ? 'Suspend' : 'Activate'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          ) : tab === 'gigs' ? (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {['Title', 'Category', 'Budget', 'Status', 'Client', 'Posted'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {gigs.map((g) => (
                  <tr key={g._id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 text-sm font-medium text-gray-800 max-w-[200px] truncate">
                      {g.title}
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{g.category}</td>
                    <td className="px-5 py-4 text-sm text-gray-700">
                      ₹{g.budget?.min?.toLocaleString()}–{g.budget?.max?.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                        g.status === 'open' ? 'bg-green-100 text-green-700' :
                        g.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {g.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm text-gray-500">{g.client?.name}</td>
                    <td className="px-5 py-4 text-sm text-gray-400">
                      {new Date(g.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

          ) : tab === 'disputes' ? (
            <div className="p-6">
              {disputes.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-5xl mb-4">⚖️</p>
                  <p className="text-gray-500 text-lg">No disputes raised yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {disputes.map((d) => (
                    <div key={d._id}
                      className="border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-800">{d.gig?.title}</h3>
                          <p className="text-gray-400 text-sm mt-0.5">
                            {d.raisedBy?.name} → {d.against?.name}
                          </p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor[d.status]}`}>
                          {d.status?.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="bg-red-50 rounded-xl p-3 mb-3">
                        <p className="text-xs text-red-400 mb-0.5">Reason</p>
                        <p className="text-red-700 text-sm font-medium">{d.reason}</p>
                      </div>

                      <p className="text-gray-600 text-sm mb-3">{d.description}</p>

                      {d.resolution && (
                        <div className="bg-green-50 rounded-xl p-3 mb-3">
                          <p className="text-xs text-green-400 mb-0.5">Resolution</p>
                          <p className="text-green-700 text-sm">{d.resolution}</p>
                        </div>
                      )}

                      <p className="text-xs text-gray-400 mb-3">
                        Raised on {new Date(d.createdAt).toLocaleDateString()}
                      </p>

                      {d.status !== 'resolved' && (
                        <>
                          {resolvingId === d._id ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={resolutionText}
                                onChange={(e) => setResolutionText(e.target.value)}
                                placeholder="Enter resolution..."
                                className="flex-1 border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                              />
                              <button
                                onClick={() => handleResolveDispute(d._id)}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
                                Resolve
                              </button>
                              <button
                                onClick={() => setResolvingId(null)}
                                className="bg-gray-100 text-gray-600 px-4 py-2 rounded-xl text-sm transition">
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setResolvingId(d._id);
                                setResolutionText('');
                              }}
                              className="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 px-4 py-2 rounded-xl text-sm font-medium transition">
                              ⚖️ Resolve Dispute
                            </button>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;