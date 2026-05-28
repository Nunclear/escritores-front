import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { authService } from "../api/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [authError, setAuthError] = useState("");

  const isAuthenticated = Boolean(user);

  const loadCurrentUser = useCallback(async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      setIsCheckingSession(false);
      return;
    }

    try {
      const currentUser = await authService.me();
      setUser(currentUser);
    } catch {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    } finally {
      setIsCheckingSession(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  async function login({ loginOrEmail, password }) {
    setAuthError("");

    const response = await authService.login({
      loginOrEmail,
      password,
    });

    localStorage.setItem("accessToken", response.accessToken);
    localStorage.setItem("refreshToken", response.refreshToken);

    setUser(response.user);

    return response;
  }

  async function register({
    loginName,
    emailAddress,
    displayName,
    password,
  }) {
    setAuthError("");

    return authService.register({
      loginName,
      emailAddress,
      displayName,
      password,
    });
  }

  async function logout() {
    const refreshToken = localStorage.getItem("refreshToken");

    try {
      if (refreshToken) {
        await authService.logout(refreshToken);
      }
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
    }
  }

  async function forgotPassword(emailAddress) {
    setAuthError("");
    return authService.forgotPassword(emailAddress);
  }

  async function resetPassword(resetToken, newPassword) {
    setAuthError("");
    return authService.resetPassword(resetToken, newPassword);
  }

  async function verifyEmail(verificationToken) {
    setAuthError("");
    return authService.verifyEmail(verificationToken);
  }

  const value = useMemo(
    () => ({
      user,
      isAuthenticated,
      isCheckingSession,
      authError,
      setAuthError,
      login,
      register,
      logout,
      forgotPassword,
      resetPassword,
      verifyEmail,
      loadCurrentUser,
    }),
    [user, isAuthenticated, isCheckingSession, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }

  return context;
}
