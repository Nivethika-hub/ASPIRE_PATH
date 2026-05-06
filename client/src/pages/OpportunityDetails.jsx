import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOpportunityById, addBookmark, checkBookmark, applyForOpportunity, getMyApplications } from '../services/api';

const OpportunityDetails = () => {
  const { id } = useParams();
  const [opportunity, setOpportunity] = useState(null);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [trackMessage, setTrackMessage] = useState('');

  useEffect(() => {
    fetchOpportunity();
    checkIfBookmarked();
    checkIfTracking();
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      const { data } = await getOpportunityById(id);
      setOpportunity(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const checkIfBookmarked = async () => {
    try {
      const { data } = await checkBookmark(id);
      setIsBookmarked(data.bookmarked);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const checkIfTracking = async () => {
    try {
      const { data } = await getMyApplications();
      const tracking = data.some(app => app.opportunity.id === parseInt(id));
      setIsTracking(tracking);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleBookmark = async () => {
    try {
      await addBookmark(id);
      setIsBookmarked(true);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleTrack = async () => {
    try {
      await applyForOpportunity(id);
      setIsTracking(true);
      setTrackMessage('Application is now being tracked!');
      setTimeout(() => setTrackMessage(''), 3000);
    } catch (error) {
      setTrackMessage(error.response?.data?.message || 'Error tracking application');
      setTimeout(() => setTrackMessage(''), 3000);
    }
  };

  if (!opportunity) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex justify-between items-start mb-6">
            <h1 className="text-3xl font-bold text-gray-800">{opportunity.title}</h1>
            <span className={`text-sm font-medium px-3 py-1 rounded-full ${
              opportunity.type === 'Hackathon' ? 'bg-purple-100 text-purple-700' :
              opportunity.type === 'Internship' ? 'bg-blue-100 text-blue-700' :
              'bg-green-100 text-green-700'
            }`}>
              {opportunity.type}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 mb-2">{opportunity.company}</h2>
            <p className="text-gray-600">{opportunity.location}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-700">{opportunity.description}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Skills Required</h3>
            <div className="flex flex-wrap gap-2">
              {opportunity.skillsRequired.map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Deadline</h3>
            <p className="text-gray-700">{new Date(opportunity.deadline).toLocaleDateString()}</p>
          </div>

          <div className="flex gap-4">
            <a
              href={opportunity.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Apply Now
            </a>
            <button
              onClick={handleTrack}
              disabled={isTracking}
              className={`px-6 py-3 rounded-lg font-semibold shadow-sm transition-all ${
                isTracking
                  ? 'bg-blue-100 text-blue-600 cursor-default'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isTracking ? 'Tracking Progress' : 'Track Application'}
            </button>
            <button
              onClick={handleBookmark}
              disabled={isBookmarked}
              className={`px-6 py-3 rounded-lg font-semibold shadow-sm transition-all ${
                isBookmarked
                  ? 'bg-yellow-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {isBookmarked ? 'Bookmarked' : 'Bookmark'}
            </button>
          </div>
          {trackMessage && (
            <p className={`mt-4 text-sm font-medium ${trackMessage.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
              {trackMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityDetails;
