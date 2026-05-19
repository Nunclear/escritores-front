import { BookOpen, Feather, ShieldCheck, Sparkles, Star, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../../components/layout/PublicNavbar";
import EditorialButton from "../../components/ui/EditorialButton";
import { useAuth } from "../../context/AuthContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen overflow-hidden bg-[var(--color-bg)]">
      <PublicNavbar />

      <main className="relative mx-auto max-w-7xl px-5 pb-16 pt-8 md:px-8">
        <div className="pointer-events-none absolute -left-24 top-24 h-80 w-80 rounded-full bg-[#e9ddca]/60 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-40 h-96 w-96 rounded-full bg-[#f2e8d9]/80 blur-3xl" />

        <section className="relative grid items-center gap-12 py-10 lg:grid-cols-[1fr_0.95fr]">
          <div>
            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-[var(--color-sand)] bg-[rgba(255,254,251,0.72)] px-5 py-3 text-sm font-semibold text-[var(--color-brown)]">
              <Sparkles size={17} />
              La plataforma para escritores creativos
            </div>

            <h1 className="max-w-3xl font-serif text-5xl font-black leading-[0.95] tracking-tight text-[var(--color-text)] md:text-7xl">
              Escribe, comparte y descubre historias
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
              Una comunidad literaria premium donde escritores y lectores se
              encuentran. Crea mundos narrativos, gestiona personajes y conecta
              con personas que viven para las historias.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <EditorialButton
                iconLeft={Feather}
                onClick={() => navigate(isAuthenticated ? "/app" : "/registro")}
                className="px-8"
              >
                Comenzar a escribir
              </EditorialButton>

              <EditorialButton
                variant="secondary"
                onClick={() => navigate("/explorar")}
                className="px-8"
              >
                Explorar historias
              </EditorialButton>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <FeaturePill icon={Users} label="Comunidad activa" />
              <FeaturePill icon={BookOpen} label="Historias destacadas" />
              <FeaturePill icon={ShieldCheck} label="Privado y seguro" />
              <FeaturePill icon={Star} label="Hecho para escritores" />
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-8 -top-8 h-40 w-40 rounded-full bg-[var(--color-light-accent)]" />
            <div className="absolute -right-8 top-0 h-48 w-48 rounded-full bg-[#ead9c4]" />

            <div className="relative overflow-hidden rounded-[44px] border border-[var(--color-border)] bg-[#2b1d14] p-5 shadow-[var(--shadow-warm)]">
              <div className="min-h-[420px] rounded-[34px] bg-[linear-gradient(135deg,#1e1a16,#5d3b25)] p-8 text-white">
                <div className="max-w-xs rounded-[26px] border border-[#c49a6c]/60 bg-black/25 p-7 backdrop-blur">
                  <p className="font-serif text-5xl text-[var(--color-sand)]">
                    “
                  </p>
                  <p className="mt-2 font-serif text-2xl leading-9">
                    Toda gran historia comienza con alguien que decide
                    escribirla.
                  </p>
                  <div className="mt-6 h-px w-20 bg-[var(--color-sand)]" />
                </div>

                <div className="mt-20 rounded-[30px] border border-white/10 bg-white/10 p-6 backdrop-blur">
                  <p className="text-sm uppercase tracking-[0.25em] text-[#e8d7c3]">
                    Manuscrito abierto
                  </p>
                  <h2 className="mt-3 font-serif text-4xl font-bold">
                    Bajo la misma luna
                  </h2>
                  <p className="mt-3 max-w-md text-[#e9ded3]">
                    Una noche, dos desconocidos y un secreto que cambiará sus
                    destinos para siempre.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="relative grid gap-6 lg:grid-cols-2">
          <article className="rounded-[30px] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-3 text-[var(--color-premium)]">
              <Star size={20} fill="currentColor" />
              <span className="font-semibold">Historia destacada</span>
            </div>

            <h2 className="mt-4 font-serif text-3xl font-bold text-[var(--color-text)]">
              Bajo la misma luna
            </h2>

            <p className="mt-3 text-[var(--color-muted)]">
              Una noche, dos desconocidos y un secreto que cambiará sus destinos
              para siempre.
            </p>

            <div className="mt-7 flex items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-[var(--color-text)]">
                  Por Valeria Montejo
                </p>
                <p className="text-sm text-[var(--color-muted)]">
                  Novela · 12 capítulos
                </p>
              </div>

              <EditorialButton variant="secondary">Leer ahora</EditorialButton>
            </div>
          </article>

          <article className="rounded-[30px] border border-[var(--color-border)] bg-[var(--color-surface)] p-7 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-3 text-[var(--color-success)]">
              <Users size={20} />
              <span className="font-semibold">Comunidad que inspira</span>
            </div>

            <h2 className="mt-4 font-serif text-3xl font-bold text-[var(--color-text)]">
              Conecta. Colabora. Crece.
            </h2>

            <p className="mt-3 max-w-xl text-[var(--color-muted)]">
              Únete a miles de escritores y lectores que comparten su pasión por
              las historias cada día.
            </p>

            <div className="mt-7 flex items-center gap-3">
              {["A", "M", "R", "L"].map((item) => (
                <span
                  key={item}
                  className="-ml-1 flex h-10 w-10 items-center justify-center rounded-full border-2 border-[var(--color-surface)] bg-[var(--color-light-accent)] font-bold text-[var(--color-brown)]"
                >
                  {item}
                </span>
              ))}
              <span className="ml-2 rounded-full bg-[var(--color-light-accent)] px-4 py-2 text-sm font-semibold text-[var(--color-brown)]">
                +1.2k
              </span>
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}

function FeaturePill({ icon: Icon, label }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[rgba(255,254,251,0.75)] px-4 py-3 text-sm font-semibold text-[var(--color-muted)] shadow-sm">
      <Icon size={18} className="text-[var(--color-brown)]" />
      {label}
    </div>
  );
}