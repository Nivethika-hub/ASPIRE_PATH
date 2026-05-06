import { useNavigate } from 'react-router-dom';

const OpportunityCard = ({ opportunity, onBookmark, isBookmarked }) => {
  const navigate = useNavigate();

  if (!opportunity) return null;

  const getDeadlineStatus = () => {
    if (!opportunity.deadline) return { text: 'No deadline', color: 'text-gray-400' };
    const deadline = new Date(opportunity.deadline);
    const today = new Date();
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Expired', color: 'text-red-600' };
    if (diffDays === 0) return { text: 'Today', color: 'text-orange-600' };
    if (diffDays === 1) return { text: '1 day left', color: 'text-orange-600' };
    return { text: `${diffDays} days left`, color: 'text-green-600' };
  };

  const deadlineStatus = getDeadlineStatus();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-800">{opportunity.title}</h3>
        <span className={`text-sm font-medium px-3 py-1 rounded-full ${
          opportunity.type === 'Hackathon' ? 'bg-purple-100 text-purple-700' :
          opportunity.type === 'Internship' ? 'bg-blue-100 text-blue-700' :
          'bg-green-100 text-green-700'
        }`}>
          {opportunity.type}
        </span>
      </div>
      <p className="text-gray-600 mb-2">{opportunity.company}</p>
      <p className="text-sm text-gray-500 mb-3">{opportunity.location}</p>
      <p className={`text-sm font-medium mb-4 ${deadlineStatus.color}`}>
        {deadlineStatus.text}
      </p>
      {opportunity.matchScore !== undefined && (
        <div className="mb-3">
          <span className="text-sm font-medium text-blue-600">
            Match Score: {opportunity.matchScore}%
          </span>
        </div>
      )}
      <div className="flex gap-2">
        <button
          onClick={() => navigate(`/opportunity/${opportunity.id}`)}
          className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          View Details
        </button>
        {onBookmark && (
          <button
            onClick={() => onBookmark(opportunity.id)}
            className={`px-4 py-2 rounded-lg ${
              isBookmarked
                ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isBookmarked ? 'Saved' : 'Save'}
          </button>
        )}
      </div>
    </div>
  );
};

export default OpportunityCard;
