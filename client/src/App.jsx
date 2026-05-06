import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Explore from './pages/Explore';
import OpportunityDetails from './pages/OpportunityDetails';
import Bookmarks from './pages/Bookmarks';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import AddOpportunity from './pages/AddOpportunity';
import EditOpportunity from './pages/EditOpportunity';
import Applications from './pages/Applications';

// Protected Route component
const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Redirect to correct dashboard based on role
    return <Navigate to={role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return children;
};

// Layout wrapper that handles footer visibility
const Layout = ({ children }) => {
  const location = useLocation();
  const role = localStorage.getItem('role');
  // Hide footer on admin dashboard
  const hideFooter = role === 'admin' && location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow">
        {children}
      </div>
      {!hideFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute requiredRole="student">
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/explore" element={
            <ProtectedRoute>
              <Explore />
            </ProtectedRoute>
          } />
          <Route path="/opportunity/:id" element={
            <ProtectedRoute>
              <OpportunityDetails />
            </ProtectedRoute>
          } />
          <Route path="/bookmarks" element={
            <ProtectedRoute requiredRole="student">
              <Bookmarks />
            </ProtectedRoute>
          } />
          <Route path="/applications" element={
            <ProtectedRoute requiredRole="student">
              <Applications />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute requiredRole="student">
              <Profile />
            </ProtectedRoute>
          } />

          {/* Admin Protected Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/add-opportunity" element={
            <ProtectedRoute requiredRole="admin">
              <AddOpportunity />
            </ProtectedRoute>
          } />
          <Route path="/admin/opportunity/edit/:id" element={
            <ProtectedRoute requiredRole="admin">
              <EditOpportunity />
            </ProtectedRoute>
          } />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
