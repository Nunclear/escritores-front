// Date formatting
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d);
};

export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return new Intl.DateTimeFormat('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

export const formatDateTime = (date) => {
  if (!date) return '';
  return `${formatDate(date)} a las ${formatTime(date)}`;
};

export const formatRelativeTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const seconds = Math.floor((now - d) / 1000);

  if (seconds < 60) return 'Hace un momento';
  if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} minuto(s)`;
  if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} hora(s)`;
  if (seconds < 604800) return `Hace ${Math.floor(seconds / 86400)} día(s)`;

  return formatDate(date);
};

// Text utilities
export const truncateText = (text, length = 100) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};

export const wordCount = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
};

export const estimateReadingTime = (text) => {
  const words = wordCount(text);
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);
  return minutes;
};

export const generateSlug = (text) => {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// Validation
export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validatePassword = (password) => {
  return password && password.length >= 8;
};

export const validateLoginName = (loginName) => {
  return loginName && loginName.length >= 3 && /^[a-zA-Z0-9_-]+$/.test(loginName);
};

// Array utilities
export const sortByDate = (items, key = 'createdAt', ascending = false) => {
  return [...items].sort((a, b) => {
    const dateA = new Date(a[key]);
    const dateB = new Date(b[key]);
    return ascending ? dateA - dateB : dateB - dateA;
  });
};

export const sortByProperty = (items, property, ascending = false) => {
  return [...items].sort((a, b) => {
    if (ascending) {
      return a[property] > b[property] ? 1 : -1;
    }
    return a[property] < b[property] ? 1 : -1;
  });
};

export const filterByProperty = (items, property, value) => {
  return items.filter((item) => item[property] === value);
};

// Color utilities for publication/visibility states
export const getStateColor = (state) => {
  const colors = {
    draft: '#f2e8d9',
    published: '#3a6b4a',
    archived: '#7a7168',
    public: '#3a5a8b',
    private: '#8b5e3c',
    hidden: '#8b3a3a',
  };
  return colors[state] || '#7a7168';
};

export const getStateLabel = (state) => {
  const labels = {
    draft: 'Borrador',
    published: 'Publicado',
    archived: 'Archivado',
    public: 'Público',
    private: 'Privado',
    hidden: 'Oculto',
    pending: 'Pendiente',
    reviewed: 'Revisado',
    resolved: 'Resuelto',
  };
  return labels[state] || state;
};

// Error handling
export const getErrorMessage = (error) => {
  if (typeof error === 'string') return error;
  if (error?.response?.data?.message) return error.response.data.message;
  if (error?.message) return error.message;
  return 'Algo salió mal. Por favor intenta de nuevo.';
};

// Local storage
export const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

export const getStorageItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage:', error);
    return defaultValue;
  }
};

export const removeStorageItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing from localStorage:', error);
  }
};

// Role-based access
export const hasRole = (userRole, requiredRoles) => {
  if (typeof requiredRoles === 'string') {
    return userRole === requiredRoles;
  }
  return requiredRoles.includes(userRole);
};

export const canAccessAdminPanel = (role) => {
  return ['ADMIN', 'MODERATOR'].includes(role);
};

export const canModerateContent = (role) => {
  return ['ADMIN', 'MODERATOR'].includes(role);
};

export const canEditStory = (userId, storyAuthorId, role) => {
  return userId === storyAuthorId || role === 'ADMIN';
};

// Image utilities
export const getInitials = (name) => {
  if (!name) return '?';
  return name
    .split(' ')
    .map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getAvatarUrl = (user) => {
  if (user?.avatarUrl) return user.avatarUrl;
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.loginName || 'user'}`;
};
