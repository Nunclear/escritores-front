import apiClient from "./apiClient";

export const commentsService = {
  // Create comment
  async createComment(storyId, chapterId, commentData) {
    const { data } = await apiClient.post(
      `/stories/${storyId}/chapters/${chapterId}/comments`,
      commentData
    );
    return data;
  },

  // Get comment
  async getComment(storyId, chapterId, commentId) {
    const { data } = await apiClient.get(
      `/stories/${storyId}/chapters/${chapterId}/comments/${commentId}`
    );
    return data;
  },

  // List chapter comments
  async listComments(storyId, chapterId, page = 0, size = 20) {
    const { data } = await apiClient.get(
      `/stories/${storyId}/chapters/${chapterId}/comments`,
      {
        params: { page, size },
      }
    );
    return data;
  },

  // Update comment
  async updateComment(storyId, chapterId, commentId, commentData) {
    const { data } = await apiClient.put(
      `/stories/${storyId}/chapters/${chapterId}/comments/${commentId}`,
      commentData
    );
    return data;
  },

  // Delete comment
  async deleteComment(storyId, chapterId, commentId) {
    const { data } = await apiClient.delete(
      `/stories/${storyId}/chapters/${chapterId}/comments/${commentId}`
    );
    return data;
  },

  // Like comment
  async likeComment(storyId, chapterId, commentId) {
    const { data } = await apiClient.post(
      `/stories/${storyId}/chapters/${chapterId}/comments/${commentId}/like`
    );
    return data;
  },

  // Unlike comment
  async unlikeComment(storyId, chapterId, commentId) {
    const { data } = await apiClient.post(
      `/stories/${storyId}/chapters/${chapterId}/comments/${commentId}/unlike`
    );
    return data;
  },

  // Reply to comment
  async replyToComment(storyId, chapterId, commentId, replyData) {
    const { data } = await apiClient.post(
      `/stories/${storyId}/chapters/${chapterId}/comments/${commentId}/replies`,
      replyData
    );
    return data;
  },

  // Get comment replies
  async getReplies(storyId, chapterId, commentId, page = 0, size = 10) {
    const { data } = await apiClient.get(
      `/stories/${storyId}/chapters/${chapterId}/comments/${commentId}/replies`,
      {
        params: { page, size },
      }
    );
    return data;
  },

  // Report comment
  async reportComment(storyId, chapterId, commentId, reportData) {
    const { data } = await apiClient.post(
      `/stories/${storyId}/chapters/${chapterId}/comments/${commentId}/report`,
      reportData
    );
    return data;
  },
};
