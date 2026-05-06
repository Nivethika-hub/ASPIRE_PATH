import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../services/api';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const { data } = await adminLogin(formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Admin Login</h2>
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Admin Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Admin Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 font-medium"
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
