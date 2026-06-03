import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { getMyGigs, deleteGig } from '../../services/gigService';
import toast from 'react-hot-toast';

const MyGigs = () => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchGigs(); }, []);

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

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this gig?')) return;
    try {
      await deleteGig(id);
      setGigs(gigs.filter(g => g._id !== id));
      toast.success('Gig deleted');
    } catch {
      toast.error('Failed to delete gig');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">My Gigs</h1>
            <p className="text-gray-500 mt-1">{gigs.length} gigs posted</p>
          </div>
          <Link to="/client/post-gig"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition">
            + Post New Gig
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : gigs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-gray-500 text-lg mb-5">You haven't posted any gigs yet</p>
            <Link to="/client/post-gig"
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-sm font-medium hover:bg-indigo-700 transition">
              Post Your First Gig
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {gigs.map((gig) => (
              <div key={gig._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-800">{gig.title}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                        gig.status === 'open' ? 'bg-green-100 text-green-700' :
                        gig.status === 'in-progress' ? 'bg-yellow-100 text-yellow-700' :
                        gig.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {gig.status}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">{gig.description}</p>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {gig.skills?.map((s, i) => (
                        <span key={i} className="bg-indigo-50 text-indigo-600 text-xs px-2.5 py-0.5 rounded-full">{s}</span>
                      ))}
                    </div>
                    <div className="flex items-center gap-5 text-sm text-gray-500">
                      <span>💰 ₹{gig.budget?.min?.toLocaleString()}–{gig.budget?.max?.toLocaleString()}</span>
                      <span>📂 {gig.category}</span>
                      <span>👥 {gig.proposals?.length || 0} proposals</span>
                      <span>📅 {new Date(gig.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Link to={`/client/gig/${gig._id}/proposals`}
                      className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-3 py-2 rounded-lg text-sm font-medium transition">
                      View Proposals ({gig.proposals?.length || 0})
                    </Link>
                    <button onClick={() => handleDelete(gig._id)}
                      className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-2 rounded-lg text-sm transition">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyGigs;
