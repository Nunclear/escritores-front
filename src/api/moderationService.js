import apiClient from "./apiClient";

export const moderationService = {
  // Report content
  async reportContent(contentType, contentId, reportData) {
    const { data } = await apiClient.post("/reports", {
      contentType,
      contentId,
      ...reportData,
    });
    return data;
  },

  // List reports (moderator/admin)
  async listReports(page = 0, size = 20, filters = {}) {
    const { data } = await apiClient.get("/moderation/reports", {
      params: { page, size, ...filters },
    });
    return data;
  },

  // Get report details
  async getReportDetails(reportId) {
    const { data } = await apiClient.get(`/moderation/reports/${reportId}`);
    return data;
  },

  // Review report
  async reviewReport(reportId, reviewData) {
    const { data } = await apiClient.post(
      `/moderation/reports/${reportId}/review`,
      reviewData
    );
    return data;
  },

  // Close report
  async closeReport(reportId) {
    const { data } = await apiClient.post(
      `/moderation/reports/${reportId}/close`
    );
    return data;
  },

  // Hide/unhide content
  async hideContent(contentType, contentId, reason = "") {
    const { data } = await apiClient.post(`/moderation/hide`, {
      contentType,
      contentId,
      reason,
    });
    return data;
  },

  async unhideContent(contentType, contentId) {
    const { data } = await apiClient.post(`/moderation/unhide`, {
      contentType,
      contentId,
    });
    return data;
  },

  // Suspend/unsuspend user
  async suspendUser(userId, suspensionData) {
    const { data } = await apiClient.post(
      `/moderation/users/${userId}/suspend`,
      suspensionData
    );
    return data;
  },

  async unsuspendUser(userId) {
    const { data } = await apiClient.post(`/moderation/users/${userId}/unsuspend`);
    return data;
  },

  // Ban/unban user
  async banUser(userId, banData) {
    const { data } = await apiClient.post(
      `/moderation/users/${userId}/ban`,
      banData
    );
    return data;
  },

  async unbanUser(userId) {
    const { data } = await apiClient.post(
      `/moderation/users/${userId}/unban`
    );
    return data;
  },

  // List user sanctions
  async getUserSanctions(userId) {
    const { data } = await apiClient.get(`/moderation/users/${userId}/sanctions`);
    return data;
  },

  // Create global notice
  async createGlobalNotice(noticeData) {
    const { data } = await apiClient.post("/moderation/notices", noticeData);
    return data;
  },

  // List global notices
  async listGlobalNotices(page = 0, size = 10) {
    const { data } = await apiClient.get("/moderation/notices", {
      params: { page, size },
    });
    return data;
  },

  // Delete notice
  async deleteNotice(noticeId) {
    const { data } = await apiClient.delete(`/moderation/notices/${noticeId}`);
    return data;
  },

  // Get content moderation queue
  async getModerationQueue(page = 0, size = 20, filters = {}) {
    const { data } = await apiClient.get("/moderation/queue", {
      params: { page, size, ...filters },
    });
    return data;
  },

  // Approve content
  async approveContent(contentType, contentId) {
    const { data } = await apiClient.post(`/moderation/approve`, {
      contentType,
      contentId,
    });
    return data;
  },

  // Reject content
  async rejectContent(contentType, contentId, reason = "") {
    const { data } = await apiClient.post(`/moderation/reject`, {
      contentType,
      contentId,
      reason,
    });
    return data;
  },
};
