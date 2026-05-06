import { useState, useEffect } from 'react';
import { getMyApplications, updateApplicationStatus, deleteApplication } from '../services/api';

const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const { data } = await getMyApplications();
      setApplications(data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateApplicationStatus(id, newStatus);
      setApplications(applications.map(app => 
        app.id === id ? { ...app, status: newStatus } : app
      ));
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await deleteApplication(id);
      setApplications(applications.filter(app => app.id !== id));
    } catch (error) {
      console.error('Error removing application:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'APPLIED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'INTERVIEWING': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'OFFERED': return 'bg-green-100 text-green-700 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-purple-600 font-semibold text-lg">Loading your applications...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight sm:text-4xl">
            Application Tracker
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Monitor and update the status of your journey with every opportunity.
          </p>
        </div>

        {applications.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
            <p className="text-gray-500 text-lg mb-6">You haven't tracked any applications yet.</p>
            <button 
              onClick={() => window.location.href = '/explore'}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-purple-200 transition-all"
            >
              Explore Opportunities
            </button>
          </div>
        ) : (
          <div className="grid gap-6">
            {applications.map((app) => (
              <div key={app.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 transition-all hover:shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{app.opportunity.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </div>
                    <p className="text-gray-600 font-medium">{app.opportunity.company}</p>
                    <p className="text-gray-400 text-sm mt-1">Applied on: {new Date(app.appliedAt).toLocaleDateString()}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex bg-gray-50 p-1 rounded-2xl border border-gray-100">
                      {['APPLIED', 'INTERVIEWING', 'OFFERED', 'REJECTED'].map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusUpdate(app.id, status)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            app.status === status
                              ? 'bg-white text-purple-600 shadow-sm'
                              : 'text-gray-400 hover:text-gray-600'
                          }`}
                        >
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => handleRemove(app.id)}
                      className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                      title="Remove from tracking"
                    >
                      Remove
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

export default Applications;
