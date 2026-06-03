import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from '../../components/common/Navbar';
import api from '../../services/api';
import toast from 'react-hot-toast';

const ProgressTracker = () => {
  const { user } = useSelector((state) => state.auth);
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [milestones, setMilestones] = useState([]);

  useEffect(() => { fetchActiveGigs(); }, []);

  const fetchActiveGigs = async () => {
    try {
      if (user?.role === 'client') {
        const res = await api.get('/gigs/my-gigs');
        const active = res.data.gigs.filter(g => g.status === 'in-progress');
        setGigs(active);
        if (active.length > 0) {
          setSelected(active[0]);
          setMilestones(active[0].milestones || []);
        }
      } else {
        const res = await api.get('/proposals/my');
        const accepted = res.data.proposals
          .filter(p => p.status === 'accepted' && p.gig?.status === 'in-progress')
          .map(p => p.gig);
        setGigs(accepted);
        if (accepted.length > 0) {
          setSelected(accepted[0]);
          setMilestones(accepted[0].milestones || []);
        }
      }
    } catch {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const selectGig = (gig) => {
    setSelected(gig);
    setMilestones(gig.milestones || []);
  };

  const toggleMilestone = async (index) => {
    if (user?.role !== 'client') return;
    const updated = [...milestones];
    updated[index].status = updated[index].status === 'completed' ? 'pending' : 'completed';
    setMilestones(updated);

    try {
      await api.put(`/gigs/${selected._id}`, { milestones: updated });
      toast.success('Milestone updated!');
    } catch {
      toast.error('Failed to update milestone');
    }
  };

  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const progressPercent = milestones.length
    ? Math.round((completedCount / milestones.length) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Project Progress</h1>
          <p className="text-gray-500 mt-1">Track your active projects</p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : gigs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-5xl mb-4">📊</p>
            <p className="text-gray-500 text-lg">No active projects</p>
            <p className="text-gray-400 text-sm mt-2">
              Projects appear here when proposals are accepted
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Project List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="font-semibold text-gray-800 mb-3">Active Projects</h2>
              <div className="space-y-2">
                {gigs.map((gig) => (
                  <button key={gig._id} onClick={() => selectGig(gig)}
                    className={`w-full text-left p-3 rounded-xl transition ${
                      selected?._id === gig._id
                        ? 'bg-indigo-50 border border-indigo-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}>
                    <p className="font-medium text-sm text-gray-800 truncate">{gig.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{gig.category}</p>
                    <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                      <div className="bg-indigo-600 h-1.5 rounded-full"
                        style={{
                          width: `${gig.milestones?.length
                            ? (gig.milestones.filter(m => m.status === 'completed').length / gig.milestones.length) * 100
                            : 0}%`
                        }}>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Detail */}
            <div className="lg:col-span-2 space-y-5">
              {selected && (
                <>
                  {/* Progress Card */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="font-semibold text-gray-800 mb-1">{selected.title}</h2>
                    <p className="text-gray-400 text-sm mb-4">{selected.category}</p>

                    {/* Progress Ring */}
                    <div className="flex items-center gap-6 mb-5">
                      <div className="relative w-24 h-24">
                        <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15.9"
                            fill="none" stroke="#e5e7eb" strokeWidth="3" />
                          <circle cx="18" cy="18" r="15.9"
                            fill="none" stroke="#4F46E5" strokeWidth="3"
                            strokeDasharray={`${progressPercent} ${100 - progressPercent}`}
                            strokeLinecap="round" />
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-xl font-bold text-indigo-600">{progressPercent}%</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Overall Progress</p>
                        <p className="text-2xl font-bold text-gray-800 mt-1">
                          {completedCount}/{milestones.length} milestones
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                          Budget: ₹{selected.budget?.min?.toLocaleString()}–₹{selected.budget?.max?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Status Bar */}
                    <div className="w-full bg-gray-100 rounded-full h-2.5 mb-1">
                      <div className="bg-indigo-600 h-2.5 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}></div>
                    </div>
                    <p className="text-xs text-gray-400 text-right">{progressPercent}% complete</p>
                  </div>

                  {/* Milestones */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="font-semibold text-gray-800 mb-4">
                      Milestones
                      {user?.role === 'client' && (
                        <span className="text-xs text-gray-400 font-normal ml-2">
                          (click to mark complete)
                        </span>
                      )}
                    </h2>

                    {milestones.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-3xl mb-2">📋</p>
                        <p className="text-gray-400 text-sm">
                          No milestones defined for this project
                        </p>
                        <p className="text-gray-300 text-xs mt-1">
                          Add milestones when posting a gig next time
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {milestones.map((milestone, i) => (
                          <div key={i}
                            onClick={() => toggleMilestone(i)}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition ${
                              user?.role === 'client' ? 'cursor-pointer' : ''
                            } ${
                              milestone.status === 'completed'
                                ? 'bg-green-50 border-green-200'
                                : 'bg-gray-50 border-gray-200 hover:border-indigo-200'
                            }`}>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                              milestone.status === 'completed'
                                ? 'bg-green-500 border-green-500'
                                : 'border-gray-300'
                            }`}>
                              {milestone.status === 'completed' && (
                                <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className={`font-medium text-sm ${
                                milestone.status === 'completed' ? 'text-green-700 line-through' : 'text-gray-800'
                              }`}>
                                {milestone.title}
                              </p>
                              {milestone.amount && (
                                <p className="text-xs text-gray-400 mt-0.5">
                                  ₹{milestone.amount?.toLocaleString()}
                                  {milestone.dueDate && ` · Due: ${new Date(milestone.dueDate).toLocaleDateString()}`}
                                </p>
                              )}
                            </div>
                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                              milestone.status === 'completed'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-gray-100 text-gray-500'
                            }`}>
                              {milestone.status === 'completed' ? 'Done' : 'Pending'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Project Info */}
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                    <h2 className="font-semibold text-gray-800 mb-4">Project Details</h2>
                    <p className="text-gray-600 text-sm leading-relaxed">{selected.description}</p>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Status</p>
                        <p className="font-semibold text-yellow-600 capitalize mt-0.5">{selected.status}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Level</p>
                        <p className="font-semibold text-gray-700 capitalize mt-0.5">{selected.experienceLevel}</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 rounded-xl">
                        <p className="text-xs text-gray-400">Posted</p>
                        <p className="font-semibold text-gray-700 mt-0.5">
                          {new Date(selected.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressTracker;