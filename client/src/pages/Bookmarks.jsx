import { useState, useEffect } from 'react';
import { getBookmarks, removeBookmark } from '../services/api';
import OpportunityCard from '../components/OpportunityCard';

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const fetchBookmarks = async () => {
    try {
      const { data } = await getBookmarks();
      setBookmarks(data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleRemove = async (oppId) => {
    try {
      await removeBookmark(oppId);
      setBookmarks(bookmarks.filter(b => b.opportunity.id !== oppId));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Your Bookmarks</h1>

        {bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No bookmarks yet!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {bookmarks.map(bookmark => (
              <div key={bookmark.id}>
                <OpportunityCard opportunity={bookmark.opportunity} />
                <button
                  onClick={() => handleRemove(bookmark.opportunity.id)}
                  className="w-full mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Bookmarks;
