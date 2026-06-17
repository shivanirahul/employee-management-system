import apiClient from './api';

export const authService = {
  login: async (username, password) => {
    const response = await apiClient.post('/api/login', { username, password });
    
    // Assumes backend returns { token: "your-jwt-string" }
    if (response.data && response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('token');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  }
};