import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';
import logo from '../logo_aspirepath.jpeg';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
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
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    try {
      const { data } = await login(formData);
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role || 'student');

      if (data.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        localStorage.setItem('student', JSON.stringify(data.student));
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-pink-900 flex items-center justify-center px-4 py-12">
      {/* Background glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-purple-600 rounded-full filter blur-3xl opacity-15"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-pink-600 rounded-full filter blur-3xl opacity-15"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <img src={logo} alt="AspirePath Logo" className="w-20 h-20 rounded-2xl mx-auto mb-4 shadow-lg shadow-blue-500/20 object-cover" />
            <h1 className="text-3xl font-extrabold text-white mb-1">Welcome Back</h1>
            <p className="text-white/50 text-sm">Sign in to continue your journey</p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 bg-red-500/20 border border-red-400/40 text-red-200 rounded-xl p-3 mb-5 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-1.5">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                autoComplete="email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70 transition-colors text-base"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold text-base hover:from-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all shadow-lg shadow-purple-500/30 disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Role info hint */}
          <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10 text-center">
            <p className="text-white/40 text-xs">
              Admins are automatically redirected to the Admin Dashboard after login.
            </p>
          </div>

          <p className="text-center text-white/50 text-sm mt-5">
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/register')}
              className="text-purple-400 hover:text-purple-300 font-semibold transition-colors"
            >
              Create Account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
