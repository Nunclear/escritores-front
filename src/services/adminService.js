import api from './api';

// Global Notices API
export const globalNoticesService = {
  getActiveNotice: async () => {
    const response = await api.get('/global-notices/active');
    return response.data;
  },

  getAllNotices: async (params = {}) => {
    const response = await api.get('/global-notices', { params });
    return response.data;
  },

  createNotice: async (data) => {
    const response = await api.post('/global-notices', data);
    return response.data;
  },

  updateNotice: async (id, data) => {
    const response = await api.put(`/global-notices/${id}`, data);
    return response.data;
  },

  deleteNotice: async (id) => {
    const response = await api.delete(`/global-notices/${id}`);
    return response.data;
  },
};

// System Activity / Admin Dashboard API
export const adminDashboardService = {
  getSystemActivity: async (params = {}) => {
    const response = await api.get('/admin/system-activity', { params });
    return response.data;
  },

  getUserManagement: async (params = {}) => {
    const response = await api.get('/admin/users', { params });
    return response.data;
  },

  getContentStats: async () => {
    const response = await api.get('/admin/stats');
    return response.data;
  },

  suspendUser: async (userId, reason) => {
    const response = await api.post(`/admin/users/${userId}/suspend`, {
      reason,
    });
    return response.data;
  },

  unsuspendUser: async (userId) => {
    const response = await api.post(`/admin/users/${userId}/unsuspend`);
    return response.data;
  },

  banUser: async (userId, reason) => {
    const response = await api.post(`/admin/users/${userId}/ban`, { reason });
    return response.data;
  },

  unbanUser: async (userId) => {
    const response = await api.post(`/admin/users/${userId}/unban`);
    return response.data;
  },

  deleteContent: async (contentType, contentId) => {
    const response = await api.delete(
      `/admin/content/${contentType}/${contentId}`
    );
    return response.data;
  },
};
