import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";
import ExplorePage from "../pages/public/ExplorePage";
import StoryDetailPage from "../pages/public/StoryDetailPage";
import ChapterReaderPage from "../pages/public/ChapterReaderPage";
import AuthorsPage from "../pages/public/AuthorsPage";
import WriterDashboardPage from "../pages/private/WriterDashboardPage";
import StoryEditorPage from "../pages/private/StoryEditorPage";
import ChapterEditorPage from "../pages/private/ChapterEditorPage";
import CharactersManagerPage from "../pages/private/CharactersManagerPage";
import ObjectsManagerPage from "../pages/private/ObjectsManagerPage";
import UserProfilePage from "../pages/private/UserProfilePage";
import UserFavoritesPage from "../pages/private/UserFavoritesPage";
import FollowersPage from "../pages/private/FollowersPage";
import FollowingPage from "../pages/private/FollowingPage";
import ProtectedRoute from "../components/ProtectedRoute";
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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/explorar" element={<ExplorePage />} />
      <Route path="/autores" element={<AuthorsPage />} />
      <Route path="/story/:storyId" element={<StoryDetailPage />} />
      <Route path="/story/:storyId/chapter/:chapterId" element={<ChapterReaderPage />} />
      
      {/* Protected Routes - Writer Dashboard */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <WriterDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/historia/:storyId"
        element={
          <ProtectedRoute>
            <StoryEditorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/historia/nueva"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="Crear Nueva Historia" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/historia/:storyId/capitulo/nuevo"
        element={
          <ProtectedRoute>
            <ChapterEditorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/historia/:storyId/capitulo/:chapterId"
        element={
          <ProtectedRoute>
            <ChapterEditorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/historia/:storyId/personajes"
        element={
          <ProtectedRoute>
            <CharactersManagerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/historia/:storyId/objetos"
        element={
          <ProtectedRoute>
            <ObjectsManagerPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/historia/:storyId/arcos"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="Gestión de Arcos" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/app/historia/:storyId/volumenes"
        element={
          <ProtectedRoute>
            <PlaceholderPage title="Gestión de Volúmenes" />
          </ProtectedRoute>
        }
      />
      
      {/* User Account Pages */}
      <Route
        path="/perfil"
        element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/favoritos"
        element={
          <ProtectedRoute>
            <UserFavoritesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/seguidores"
        element={
          <ProtectedRoute>
            <FollowersPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/siguiendo"
        element={
          <ProtectedRoute>
            <FollowingPage />
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

      <Route path="*" element={<PlaceholderPage title="Página no encontrada" />} />
    </Routes>
  );
}
