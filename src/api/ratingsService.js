import apiClient from "./apiClient";

export const ratingsService = {
  // Rate story
  async rateStory(storyId, ratingData) {
    const { data } = await apiClient.post(`/stories/${storyId}/ratings`, ratingData);
    return data;
  },

  // Get story rating
  async getStoryRating(storyId) {
    const { data } = await apiClient.get(`/stories/${storyId}/ratings`);
    return data;
  },

  // Get user's rating for story
  async getUserRating(storyId) {
    const { data } = await apiClient.get(`/stories/${storyId}/ratings/my-rating`);
    return data;
  },

  // Update rating
  async updateRating(storyId, ratingData) {
    const { data } = await apiClient.put(`/stories/${storyId}/ratings`, ratingData);
    return data;
  },

  // Delete rating
  async deleteRating(storyId) {
    const { data } = await apiClient.delete(`/stories/${storyId}/ratings`);
    return data;
  },

  // Rate chapter
  async rateChapter(storyId, chapterId, ratingData) {
    const { data } = await apiClient.post(
      `/stories/${storyId}/chapters/${chapterId}/ratings`,
      ratingData
    );
    return data;
  },

  // Get chapter rating
  async getChapterRating(storyId, chapterId) {
    const { data } = await apiClient.get(
      `/stories/${storyId}/chapters/${chapterId}/ratings`
    );
    return data;
  },

  // Get rating distribution
  async getRatingDistribution(storyId) {
    const { data } = await apiClient.get(
      `/stories/${storyId}/ratings/distribution`
    );
    return data;
  },

  // List story ratings
  async listRatings(storyId, page = 0, size = 20) {
    const { data } = await apiClient.get(`/stories/${storyId}/ratings/all`, {
      params: { page, size },
    });
    return data;
  },
};
