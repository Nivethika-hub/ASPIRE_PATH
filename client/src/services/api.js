import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api'
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const adminLogin = (data) => API.post('/auth/admin-login', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);

export const getOpportunities = (params) => API.get('/opportunities', { params });
export const getOpportunityById = (id) => API.get(`/opportunities/${id}`);
export const createOpportunity = (data) => API.post('/opportunities', data);
export const updateOpportunity = (id, data) => API.put(`/opportunities/${id}`, data);
export const deleteOpportunity = (id) => API.delete(`/opportunities/${id}`);
export const getRecommendations = () => API.get('/opportunities/recommendations');
export const getStats = () => API.get('/opportunities/stats');

export const addBookmark = (opportunityId) => API.post(`/bookmarks/${opportunityId}`);
export const getBookmarks = () => API.get('/bookmarks');
export const removeBookmark = (opportunityId) => API.delete(`/bookmarks/${opportunityId}`);
export const checkBookmark = (opportunityId) => API.get(`/bookmarks/check/${opportunityId}`);

export const applyForOpportunity = (id) => API.post(`/applications/apply/${id}`);
export const getMyApplications = () => API.get('/applications/my');
export const updateApplicationStatus = (id, status) => API.put(`/applications/${id}/status`, { status });
export const deleteApplication = (id) => API.delete(`/applications/${id}`);
