import { useState, useEffect } from 'react';
import { getOpportunities, addBookmark, checkBookmark } from '../services/api';
import OpportunityCard from '../components/OpportunityCard';

const Explore = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [filters, setFilters] = useState({ type: '', location: '', search: '' });
  const [bookmarkedIds, setBookmarkedIds] = useState({});

  useEffect(() => {
    fetchOpportunities();
  }, [filters]);

  const fetchOpportunities = async () => {
    try {
      const { data } = await getOpportunities(filters);
      setOpportunities(data);
      data.forEach(opp => checkIfBookmarked(opp.id));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const checkIfBookmarked = async (oppId) => {
    try {
      const { data } = await checkBookmark(oppId);
      setBookmarkedIds(prev => ({ ...prev, [oppId]: data.bookmarked }));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleBookmark = async (oppId) => {
    try {
      await addBookmark(oppId);
      setBookmarkedIds(prev => ({ ...prev, [oppId]: true }));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Explore Opportunities</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Search..."
              className="px-4 py-2 border rounded-lg"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <select
              className="px-4 py-2 border rounded-lg"
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Internship">Internship</option>
              <option value="Job">Job</option>
            </select>
            <input
              type="text"
              placeholder="Location"
              className="px-4 py-2 border rounded-lg"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {opportunities.map(opp => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onBookmark={handleBookmark}
              isBookmarked={bookmarkedIds[opp.id]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Explore;
