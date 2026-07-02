const RAW_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
export const API_ROOT = `${RAW_BASE_URL.replace(/\/$/, '')}`;

const ACCESS_TOKEN_KEY = 'rdp_access_token';
const REFRESH_TOKEN_KEY = 'rdp_refresh_token';
const USER_KEY = 'rdp_user';
const VISITOR_KEY = 'rdp_visitor_token';

export const storage = {
  getAccessToken: () => localStorage.getItem(ACCESS_TOKEN_KEY),
  setAccessToken: (token) => token ? localStorage.setItem(ACCESS_TOKEN_KEY, token) : localStorage.removeItem(ACCESS_TOKEN_KEY),
  getRefreshToken: () => localStorage.getItem(REFRESH_TOKEN_KEY),
  setRefreshToken: (token) => token ? localStorage.setItem(REFRESH_TOKEN_KEY, token) : localStorage.removeItem(REFRESH_TOKEN_KEY),
  getVisitorToken: () => {
    let token = localStorage.getItem(VISITOR_KEY);
    if (!token) {
      token = crypto?.randomUUID?.() || `visitor-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      localStorage.setItem(VISITOR_KEY, token);
    }
    return token;
  },
  getUser: () => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  },
  setUser: (user) => user ? localStorage.setItem(USER_KEY, JSON.stringify(user)) : localStorage.removeItem(USER_KEY),
  clear: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  }
};

export class ApiError extends Error {
  constructor(message, status, payload) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.payload = payload;
  }
}

function toQuery(params = {}) {
  const query = new URLSearchParams();
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') query.append(key, value);
  });
  const text = query.toString();
  return text ? `?${text}` : '';
}

export function pageContent(payload, fallback = []) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.content)) return payload.content;
  return fallback;
}

export async function request(path, options = {}) {
  const { method = 'GET', body, params, headers = {}, auth = true, isFormData = false } = options;
  const token = storage.getAccessToken();
  const finalHeaders = { ...headers };

  if (!isFormData) finalHeaders['Content-Type'] = 'application/json';
  if (auth && token) finalHeaders.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_ROOT}${path}${toQuery(params)}`, {
    method,
    headers: finalHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json().catch(() => null) : await response.text().catch(() => null);

  if (!response.ok) {
    throw new ApiError(payload?.message || payload?.error || `Error HTTP ${response.status}`, response.status, payload);
  }

  return payload;
}

export const api = {
  auth: {
    register: (data) => request('/auth/register', { method: 'POST', body: data, auth: false }),
    login: (data) => request('/auth/login', { method: 'POST', body: data, auth: false }),
    refresh: (refreshToken) => request('/auth/refresh', { method: 'POST', body: { refreshToken }, auth: false }),
    logout: (refreshToken) => request('/auth/logout', { method: 'POST', body: { refreshToken } }),
    me: () => request('/auth/me'),
    forgotPassword: (emailAddress) => request('/auth/forgot-password', { method: 'POST', body: { emailAddress }, auth: false }),
    resetPassword: (data) => request('/auth/reset-password', { method: 'POST', body: data, auth: false }),
    verifyEmail: (verificationToken) => request('/auth/verify-email', { method: 'POST', body: { verificationToken }, auth: false }),
    invalidateAllSessions: () => request('/auth/invalidate-all-sessions', { method: 'POST' }),
  },

  users: {
    get: (id) => request(`/users/${id}`, { auth: false }),
    list: (params) => request('/users', { params }),
    publicProfile: (id) => request(`/users/${id}/public-profile`, { auth: false }),
    authorStories: (id, params) => request(`/users/${id}/stories`, { params, auth: false }),
    me: () => request('/users/me'),
    updateMe: (data) => request('/users/me', { method: 'PUT', body: data }),
    updateAvatar: (avatarUrl) => request('/users/me/avatar', { method: 'PATCH', body: { avatarUrl } }),
    changePassword: (data) => request('/users/me/change-password', { method: 'POST', body: data }),
    changeEmail: (data) => request('/users/me/change-email', { method: 'POST', body: data }),
    deactivateMe: () => request('/users/me/deactivate', { method: 'POST' }),
    search: (params) => request('/users/search', { params }),
    publicSearch: (params) => request('/users/search', { params, auth: false }),
  },

  adminUsers: {
    setAccessLevel: (id, accessLevel) => request(`/admin/users/${id}/access-level`, { method: 'PATCH', body: { accessLevel } }),
    setAccountState: (id, accountState) => request(`/admin/users/${id}/account-state`, { method: 'PATCH', body: { accountState } }),
    byRole: (params) => request('/admin/users/by-role', { params }),
    byState: (params) => request('/admin/users/by-state', { params }),
    history: (id) => request(`/admin/users/${id}/history`),
  },

  stories: {
    list: (params = {}) => request('/stories', { params: { page: 0, size: 12, sort: 'createdAt,desc', ...params }, auth: false }),
    search: (params = {}) => request('/stories/search', { params: { visibilityState: 'public', publicationState: 'published', page: 0, size: 12, ...params }, auth: false }),
    get: (id) => request(`/stories/${id}`, { auth: false }),
    getBySlug: (slug) => request(`/stories/slug/${slug}`, { auth: false }),
    mineDrafts: (params) => request('/stories/me/drafts', { params }),
    mineArchived: (params) => request('/stories/me/archived', { params }),
    byUser: (userId, params) => request(`/stories/user/${userId}`, { params, auth: params?.includeDrafts ? true : false }),
    create: (data) => request('/stories', { method: 'POST', body: data }),
    update: (id, data) => request(`/stories/${id}`, { method: 'PUT', body: data }),
    publish: (id) => request(`/stories/${id}/publish`, { method: 'POST' }),
    unpublish: (id) => request(`/stories/${id}/unpublish`, { method: 'POST' }),
    archive: (id) => request(`/stories/${id}/archive`, { method: 'POST' }),
    restore: (id) => request(`/stories/${id}/restore`, { method: 'POST' }),
    duplicate: (id, title) => request(`/stories/${id}/duplicate`, { method: 'POST', body: { title } }),
    remove: (id) => request(`/stories/${id}`, { method: 'DELETE' }),
  },

  chapters: {
    published: (storyId) => request(`/chapters/story/${storyId}/published`, { auth: false }),
    byStory: (storyId, includeDrafts = false) => request(`/chapters/story/${storyId}`, { params: { includeDrafts }, auth: includeDrafts }),
    get: (id) => request(`/chapters/${id}`, { auth: false }),
    search: (params) => request('/chapters/search', { params, auth: false }),
    drafts: (params) => request('/chapters/me/drafts', { params }),
    create: (data) => request('/chapters', { method: 'POST', body: data }),
    update: (id, data) => request(`/chapters/${id}`, { method: 'PUT', body: data }),
    publish: (id) => request(`/chapters/${id}/publish`, { method: 'POST' }),
    unpublish: (id) => request(`/chapters/${id}/unpublish`, { method: 'POST' }),
    archive: (id) => request(`/chapters/${id}/archive`, { method: 'POST' }),
    reorder: (storyId, items) => request('/chapters/reorder', { method: 'POST', body: { storyId, items } }),
    move: (id, data) => request(`/chapters/${id}/move`, { method: 'POST', body: data }),
    remove: (id) => request(`/chapters/${id}`, { method: 'DELETE' }),
  },

  arcs: {
    create: (data) => request('/arcs', { method: 'POST', body: data }),
    get: (id) => request(`/arcs/${id}`, { auth: false }),
    byStory: (storyId) => request(`/arcs/story/${storyId}`, { auth: false }),
    update: (id, data) => request(`/arcs/${id}`, { method: 'PUT', body: data }),
    reorder: (storyId, items) => request('/arcs/reorder', { method: 'POST', body: { storyId, items } }),
    remove: (id) => request(`/arcs/${id}`, { method: 'DELETE' }),
  },

  volumes: {
    create: (data) => request('/volumes', { method: 'POST', body: data }),
    get: (id) => request(`/volumes/${id}`, { auth: false }),
    byStory: (storyId) => request(`/volumes/story/${storyId}`, { auth: false }),
    update: (id, data) => request(`/volumes/${id}`, { method: 'PUT', body: data }),
    reorder: (storyId, items) => request('/volumes/reorder', { method: 'POST', body: { storyId, items } }),
    move: (id, data) => request(`/volumes/${id}/move`, { method: 'POST', body: data }),
    remove: (id) => request(`/volumes/${id}`, { method: 'DELETE' }),
  },

  characters: {
    create: (data) => request('/characters', { method: 'POST', body: data }),
    get: (id) => request(`/characters/${id}`, { auth: false }),
    byStory: (storyId, params) => request(`/characters/story/${storyId}`, { params, auth: false }),
    search: (params) => request('/characters/search', { params, auth: false }),
    update: (id, data) => request(`/characters/${id}`, { method: 'PUT', body: data }),
    remove: (id) => request(`/characters/${id}`, { method: 'DELETE' }),
  },

  skills: {
    create: (data) => request('/skills', { method: 'POST', body: data }),
    get: (id) => request(`/skills/${id}`, { auth: false }),
    byStory: (storyId, params) => request(`/skills/story/${storyId}`, { params, auth: false }),
    search: (params) => request('/skills/search', { params, auth: false }),
    update: (id, data) => request(`/skills/${id}`, { method: 'PUT', body: data }),
    remove: (id) => request(`/skills/${id}`, { method: 'DELETE' }),
  },

  characterSkills: {
    assign: (data) => request('/character-skills', { method: 'POST', body: data }),
    byCharacter: (storyCharacterId) => request(`/character-skills/character/${storyCharacterId}`, { auth: false }),
    bySkill: (skillId) => request(`/character-skills/skill/${skillId}`, { auth: false }),
    update: (id, data) => request(`/character-skills/${id}`, { method: 'PUT', body: data }),
    remove: (id) => request(`/character-skills/${id}`, { method: 'DELETE' }),
  },

  events: {
    create: (data) => request('/events', { method: 'POST', body: data }),
    get: (id) => request(`/events/${id}`, { auth: false }),
    byStory: (storyId, params) => request(`/events/story/${storyId}`, { params, auth: false }),
    byChapter: (chapterId) => request(`/events/chapter/${chapterId}`, { auth: false }),
    search: (params) => request('/events/search', { params, auth: false }),
    update: (id, data) => request(`/events/${id}`, { method: 'PUT', body: data }),
    remove: (id) => request(`/events/${id}`, { method: 'DELETE' }),
  },

  ideas: {
    create: (data) => request('/ideas', { method: 'POST', body: data }),
    get: (id) => request(`/ideas/${id}`),
    byStory: (storyId, params) => request(`/ideas/story/${storyId}`, { params }),
    update: (id, data) => request(`/ideas/${id}`, { method: 'PUT', body: data }),
    remove: (id) => request(`/ideas/${id}`, { method: 'DELETE' }),
  },

  items: {
    create: (data) => request('/items', { method: 'POST', body: data }),
    get: (id) => request(`/items/${id}`, { auth: false }),
    byStory: (storyId, params) => request(`/items/story/${storyId}`, { params, auth: false }),
    update: (id, data) => request(`/items/${id}`, { method: 'PUT', body: data }),
    remove: (id) => request(`/items/${id}`, { method: 'DELETE' }),
  },

  media: {
    upload: (data) => request('/media/upload', { method: 'POST', body: data }),
    get: (id) => request(`/media/${id}`, { auth: false }),
    byChapter: (chapterId) => request(`/media/chapter/${chapterId}`, { auth: false }),
    update: (id, data) => request(`/media/${id}`, { method: 'PUT', body: data }),
    download: (id) => request(`/media/${id}/download`, { auth: false }),
    remove: (id) => request(`/media/${id}`, { method: 'DELETE' }),
  },

  comments: {
    create: (data) => request('/comments', { method: 'POST', body: data }),
    get: (id) => request(`/comments/${id}`, { auth: false }),
    byStory: (storyId, params) => request(`/comments/story/${storyId}`, { params, auth: false }),
    byChapter: (chapterId, params) => request(`/comments/chapter/${chapterId}`, { params, auth: false }),
    replies: (id) => request(`/comments/${id}/replies`, { auth: false }),
    update: (id, data) => request(`/comments/${id}`, { method: 'PUT', body: data }),
    remove: (id) => request(`/comments/${id}`, { method: 'DELETE' }),
  },

  ratings: {
    createOrUpdate: (data) => request('/ratings', { method: 'POST', body: data }),
    get: (id) => request(`/ratings/${id}`, { auth: false }),
    byStory: (storyId, params) => request(`/ratings/story/${storyId}`, { params, auth: false }),
    average: (storyId) => request(`/ratings/story/${storyId}/average`, { auth: false }),
    mineForStory: (storyId) => request(`/ratings/story/${storyId}/me`),
    remove: (id) => request(`/ratings/${id}`, { method: 'DELETE' }),
  },

  favorites: {
    add: (storyId) => request('/favorites', { method: 'POST', body: { storyId } }),
    remove: (storyId) => request(`/favorites/${storyId}`, { method: 'DELETE' }),
    mine: (params) => request('/favorites/me', { params }),
    isFavorite: (storyId) => request(`/favorites/story/${storyId}/me`),
    count: (storyId) => request(`/favorites/story/${storyId}/count`, { auth: false }),
  },

  follows: {
    follow: (followedUserId) => request('/follows', { method: 'POST', body: { followedUserId } }),
    unfollow: (followedUserId) => request(`/follows/${followedUserId}`, { method: 'DELETE' }),
    following: (params) => request('/follows/me/following', { params }),
    followers: (userId, params) => request(`/follows/user/${userId}/followers`, { params, auth: false }),
    isFollowing: (userId) => request(`/follows/user/${userId}/me`),
    count: (userId) => request(`/follows/user/${userId}/count`, { auth: false }),
  },

  reports: {
    story: (data) => request('/reports/story', { method: 'POST', body: data }),
    chapter: (data) => request('/reports/chapter', { method: 'POST', body: data }),
    comment: (data) => request('/reports/comment', { method: 'POST', body: data }),
    user: (data) => request('/reports/user', { method: 'POST', body: data }),
    pending: (params) => request('/reports/pending', { params }),
    list: (params) => request('/reports', { params }),
    get: (id) => request(`/reports/${id}`),
    assign: (id, reviewedByUserId) => request(`/reports/${id}/assign`, { method: 'POST', body: { reviewedByUserId } }),
    review: (id, resolutionText) => request(`/reports/${id}/review`, { method: 'POST', body: { resolutionText } }),
    resolve: (id, resolutionText) => request(`/reports/${id}/resolve`, { method: 'POST', body: { resolutionText } }),
    reject: (id, resolutionText) => request(`/reports/${id}/reject`, { method: 'POST', body: { resolutionText } }),
    history: (params) => request('/reports/history', { params }),
  },

  sanctions: {
    warning: (data) => request('/sanctions/warning', { method: 'POST', body: data }),
    temporaryBan: (data) => request('/sanctions/temporary-ban', { method: 'POST', body: data }),
    permanentBan: (data) => request('/sanctions/permanent-ban', { method: 'POST', body: data }),
    lift: (id, reasonText) => request(`/sanctions/${id}/lift`, { method: 'POST', body: { reasonText } }),
    byUser: (userId) => request(`/sanctions/user/${userId}`),
    mine: () => request('/sanctions/me'),
    active: (params) => request('/sanctions/active', { params }),
  },

  globalNotices: {
    create: (data) => request('/global-notices', { method: 'POST', body: data }),
    get: (id) => request(`/global-notices/${id}`, { auth: false }),
    active: () => request('/global-notices/active', { auth: false }),
    history: (params) => request('/global-notices/history', { params }),
    update: (id, data) => request(`/global-notices/${id}`, { method: 'PUT', body: data }),
    enable: (id) => request(`/global-notices/${id}/enable`, { method: 'POST' }),
    disable: (id) => request(`/global-notices/${id}/disable`, { method: 'POST' }),
    archive: (id) => request(`/global-notices/${id}/archive`, { method: 'POST' }),
  },

  moderation: {
    hideComment: (id, reasonText) => request(`/moderation/comments/${id}/hide`, { method: 'POST', body: { reasonText } }),
    restoreComment: (id) => request(`/moderation/comments/${id}/restore`, { method: 'POST' }),
    hiddenComments: (params) => request('/moderation/comments/hidden', { params }),
    reportedComments: (params) => request('/moderation/comments/reported', { params }),
    commentQueue: (params) => request('/moderation/comments/queue', { params }),
  },

  metrics: {
    story: (storyId) => request(`/metrics/story/${storyId}`),
    chapter: (chapterId) => request(`/metrics/chapter/${chapterId}`),
    author: (userId) => request(`/metrics/author/${userId}`),
    topViewed: (params = {}) => request('/metrics/stories/top-viewed', { params: { page: 0, size: 10, ...params }, auth: false }),
    registerStoryView: (storyId) => request('/metrics/views/story', { method: 'POST', auth: false, body: { storyId: Number(storyId), chapterId: null, visitorToken: storage.getVisitorToken(), userAgentText: navigator.userAgent } }),
    registerChapterView: (storyId, chapterId) => request('/metrics/views/chapter', { method: 'POST', auth: false, body: { storyId: Number(storyId), chapterId: Number(chapterId), visitorToken: storage.getVisitorToken(), userAgentText: navigator.userAgent } }),
  },

  dashboard: {
    me: () => request('/dashboard/me/summary'),
    recentComments: (params) => request('/dashboard/me/recent-comments', { params }),
    ratings: (params) => request('/dashboard/me/ratings', { params }),
  },

  adminDashboard: {
    summary: () => request('/admin/dashboard/summary'),
    activity: (params) => request('/admin/dashboard/activity', { params }),
  },

  // Alias para mantener compatibilidad con componentes ya creados.
  engagement: {
    commentsByStory: (storyId, params) => api.comments.byStory(storyId, params),
    commentsByChapter: (chapterId, params) => api.comments.byChapter(chapterId, params),
    replies: (commentId) => api.comments.replies(commentId),
    createComment: (data) => api.comments.create(data),
    ratingsByStory: (storyId, params) => api.ratings.byStory(storyId, params),
    averageRating: (storyId) => api.ratings.average(storyId),
    rate: (data) => api.ratings.createOrUpdate(data),
    favorite: (storyId) => api.favorites.add(storyId),
    unfavorite: (storyId) => api.favorites.remove(storyId),
    myFavorites: (params) => api.favorites.mine(params),
    isFavorite: (storyId) => api.favorites.isFavorite(storyId),
    favoriteCount: (storyId) => api.favorites.count(storyId),
    follow: (followedUserId) => api.follows.follow(followedUserId),
    unfollow: (followedUserId) => api.follows.unfollow(followedUserId),
    isFollowing: (userId) => api.follows.isFollowing(userId),
    followers: (userId, params) => api.follows.followers(userId, params),
    followersCount: (userId) => api.follows.count(userId),
  },

  notices: {
    active: () => api.globalNotices.active(),
  }
};
