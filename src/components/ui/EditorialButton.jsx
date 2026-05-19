import { Loader2 } from "lucide-react";

const variants = {
  primary: "bg-[var(--color-brown)] text-white hover:bg-[#744a2e]",
  secondary:
    "bg-[var(--color-light-accent)] text-[var(--color-brown)] border border-[var(--color-sand)] hover:bg-[#ead9c4]",
  ghost:
    "bg-transparent text-[var(--color-muted)] hover:bg-[var(--color-secondary-surface)]",
  danger: "bg-[var(--color-danger)] text-white hover:bg-[#742d2d]",
};

export default function EditorialButton({
  children,
  variant = "primary",
  isLoading = false,
  disabled = false,
  className = "",
  type = "button",
  iconLeft: IconLeft,
  iconRight: IconRight,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={[
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition",
        "focus:outline-none focus:ring-2 focus:ring-[var(--color-sand)] focus:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {isLoading ? <Loader2 size={17} className="animate-spin" /> : null}
      {!isLoading && IconLeft ? <IconLeft size={17} /> : null}
      {children}
      {!isLoading && IconRight ? <IconRight size={17} /> : null}
    </button>
  );
}