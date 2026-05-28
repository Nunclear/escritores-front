import apiClient from "./apiClient";

export const charactersService = {
  // Create character
  async createCharacter(storyId, characterData) {
    const { data } = await apiClient.post(
      `/stories/${storyId}/characters`,
      characterData
    );
    return data;
  },

  // Get character
  async getCharacter(storyId, characterId) {
    const { data } = await apiClient.get(
      `/stories/${storyId}/characters/${characterId}`
    );
    return data;
  },

  // List story characters
  async listCharacters(storyId, page = 0, size = 50) {
    const { data } = await apiClient.get(`/stories/${storyId}/characters`, {
      params: { page, size },
    });
    return data;
  },

  // Update character
  async updateCharacter(storyId, characterId, characterData) {
    const { data } = await apiClient.put(
      `/stories/${storyId}/characters/${characterId}`,
      characterData
    );
    return data;
  },

  // Delete character
  async deleteCharacter(storyId, characterId) {
    const { data } = await apiClient.delete(
      `/stories/${storyId}/characters/${characterId}`
    );
    return data;
  },

  // Get character appearances in chapters
  async getCharacterAppearances(storyId, characterId) {
    const { data } = await apiClient.get(
      `/stories/${storyId}/characters/${characterId}/appearances`
    );
    return data;
  },

  // Get character statistics
  async getCharacterStats(storyId, characterId) {
    const { data } = await apiClient.get(
      `/stories/${storyId}/characters/${characterId}/stats`
    );
    return data;
  },
};
