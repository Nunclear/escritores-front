import api from './api';

// Characters API
export const charactersService = {
  getCharacter: async (id) => {
    const response = await api.get(`/characters/${id}`);
    return response.data;
  },

  getStoryCharacters: async (storyId, params = {}) => {
    const response = await api.get(`/characters/story/${storyId}`, { params });
    return response.data;
  },

  searchCharacters: async (params = {}) => {
    const response = await api.get('/characters/search', { params });
    return response.data;
  },

  createCharacter: async (data) => {
    const response = await api.post('/characters', data);
    return response.data;
  },

  updateCharacter: async (id, data) => {
    const response = await api.put(`/characters/${id}`, data);
    return response.data;
  },

  deleteCharacter: async (id) => {
    const response = await api.delete(`/characters/${id}`);
    return response.data;
  },
};

// Skills API
export const skillsService = {
  getSkill: async (id) => {
    const response = await api.get(`/skills/${id}`);
    return response.data;
  },

  getStorySkills: async (storyId, params = {}) => {
    const response = await api.get(`/skills/story/${storyId}`, { params });
    return response.data;
  },

  searchSkills: async (params = {}) => {
    const response = await api.get('/skills/search', { params });
    return response.data;
  },

  createSkill: async (data) => {
    const response = await api.post('/skills', data);
    return response.data;
  },

  updateSkill: async (id, data) => {
    const response = await api.put(`/skills/${id}`, data);
    return response.data;
  },

  deleteSkill: async (id) => {
    const response = await api.delete(`/skills/${id}`);
    return response.data;
  },
};

// Character Skills API
export const characterSkillsService = {
  getCharacterSkills: async (characterId) => {
    const response = await api.get(`/character-skills/character/${characterId}`);
    return response.data;
  },

  getSkillUsers: async (skillId) => {
    const response = await api.get(`/character-skills/skill/${skillId}`);
    return response.data;
  },

  assignSkill: async (data) => {
    const response = await api.post('/character-skills', data);
    return response.data;
  },

  updateCharacterSkill: async (id, data) => {
    const response = await api.put(`/character-skills/${id}`, data);
    return response.data;
  },

  removeCharacterSkill: async (id) => {
    const response = await api.delete(`/character-skills/${id}`);
    return response.data;
  },
};

// Events API
export const eventsService = {
  getEvent: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  getStoryEvents: async (storyId, params = {}) => {
    const response = await api.get(`/events/story/${storyId}`, { params });
    return response.data;
  },

  searchEvents: async (params = {}) => {
    const response = await api.get('/events/search', { params });
    return response.data;
  },

  createEvent: async (data) => {
    const response = await api.post('/events', data);
    return response.data;
  },

  updateEvent: async (id, data) => {
    const response = await api.put(`/events/${id}`, data);
    return response.data;
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
};

// Arcs API
export const arcsService = {
  getArc: async (id) => {
    const response = await api.get(`/arcs/${id}`);
    return response.data;
  },

  getStoryArcs: async (storyId, params = {}) => {
    const response = await api.get(`/arcs/story/${storyId}`, { params });
    return response.data;
  },

  createArc: async (data) => {
    const response = await api.post('/arcs', data);
    return response.data;
  },

  updateArc: async (id, data) => {
    const response = await api.put(`/arcs/${id}`, data);
    return response.data;
  },

  reorderArcs: async (data) => {
    const response = await api.post('/arcs/reorder', data);
    return response.data;
  },

  deleteArc: async (id) => {
    const response = await api.delete(`/arcs/${id}`);
    return response.data;
  },
};

// Volumes API
export const volumesService = {
  getVolume: async (id) => {
    const response = await api.get(`/volumes/${id}`);
    return response.data;
  },

  getStoryVolumes: async (storyId, params = {}) => {
    const response = await api.get(`/volumes/story/${storyId}`, { params });
    return response.data;
  },

  createVolume: async (data) => {
    const response = await api.post('/volumes', data);
    return response.data;
  },

  updateVolume: async (id, data) => {
    const response = await api.put(`/volumes/${id}`, data);
    return response.data;
  },

  reorderVolumes: async (data) => {
    const response = await api.post('/volumes/reorder', data);
    return response.data;
  },

  moveVolume: async (volumeId, data) => {
    const response = await api.post(`/volumes/${volumeId}/move`, data);
    return response.data;
  },

  deleteVolume: async (id) => {
    const response = await api.delete(`/volumes/${id}`);
    return response.data;
  },
};
