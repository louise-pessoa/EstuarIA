import { cn } from "@/lib/utils";
import { severidadeLabel, type Severidade, type Tema } from "@/lib/ilha-data";

const SEV_CLASS: Record<Severidade, string> = {
  critico: "bg-critico/12 text-critico border-critico/30",
  alto: "bg-alto/14 text-alto border-alto/35",
  moderado: "bg-moderado/16 text-moderado border-moderado/40",
  baixo: "bg-baixo/14 text-baixo border-baixo/35",
};

export function SeverityBadge({
  severidade,
  className,
}: {
  severidade: Severidade;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-[11px] font-semibold uppercase tracking-[0.06em]",
        SEV_CLASS[severidade],
        className,
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {severidadeLabel(severidade)}
    </span>
  );
}

export const TEMA_DOT: Record<Tema, string> = {
  alagamento: "bg-tema-alagamento",
  calor: "bg-tema-calor",
  arborizacao: "bg-tema-arborizacao",
  patrimonio: "bg-tema-patrimonio",
};

export const TEMA_TEXT: Record<Tema, string> = {
  alagamento: "text-tema-alagamento",
  calor: "text-tema-calor",
  arborizacao: "text-tema-arborizacao",
  patrimonio: "text-tema-patrimonio",
};

export const SEV_FILL: Record<Severidade, string> = {
  critico: "var(--critico)",
  alto: "var(--alto)",
  moderado: "var(--moderado)",
  baixo: "var(--baixo)",
};
