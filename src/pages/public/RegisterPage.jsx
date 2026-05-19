import { useState } from "react";
import { BookOpenCheck, Feather } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import PublicNavbar from "../../components/layout/PublicNavbar";
import EditorialButton from "../../components/ui/EditorialButton";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState({
    loginName: "",
    emailAddress: "",
    displayName: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function updateField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function validateForm() {
    if (!form.loginName.trim()) {
      return "Escribe un nombre de usuario.";
    }

    if (!form.emailAddress.trim()) {
      return "Escribe tu correo electrónico.";
    }

    if (!form.displayName.trim()) {
      return "Escribe el nombre que verán tus lectores.";
    }

    if (!form.password.trim()) {
      return "Escribe una contraseña.";
    }

    if (form.password.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres.";
    }

    return "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    const payload = {
      loginName: form.loginName.trim(),
      emailAddress: form.emailAddress.trim(),
      displayName: form.displayName.trim(),
      password: form.password,
    };

    console.log("REGISTER PAYLOAD:", payload);

    try {
      await register(payload);

      setSuccessMessage("Tu cuenta fue creada. Ya puedes iniciar sesión.");

      setTimeout(() => {
        navigate("/login");
      }, 900);
    } catch (err) {
      console.error("REGISTER ERROR:", err);

      if (err.status === 0) {
        setError(
          "No hay conexión con el backend. Verifica que Spring Boot esté corriendo en http://localhost:8080 y que CORS permita http://localhost:5173."
        );
      } else if (err.status === 400) {
        setError(err.message || "Los datos enviados no son válidos.");
      } else if (err.status === 409) {
        setError(
          err.message ||
            "Ese usuario o correo ya existe. Prueba con otros datos."
        );
      } else if (err.status === 422) {
        setError(
          err.message ||
            "No se pudo procesar el registro por una regla del servidor."
        );
      } else if (err.status >= 500) {
        setError(
          err.message ||
            "El servidor tuvo un problema al crear la cuenta."
        );
      } else {
        setError(err.message || "No pudimos crear tu cuenta.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <PublicNavbar />

      <main className="mx-auto grid max-w-6xl gap-10 px-5 py-12 md:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-[34px] border border-[var(--color-border)] bg-[linear-gradient(135deg,#fffefb,#faf6ef)] p-8 shadow-[var(--shadow-soft)]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--color-light-accent)] text-[var(--color-brown)]">
            <BookOpenCheck size={30} />
          </div>

          <h1 className="mt-6 font-serif text-5xl font-black leading-tight text-[var(--color-text)]">
            Abre tu biblioteca creativa
          </h1>

          <p className="mt-5 text-lg leading-8 text-[var(--color-muted)]">
            Crea una cuenta para publicar historias, organizar capítulos,
            construir personajes y compartir tu voz con nuevos lectores.
          </p>
        </section>

        <section className="rounded-[34px] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-warm)]">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[var(--color-brown)]">
            Registro
          </p>

          <h2 className="mt-3 font-serif text-4xl font-bold text-[var(--color-text)]">
            Comienza tu obra
          </h2>

          {error ? (
            <div className="mt-5 rounded-2xl border border-[#e5b7b7] bg-[#fff1f1] px-4 py-3 text-sm font-medium text-[var(--color-danger)]">
              {error}
            </div>
          ) : null}

          {successMessage ? (
            <div className="mt-5 rounded-2xl border border-[#b9d8c1] bg-[#f0fff3] px-4 py-3 text-sm font-medium text-[var(--color-success)]">
              {successMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label
                htmlFor="loginName"
                className="text-sm font-semibold text-[var(--color-text)]"
              >
                Nombre de usuario
              </label>

              <input
                id="loginName"
                name="loginName"
                value={form.loginName}
                onChange={updateField}
                required
                placeholder="usuario1"
                autoComplete="username"
                className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-secondary-surface)] px-4 py-3 outline-none transition focus:border-[var(--color-sand)] focus:ring-2 focus:ring-[var(--color-light-accent)]"
              />
            </div>

            <div>
              <label
                htmlFor="emailAddress"
                className="text-sm font-semibold text-[var(--color-text)]"
              >
                Correo electrónico
              </label>

              <input
                id="emailAddress"
                name="emailAddress"
                value={form.emailAddress}
                onChange={updateField}
                type="email"
                required
                placeholder="usuario@example.com"
                autoComplete="email"
                className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-secondary-surface)] px-4 py-3 outline-none transition focus:border-[var(--color-sand)] focus:ring-2 focus:ring-[var(--color-light-accent)]"
              />
            </div>

            <div>
              <label
                htmlFor="displayName"
                className="text-sm font-semibold text-[var(--color-text)]"
              >
                Nombre visible
              </label>

              <input
                id="displayName"
                name="displayName"
                value={form.displayName}
                onChange={updateField}
                required
                placeholder="Usuario Ejemplo"
                autoComplete="name"
                className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-secondary-surface)] px-4 py-3 outline-none transition focus:border-[var(--color-sand)] focus:ring-2 focus:ring-[var(--color-light-accent)]"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="text-sm font-semibold text-[var(--color-text)]"
              >
                Contraseña
              </label>

              <input
                id="password"
                name="password"
                value={form.password}
                onChange={updateField}
                type="password"
                required
                placeholder="Password123!"
                autoComplete="new-password"
                className="mt-2 w-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-secondary-surface)] px-4 py-3 outline-none transition focus:border-[var(--color-sand)] focus:ring-2 focus:ring-[var(--color-light-accent)]"
              />
            </div>

            <EditorialButton
              type="submit"
              isLoading={isLoading}
              iconRight={Feather}
              className="w-full"
            >
              Crear cuenta
            </EditorialButton>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--color-muted)]">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="font-bold text-[var(--color-brown)] hover:underline"
            >
              Iniciar sesión
            </Link>
          </p>
        </section>
      </main>
    </div>
  );
}