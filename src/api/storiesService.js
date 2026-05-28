import apiClient from "./apiClient";

export const storiesService = {
  // Create story
  async createStory(storyData) {
    const { data } = await apiClient.post("/stories", storyData);
    return data;
  },

  // Get story by ID
  async getStoryById(storyId) {
    const { data } = await apiClient.get(`/stories/${storyId}`);
    return data;
  },

  // List stories (public)
  async listStories(page = 0, size = 20, sort = "createdAt,desc") {
    const { data } = await apiClient.get("/stories", {
      params: { page, size, sort },
    });
    return data;
  },

  // Search stories
  async searchStories(query, page = 0, size = 20) {
    const { data } = await apiClient.get("/stories/search", {
      params: { q: query, page, size },
    });
    return data;
  },

  // List user's stories
  async getUserStories(userId, page = 0, size = 20) {
    const { data } = await apiClient.get(`/users/${userId}/stories`, {
      params: { page, size },
    });
    return data;
  },

  // Update story
  async updateStory(storyId, storyData) {
    const { data } = await apiClient.put(`/stories/${storyId}`, storyData);
    return data;
  },

  // Delete story
  async deleteStory(storyId) {
    const { data } = await apiClient.delete(`/stories/${storyId}`);
    return data;
  },

  // Publish/unpublish story
  async publishStory(storyId) {
    const { data } = await apiClient.post(`/stories/${storyId}/publish`);
    return data;
  },

  async unpublishStory(storyId) {
    const { data } = await apiClient.post(`/stories/${storyId}/unpublish`);
    return data;
  },

  // Get story statistics
  async getStoryStats(storyId) {
    const { data } = await apiClient.get(`/stories/${storyId}/stats`);
    return data;
  },

  // Filter stories by genre, tags, etc
  async filterStories(filters, page = 0, size = 20) {
    const { data } = await apiClient.get("/stories/filter", {
      params: { ...filters, page, size },
    });
    return data;
  },

  // Get trending stories
  async getTrendingStories(page = 0, size = 20) {
    const { data } = await apiClient.get("/stories/trending", {
      params: { page, size },
    });
    return data;
  },

  // Get recommended stories
  async getRecommendedStories(page = 0, size = 20) {
    const { data } = await apiClient.get("/stories/recommended", {
      params: { page, size },
    });
    return data;
  },

  // Draft management
  async saveDraft(storyId, draftData) {
    const { data } = await apiClient.post(
      `/stories/${storyId}/drafts`,
      draftData
    );
    return data;
  },

  async getDrafts(page = 0, size = 20) {
    const { data } = await apiClient.get("/stories/drafts", {
      params: { page, size },
    });
    return data;
  },
};
