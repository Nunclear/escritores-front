import { BookOpen, Feather, Menu, X } from "lucide-react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import EditorialButton from "../ui/EditorialButton";
import UserAvatarMenu from "../ui/UserAvatarMenu";
import { useAuth } from "../../context/AuthContext";

export default function PublicNavbar() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  const navLinkClass = ({ isActive }) =>
    [
      "text-sm font-medium transition hover:text-[var(--color-brown)]",
      isActive
        ? "text-[var(--color-brown)]"
        : "text-[var(--color-muted)]",
    ].join(" ");

  return (
    <header className="sticky top-0 z-40 px-4 py-4">
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-[28px] border border-[var(--color-border)] bg-[rgba(255,254,251,0.88)] px-5 py-3 shadow-[var(--shadow-soft)] backdrop-blur-md md:px-8">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl text-[var(--color-brown)]">
            <BookOpen size={31} strokeWidth={1.8} />
          </span>
          <span className="font-serif text-3xl font-bold tracking-tight text-[var(--color-text)]">
            Escritores
          </span>
        </Link>

        <nav className="hidden items-center gap-10 md:flex">
          <NavLink to="/explorar" className={navLinkClass}>
            Explorar historias
          </NavLink>

          {!isAuthenticated ? (
            <NavLink to="/autores" className={navLinkClass}>
              Autores
            </NavLink>
          ) : null}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="rounded-full px-5 py-3 text-sm font-semibold text-[var(--color-muted)] transition hover:bg-[var(--color-secondary-surface)] hover:text-[var(--color-brown)]"
              >
                Iniciar sesión
              </Link>

              <EditorialButton
                as={Link}
                onClick={() => navigate("/registro")}
                iconRight={Feather}
              >
                Comenzar a escribir
              </EditorialButton>
            </>
          ) : (
            <UserAvatarMenu user={user} onLogout={handleLogout} />
          )}
        </div>

        <button
          type="button"
          onClick={() => setIsMobileOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--color-border)] text-[var(--color-brown)] md:hidden"
          aria-label="Abrir navegación"
        >
          {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {isMobileOpen ? (
        <div className="mx-auto mt-3 max-w-7xl rounded-[28px] border border-[var(--color-border)] bg-[var(--color-surface)] p-4 shadow-[var(--shadow-warm)] md:hidden">
          <div className="flex flex-col gap-2">
            <NavLink
              to="/explorar"
              onClick={() => setIsMobileOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--color-muted)] hover:bg-[var(--color-secondary-surface)]"
            >
              Explorar historias
            </NavLink>

            {!isAuthenticated ? (
              <>
                <NavLink
                  to="/autores"
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--color-muted)] hover:bg-[var(--color-secondary-surface)]"
                >
                  Autores
                </NavLink>

                <NavLink
                  to="/login"
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--color-muted)] hover:bg-[var(--color-secondary-surface)]"
                >
                  Iniciar sesión
                </NavLink>

                <EditorialButton
                  className="mt-2 w-full"
                  iconRight={Feather}
                  onClick={() => {
                    setIsMobileOpen(false);
                    navigate("/registro");
                  }}
                >
                  Comenzar a escribir
                </EditorialButton>
              </>
            ) : (
              <>
                <Link
                  to="/perfil"
                  onClick={() => setIsMobileOpen(false)}
                  className="rounded-2xl px-4 py-3 text-sm font-semibold text-[var(--color-muted)] hover:bg-[var(--color-secondary-surface)]"
                >
                  Perfil
                </Link>

                <EditorialButton
                  variant="secondary"
                  className="mt-2 w-full"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </EditorialButton>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  );
}