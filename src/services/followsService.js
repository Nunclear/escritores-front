import api from './api';

export const followsService = {
  // Get my following list
  getMyFollowing: async (params = {}) => {
    const response = await api.get('/follows/me/following', { params });
    return response.data;
  },

  // Get user's followers count
  getFollowerCount: async (userId) => {
    const response = await api.get(`/follows/user/${userId}/count`);
    return response.data;
  },

  // Check if I follow a user
  getMyFollow: async (userId) => {
    const response = await api.get(`/follows/user/${userId}/me`);
    return response.data;
  },

  // Get user's followers
  getUserFollowers: async (userId, params = {}) => {
    const response = await api.get(`/follows/user/${userId}/followers`, {
      params,
    });
    return response.data;
  },

  // Follow a user
  followUser: async (userId) => {
    const response = await api.post('/follows', { followedUserId: userId });
    return response.data;
  },

  // Unfollow a user
  unfollowUser: async (userId) => {
    const response = await api.delete(`/follows/${userId}`);
    return response.data;
  },
};
