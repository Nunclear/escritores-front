import api from './api';

export const storiesService = {
  // Get all stories
  getStories: async (params = {}) => {
    const response = await api.get('/stories', { params });
    return response.data;
  },

  // Search stories
  searchStories: async (params = {}) => {
    const response = await api.get('/stories/search', { params });
    return response.data;
  },

  // Get story by ID
  getStory: async (id) => {
    const response = await api.get(`/stories/${id}`);
    return response.data;
  },

  // Get story by slug
  getStoryBySlug: async (slug) => {
    const response = await api.get(`/stories/slug/${slug}`);
    return response.data;
  },

  // Get user's stories
  getUserStories: async (userId, params = {}) => {
    const response = await api.get(`/stories/user/${userId}`, { params });
    return response.data;
  },

  // Get my stories (drafts, archived)
  getMyDrafts: async (params = {}) => {
    const response = await api.get('/stories/me/drafts', { params });
    return response.data;
  },

  getMyArchived: async (params = {}) => {
    const response = await api.get('/stories/me/archived', { params });
    return response.data;
  },

  // Create story
  createStory: async (data) => {
    const response = await api.post('/stories', data);
    return response.data;
  },

  // Update story
  updateStory: async (id, data) => {
    const response = await api.put(`/stories/${id}`, data);
    return response.data;
  },

  // Publish story
  publishStory: async (id) => {
    const response = await api.post(`/stories/${id}/publish`);
    return response.data;
  },

  // Unpublish story
  unpublishStory: async (id) => {
    const response = await api.post(`/stories/${id}/unpublish`);
    return response.data;
  },

  // Archive story
  archiveStory: async (id) => {
    const response = await api.post(`/stories/${id}/archive`);
    return response.data;
  },

  // Restore story
  restoreStory: async (id) => {
    const response = await api.post(`/stories/${id}/restore`);
    return response.data;
  },

  // Duplicate story
  duplicateStory: async (id) => {
    const response = await api.post(`/stories/${id}/duplicate`);
    return response.data;
  },

  // Delete story
  deleteStory: async (id) => {
    const response = await api.delete(`/stories/${id}`);
    return response.data;
  },
};
