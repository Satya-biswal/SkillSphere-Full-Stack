import { useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import api from '../../services/api';
import toast from 'react-hot-toast';

const Analytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get('/users/analytics');
        setAnalytics(res.data.analytics);
      } catch {
        toast.error('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex justify-center py-20">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    </div>
  );

  const months = Object.keys(analytics?.monthlyEarnings || {});
  const earnings = Object.values(analytics?.monthlyEarnings || {});
  const maxEarning = Math.max(...earnings, 1);
  const categories = Object.entries(analytics?.categoryBreakdown || {});

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-500 mt-1">Your performance overview</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          {[
            { label: 'Total Earnings', value: `₹${analytics?.totalEarnings?.toLocaleString() || 0}`, icon: '💰', color: 'bg-green-50 text-green-600' },
            { label: 'Jobs Completed', value: analytics?.completedJobs || 0, icon: '✅', color: 'bg-blue-50 text-blue-600' },
            { label: 'Success Rate', value: `${analytics?.successRate || 0}%`, icon: '📈', color: 'bg-indigo-50 text-indigo-600' },
            { label: 'Reputation', value: `⭐ ${analytics?.reputationScore || 0}`, icon: '🏆', color: 'bg-yellow-50 text-yellow-600' },
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Monthly Earnings Chart */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-5">Monthly Earnings</h2>
            {months.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-3xl mb-2">📊</p>
                <p className="text-gray-400 text-sm">No earnings data yet</p>
              </div>
            ) : (
              <div className="flex items-end gap-3 h-40">
                {months.map((month, i) => (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1">
                    <p className="text-xs text-indigo-600 font-semibold">
                      ₹{earnings[i]?.toLocaleString()}
                    </p>
                    <div className="w-full bg-indigo-600 rounded-t-lg transition-all"
                      style={{ height: `${(earnings[i] / maxEarning) * 120}px`, minHeight: '8px' }}>
                    </div>
                    <p className="text-xs text-gray-400">{month}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="font-semibold text-gray-800 mb-5">Top Categories</h2>
            {categories.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-3xl mb-2">📂</p>
                <p className="text-gray-400 text-sm">No data yet</p>
              </div>
            ) : (
              <div className="space-y-3">
                {categories.sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
                  const total = categories.reduce((s, [, c]) => s + c, 0);
                  const percent = Math.round((count / total) * 100);
                  return (
                    <div key={cat}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700 truncate">{cat}</span>
                        <span className="text-gray-400 ml-2">{percent}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${percent}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Proposal Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="font-semibold text-gray-800 mb-5">Proposal Statistics</h2>
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Total Sent', value: analytics?.proposalStats?.total || 0, color: 'bg-blue-100 text-blue-700' },
              { label: 'Pending', value: analytics?.proposalStats?.pending || 0, color: 'bg-yellow-100 text-yellow-700' },
              { label: 'Accepted', value: analytics?.proposalStats?.accepted || 0, color: 'bg-green-100 text-green-700' },
              { label: 'Rejected', value: analytics?.proposalStats?.rejected || 0, color: 'bg-red-100 text-red-700' },
            ].map((s) => (
              <div key={s.label} className={`${s.color} rounded-2xl p-5 text-center`}>
                <p className="text-3xl font-bold">{s.value}</p>
                <p className="text-sm mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;