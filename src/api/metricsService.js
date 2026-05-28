import apiClient from "./apiClient";

export const metricsService = {
  // Get story metrics
  async getStoryMetrics(storyId) {
    const { data } = await apiClient.get(`/metrics/stories/${storyId}`);
    return data;
  },

  // Get chapter metrics
  async getChapterMetrics(storyId, chapterId) {
    const { data } = await apiClient.get(
      `/metrics/stories/${storyId}/chapters/${chapterId}`
    );
    return data;
  },

  // Get user metrics
  async getUserMetrics(userId) {
    const { data } = await apiClient.get(`/metrics/users/${userId}`);
    return data;
  },

  // Get reading progress
  async getReadingProgress(storyId) {
    const { data } = await apiClient.get(`/metrics/reading-progress/${storyId}`);
    return data;
  },

  // Get engagement metrics
  async getEngagementMetrics(storyId) {
    const { data } = await apiClient.get(`/metrics/engagement/${storyId}`);
    return data;
  },

  // Track view
  async trackView(storyId, chapterId) {
    const { data } = await apiClient.post("/metrics/track-view", {
      storyId,
      chapterId,
    });
    return data;
  },

  // Track interaction
  async trackInteraction(contentType, contentId, action) {
    const { data } = await apiClient.post("/metrics/track-interaction", {
      contentType,
      contentId,
      action,
    });
    return data;
  },

  // Get popular stories
  async getPopularStories(timeframe = "week", page = 0, size = 20) {
    const { data } = await apiClient.get("/metrics/popular", {
      params: { timeframe, page, size },
    });
    return data;
  },

  // Get reading trends
  async getReadingTrends(timeframe = "month") {
    const { data } = await apiClient.get("/metrics/trends", {
      params: { timeframe },
    });
    return data;
  },

  // Get writer analytics
  async getWriterAnalytics(userId) {
    const { data } = await apiClient.get(`/metrics/writer-analytics/${userId}`);
    return data;
  },

  // Get reader analytics
  async getReaderAnalytics(userId) {
    const { data } = await apiClient.get(`/metrics/reader-analytics/${userId}`);
    return data;
  },
};
