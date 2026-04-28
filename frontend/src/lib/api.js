import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (username, password) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    const response = await api.post('/api/auth/login', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  }
};

export const profileApi = {
  getMe: async () => {
    const response = await api.get('/api/profile/me');
    return response.data;
  },
  updateMe: async (profileData) => {
    const response = await api.put('/api/profile/me', profileData);
    return response.data;
  },
  getPublicProfile: async (username) => {
    const response = await api.get(`/api/users/${username}`);
    return response.data;
  }
};

export const projectApi = {
  getProjects: async (isTeam = null) => {
    const params = isTeam !== null ? { is_team: isTeam } : {};
    const response = await api.get('/api/projects', { params });
    return response.data;
  },
  createProject: async (projectData) => {
    const response = await api.post('/api/projects', projectData);
    return response.data;
  },
  getProject: async (id) => {
    const response = await api.get(`/api/projects/${id}`);
    return response.data;
  }
};

export default api;
