import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getRecommendations, getOpportunities, getBookmarks } from '../services/api';
import OpportunityCard from '../components/OpportunityCard';

const Dashboard = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [recent, setRecent] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const student = JSON.parse(localStorage.getItem('student') || '{}');
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [recRes, oppRes, bookRes] = await Promise.all([
        getRecommendations(),
        getOpportunities(),
        getBookmarks()
      ]);
      setRecommendations(recRes.data.slice(0, 3));
      setRecent(oppRes.data.slice(0, 3));
      setBookmarks(bookRes.data.slice(0, 3));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* Hero welcome banner */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-pink-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="text-purple-200 text-sm font-medium mb-1">{greeting}</p>
              <h1 className="text-3xl sm:text-4xl font-extrabold">{student.name || 'Student'}!</h1>
              <p className="text-purple-200 mt-2 text-sm">
                You have <span className="text-white font-bold">{recommendations.length}</span> personalized recommendations waiting for you.
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => navigate('/explore')}
                className="px-5 py-2.5 bg-white text-purple-700 rounded-xl font-semibold text-sm hover:bg-purple-50 transition-colors shadow-lg"
              >
                Explore
              </button>
              <button
                onClick={() => navigate('/profile')}
                className="px-5 py-2.5 bg-white/20 border border-white/30 text-white rounded-xl font-semibold text-sm hover:bg-white/30 transition-colors"
              >
                Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quick stats */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Recommendations', value: recommendations.length, color: 'border-l-4 border-purple-500' },
            { label: 'Recent Listings', value: recent.length, color: 'border-l-4 border-pink-500' },
            { label: 'Bookmarks', value: bookmarks.length, color: 'border-l-4 border-indigo-500' },
          ].map(s => (
            <div key={s.label} className={`bg-white rounded-2xl shadow-md p-4 flex items-center gap-4 ${s.color}`}>
              <div>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                <p className="text-gray-500 text-xs">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => navigate('/explore')}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold text-sm hover:shadow-lg hover:shadow-purple-200 hover:scale-105 transition-all"
          >
            Explore All Opportunities
          </button>
          <button
            onClick={() => navigate('/bookmarks')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold text-sm hover:border-purple-300 hover:text-purple-600 transition-all"
          >
            View Bookmarks
          </button>
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl font-semibold text-sm hover:border-purple-300 hover:text-purple-600 transition-all"
          >
            Edit Profile
          </button>
        </div>

        {/* Sections */}
        <div className="space-y-10 pb-12">
          {/* Recommendations */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Recommended for You</h2>
                <p className="text-gray-500 text-sm">Based on your skills and interests</p>
              </div>
              <button onClick={() => navigate('/explore')} className="text-purple-600 text-sm font-semibold hover:text-purple-700 transition-colors">
                View all →
              </button>
            </div>
            {recommendations.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-5">
                {recommendations.map(opp => <OpportunityCard key={opp.id} opportunity={opp} />)}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-purple-200 p-10 text-center">
                <p className="text-gray-500 text-sm">No recommendations yet. Update your profile to get personalized suggestions.</p>
                <button onClick={() => navigate('/profile')} className="mt-3 text-purple-600 font-semibold text-sm hover:underline">Update Profile</button>
              </div>
            )}
          </section>

          {/* Recently Added */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Recently Added</h2>
                <p className="text-gray-500 text-sm">Latest opportunities on the platform</p>
              </div>
              <button onClick={() => navigate('/explore')} className="text-purple-600 text-sm font-semibold hover:text-purple-700 transition-colors">
                View all →
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-5">
              {recent.map(opp => <OpportunityCard key={opp.id} opportunity={opp} />)}
            </div>
          </section>

          {/* Bookmarks */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Your Bookmarks</h2>
                <p className="text-gray-500 text-sm">Opportunities you've saved</p>
              </div>
              <button onClick={() => navigate('/bookmarks')} className="text-purple-600 text-sm font-semibold hover:text-purple-700 transition-colors">
                View all →
              </button>
            </div>
            {bookmarks.length > 0 ? (
              <div className="grid md:grid-cols-3 gap-5">
                {bookmarks.map(bookmark => (
                  <OpportunityCard key={bookmark.id} opportunity={bookmark.opportunity} />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-dashed border-purple-200 p-10 text-center">
                <p className="text-gray-500 text-sm">You haven't bookmarked anything yet.</p>
                <button onClick={() => navigate('/explore')} className="mt-3 text-purple-600 font-semibold text-sm hover:underline">Browse Opportunities</button>
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
