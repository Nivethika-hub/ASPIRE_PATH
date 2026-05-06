import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../services/api';
import logo from '../logo_aspirepath.jpeg';

const Register = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    skills: '',
    interests: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate(localStorage.getItem('role') === 'admin' ? '/admin/dashboard' : '/dashboard');
    }
  }, [navigate]);

  const validate = () => {
    if (!formData.email.trim()) return 'Email is required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) return 'Please enter a valid email.';
    if (!formData.password) return 'Password is required.';
    if (formData.password.length < 6) return 'Password must be at least 6 characters.';
    if (formData.password !== formData.confirmPassword) return 'Passwords do not match.';
    if (role === 'student' && !formData.name.trim()) return 'Name is required.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        email: formData.email,
        password: formData.password,
        role,
        ...(role === 'student' && {
          name: formData.name,
          skills: formData.skills ? formData.skills.split(',').map(s => s.trim()).filter(Boolean) : [],
          interests: formData.interests ? formData.interests.split(',').map(i => i.trim()).filter(Boolean) : []
        })
      };

      await register(payload);

      if (role === 'student') {
        const { data } = await login({ email: formData.email, password: formData.password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', 'student');
        localStorage.setItem('student', JSON.stringify(data.student));
        setSuccess('Registration successful! Redirecting to dashboard...');
        setTimeout(() => navigate('/dashboard'), 1500);
      } else {
        const { data } = await login({ email: formData.email, password: formData.password });
        localStorage.setItem('token', data.token);
        localStorage.setItem('role', 'admin');
        localStorage.setItem('admin', JSON.stringify(data.admin));
        setSuccess('Admin account created successfully! Redirecting to dashboard...');
        setTimeout(() => navigate('/admin/dashboard'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-600 rounded-full filter blur-3xl opacity-15"></div>
        <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-pink-600 rounded-full filter blur-3xl opacity-15"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src={logo} alt="AspirePath Logo" className="w-20 h-20 rounded-2xl mx-auto mb-4 shadow-lg shadow-blue-500/20 object-cover" />
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-1">
              AspirePath
            </h1>
            <p className="text-white/60 text-sm">Create your account to get started</p>
          </div>

          {/* Role Toggle */}
          <div className="flex bg-white/10 rounded-2xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${role === 'student'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-white/60 hover:text-white'
                }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${role === 'admin'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                  : 'text-white/60 hover:text-white'
                }`}
            >
              Admin
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="flex items-center gap-3 bg-red-500/20 border border-red-400/40 text-red-200 rounded-xl p-3 mb-4 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-3 bg-green-500/20 border border-green-400/40 text-green-200 rounded-xl p-3 mb-4 text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Name - Students only */}
            {role === 'student' && (
              <div>
                <label className="block text-white/70 text-sm font-medium mb-1.5">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 6 characters"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all pr-12"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-1.5">Confirm Password</label>
              <input
                type="password"
                placeholder="Repeat your password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </div>

            {/* Student-only fields */}
            {role === 'student' && (
              <>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1.5">
                    Skills <span className="text-white/40 font-normal">(comma separated)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="React, Python, Machine Learning"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    value={formData.skills}
                    onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-1.5">
                    Interests <span className="text-white/40 font-normal">(comma separated)</span>
                  </label>
                  <input
                    type="text"
                    placeholder="AI, Web Development, Startups"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                    value={formData.interests}
                    onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                  />
                </div>
              </>
            )}

            {/* Admin info notice */}
            {role === 'admin' && (
              <div className="bg-indigo-500/20 border border-indigo-400/30 rounded-xl p-3 text-indigo-200 text-xs">
                Admin accounts have full access to manage opportunities and view platform analytics.
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-base hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  Creating account...
                </span>
              ) : (
                `Create ${role === 'admin' ? 'Admin' : 'Student'} Account`
              )}
            </button>
          </form>

          <p className="text-center text-white/50 text-sm mt-6">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
