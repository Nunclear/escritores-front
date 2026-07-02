import { Navigate, Route, Routes } from 'react-router-dom';
import Shell from './components/Shell';
import Home from './pages/Home';
import Explore from './pages/Explore';
import StoryCover from './pages/StoryCover';
import Reader from './pages/Reader';
import AuthPage from './pages/AuthPage';
import WriterStudio from './pages/WriterStudio';
import Dashboard from './pages/Dashboard';
import WriterPanel from './pages/WriterPanel';
import AuthorProfile from './pages/AuthorProfile';
import Authors from './pages/Authors';
import Community from './pages/Community';
import MyStories from './pages/MyStories';
import Favorites from './pages/Favorites';
import Following from './pages/Following';
import ProfileSettings from './pages/ProfileSettings';
import AccountSettings from './pages/AccountSettings';
import QuickWrite from './pages/QuickWrite';
import StoryEditor from './pages/StoryEditor';
import Moderation from './pages/Moderation';
import AdminPanel from './pages/AdminPanel';
import { useAuth } from './context/AuthContext';

function Protected({ children }) {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <section className="page"><div className="state-block"><span className="spinner" /> Validando sesión...</div></section>;
  return isAuthenticated ? children : <Navigate to="/acceso" replace />;
}

function StaffOnly({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const level = String(user?.accessLevel || user?.role || '').toLowerCase();
  const staff = ['admin', 'administrator', 'moderator', 'moderador'].includes(level);
  if (loading) return <section className="page"><div className="state-block"><span className="spinner" /> Validando permisos...</div></section>;
  if (!isAuthenticated) return <Navigate to="/acceso" replace />;
  return staff ? children : <Navigate to="/dashboard" replace />;
}

function AdminOnly({ children }) {
  const { user, isAuthenticated, loading } = useAuth();
  const level = String(user?.accessLevel || user?.role || '').toLowerCase();
  const admin = ['admin', 'administrator'].includes(level);
  if (loading) return <section className="page"><div className="state-block"><span className="spinner" /> Validando permisos...</div></section>;
  if (!isAuthenticated) return <Navigate to="/acceso" replace />;
  return admin ? children : <Navigate to="/moderacion" replace />;
}

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explorar" element={<Explore />} />
        <Route path="/autores" element={<Authors />} />
        <Route path="/comunidad" element={<Community />} />
        <Route path="/mis-historias" element={<Protected><WriterPanel /></Protected>} />
        <Route path="/historia/:storyId" element={<StoryCover />} />
        <Route path="/leer/:storyId/capitulo/:chapterId" element={<Reader />} />
        <Route path="/autor/:authorId" element={<AuthorProfile />} />
        <Route path="/acceso" element={<AuthPage />} />
        <Route path="/escritor" element={<Protected><WriterPanel /></Protected>} />
        <Route path="/escribir" element={<Protected><QuickWrite /></Protected>} />
        <Route path="/editor/:storyId" element={<Protected><StoryEditor /></Protected>} />
        <Route path="/mi-perfil" element={<Protected><ProfileSettings /></Protected>} />
        <Route path="/favoritos" element={<Protected><Favorites /></Protected>} />
        <Route path="/siguiendo" element={<Protected><Following /></Protected>} />
        <Route path="/configuracion" element={<Protected><AccountSettings /></Protected>} />
        <Route path="/dashboard" element={<Protected><WriterPanel /></Protected>} />
        <Route path="/moderacion" element={<StaffOnly><Moderation /></StaffOnly>} />
        <Route path="/admin" element={<AdminOnly><AdminPanel /></AdminOnly>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Shell>
  );
}
