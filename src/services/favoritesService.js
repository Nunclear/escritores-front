import api from './api';

export const favoritesService = {
  // Get my favorites
  getMyFavorites: async (params = {}) => {
    const response = await api.get('/favorites/me', { params });
    return response.data;
  },

  // Get favorite count for a story
  getStoryFavoriteCount: async (storyId) => {
    const response = await api.get(`/favorites/story/${storyId}/count`);
    return response.data;
  },

  // Check if story is favorited by me
  getMyFavorite: async (storyId) => {
    const response = await api.get(`/favorites/story/${storyId}/me`);
    return response.data;
  },

  // Add to favorites
  addFavorite: async (storyId) => {
    const response = await api.post('/favorites', { storyId });
    return response.data;
  },

  // Remove from favorites
  removeFavorite: async (storyId) => {
    const response = await api.delete(`/favorites/${storyId}`);
    return response.data;
  },
};
