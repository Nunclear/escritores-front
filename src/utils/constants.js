// API Configuration
export const API_BASE_URL = 'http://localhost:8080/api';
export const API_TIMEOUT = 30000;

// User Roles
export const ROLES = {
  READER: 'LECTOR',
  USER: 'USER',
  MODERATOR: 'MODERATOR',
  ADMIN: 'ADMIN',
};

// Publication States
export const PUBLICATION_STATES = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ARCHIVED: 'archived',
};

// Visibility States
export const VISIBILITY_STATES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  HIDDEN: 'hidden',
};

// Report Status
export const REPORT_STATUS = {
  PENDING: 'pending',
  REVIEWED: 'reviewed',
  RESOLVED: 'resolved',
};

// Account States
export const ACCOUNT_STATES = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
  BANNED: 'banned',
};

// Pagination
export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE = 0;

// Character Roles
export const CHARACTER_ROLES = {
  PROTAGONIST: 'protagonist',
  ANTAGONIST: 'antagonist',
  SUPPORTING: 'supporting',
  MINOR: 'minor',
};

// Skill Categories
export const SKILL_CATEGORIES = {
  MAGIC: 'magic',
  COMBAT: 'combat',
  CRAFT: 'craft',
  KNOWLEDGE: 'knowledge',
  SOCIAL: 'social',
  OTHER: 'other',
};

// Reading Times
export const WORDS_PER_MINUTE = 200;

// Validation Rules
export const VALIDATION = {
  MIN_USERNAME_LENGTH: 3,
  MIN_PASSWORD_LENGTH: 8,
  MAX_STORY_TITLE_LENGTH: 255,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_CHAPTER_TITLE_LENGTH: 255,
  MAX_CHARACTER_NAME_LENGTH: 255,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Error de conexión. Por favor verifica tu internet.',
  AUTH_ERROR: 'Error de autenticación. Por favor intenta de nuevo.',
  NOT_FOUND: 'El recurso solicitado no fue encontrado.',
  FORBIDDEN: 'No tienes permisos para acceder a esto.',
  SERVER_ERROR: 'Error del servidor. Por favor intenta más tarde.',
  VALIDATION_ERROR: 'Hay errores en el formulario. Por favor verifica los campos.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  SAVED: 'Cambios guardados exitosamente',
  CREATED: 'Creado exitosamente',
  DELETED: 'Eliminado exitosamente',
  PUBLISHED: 'Publicado exitosamente',
};
