import apiClient from "./apiClient";

export const authService = {
  async login(payload) {
    const { data } = await apiClient.post("/auth/login", {
      loginOrEmail: payload.loginOrEmail,
      password: payload.password,
    });

    return data;
  },

  async register(payload) {
    const { data } = await apiClient.post("/auth/register", {
      loginName: payload.loginName,
      emailAddress: payload.emailAddress,
      displayName: payload.displayName,
      password: payload.password,
    });

    return data;
  },

  async me() {
    const { data } = await apiClient.get("/auth/me");
    return data;
  },

  async logout(refreshToken) {
    const { data } = await apiClient.post("/auth/logout", {
      refreshToken,
    });

    return data;
  },

  async refreshToken(refreshToken) {
    const { data } = await apiClient.post("/auth/refresh", {
      refreshToken,
    });

    return data;
  },

  async forgotPassword(emailAddress) {
    const { data } = await apiClient.post("/auth/forgot-password", {
      emailAddress,
    });

    return data;
  },

  async resetPassword(resetToken, newPassword) {
    const { data } = await apiClient.post("/auth/reset-password", {
      resetToken,
      newPassword,
    });

    return data;
  },

  async verifyEmail(verificationToken) {
    const { data } = await apiClient.post("/auth/verify-email", {
      verificationToken,
    });

    return data;
  },

  async invalidateAllSessions() {
    const { data } = await apiClient.post("/auth/invalidate-all-sessions");

    return data;
  },
};
