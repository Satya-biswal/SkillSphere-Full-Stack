import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../../components/common/Navbar';
import { getGigProposals, updateProposalStatus } from '../../services/gigService';
import PaymentModal from '../../components/payment/PaymentModal';
import toast from 'react-hot-toast';

const ViewProposals = () => {
  const { gigId } = useParams();
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState(null);
  const [gig, setGig] = useState(null);

  useEffect(() => { fetchProposals(); }, []);

  const fetchProposals = async () => {
    try {
      const data = await getGigProposals(gigId);
      setProposals(data.proposals);
      if (data.gig) setGig(data.gig);
    } catch {
      toast.error('Failed to load proposals');
    } finally {
      setLoading(false);
    }
  };

  const handleStatus = async (proposalId, status) => {
    try {
      await updateProposalStatus(proposalId, status);
      toast.success(`Proposal ${status}`);
      fetchProposals();
    } catch {
      toast.error('Failed to update proposal');
    }
  };

  const statusColor = {
    pending: 'bg-yellow-100 text-yellow-700',
    accepted: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
    withdrawn: 'bg-gray-100 text-gray-600',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link to="/client/my-gigs" className="text-gray-400 hover:text-gray-600 text-sm">← Back</Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Proposals</h1>
            <p className="text-gray-500">{proposals.length} proposals received</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : proposals.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-100">
            <p className="text-5xl mb-4">📩</p>
            <p className="text-gray-500 text-lg">No proposals yet</p>
            <p className="text-gray-400 text-sm mt-2">Freelancers will appear here once they apply</p>
          </div>
        ) : (
          <div className="space-y-4">
            {proposals.map((proposal) => (
              <div key={proposal._id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                {/* Freelancer Info */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-lg">
                      {proposal.freelancer?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{proposal.freelancer?.name}</p>
                      <p className="text-gray-400 text-sm">
                        ⭐ {proposal.freelancer?.reputationScore || 0} · {proposal.freelancer?.completedJobs || 0} jobs
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${statusColor[proposal.status]}`}>
                    {proposal.status}
                  </span>
                </div>

                {/* Bid Details */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Bid Amount</p>
                    <p className="font-bold text-indigo-600 text-lg">₹{proposal.bidAmount?.toLocaleString()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Delivery</p>
                    <p className="font-bold text-gray-800">{proposal.estimatedDays} days</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">Applied</p>
                    <p className="font-medium text-gray-700 text-sm">
                      {new Date(proposal.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Cover Letter */}
                <div className="mb-4">
                  <p className="text-xs text-gray-400 mb-1.5">Cover Letter</p>
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 rounded-xl p-3">
                    {proposal.coverLetter}
                  </p>
                </div>

                {/* Skills */}
                {proposal.freelancer?.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {proposal.freelancer.skills.slice(0, 5).map((s, i) => (
                      <span key={i} className="bg-indigo-50 text-indigo-600 text-xs px-2.5 py-0.5 rounded-full">
                        {s.skill || s}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                {proposal.status === 'pending' && (
                  <div className="flex gap-3 pt-3 border-t border-gray-100">
                    <button
                      onClick={() => handleStatus(proposal._id, 'accepted')}
                      className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2.5 rounded-xl text-sm font-medium transition">
                      ✓ Accept
                    </button>
                    <Link to="/chat"
                      className="flex-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 py-2.5 rounded-xl text-sm font-medium transition text-center">
                      💬 Message
                    </Link>
                    <button
                      onClick={() => handleStatus(proposal._id, 'rejected')}
                      className="flex-1 bg-red-50 hover:bg-red-100 text-red-500 py-2.5 rounded-xl text-sm font-medium transition">
                      ✗ Reject
                    </button>
                  </div>
                )}

                {proposal.status === 'accepted' && (
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <p className="text-green-600 text-sm font-medium">✅ Accepted</p>
                    <div className="flex gap-2">
                      <Link
                        to={`/reviews/${proposal.freelancer?._id}`}
                        className="bg-yellow-50 text-yellow-600 hover:bg-yellow-100 px-4 py-2 rounded-xl text-sm font-medium transition">
                        ⭐ Review
                      </Link>
                      <button
                        onClick={() => setPaymentData({
                          gig: gig || { _id: gigId, title: 'Project', budget: { min: 0, max: 0 } },
                          freelancer: proposal.freelancer
                        })}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition">
                        💳 Pay Now
                      </button>
                    </div>
                  </div>
                )}

                {proposal.status === 'rejected' && (
                  <div className="pt-3 border-t border-gray-100">
                    <p className="text-red-400 text-sm text-center">Proposal was rejected</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {paymentData && (
        <PaymentModal
          gig={paymentData.gig}
          freelancer={paymentData.freelancer}
          onClose={() => setPaymentData(null)}
          onSuccess={() => fetchProposals()}
        />
      )}
    </div>
  );
};

export default ViewProposals;