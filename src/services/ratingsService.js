import api from './api';

export const ratingsService = {
  // Get average rating for a story
  getAverageRating: async (storyId) => {
    const response = await api.get(`/ratings/story/${storyId}/average`);
    return response.data;
  },

  // Get all ratings for a story
  getStoryRatings: async (storyId, params = {}) => {
    const response = await api.get(`/ratings/story/${storyId}`, { params });
    return response.data;
  },

  // Get my rating for a story
  getMyRating: async (storyId) => {
    const response = await api.get(`/ratings/story/${storyId}/me`);
    return response.data;
  },

  // Create or update rating
  createRating: async (data) => {
    const response = await api.post('/ratings', data);
    return response.data;
  },

  // Delete rating
  deleteRating: async (ratingId) => {
    const response = await api.delete(`/ratings/${ratingId}`);
    return response.data;
  },
};
