import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { SeverityBadge, TEMA_DOT, TEMA_TEXT } from "@/components/SeverityBadge";
import {
  GraficoBairros,
  GraficoServicos,
  ResumoConflitos,
} from "@/components/DashboardCharts";
import { usePerfil } from "@/lib/perfil-context";
import { ALERTAS, FROTA, INDICADORES, PONTOS, TEMAS, type Tema } from "@/lib/ilha-data";
import { ArrowDownRight, ArrowUpRight, CalendarDays, MapPinned, MessageSquareText } from "lucide-react";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Visão geral | Ilha Inteligente — Recife" },
      {
        name: "description",
        content:
          "Painel simples para quem cuida da cidade: enchente, calor, árvores e prédios históricos na Ilha do Recife.",
      },
      { property: "og:title", content: "Visão geral | Ilha Inteligente — Recife" },
      {
        property: "og:description",
        content:
          "Veja o que precisa de atenção hoje na Ilha do Recife e teste melhorias antes de fazer a obra.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const { perfil } = usePerfil();
  const ordem = perfil.temasPrioritarios;

  const indicadores = [...INDICADORES].sort(
    (a, b) => ordem.indexOf(a.tema) - ordem.indexOf(b.tema),
  );
  const destaque = ordem[0];
  const alertas = [...ALERTAS].sort((a, b) => ordem.indexOf(a.tema) - ordem.indexOf(b.tema));

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="label-inst">{perfil.secretaria}</p>
          <h1 className="mt-1 text-2xl font-semibold">O que precisa de atenção hoje</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            APIs e sensores trazem os dados. A plataforma organiza tudo nesta tela.
            Para o seu setor, aparece primeiro o tema{" "}
            <span className={TEMA_TEXT[destaque]}>{TEMAS[destaque].nome.toLowerCase()}</span>.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/mapa"
            className="inline-flex items-center gap-2 rounded-sm bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <MapPinned className="size-4" /> Ver no mapa
          </Link>
          <Link
            to="/calendario"
            className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <CalendarDays className="size-4" /> Ver calendário
          </Link>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 rounded-sm border border-border bg-card px-3.5 py-2 text-sm font-medium transition-colors hover:bg-secondary"
          >
            <MessageSquareText className="size-4" /> Perguntar ao assistente
          </Link>


        </div>
      </div>

      <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {indicadores.map((ind, i) => (
          <article
            key={ind.tema}
            className={`rounded-md border bg-card p-4 shadow-panel ${
              i === 0 ? "border-primary/40 ring-1 ring-primary/15" : "border-border"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.07em] text-muted-foreground">
                <span className={`size-2 rounded-full ${TEMA_DOT[ind.tema]}`} />
                {ind.titulo}
              </span>
              <SeverityBadge severidade={ind.severidade} />
            </div>
            <p className="mt-3 text-3xl font-semibold tracking-tight">{ind.valor}</p>
            <p className="mt-1 text-sm text-muted-foreground">{ind.descricao}</p>
            <p className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
              {ind.variacao >= 0 ? (
                <ArrowUpRight className="size-3.5" />
              ) : (
                <ArrowDownRight className="size-3.5" />
              )}
              {Math.abs(ind.variacao)}% em relação à semana passada
            </p>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr_0.7fr]">
        <GraficoBairros />
        <GraficoServicos />
        <ResumoConflitos />
      </section>



      <div className="mt-6 grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <section className="rounded-md border border-border bg-card shadow-panel">
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Avisos recentes</h2>
            <span className="label-inst">primeiro o do seu setor</span>
          </header>
          <ul className="divide-y divide-border">
            {alertas.map((a) => (
              <li key={a.id} className="flex gap-3 px-4 py-3.5">
                <span className={`mt-1.5 size-2 shrink-0 rounded-full ${TEMA_DOT[a.tema]}`} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-sm font-medium">{a.titulo}</h3>
                    <SeverityBadge severidade={a.severidade} />
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">{a.corpo}</p>
                  <p className="mt-1.5 text-xs text-muted-foreground">
                    {a.local} · {TEMAS[a.tema].nome} · {a.quando}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <div className="space-y-5">
          <section className="rounded-md border border-border bg-card shadow-panel">
            <header className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold">Quem coleta os dados</h2>
            </header>
            <ul className="divide-y divide-border">
              {FROTA.map((f) => (
                <li key={f.tipo} className="px-4 py-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-sm font-medium">{f.tipo}</span>
                    <span className="font-mono text-sm">{f.ativos}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {f.cobertura} · última passagem {f.ultimaColeta}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-md border border-border bg-card shadow-panel">
            <header className="border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold">
                Lugares que precisam de atenção — {TEMAS[destaque].nome}
              </h2>
            </header>
            <ul className="divide-y divide-border">
              {PONTOS.filter((p) => p.tema === destaque)
                .sort((a, b) => (a.severidade === "critico" ? -1 : 1))
                .slice(0, 4)
                .map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">{p.nome}</p>
                      <p className="text-xs text-muted-foreground">{p.bairro}</p>
                    </div>
                    <SeverityBadge severidade={p.severidade} />
                  </li>
                ))}
            </ul>
          </section>
        </div>
      </div>
    </AppShell>
  );
}
