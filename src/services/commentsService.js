import api from './api';

export const commentsService = {
  // Get comments for a story
  getStoryComments: async (storyId, params = {}) => {
    const response = await api.get(`/comments/story/${storyId}`, { params });
    return response.data;
  },

  // Get comments for a chapter
  getChapterComments: async (chapterId, params = {}) => {
    const response = await api.get(`/comments/chapter/${chapterId}`, { params });
    return response.data;
  },

  // Get comment by ID
  getComment: async (id) => {
    const response = await api.get(`/comments/${id}`);
    return response.data;
  },

  // Create comment
  createComment: async (data) => {
    const response = await api.post('/comments', data);
    return response.data;
  },

  // Update comment
  updateComment: async (id, data) => {
    const response = await api.put(`/comments/${id}`, data);
    return response.data;
  },

  // Delete comment
  deleteComment: async (id) => {
    const response = await api.delete(`/comments/${id}`);
    return response.data;
  },
};
