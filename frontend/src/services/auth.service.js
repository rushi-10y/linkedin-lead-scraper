import api from './api.js';

const unwrapData = (response) => response?.data || response;

class AuthService {
  async login(credentials) {
    if (!credentials?.email || !credentials?.password) {
      throw new Error('Email and password are required');
    }
    const response = await api.post('/auth/login', credentials);
    return unwrapData(response);
  }

  async register(userData) {
    if (!userData?.email || !userData?.password) {
      throw new Error('Email and password are required');
    }
    const response = await api.post('/auth/register', userData);
    return unwrapData(response);
  }

  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // Ignore logout API error
    }
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    return { success: true };
  }

  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return unwrapData(response);
  }

  async refreshToken() {
    const response = await api.post('/auth/refresh');
    return unwrapData(response);
  }

  isAuthenticated() {
    return !!localStorage.getItem('token');
  }
}

export default new AuthService();
