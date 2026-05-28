import apiClient from "./apiClient";

export const chaptersService = {
  // Create chapter
  async createChapter(storyId, chapterData) {
    const { data } = await apiClient.post(`/stories/${storyId}/chapters`, chapterData);
    return data;
  },

  // Get chapter
  async getChapter(storyId, chapterId) {
    const { data } = await apiClient.get(`/stories/${storyId}/chapters/${chapterId}`);
    return data;
  },

  // List story chapters
  async listChapters(storyId, page = 0, size = 50) {
    const { data } = await apiClient.get(`/stories/${storyId}/chapters`, {
      params: { page, size },
    });
    return data;
  },

  // Update chapter
  async updateChapter(storyId, chapterId, chapterData) {
    const { data } = await apiClient.put(
      `/stories/${storyId}/chapters/${chapterId}`,
      chapterData
    );
    return data;
  },

  // Delete chapter
  async deleteChapter(storyId, chapterId) {
    const { data } = await apiClient.delete(
      `/stories/${storyId}/chapters/${chapterId}`
    );
    return data;
  },

  // Publish/unpublish chapter
  async publishChapter(storyId, chapterId) {
    const { data } = await apiClient.post(
      `/stories/${storyId}/chapters/${chapterId}/publish`
    );
    return data;
  },

  async unpublishChapter(storyId, chapterId) {
    const { data } = await apiClient.post(
      `/stories/${storyId}/chapters/${chapterId}/unpublish`
    );
    return data;
  },

  // Get chapter statistics
  async getChapterStats(storyId, chapterId) {
    const { data } = await apiClient.get(
      `/stories/${storyId}/chapters/${chapterId}/stats`
    );
    return data;
  },

  // Reorder chapters
  async reorderChapters(storyId, chaptersOrder) {
    const { data } = await apiClient.post(
      `/stories/${storyId}/chapters/reorder`,
      chaptersOrder
    );
    return data;
  },

  // Save chapter draft
  async saveDraft(storyId, chapterId, draftData) {
    const { data } = await apiClient.post(
      `/stories/${storyId}/chapters/${chapterId}/drafts`,
      draftData
    );
    return data;
  },

  // Get chapter drafts
  async getDrafts(storyId, chapterId) {
    const { data } = await apiClient.get(
      `/stories/${storyId}/chapters/${chapterId}/drafts`
    );
    return data;
  },
};
