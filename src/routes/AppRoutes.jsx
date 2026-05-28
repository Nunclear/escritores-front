import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/public/HomePage";
import { ExplorePage } from "../pages/public/ExplorePage";
import { StoryReaderPage } from "../pages/public/StoryReaderPage";
import { LoginPage } from "../pages/LoginPage";
import { RegisterPage } from "../pages/RegisterPage";
import { ForgotPasswordPage } from "../pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../pages/ResetPasswordPage";
import { WriterDashboardPage } from "../pages/private/WriterDashboardPage";
import { EditorPage } from "../pages/private/EditorPage";
import { useAuth } from "../context/AuthContext";

function PlaceholderPage({ title }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-[30px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-soft)]">
        <h1 className="font-serif text-4xl font-bold text-[var(--color-text)]">
          {title}
        </h1>
        <p className="mt-3 text-[var(--color-muted)]">
          Esta vista queda lista para implementarse en la siguiente etapa.
        </p>
      </div>
    </div>
  );
}

function GuestOnlyRoute({ children }) {
  const { isAuthenticated, isCheckingSession } = useAuth();

  if (isCheckingSession) return null;

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, isCheckingSession } = useAuth();

  if (isCheckingSession) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/explorar" element={<ExplorePage />} />
      <Route path="/story/:storyId" element={<StoryReaderPage />} />
      <Route path="/story/:storyId/chapter/:chapterId" element={<StoryReaderPage />} />
      <Route path="/autores" element={<PlaceholderPage title="Autores" />} />
      <Route path="/perfil" element={<PlaceholderPage title="Perfil" />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <WriterDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/editor/:storyId"
        element={
          <ProtectedRoute>
            <EditorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <WriterDashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/login"
        element={
          <GuestOnlyRoute>
            <LoginPage />
          </GuestOnlyRoute>
        }
      />

      <Route
        path="/registro"
        element={
          <GuestOnlyRoute>
            <RegisterPage />
          </GuestOnlyRoute>
        }
      />

      <Route
        path="/forgot-password"
        element={
          <GuestOnlyRoute>
            <ForgotPasswordPage />
          </GuestOnlyRoute>
        }
      />

      <Route
        path="/reset-password"
        element={
          <GuestOnlyRoute>
            <ResetPasswordPage />
          </GuestOnlyRoute>
        }
      />

      <Route path="*" element={<PlaceholderPage title="Página no encontrada" />} />
    </Routes>
  );
}
