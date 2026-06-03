import { useEffect, useState } from 'react';
import Navbar from '../../components/common/Navbar';
import GigCard from '../../components/gigs/GigCard';
import { getAllGigs, submitProposal } from '../../services/gigService';
import toast from 'react-hot-toast';

const CATEGORIES = ['All', 'Web Development', 'Mobile Development', 'Design', 'Writing', 'Marketing', 'Data Science', 'DevOps', 'Other'];

const BrowseGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', level: '', sort: '' });
  const [selectedGig, setSelectedGig] = useState(null);
  const [proposal, setProposal] = useState({ coverLetter: '', bidAmount: '', estimatedDays: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { fetchGigs(); }, [filters.category, filters.level, filters.sort]);

  const fetchGigs = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.level) params.level = filters.level;
      if (filters.sort) params.sort = filters.sort;
      const data = await getAllGigs(params);
      setGigs(data.gigs);
    } catch {
      toast.error('Failed to load gigs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchGigs();
  };

  const handleApply = (gig) => {
    setSelectedGig(gig);
    setProposal({ coverLetter: '', bidAmount: '', estimatedDays: '' });
  };

  const handleSubmitProposal = async (e) => {
    e.preventDefault();
    if (!proposal.coverLetter || !proposal.bidAmount || !proposal.estimatedDays) {
      return toast.error('Fill all fields');
    }
    setSubmitting(true);
    try {
      await submitProposal(selectedGig._id, {
        coverLetter: proposal.coverLetter,
        bidAmount: Number(proposal.bidAmount),
        estimatedDays: Number(proposal.estimatedDays),
      });
      toast.success('Proposal submitted!');
      setSelectedGig(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit proposal');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Browse Gigs</h1>
          <p className="text-gray-500 mt-1">{gigs.length} projects available</p>
        </div>

        {/* Search + Filters */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-6">
          <form onSubmit={handleSearch} className="flex gap-3 mb-4">
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              placeholder="Search gigs by title, skill, or keyword..."
              className="flex-1 border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition">
              Search
            </button>
          </form>

          <div className="flex flex-wrap gap-3">
            <select value={filters.level} onChange={(e) => setFilters({ ...filters, level: e.target.value })}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">All Levels</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="expert">Expert</option>
            </select>
            <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
              className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Newest First</option>
              <option value="budget_high">Budget: High to Low</option>
              <option value="budget_low">Budget: Low to High</option>
            </select>
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button key={cat}
                onClick={() => setFilters({ ...filters, category: cat === 'All' ? '' : cat })}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                  (filters.category === cat || (cat === 'All' && !filters.category))
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Gig Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : gigs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-5xl mb-4">🔍</p>
            <p className="text-gray-500 text-lg">No gigs found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {gigs.map((gig) => (
              <GigCard key={gig._id} gig={gig} onApply={handleApply} />
            ))}
          </div>
        )}
      </div>

      {/* Proposal Modal */}
      {selectedGig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-start mb-5">
              <div>
                <h2 className="text-lg font-bold text-gray-800">Submit Proposal</h2>
                <p className="text-gray-400 text-sm mt-0.5 line-clamp-1">{selectedGig.title}</p>
              </div>
              <button onClick={() => setSelectedGig(null)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>

            <form onSubmit={handleSubmitProposal} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cover Letter *</label>
                <textarea
                  value={proposal.coverLetter}
                  onChange={(e) => setProposal({ ...proposal, coverLetter: e.target.value })}
                  rows={4} placeholder="Why are you the best fit for this project?"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Your Bid (₹) *</label>
                  <input type="number" value={proposal.bidAmount}
                    onChange={(e) => setProposal({ ...proposal, bidAmount: e.target.value })}
                    placeholder={`${selectedGig.budget?.min}–${selectedGig.budget?.max}`} min="0"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Days to Complete *</label>
                  <input type="number" value={proposal.estimatedDays}
                    onChange={(e) => setProposal({ ...proposal, estimatedDays: e.target.value })}
                    placeholder="e.g. 7" min="1"
                    className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setSelectedGig(null)}
                  className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Proposal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrowseGigs;
