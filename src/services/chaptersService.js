import api from './api';

export const chaptersService = {
  // Get all chapters of a story
  getChapters: async (storyId, params = {}) => {
    const response = await api.get(`/chapters/story/${storyId}`, { params });
    return response.data;
  },

  // Get published chapters
  getPublishedChapters: async (storyId, params = {}) => {
    const response = await api.get(`/chapters/story/${storyId}/published`, {
      params,
    });
    return response.data;
  },

  // Get my draft chapters
  getMyDraftChapters: async (params = {}) => {
    const response = await api.get('/chapters/me/drafts', { params });
    return response.data;
  },

  // Get chapter by ID
  getChapter: async (id) => {
    const response = await api.get(`/chapters/${id}`);
    return response.data;
  },

  // Search chapters
  searchChapters: async (params = {}) => {
    const response = await api.get('/chapters/search', { params });
    return response.data;
  },

  // Create chapter
  createChapter: async (data) => {
    const response = await api.post('/chapters', data);
    return response.data;
  },

  // Update chapter
  updateChapter: async (id, data) => {
    const response = await api.put(`/chapters/${id}`, data);
    return response.data;
  },

  // Publish chapter
  publishChapter: async (id) => {
    const response = await api.post(`/chapters/${id}/publish`);
    return response.data;
  },

  // Unpublish chapter
  unpublishChapter: async (id) => {
    const response = await api.post(`/chapters/${id}/unpublish`);
    return response.data;
  },

  // Archive chapter
  archiveChapter: async (id) => {
    const response = await api.post(`/chapters/${id}/archive`);
    return response.data;
  },

  // Move chapter
  moveChapter: async (chapterId, targetStoryId) => {
    const response = await api.post(`/chapters/${chapterId}/move`, {
      targetStoryId,
    });
    return response.data;
  },

  // Reorder chapters
  reorderChapters: async (data) => {
    const response = await api.post('/chapters/reorder', data);
    return response.data;
  },

  // Delete chapter
  deleteChapter: async (id) => {
    const response = await api.delete(`/chapters/${id}`);
    return response.data;
  },
};
