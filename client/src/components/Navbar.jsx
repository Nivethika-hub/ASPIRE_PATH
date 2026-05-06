import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../logo_aspirepath.jpeg';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const student = JSON.parse(localStorage.getItem('student') || '{}');
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide navbar on admin dashboard (it has its own sidebar)
  if (role === 'admin' && location.pathname.startsWith('/admin')) return null;

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive(path)
      ? 'bg-purple-100 text-purple-700'
      : 'text-gray-600 hover:text-purple-600 hover:bg-purple-50'
    }`;

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="AspirePath" className="w-8 h-8 rounded-lg shadow-sm group-hover:scale-110 transition-transform" />
            <span className="text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
              AspirePath
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {!token ? (
              <>
                <Link to="/" className={navLinkClass('/')}>Home</Link>
                <Link to="/login" className={navLinkClass('/login')}>Login</Link>
                <Link
                  to="/register"
                  className="ml-2 px-5 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-purple-200 hover:scale-105 transition-all duration-200"
                >
                  Get Started
                </Link>
              </>
            ) : (
              <>
                {role === 'admin' ? (
                  <Link to="/admin/dashboard" className={navLinkClass('/admin/dashboard')}>Dashboard</Link>
                ) : (
                  <>
                    <Link to="/dashboard" className={navLinkClass('/dashboard')}>
                      Dashboard
                    </Link>
                    <Link to="/explore" className={navLinkClass('/explore')}>
                      Explore
                    </Link>
                    <Link to="/bookmarks" className={navLinkClass('/bookmarks')}>
                      Bookmarks
                    </Link>
                    <Link to="/applications" className={navLinkClass('/applications')}>
                      Applications
                    </Link>
                    <Link to="/profile" className={navLinkClass('/profile')}>
                      Profile
                    </Link>
                  </>
                )}
                <div className="flex items-center gap-2 ml-3 pl-3 border-l border-gray-200">
                  {student.name && (
                    student.profilePic ? (
                      <div className="w-8 h-8 rounded-full shadow-md overflow-hidden flex-shrink-0">
                        <img src={student.profilePic} alt={student.name} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex flex-shrink-0 items-center justify-center text-white text-sm font-bold shadow-md">
                        {student.name.charAt(0).toUpperCase()}
                      </div>
                    )
                  )}
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <span className="text-sm font-bold">Close</span>
            ) : (
              <span className="text-sm font-bold">Menu</span>
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-gray-100 pt-3">
            {!token ? (
              <>
                <Link to="/" className="block px-3 py-2 text-gray-700 hover:bg-purple-50 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>Home</Link>
                <Link to="/login" className="block px-3 py-2 text-gray-700 hover:bg-purple-50 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/register" className="block px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl text-sm font-semibold text-center" onClick={() => setMenuOpen(false)}>Get Started</Link>
              </>
            ) : (
              <>
                {role !== 'admin' && (
                  <>
                    <Link to="/dashboard" className="block px-3 py-2 text-gray-700 hover:bg-purple-50 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                    <Link to="/explore" className="block px-3 py-2 text-gray-700 hover:bg-purple-50 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>Explore</Link>
                    <Link to="/bookmarks" className="block px-3 py-2 text-gray-700 hover:bg-purple-50 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>Bookmarks</Link>
                    <Link to="/applications" className="block px-3 py-2 text-gray-700 hover:bg-purple-50 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>Applications</Link>
                    <Link to="/profile" className="block px-3 py-2 text-gray-700 hover:bg-purple-50 rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>Profile</Link>
                  </>
                )}
                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg text-sm font-medium">Logout</button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
