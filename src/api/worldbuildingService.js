import apiClient from "./apiClient";

export const worldbuildingService = {
  // Create worldbuilding element
  async createElement(storyId, elementData) {
    const { data } = await apiClient.post(
      `/stories/${storyId}/worldbuilding`,
      elementData
    );
    return data;
  },

  // Get worldbuilding element
  async getElement(storyId, elementId) {
    const { data } = await apiClient.get(
      `/stories/${storyId}/worldbuilding/${elementId}`
    );
    return data;
  },

  // List story worldbuilding elements
  async listElements(storyId, page = 0, size = 50) {
    const { data } = await apiClient.get(
      `/stories/${storyId}/worldbuilding`,
      {
        params: { page, size },
      }
    );
    return data;
  },

  // Update worldbuilding element
  async updateElement(storyId, elementId, elementData) {
    const { data } = await apiClient.put(
      `/stories/${storyId}/worldbuilding/${elementId}`,
      elementData
    );
    return data;
  },

  // Delete worldbuilding element
  async deleteElement(storyId, elementId) {
    const { data } = await apiClient.delete(
      `/stories/${storyId}/worldbuilding/${elementId}`
    );
    return data;
  },

  // Get worldbuilding by category
  async getByCategory(storyId, category) {
    const { data } = await apiClient.get(
      `/stories/${storyId}/worldbuilding/category/${category}`
    );
    return data;
  },

  // List categories
  async getCategories(storyId) {
    const { data } = await apiClient.get(
      `/stories/${storyId}/worldbuilding/categories`
    );
    return data;
  },

  // Get element statistics
  async getElementStats(storyId, elementId) {
    const { data } = await apiClient.get(
      `/stories/${storyId}/worldbuilding/${elementId}/stats`
    );
    return data;
  },
};
