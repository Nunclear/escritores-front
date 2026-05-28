import apiClient from "./apiClient";

export const adminService = {
  // Get system statistics
  async getSystemStats() {
    const { data } = await apiClient.get("/admin/stats");
    return data;
  },

  // Get platform health
  async getPlatformHealth() {
    const { data } = await apiClient.get("/admin/health");
    return data;
  },

  // List all users
  async listAllUsers(page = 0, size = 50, filters = {}) {
    const { data } = await apiClient.get("/admin/users", {
      params: { page, size, ...filters },
    });
    return data;
  },

  // Get user details (admin)
  async getUserDetails(userId) {
    const { data } = await apiClient.get(`/admin/users/${userId}`);
    return data;
  },

  // Update user role
  async updateUserRole(userId, role) {
    const { data } = await apiClient.post(`/admin/users/${userId}/role`, {
      role,
    });
    return data;
  },

  // Update user account state
  async updateUserAccountState(userId, state, reason = "") {
    const { data } = await apiClient.post(
      `/admin/users/${userId}/account-state`,
      { state, reason }
    );
    return data;
  },

  // Get all stories
  async listAllStories(page = 0, size = 50, filters = {}) {
    const { data } = await apiClient.get("/admin/stories", {
      params: { page, size, ...filters },
    });
    return data;
  },

  // Get story details (admin)
  async getStoryDetails(storyId) {
    const { data } = await apiClient.get(`/admin/stories/${storyId}`);
    return data;
  },

  // Create system announcement
  async createAnnouncement(announcementData) {
    const { data } = await apiClient.post("/admin/announcements", announcementData);
    return data;
  },

  // List announcements
  async listAnnouncements(page = 0, size = 10) {
    const { data } = await apiClient.get("/admin/announcements", {
      params: { page, size },
    });
    return data;
  },

  // Update announcement
  async updateAnnouncement(announcementId, announcementData) {
    const { data } = await apiClient.put(
      `/admin/announcements/${announcementId}`,
      announcementData
    );
    return data;
  },

  // Delete announcement
  async deleteAnnouncement(announcementId) {
    const { data } = await apiClient.delete(
      `/admin/announcements/${announcementId}`
    );
    return data;
  },

  // Set site maintenance mode
  async setMaintenanceMode(enabled, message = "") {
    const { data } = await apiClient.post("/admin/maintenance", {
      enabled,
      message,
    });
    return data;
  },

  // Get activity log
  async getActivityLog(page = 0, size = 50, filters = {}) {
    const { data } = await apiClient.get("/admin/activity-log", {
      params: { page, size, ...filters },
    });
    return data;
  },

  // Get audit log
  async getAuditLog(page = 0, size = 50, filters = {}) {
    const { data } = await apiClient.get("/admin/audit-log", {
      params: { page, size, ...filters },
    });
    return data;
  },

  // Bulk operations
  async bulkUpdateUserRole(userIds, role) {
    const { data } = await apiClient.post("/admin/bulk/user-role", {
      userIds,
      role,
    });
    return data;
  },

  async bulkHideStories(storyIds, reason = "") {
    const { data } = await apiClient.post("/admin/bulk/hide-stories", {
      storyIds,
      reason,
    });
    return data;
  },

  async bulkSuspendUsers(userIds, duration, reason = "") {
    const { data } = await apiClient.post("/admin/bulk/suspend-users", {
      userIds,
      duration,
      reason,
    });
    return data;
  },

  // Feature flags / Settings
  async getSystemSettings() {
    const { data } = await apiClient.get("/admin/settings");
    return data;
  },

  async updateSystemSettings(settings) {
    const { data } = await apiClient.put("/admin/settings", settings);
    return data;
  },
};
