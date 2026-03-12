import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (identifier, password) => api.post('/auth/login', { identifier, password }),
  getMe: () => api.get('/auth/me'),
  createAdmin: (data) => api.post('/auth/create-admin', data),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  verifyOTP: (email, otp) => api.post('/auth/verify-otp', { email, otp }),
  resetPassword: (email, otp, newPassword) => api.post('/auth/reset-password', { email, otp, newPassword }),
};

export const profileAPI = {
  getProfile: () => api.get('/profile'),
  updateProfile: (data) => api.put('/profile', data),
};

export const skillsAPI = {
  getSkills: () => api.get('/skills'),
  createSkill: (data) => api.post('/skills', data),
  updateSkill: (id, data) => api.put(`/skills/${id}`, data),
  deleteSkill: (id) => api.delete(`/skills/${id}`),
};

export const educationAPI = {
  getEducations: () => api.get('/education'),
  createEducation: (data) => api.post('/education', data),
  updateEducation: (id, data) => api.put(`/education/${id}`, data),
  deleteEducation: (id) => api.delete(`/education/${id}`),
};

export const projectsAPI = {
  getProjects: () => api.get('/projects'),
  createProject: (data) => api.post('/projects', data),
  updateProject: (id, data) => api.put(`/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/projects/${id}`),
};

export const messagesAPI = {
  getMessages: () => api.get('/messages'),
  createMessage: (data) => api.post('/messages', data),
  deleteMessage: (id) => api.delete(`/messages/${id}`),
};

export const statsAPI = {
  getStats: () => api.get('/stats'),
  createStats: (data) => api.post('/stats', data),
  updateStats: (id, data) => api.put(`/stats/${id}`, data),
  deleteStats: (id) => api.delete(`/stats/${id}`),
};

export const certificateAPI = {
  getCertificates: () => api.get('/certificates'),
  createCertificate: (data) => api.post('/certificates', data),
  updateCertificate: (id, data) => api.put(`/certificates/${id}`, data),
  deleteCertificate: (id) => api.delete(`/certificates/${id}`),
};

export const githubAPI = {
  getRepos: () => api.get('/github/repos'),
  getStats: () => api.get('/github/stats'),
};

export default api;
