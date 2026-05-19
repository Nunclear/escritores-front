import { useEffect, useRef, useState } from "react";
import { LogOut, UserRound } from "lucide-react";
import { Link } from "react-router-dom";

export default function UserAvatarMenu({ user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const displayName = user?.displayName || user?.loginName || "Usuario";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    function handleClickOutside(event) {
      if (!menuRef.current?.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-label="Abrir menú de usuario"
        className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full border border-[var(--color-sand)] bg-[var(--color-light-accent)] text-sm font-bold text-[var(--color-brown)] shadow-sm transition hover:scale-[1.03]"
      >
        {user?.avatarUrl ? (
          <img
            src={user.avatarUrl}
            alt={displayName}
            className="h-full w-full object-cover"
          />
        ) : (
          initials
        )}
      </button>

      {isOpen ? (
        <div className="absolute right-0 z-50 mt-3 w-56 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2 shadow-[var(--shadow-warm)]">
          <div className="border-b border-[var(--color-border)] px-4 py-3">
            <p className="font-serif text-lg font-bold text-[var(--color-text)]">
              {displayName}
            </p>
            {user?.loginName ? (
              <p className="text-sm text-[var(--color-muted)]">
                @{user.loginName}
              </p>
            ) : null}
          </div>

          <Link
            to="/perfil"
            onClick={() => setIsOpen(false)}
            className="mt-2 flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-secondary-surface)]"
          >
            <UserRound size={17} />
            Perfil
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-[var(--color-danger)] transition hover:bg-[#f7e8e8]"
          >
            <LogOut size={17} />
            Cerrar sesión
          </button>
        </div>
      ) : null}
    </div>
  );
}