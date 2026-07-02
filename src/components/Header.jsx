import { Link, NavLink } from 'react-router-dom';
import { BookOpen, ChevronDown, Feather, Heart, LayoutDashboard, LogOut, Menu, Moon, PenLine, Search, Settings, Shield, Sun, UserRound, Users, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const THEME_KEY = 'rdp_theme';

function getInitials(user) {
  const source = user?.displayName || user?.loginName || 'U';
  return source.split(/\s+/).map((part) => part[0]).join('').slice(0, 2).toUpperCase();
}

function isStaff(user) {
  const level = String(user?.accessLevel || user?.role || '').toLowerCase();
  return ['admin', 'administrator', 'moderator', 'moderador'].includes(level);
}

function isAdmin(user) {
  const level = String(user?.accessLevel || user?.role || '').toLowerCase();
  return ['admin', 'administrator'].includes(level);
}

function ThemeMenuButton() {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_KEY) || 'light');
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return (
    <button className="dropdown-item" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
      <span>{theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>
    </button>
  );
}

function NavItems({ isAuthenticated, staff, admin, onNavigate }) {
  return (
    <>
      <NavLink to="/" end onClick={onNavigate}><Search size={16} /> Explorar historias</NavLink>
      <NavLink to="/autores" onClick={onNavigate}><Users size={16} /> Autores</NavLink>
      {isAuthenticated && <NavLink to="/comunidad" onClick={onNavigate}><BookOpen size={16} /> Comunidad</NavLink>}
      {isAuthenticated && <NavLink to="/mis-historias" onClick={onNavigate}><Feather size={16} /> Mis historias</NavLink>}
      {staff && <NavLink className="staff-link" to={admin ? '/admin' : '/moderacion'} onClick={onNavigate}><Shield size={15} /> {admin ? 'Panel admin' : 'Moderación'}</NavLink>}
    </>
  );
}

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const staff = isStaff(user);
  const admin = isAdmin(user);

  useEffect(() => {
    function handleClick(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) setProfileOpen(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleLogout() {
    setProfileOpen(false);
    setMenuOpen(false);
    await logout();
  }

  return (
    <header className="site-header">
      <Link to="/" className="brand" aria-label="Inicio de Raíz de Palabras" onClick={() => setMenuOpen(false)}>
        <span className="brand-mark"><Feather size={22} /></span>
        <span><strong>Raíz de Palabras</strong><small>Lectura · Escritura · Mundos</small></span>
      </Link>

      <nav className="nav-links desktop-nav" aria-label="Navegación principal">
        <NavItems isAuthenticated={isAuthenticated} staff={staff} admin={admin} />
      </nav>

      <div className="header-actions">
        {!isAuthenticated ? (
          <>
            <Link className="btn ghost hide-mobile" to="/acceso">Iniciar sesión</Link>
            <Link className="btn primary hide-mobile" to="/acceso?modo=registro">Comenzar a escribir</Link>
          </>
        ) : (
          <>
            <Link className="btn primary write-btn hide-mobile" to="/escribir"><PenLine size={16} /> Escribir</Link>
            <div className="profile-menu" ref={profileRef}>
              <button className="avatar-button" onClick={() => setProfileOpen((open) => !open)} aria-expanded={profileOpen} aria-haspopup="menu">
                {user?.avatarUrl ? <img src={user.avatarUrl} alt="" /> : <span>{getInitials(user)}</span>}
                <ChevronDown size={15} />
              </button>
              {profileOpen && (
                <div className="profile-dropdown" role="menu">
                  <div className="dropdown-user"><strong>{user?.displayName || user?.loginName || 'Usuario'}</strong><small>{user?.accessLevel || 'lector'}</small></div>
                  <Link className="dropdown-item" to="/mi-perfil" onClick={() => setProfileOpen(false)}><UserRound size={17} /> Mi perfil</Link>
                  <Link className="dropdown-item" to="/mis-historias" onClick={() => setProfileOpen(false)}><Feather size={17} /> Mis historias</Link>
                  <Link className="dropdown-item" to="/favoritos" onClick={() => setProfileOpen(false)}><Heart size={17} /> Favoritos</Link>
                  <Link className="dropdown-item" to="/siguiendo" onClick={() => setProfileOpen(false)}><Users size={17} /> Siguiendo</Link>
                  <Link className="dropdown-item" to="/escribir" onClick={() => setProfileOpen(false)}><PenLine size={17} /> Escribir</Link>
                  <Link className="dropdown-item" to="/dashboard" onClick={() => setProfileOpen(false)}><LayoutDashboard size={17} /> Dashboard</Link>
                  <Link className="dropdown-item" to="/configuracion" onClick={() => setProfileOpen(false)}><Settings size={17} /> Configuración</Link>
                  <ThemeMenuButton />
                  {staff && <Link className="dropdown-item muted" to={admin ? '/admin' : '/moderacion'} onClick={() => setProfileOpen(false)}><Shield size={17} /> {admin ? 'Panel admin' : 'Moderación'}</Link>}
                  <button className="dropdown-item danger" onClick={handleLogout}><LogOut size={17} /> Cerrar sesión</button>
                </div>
              )}
            </div>
          </>
        )}
        <button className="mobile-menu-button" onClick={() => setMenuOpen((open) => !open)} aria-label="Abrir menú de navegación" aria-expanded={menuOpen}>
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>

      {menuOpen && (
        <div className="mobile-nav-panel">
          <nav className="nav-links mobile-nav" aria-label="Navegación móvil">
            <NavItems isAuthenticated={isAuthenticated} staff={staff} admin={admin} onNavigate={() => setMenuOpen(false)} />
          </nav>
          <div className="mobile-actions">
            {!isAuthenticated ? (
              <>
                <Link className="btn ghost" to="/acceso" onClick={() => setMenuOpen(false)}>Iniciar sesión</Link>
                <Link className="btn primary" to="/acceso?modo=registro" onClick={() => setMenuOpen(false)}>Comenzar a escribir</Link>
              </>
            ) : (
              <>
                <Link className="btn primary" to="/escribir" onClick={() => setMenuOpen(false)}><PenLine size={16} /> Escribir</Link>
                <Link className="btn soft" to="/mis-historias" onClick={() => setMenuOpen(false)}>Mis historias</Link><Link className="btn soft" to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
