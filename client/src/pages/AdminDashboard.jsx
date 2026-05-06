import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStats, getOpportunities, deleteOpportunity, getProfile, updateProfile } from '../services/api';
import logo from '../logo_aspirepath.jpeg';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement } from 'chart.js';
import { Doughnut, Bar, Line } from 'react-chartjs-2';
import oppIcon from '../assets/opp_icon.png';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title, LineElement, PointElement);

const navItems = [
  { id: 'overview', label: 'Overview' },
  { id: 'opportunities', label: 'Opportunities' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'profile', label: 'Profile Settings' },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({});
  const [opportunities, setOpportunities] = useState([]);
  const [adminProfile, setAdminProfile] = useState({ name: '', email: '', profilePic: '' });
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Profile specific state
  const [profileMessage, setProfileMessage] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, oppRes, profileRes] = await Promise.all([
        getStats(), 
        getOpportunities(),
        getProfile()
      ]);
      setStats(statsRes.data);
      setOpportunities(oppRes.data);
      setAdminProfile({
        name: profileRes.data.name || 'Admin',
        email: profileRes.data.email || '',
        profilePic: profileRes.data.profilePic || ''
      });
    } catch (error) {
      console.error('Error fetching admin data:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOpportunity(id);
      setOpportunities(opportunities.filter(o => o.id !== id));
      setDeleteConfirm(null);
      fetchData();
    } catch (error) {
      console.error('Error deleting opportunity:', error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const { data } = await updateProfile(adminProfile);
      setAdminProfile({
        name: data.name || 'Admin',
        email: data.email || '',
        profilePic: data.profilePic || ''
      });
      // Sync local storage nav avatar
      const lsAdmin = JSON.parse(localStorage.getItem('admin') || '{}');
      lsAdmin.name = data.name;
      lsAdmin.profilePic = data.profilePic;
      localStorage.setItem('admin', JSON.stringify(lsAdmin));
      
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setProfileMessage(null), 3000);
    } catch (error) {
      setProfileMessage({ type: 'error', text: 'Error updating profile. Please try again.' });
    } finally {
      setSavingProfile(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAdminProfile((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const filteredOpportunities = opportunities
    .filter(o => filter === 'all' || o.type === filter)
    .filter(o => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return o.title?.toLowerCase().includes(q) || o.company?.toLowerCase().includes(q);
    });

  // Chart data (adjusted for light theme)
  const doughnutData = {
    labels: ['Active', 'Expired'],
    datasets: [{
      data: [stats.activeOpportunities || 0, stats.expiredOpportunities || 0],
      backgroundColor: ['#4169e1', '#a5bcef'],
      borderWidth: 0,
      hoverOffset: 8,
    }]
  };

  const barData = {
    labels: ['Hackathon', 'Internship', 'Job'],
    datasets: [{
      label: 'Count',
      data: [
        opportunities.filter(o => o.type === 'Hackathon').length,
        opportunities.filter(o => o.type === 'Internship').length,
        opportunities.filter(o => o.type === 'Job').length,
      ],
      backgroundColor: ['#4169e1', '#7a9eeb', '#c8d4f6'],
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Students Joined',
      data: [12, 19, 30, 45, 58, stats.totalStudents || 70],
      fill: true,
      backgroundColor: 'rgba(65, 105, 225, 0.1)',
      borderColor: '#4169e1',
      pointBackgroundColor: '#4169e1',
      tension: 0.4,
    }]
  };

  const chartOpts = (title) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: false },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#1e3a8a',
        bodyColor: '#3b82f6',
        borderColor: '#e0e7fa',
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
      }
    },
    scales: title !== 'doughnut' ? {
      x: { grid: { color: '#eef2fc' }, ticks: { color: '#64748b' } },
      y: { grid: { color: '#eef2fc' }, ticks: { color: '#64748b' }, beginAtZero: true },
    } : undefined
  });

  const statCards = [
    { label: 'Total Students', value: stats.totalStudents || 0, color: 'bg-blue-50 text-blue-600', trend: '+12%' },
    { label: 'Total Opportunities', value: stats.totalOpportunities || 0, color: 'bg-blue-50 text-blue-500', trend: '+8%' },
    { label: 'Active', value: stats.activeOpportunities || 0, color: 'bg-green-50 text-green-600', trend: '+5%' },
    { label: 'Expired', value: stats.expiredOpportunities || 0, color: 'bg-red-50 text-red-500', trend: '-2%' },
  ];

  const typeBadge = (type) => {
    const map = {
      Hackathon: 'bg-blue-100 text-blue-700 border border-blue-200',
      Internship: 'bg-indigo-100 text-indigo-700 border border-indigo-200',
      Job: 'bg-teal-100 text-teal-700 border border-teal-200',
    };
    return map[type] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="flex min-h-screen bg-[#f4f7fb] text-blue-900 font-sans">

      {/* ─── Sidebar ─── */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0 transition-all duration-300 bg-white border-r border-blue-100 flex flex-col shadow-sm z-20`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-blue-50">
          <img src={logo} alt="AspirePath Logo" className="w-10 h-10 rounded-xl shadow-sm object-cover flex-shrink-0" />
          {sidebarOpen && (
            <div>
              <p className="font-extrabold text-blue-900 text-base leading-tight">AspirePath</p>
              <p className="text-blue-500 text-xs font-medium">Admin Panel</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 text-left ${activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 font-medium'
                  : 'text-blue-700/70 hover:text-blue-900 hover:bg-blue-50 font-medium'
                }`}
            >
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </button>
          ))}

          <div className="pt-3 border-t border-blue-50 mt-3">
            <button
              onClick={() => navigate('/admin/add-opportunity')}
              className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100 transition-all duration-200 text-left font-medium`}
            >
              {sidebarOpen && <span className="text-sm">Add Opportunity</span>}
            </button>
          </div>
        </nav>

        {/* Sidebar footer */}
        <div className="px-3 py-4 border-t border-blue-50 space-y-1 bg-white">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-blue-500 hover:text-blue-900 hover:bg-blue-50 transition-all text-sm font-medium"
          >
            {sidebarOpen && <span>Collapse Sidebar</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all text-sm font-medium"
          >
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ─── Main Content ─── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex justify-between items-center px-8 py-4 bg-white/80 backdrop-blur-md border-b border-blue-100">
          <div>
            <h1 className="text-2xl font-extrabold text-blue-900 capitalize tracking-tight">
              {activeTab === 'profile' ? 'Profile Settings' : activeTab.replace('-', ' ')}
            </h1>
            <p className="text-blue-500/70 text-xs mt-0.5 font-medium">AspirePath Admin • {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={() => setActiveTab('profile')}>
            <span className="text-sm font-semibold text-blue-900 hidden sm:block">{adminProfile.name || 'Admin'}</span>
            <div className="w-10 h-10 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 shadow-sm overflow-hidden flex-shrink-0">
              {adminProfile.profilePic ? (
                <img src={adminProfile.profilePic} alt="Admin" className="w-full h-full object-cover" />
              ) : (
                <span className="font-bold">{adminProfile.name ? adminProfile.name.charAt(0).toUpperCase() : 'A'}</span>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-8">

          {/* ── OVERVIEW TAB ── */}
          {activeTab === 'overview' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => (
                  <div key={card.label} className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${card.color}`}>
                      </div>
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${card.trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {card.trend}
                      </span>
                    </div>
                    <div className="text-4xl font-extrabold text-blue-900 mb-1">{card.value}</div>
                    <p className="text-blue-500 font-medium text-sm">{card.label}</p>
                  </div>
                ))}
              </div>

              {/* Charts Row */}
              <div className="grid lg:grid-cols-2 gap-6 items-stretch">
                <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm flex flex-col">
                  <h3 className="text-blue-900 font-bold text-lg mb-1">Opportunity Status</h3>
                  <p className="text-blue-500/70 text-sm mb-6 font-medium">Active vs Expired distribution</p>
                  <div className="flex-1 min-h-[250px] flex items-center justify-center">
                    <Doughnut data={doughnutData} options={{
                      ...chartOpts('doughnut'),
                      plugins: { ...chartOpts('doughnut').plugins, legend: { display: true, position: 'bottom', labels: { color: '#475569', boxWidth: 12, padding: 20 } } }
                    }} />
                  </div>
                </div>
                <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm flex flex-col">
                  <h3 className="text-blue-900 font-bold text-lg mb-1">Opportunities by Type</h3>
                  <p className="text-blue-500/70 text-sm mb-6 font-medium">Distribution across categories</p>
                  <div className="flex-1 min-h-[250px]">
                    <Bar data={barData} options={chartOpts('bar')} />
                  </div>
                </div>
              </div>

              {/* Recent Opportunities */}
              <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-blue-900 font-bold text-lg">Recent Opportunities</h3>
                  <button onClick={() => setActiveTab('opportunities')} className="text-blue-600 text-sm font-semibold hover:text-blue-800 transition-colors">View all →</button>
                </div>
                <div className="space-y-4">
                  {opportunities.slice(0, 5).map(opp => (
                    <div key={opp.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 border border-blue-50 rounded-xl hover:bg-blue-50/50 transition-colors gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img src={oppIcon} alt="Opportunity" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <p className="text-blue-900 font-bold">{opp.title}</p>
                          <p className="text-blue-500 text-sm font-medium">{opp.company}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-3 py-1.5 rounded-full font-bold self-start sm:self-auto ${typeBadge(opp.type)}`}>{opp.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── OPPORTUNITIES TAB ── */}
          {activeTab === 'opportunities' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              {/* Controls */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between bg-white border border-blue-100 rounded-2xl p-5 shadow-sm">
                <div className="flex gap-2 flex-wrap">
                  {['all', 'Hackathon', 'Internship', 'Job'].map(type => (
                    <button
                      key={type}
                      onClick={() => setFilter(type)}
                      className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${filter === type
                          ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        }`}
                    >
                      {type === 'all' ? 'All' : type === 'Hackathon' ? 'Hackathon' : type === 'Internship' ? 'Internship' : 'Job'}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-3 w-full lg:w-auto">
                  <div className="relative flex-1 lg:w-72">
                    <input
                      type="text"
                      placeholder="Search opportunities..."
                      className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-blue-200 rounded-xl text-blue-900 placeholder-blue-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-sm"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => navigate('/admin/add-opportunity')}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold whitespace-nowrap hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all"
                  >
                    + Add New
                  </button>
                </div>
              </div>

              {/* Table */}
              <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b border-blue-100">
                        <th className="py-4 px-6 text-blue-600 text-xs font-bold uppercase tracking-wider">Opportunity</th>
                        <th className="py-4 px-6 text-blue-600 text-xs font-bold uppercase tracking-wider">Type</th>
                        <th className="py-4 px-6 text-blue-600 text-xs font-bold uppercase tracking-wider">Company</th>
                        <th className="py-4 px-6 text-blue-600 text-xs font-bold uppercase tracking-wider">Deadline</th>
                        <th className="py-4 px-6 text-blue-600 text-xs font-bold uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-blue-50">
                      {filteredOpportunities.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-16 text-blue-400 font-medium">
                            <p>No opportunities found mapping your criteria.</p>
                          </td>
                        </tr>
                      ) : filteredOpportunities.map(opp => {
                        const isExpired = new Date(opp.deadline) < new Date();
                        return (
                          <tr key={opp.id} className="hover:bg-blue-50/50 transition-colors">
                            <td className="py-4 px-6">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-lg bg-white shadow-sm border border-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                  <img src={oppIcon} alt="Opportunity" className="w-full h-full object-cover" />
                                </div>
                                <span className="text-blue-900 font-bold text-sm">{opp.title}</span>
                              </div>
                            </td>
                            <td className="py-4 px-6">
                              <span className={`text-xs px-3 py-1.5 rounded-full font-bold ${typeBadge(opp.type)}`}>{opp.type}</span>
                            </td>
                            <td className="py-4 px-6 text-blue-700 text-sm font-medium">{opp.company}</td>
                            <td className="py-4 px-6">
                              <span className={`text-sm font-semibold flex items-center gap-1.5 ${isExpired ? 'text-red-500' : 'text-green-600'}`}>
                                <span className={`w-2 h-2 rounded-full ${isExpired ? 'bg-red-500' : 'bg-green-500'}`}></span>
                                {new Date(opp.deadline).toLocaleDateString()}
                              </span>
                            </td>
                            <td className="py-4 px-6">
                              <div className="flex gap-2">
                                <button
                                  onClick={() => navigate(`/admin/opportunity/edit/${opp.id}`)}
                                  className="px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(opp.id)}
                                  className="px-3 py-1.5 bg-red-50 border border-red-200 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── ANALYTICS TAB ── */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-blue-900 font-bold text-lg mb-1">Student Growth</h3>
                  <p className="text-blue-500/70 text-sm mb-6 font-medium">Monthly user registrations trend</p>
                  <div className="h-64">
                    <Line data={lineData} options={chartOpts('line')} />
                  </div>
                </div>
                <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
                  <h3 className="text-blue-900 font-bold text-lg mb-1">Opportunities Breakdown</h3>
                  <p className="text-blue-500/70 text-sm mb-6 font-medium">Types of listings over time</p>
                  <div className="h-64">
                    <Bar data={barData} options={chartOpts('bar')} />
                  </div>
                </div>
              </div>

              {/* Key metrics */}
              <div className="bg-white border border-blue-100 rounded-2xl p-6 shadow-sm">
                <h3 className="text-blue-900 font-bold text-lg mb-5">Platform Health Metrics</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Engagement Rate', value: '78%', sub: 'Weekly active users' },
                    { label: 'Active Rate', value: stats.totalOpportunities ? `${Math.round((stats.activeOpportunities / stats.totalOpportunities) * 100)}%` : '0%', sub: 'Opportunities live' },
                    { label: 'Avg. per Student', value: stats.totalStudents ? (stats.totalOpportunities / stats.totalStudents).toFixed(1) : '0', sub: 'Opps per student ratio' },
                    { label: 'Platform Readiness', value: '99.9%', sub: 'System uptime' },
                  ].map(m => (
                    <div key={m.label} className="bg-blue-50/50 border border-blue-100 rounded-xl p-5 text-center transition-transform hover:-translate-y-1">
                      <div className="text-2xl font-extrabold text-blue-900">{m.value}</div>
                      <div className="text-blue-700 text-sm font-bold mt-1">{m.label}</div>
                      <div className="text-blue-500/80 text-xs mt-1 font-medium">{m.sub}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── PROFILE TAB ── */}
          {activeTab === 'profile' && (
            <div className="max-w-3xl mx-auto">
              <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden">
                <div className="h-32 bg-blue-600"></div>
                
                <div className="px-8 pb-8">
                  <div className="relative flex justify-center -mt-16 mb-8">
                    <div 
                      className="relative w-32 h-32 rounded-full border-4 border-white bg-blue-50 shadow-md flex items-center justify-center overflow-hidden group cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      {adminProfile.profilePic ? (
                        <img src={adminProfile.profilePic} alt="Admin" className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-blue-300 text-5xl font-extrabold">
                          {adminProfile.name ? adminProfile.name.charAt(0).toUpperCase() : 'A'}
                        </span>
                      )}
                      
                    </div>
                    <input type="file" ref={fileInputRef} onChange={handleImageChange} className="hidden" accept="image/*" />
                  </div>

                  <div className="text-center mb-10">
                    <h2 className="text-2xl font-extrabold text-blue-900">Admin Account</h2>
                    <p className="text-blue-500 font-medium mt-1">Manage your platform administration details</p>
                  </div>

                  {profileMessage && (
                    <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-bold ${
                      profileMessage.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {profileMessage.text}
                    </div>
                  )}

                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-bold text-blue-900 mb-2 ml-1">Admin Name</label>
                          <input
                            type="text"
                            className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                            value={adminProfile.name}
                            onChange={(e) => setAdminProfile({ ...adminProfile, name: e.target.value })}
                            placeholder="Administrator Name"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-blue-900 mb-2 ml-1">Email <span className="text-blue-400 font-medium">(Read Only)</span></label>
                          <input
                            type="email"
                            className="w-full px-4 py-3 bg-gray-50 border border-blue-100 rounded-xl text-blue-500 font-medium opacity-80 cursor-not-allowed"
                            value={adminProfile.email}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold text-base hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all shadow-md shadow-blue-500/20 disabled:opacity-70 flex justify-center items-center gap-2"
                    >
                      {savingProfile ? 'Updating...' : 'Save Admin Details'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-blue-900/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white border border-blue-100 rounded-2xl p-8 w-full max-w-sm shadow-2xl">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-red-100">
              </div>
              <h3 className="text-blue-900 text-xl font-extrabold mb-2">Delete Opportunity</h3>
              <p className="text-blue-600/80 text-sm font-medium">This action cannot be undone. Are you sure you want to permanently delete this listing?</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 shadow-md shadow-red-500/20 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
