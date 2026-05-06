import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getOpportunityById, updateOpportunity } from '../services/api';

const EditOpportunity = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    type: 'Hackathon',
    company: '',
    description: '',
    skillsRequired: '',
    location: '',
    deadline: '',
    applyLink: ''
  });

  useEffect(() => {
    fetchOpportunity();
  }, [id]);

  const fetchOpportunity = async () => {
    try {
      const { data } = await getOpportunityById(id);
      setFormData({
        ...data,
        skillsRequired: data.skillsRequired.join(', '),
        deadline: data.deadline.split('T')[0]
      });
    } catch (error) {
      console.error('Error fetching opportunity:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        skillsRequired: formData.skillsRequired.split(',').map(s => s.trim())
      };
      await updateOpportunity(id, data);
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error updating opportunity:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Opportunity</h1>
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <select
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Hackathon">Hackathon</option>
              <option value="Internship">Internship</option>
              <option value="Job">Job</option>
            </select>
            <input
              type="text"
              placeholder="Company"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              required
            />
            <textarea
              placeholder="Description"
              className="w-full px-4 py-2 border rounded-lg"
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Skills Required (comma separated)"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.skillsRequired}
              onChange={(e) => setFormData({ ...formData, skillsRequired: e.target.value })}
            />
            <input
              type="text"
              placeholder="Location"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
            <input
              type="date"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              required
            />
            <input
              type="url"
              placeholder="Apply Link"
              className="w-full px-4 py-2 border rounded-lg"
              value={formData.applyLink}
              onChange={(e) => setFormData({ ...formData, applyLink: e.target.value })}
              required
            />
            <button type="submit" className="w-full bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
              Update Opportunity
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditOpportunity;
