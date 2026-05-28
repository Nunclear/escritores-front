import api from './api';

// Reports API
export const reportsService = {
  getReport: async (id) => {
    const response = await api.get(`/reports/${id}`);
    return response.data;
  },

  getAllReports: async (params = {}) => {
    const response = await api.get('/reports', { params });
    return response.data;
  },

  reportStory: async (data) => {
    const response = await api.post('/reports/story', data);
    return response.data;
  },

  reportChapter: async (data) => {
    const response = await api.post('/reports/chapter', data);
    return response.data;
  },

  reportComment: async (data) => {
    const response = await api.post('/reports/comment', data);
    return response.data;
  },

  updateReportStatus: async (id, status) => {
    const response = await api.put(`/reports/${id}`, { status });
    return response.data;
  },

  deleteReport: async (id) => {
    const response = await api.delete(`/reports/${id}`);
    return response.data;
  },
};

// Sanctions API
export const sanctionsService = {
  getSanction: async (id) => {
    const response = await api.get(`/sanctions/${id}`);
    return response.data;
  },

  getUserSanctions: async (userId, params = {}) => {
    const response = await api.get(`/sanctions/user/${userId}`, { params });
    return response.data;
  },

  getAllSanctions: async (params = {}) => {
    const response = await api.get('/sanctions', { params });
    return response.data;
  },

  createSanction: async (data) => {
    const response = await api.post('/sanctions', data);
    return response.data;
  },

  updateSanction: async (id, data) => {
    const response = await api.put(`/sanctions/${id}`, data);
    return response.data;
  },

  removeSanction: async (id) => {
    const response = await api.delete(`/sanctions/${id}`);
    return response.data;
  },
};

// Hidden Comments API
export const hiddenCommentsService = {
  getHiddenComments: async (params = {}) => {
    const response = await api.get('/comments/hidden', { params });
    return response.data;
  },

  hideComment: async (commentId) => {
    const response = await api.post(`/comments/${commentId}/hide`);
    return response.data;
  },

  unhideComment: async (commentId) => {
    const response = await api.post(`/comments/${commentId}/unhide`);
    return response.data;
  },
};
