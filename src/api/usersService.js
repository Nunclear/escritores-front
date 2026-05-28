import apiClient from "./apiClient";

export const usersService = {
  // Get user by ID
  async getUserById(userId) {
    const { data } = await apiClient.get(`/users/${userId}`);
    return data;
  },

  // Get current user profile
  async getCurrentUserProfile() {
    const { data } = await apiClient.get("/users/me");
    return data;
  },

  // List all users (admin/moderator)
  async listUsers(page = 0, size = 20, sort = "createdAt,desc") {
    const { data } = await apiClient.get("/users", {
      params: { page, size, sort },
    });
    return data;
  },

  // Search users
  async searchUsers(query, page = 0, size = 20) {
    const { data } = await apiClient.get("/users/search", {
      params: { q: query, page, size },
    });
    return data;
  },

  // Update own profile
  async updateProfile(profileData) {
    const { data } = await apiClient.put("/users/me", profileData);
    return data;
  },

  // Change avatar
  async changeAvatar(avatarUrl) {
    const { data } = await apiClient.patch("/users/me/avatar", {
      avatarUrl,
    });
    return data;
  },

  // Change password
  async changePassword(currentPassword, newPassword) {
    const { data } = await apiClient.post("/users/me/change-password", {
      currentPassword,
      newPassword,
    });
    return data;
  },

  // Delete account
  async deleteAccount(password) {
    const { data } = await apiClient.post("/users/me/delete-account", {
      password,
    });
    return data;
  },

  // Follow user
  async followUser(userId) {
    const { data } = await apiClient.post(`/users/${userId}/follow`);
    return data;
  },

  // Unfollow user
  async unfollowUser(userId) {
    const { data } = await apiClient.post(`/users/${userId}/unfollow`);
    return data;
  },

  // Get followers
  async getFollowers(userId, page = 0, size = 20) {
    const { data } = await apiClient.get(`/users/${userId}/followers`, {
      params: { page, size },
    });
    return data;
  },

  // Get following
  async getFollowing(userId, page = 0, size = 20) {
    const { data } = await apiClient.get(`/users/${userId}/following`, {
      params: { page, size },
    });
    return data;
  },

  // Get user statistics
  async getUserStats(userId) {
    const { data } = await apiClient.get(`/users/${userId}/stats`);
    return data;
  },
};
