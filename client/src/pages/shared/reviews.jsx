import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from '../../components/common/Navbar';
import api from '../../services/api';
import toast from 'react-hot-toast';

const StarRating = ({ value, onChange }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((star) => (
      <button key={star} type="button" onClick={() => onChange && onChange(star)}>
        <svg className={`w-7 h-7 ${star <= value ? 'text-yellow-400' : 'text-gray-200'}`}
          fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      </button>
    ))}
  </div>
);

const TAGS = ['Great Communication', 'On Time', 'Quality Work', 'Would Hire Again', 'Professional'];

const Reviews = () => {
  const { freelancerId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [reviews, setReviews] = useState([]);
  const [avgRating, setAvgRating] = useState(0);
  const [freelancer, setFreelancer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ rating: 5, comment: '', tags: [], gigId: '' });
  const [myGigs, setMyGigs] = useState([]);

  useEffect(() => {
    fetchReviews();
    if (user?.role === 'client') fetchMyGigs();
  }, [freelancerId]);

  const fetchReviews = async () => {
    try {
      const [reviewRes, userRes] = await Promise.all([
        api.get(`/reviews/${freelancerId}`),
        api.get(`/users/${freelancerId}`),
      ]);
      setReviews(reviewRes.data.reviews);
      setAvgRating(reviewRes.data.avgRating);
      setFreelancer(userRes.data.user);
    } catch {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchMyGigs = async () => {
    try {
      const res = await api.get('/gigs/my-gigs');
      const completed = res.data.gigs.filter(g =>
        g.status === 'completed' || g.status === 'in-progress'
      );
      setMyGigs(completed);
    } catch {}
  };

  const toggleTag = (tag) => {
    setForm(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.comment.trim()) return toast.error('Please write a comment');
    if (!form.gigId) return toast.error('Select the gig you worked on');
    setSubmitting(true);
    try {
      await api.post(`/reviews/${freelancerId}`, form);
      toast.success('Review submitted!');
      setShowForm(false);
      fetchReviews();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  const ratingCounts = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length,
    percent: reviews.length
      ? (reviews.filter(r => r.rating === star).length / reviews.length) * 100
      : 0,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-6 py-8">

        {/* Header */}
        <button onClick={() => navigate(-1)}
          className="text-gray-400 hover:text-gray-600 text-sm mb-6 flex items-center gap-1">
          ← Back
        </button>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : (
          <>
            {/* Freelancer Info */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {freelancer?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-gray-800">{freelancer?.name}</h1>
                    <p className="text-gray-400 text-sm">{freelancer?.bio || 'Freelancer'}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating value={Math.round(avgRating)} />
                      <span className="text-sm font-semibold text-gray-700">{avgRating}</span>
                      <span className="text-sm text-gray-400">({reviews.length} reviews)</span>
                    </div>
                  </div>
                </div>
                {user?.role === 'client' && (
                  <button onClick={() => setShowForm(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition">
                    + Write Review
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Rating Breakdown */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-fit">
                <h2 className="font-semibold text-gray-800 mb-4">Rating Breakdown</h2>
                <div className="text-center mb-4">
                  <p className="text-5xl font-bold text-gray-800">{avgRating}</p>
                  <StarRating value={Math.round(avgRating)} />
                  <p className="text-sm text-gray-400 mt-1">{reviews.length} total reviews</p>
                </div>
                <div className="space-y-2">
                  {ratingCounts.map(({ star, count, percent }) => (
                    <div key={star} className="flex items-center gap-2 text-sm">
                      <span className="text-gray-500 w-4">{star}</span>
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <div className="flex-1 bg-gray-100 rounded-full h-2">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percent}%` }}></div>
                      </div>
                      <span className="text-gray-400 w-4">{count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews List */}
              <div className="lg:col-span-2 space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
                    <p className="text-4xl mb-3">⭐</p>
                    <p className="text-gray-500">No reviews yet</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review._id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
                            {review.reviewer?.name?.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{review.reviewer?.name}</p>
                            <p className="text-xs text-gray-400">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <StarRating value={review.rating} />
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3">{review.comment}</p>
                      {review.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {review.tags.map((tag, i) => (
                            <span key={i} className="bg-indigo-50 text-indigo-600 text-xs px-2.5 py-0.5 rounded-full">
                              ✓ {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Review Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-lg font-bold text-gray-800">Write a Review</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 text-xl hover:text-gray-600">×</button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Gig Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Select Gig *</label>
                <select value={form.gigId} onChange={(e) => setForm({ ...form, gigId: e.target.value })}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                  <option value="">Select the gig you worked on</option>
                  {myGigs.map(g => (
                    <option key={g._id} value={g._id}>{g.title}</option>
                  ))}
                </select>
              </div>

              {/* Star Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating *</label>
                <StarRating value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Comment *</label>
                <textarea value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })}
                  rows={4} placeholder="Describe your experience working with this freelancer..."
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags (optional)</label>
                <div className="flex flex-wrap gap-2">
                  {TAGS.map(tag => (
                    <button key={tag} type="button" onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${
                        form.tags.includes(tag)
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}>
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="flex-1 border border-gray-300 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl text-sm font-medium transition disabled:opacity-50">
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reviews;