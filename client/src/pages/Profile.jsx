import { useState, useEffect, useRef } from 'react';
import { getProfile, updateProfile } from '../services/api';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    skills: '',
    interests: '',
    profilePic: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await getProfile();
      setFormData({
        name: data.name || '',
        skills: data.skills ? data.skills.join(', ') : '',
        interests: data.interests ? data.interests.join(', ') : '',
        profilePic: data.profilePic || ''
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = {
        name: formData.name,
        skills: formData.skills.split(',').map(s => s.trim()).filter(Boolean),
        interests: formData.interests.split(',').map(i => i.trim()).filter(Boolean),
        profilePic: formData.profilePic
      };
      
      const response = await updateProfile(data);
      
      // Update local storage so navbar avatar reflects changes
      const studentData = JSON.parse(localStorage.getItem('student') || '{}');
      studentData.name = response.data.name;
      studentData.skills = response.data.skills;
      studentData.interests = response.data.interests;
      studentData.profilePic = response.data.profilePic;
      localStorage.setItem('student', JSON.stringify(studentData));

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Error updating profile. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
          {/* Header Banner */}
          <div className="h-32 bg-gradient-to-r from-blue-600 to-blue-400"></div>
          
          <div className="px-8 pb-8">
            {/* Profile Avatar Section */}
            <div className="relative flex justify-center -mt-16 mb-8">
              <div 
                className="relative w-32 h-32 rounded-full border-4 border-white bg-blue-50 shadow-lg flex items-center justify-center overflow-hidden group cursor-pointer"
                onClick={triggerFileInput}
              >
                {formData.profilePic ? (
                  <img src={formData.profilePic} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-blue-300 text-5xl font-bold">
                    {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                  </span>
                )}
                
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageChange} 
                className="hidden" 
                accept="image/*" 
              />
            </div>

            <div className="text-center mb-8">
              <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">Edit Profile</h1>
              <p className="text-blue-500/80 mt-1">Manage your account details and preferences</p>
            </div>

            {message && (
              <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 text-sm font-medium ${
                message.type === 'success' 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <h2 className="text-lg font-bold text-blue-900 mb-5 flex items-center gap-2">
                  Personal Information
                </h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-blue-900 mb-1.5 ml-1">Full Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. John Doe"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <h2 className="text-lg font-bold text-blue-900 mb-5 flex items-center gap-2">
                  Professional Details
                </h2>
                
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-blue-900 mb-1.5 ml-1">
                      Skills <span className="text-blue-500/60 font-medium ml-1">(comma separated)</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                      value={formData.skills}
                      onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                      placeholder="e.g. React, Node.js, Design"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-blue-900 mb-1.5 ml-1">
                      Interests <span className="text-blue-500/60 font-medium ml-1">(comma separated)</span>
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-white border border-blue-200 rounded-xl text-blue-900 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
                      value={formData.interests}
                      onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                      placeholder="e.g. Open Source, Machine Learning"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold text-base hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all shadow-lg shadow-blue-600/20 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    'Updating Profile...'
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
