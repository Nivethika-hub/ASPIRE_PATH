import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOpportunity } from '../services/api';

const AddOpportunity = () => {
  const navigate = useNavigate();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        // Ensure skills is an array and handle empty string
        skillsRequired: formData.skillsRequired ? formData.skillsRequired.split(',').map(s => s.trim()) : [],
        // Format date to LocalDateTime (YYYY-MM-DDTHH:mm:ss)
        deadline: `${formData.deadline}T00:00:00`
      };
      
      await createOpportunity(data);
      alert('Opportunity created successfully!');
      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error creating opportunity:', error);
      alert('Failed to create opportunity: ' + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Add Opportunity</h1>
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
              Add Opportunity
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddOpportunity;
