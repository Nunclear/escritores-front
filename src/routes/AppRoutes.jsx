import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/public/HomePage";
import LoginPage from "../pages/public/LoginPage";
import RegisterPage from "../pages/public/RegisterPage";
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

      <Route path="/explorar" element={<PlaceholderPage title="Explorar historias" />} />
      <Route path="/autores" element={<PlaceholderPage title="Autores" />} />
      <Route path="/perfil" element={<PlaceholderPage title="Perfil" />} />
      <Route path="/app" element={<PlaceholderPage title="Mesa de trabajo" />} />

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