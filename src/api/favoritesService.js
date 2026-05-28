import apiClient from "./apiClient";

export const favoritesService = {
  // Add story to favorites
  async addToFavorites(storyId) {
    const { data } = await apiClient.post(`/users/me/favorites/${storyId}`);
    return data;
  },

  // Remove story from favorites
  async removeFromFavorites(storyId) {
    const { data } = await apiClient.delete(`/users/me/favorites/${storyId}`);
    return data;
  },

  // List user's favorites
  async listFavorites(page = 0, size = 20) {
    const { data } = await apiClient.get("/users/me/favorites", {
      params: { page, size },
    });
    return data;
  },

  // Check if story is in favorites
  async isFavorite(storyId) {
    const { data } = await apiClient.get(`/users/me/favorites/${storyId}/is-favorite`);
    return data;
  },

  // Get favorites count
  async getFavoritesCount() {
    const { data } = await apiClient.get("/users/me/favorites/count");
    return data;
  },

  // Create favorites collection
  async createCollection(collectionData) {
    const { data } = await apiClient.post("/users/me/favorites/collections", collectionData);
    return data;
  },

  // List collections
  async listCollections(page = 0, size = 20) {
    const { data } = await apiClient.get("/users/me/favorites/collections", {
      params: { page, size },
    });
    return data;
  },

  // Add story to collection
  async addToCollection(collectionId, storyId) {
    const { data } = await apiClient.post(
      `/users/me/favorites/collections/${collectionId}/stories/${storyId}`
    );
    return data;
  },

  // Remove story from collection
  async removeFromCollection(collectionId, storyId) {
    const { data } = await apiClient.delete(
      `/users/me/favorites/collections/${collectionId}/stories/${storyId}`
    );
    return data;
  },
};
