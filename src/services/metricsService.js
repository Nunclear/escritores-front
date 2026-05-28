import api from './api';

export const metricsService = {
  // Get story metrics
  getStoryMetrics: async (storyId) => {
    const response = await api.get(`/metrics/story/${storyId}`);
    return response.data;
  },

  // Get top viewed stories
  getTopViewedStories: async (params = {}) => {
    const response = await api.get('/metrics/stories/top-viewed', { params });
    return response.data;
  },

  // Record chapter view
  recordChapterView: async (chapterId) => {
    const response = await api.post('/metrics/views/chapter', { chapterId });
    return response.data;
  },

  // Get dashboard summary
  getDashboardSummary: async () => {
    const response = await api.get('/dashboard/me/summary');
    return response.data;
  },

  // Get recent comments
  getRecentComments: async (params = {}) => {
    const response = await api.get('/dashboard/me/recent-comments', { params });
    return response.data;
  },

  // Get my ratings
  getMyRatings: async (params = {}) => {
    const response = await api.get('/dashboard/me/ratings', { params });
    return response.data;
  },
};
