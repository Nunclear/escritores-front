import apiClient from "./apiClient";

export const notificationsService = {
  // Get user notifications
  async getNotifications(page = 0, size = 20, read = null) {
    const params = { page, size };
    if (read !== null) params.read = read;
    const { data } = await apiClient.get("/users/me/notifications", { params });
    return data;
  },

  // Get unread count
  async getUnreadCount() {
    const { data } = await apiClient.get("/users/me/notifications/unread-count");
    return data;
  },

  // Mark notification as read
  async markAsRead(notificationId) {
    const { data } = await apiClient.post(
      `/users/me/notifications/${notificationId}/read`
    );
    return data;
  },

  // Mark all as read
  async markAllAsRead() {
    const { data } = await apiClient.post("/users/me/notifications/read-all");
    return data;
  },

  // Delete notification
  async deleteNotification(notificationId) {
    const { data } = await apiClient.delete(
      `/users/me/notifications/${notificationId}`
    );
    return data;
  },

  // Delete all notifications
  async deleteAllNotifications() {
    const { data } = await apiClient.delete("/users/me/notifications/all");
    return data;
  },

  // Update notification preferences
  async updateNotificationPreferences(preferences) {
    const { data } = await apiClient.put(
      "/users/me/notification-preferences",
      preferences
    );
    return data;
  },

  // Get notification preferences
  async getNotificationPreferences() {
    const { data } = await apiClient.get("/users/me/notification-preferences");
    return data;
  },
};
