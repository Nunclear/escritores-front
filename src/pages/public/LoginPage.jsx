import { useState } from "react";
import { BookOpen, Feather } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PublicNavbar from "../../components/layout/PublicNavbar";
import EditorialButton from "../../components/ui/EditorialButton";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    loginOrEmail: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(form);
      navigate("/");
    } catch (err) {
      setError(err.message || "No pudimos iniciar sesión.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <PublicNavbar />

      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[34px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-soft)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-light-accent)] text-[var(--color-brown)]">
            <BookOpen size={30} />
          </div>

          <h1 className="mt-6 font-serif text-5xl font-black leading-tight text-[var(--color-text)]">
            Vuelve a tu mesa de escritura
          </h1>

          <p className="mt-5 text-lg leading-8 text-[var(--color-muted)]">
            Inicia sesión para continuar tus manuscritos, descubrir nuevas
            historias y cuidar tu biblioteca creativa.
          </p>
        </section>

        <section className="rounded-[34px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-warm)]">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-brown)]">
            Iniciar sesión
          </p>

          <h2 className="mt-3 font-serif text-4xl font-bold text-[var(--color-text)]">
            Entra al taller
          </h2>

          {error ? (
            <div className="mt-5 rounded-2xl border border-[#e5b7b7] bg-[#fff1f1] px-4 py-3 text-sm font-medium text-[var(--color-danger)]">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label className="text-sm font-semibold text-[var(--color-text)]">
                Usuario o correo
              </label>
              <input
                name="loginOrEmail"
                value={form.loginOrEmail}
                onChange={updateField}
                required
                placeholder="usuario1 o usuario@example.com"
                className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-secondary-surface)] px-4 py-3 outline-none transition focus:border-[var(--color-sand)] focus:ring-2 focus:ring-[var(--color-light-accent)]"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-[var(--color-text)]">
                Contraseña
              </label>
              <input
                name="password"
                value={form.password}
                onChange={updateField}
                type="password"
                required
                placeholder="Tu contraseña"
                className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-secondary-surface)] px-4 py-3 outline-none transition focus:border-[var(--color-sand)] focus:ring-2 focus:ring-[var(--color-light-accent)]"
              />
            </div>

            <EditorialButton
              type="submit"
              isLoading={isLoading}
              iconRight={Feather}
              className="w-full"
            >
              Iniciar sesión
            </EditorialButton>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
            ¿Aún no tienes cuenta?{" "}
            <Link
              to="/registro"
              className="font-bold text-[var(--color-brown)] hover:underline"
            >
              Comienza a escribir
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}