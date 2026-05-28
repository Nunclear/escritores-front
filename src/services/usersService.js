import api from './api';

export const usersService = {
  // Get user by ID
  getUser: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  // Get user's public profile
  getPublicProfile: async (id) => {
    const response = await api.get(`/users/${id}/public-profile`);
    return response.data;
  },

  // Get user's stories
  getUserStories: async (userId, params = {}) => {
    const response = await api.get(`/users/${userId}/stories`, { params });
    return response.data;
  },

  // Get all authors/users
  getAuthors: async (params = {}) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  // Update user profile
  updateProfile: async (data) => {
    const response = await api.put('/users/me', data);
    return response.data;
  },

  // Search users
  searchUsers: async (params = {}) => {
    const response = await api.get('/users/search', { params });
    return response.data;
  },
};
