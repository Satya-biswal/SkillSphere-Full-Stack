import { useNavigate } from 'react-router-dom';

const GigCard = ({ gig, onApply }) => {
  const navigate = useNavigate();

  const categoryColors = {
    'Web Development': 'bg-blue-100 text-blue-700',
    'Mobile Development': 'bg-purple-100 text-purple-700',
    'Design': 'bg-pink-100 text-pink-700',
    'Writing': 'bg-yellow-100 text-yellow-700',
    'Marketing': 'bg-green-100 text-green-700',
    'Data Science': 'bg-orange-100 text-orange-700',
    'DevOps': 'bg-red-100 text-red-700',
    'Other': 'bg-gray-100 text-gray-700',
  };

  const levelColors = {
    beginner: 'bg-green-50 text-green-600',
    intermediate: 'bg-yellow-50 text-yellow-600',
    expert: 'bg-red-50 text-red-600',
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition hover:-translate-y-0.5 cursor-pointer"
      onClick={() => navigate(`/gigs/${gig._id}`)}>
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${categoryColors[gig.category] || 'bg-gray-100 text-gray-700'}`}>
          {gig.category}
        </span>
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full capitalize ${levelColors[gig.experienceLevel]}`}>
          {gig.experienceLevel}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-800 text-base mb-2 line-clamp-2">{gig.title}</h3>
      <p className="text-gray-500 text-sm mb-3 line-clamp-2">{gig.description}</p>

      {/* Skills */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {gig.skills?.slice(0, 4).map((skill, i) => (
          <span key={i} className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">
            {skill}
          </span>
        ))}
        {gig.skills?.length > 4 && (
          <span className="text-xs text-gray-400">+{gig.skills.length - 4} more</span>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-3 border-t border-gray-50">
        <div>
          <p className="text-xs text-gray-400">Budget</p>
          <p className="text-sm font-bold text-indigo-600">
            ₹{gig.budget?.min?.toLocaleString()} – ₹{gig.budget?.max?.toLocaleString()}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-gray-400">{gig.proposals?.length || 0} proposals</p>
          <p className="text-xs text-gray-400">
            {gig.client?.location || 'Remote'}
          </p>
        </div>
      </div>

      {/* Client Info */}
      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-50">
        <div className="w-7 h-7 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-xs font-bold">
          {gig.client?.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-xs font-medium text-gray-700">{gig.client?.name}</p>
          <p className="text-xs text-gray-400">{gig.client?.companyName || 'Client'}</p>
        </div>
      </div>

      {onApply && (
        <button
          onClick={(e) => { e.stopPropagation(); onApply(gig); }}
          className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2 rounded-lg transition"
        >
          Submit Proposal
        </button>
      )}
    </div>
  );
};

export default GigCard;
