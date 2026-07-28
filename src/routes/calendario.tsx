import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { SeverityBadge, TEMA_DOT } from "@/components/SeverityBadge";
import { usePerfil } from "@/lib/perfil-context";
import { TEMAS } from "@/lib/ilha-data";
import {
  CONFLITOS,
  MES_REFERENCIA,
  SERVICOS,
  TIPO_CONFLITO_LABEL,
  conflitosDoServico,
  diasDoServico,
  servicoPorId,
  servicosNoDia,
  type Conflito,
  type TipoConflito,
} from "@/lib/agenda-data";
import { CalendarClock, Layers, RefreshCcw, Sparkles, TriangleAlert } from "lucide-react";

export const Route = createFileRoute("/calendario")({
  head: () => ({
    meta: [
      { title: "Calendário de serviços | Ilha Inteligente — Recife" },
      {
        name: "description",
        content:
          "Agenda de obras e serviços na Ilha do Recife com conflitos detectados pelo copiloto de IA: remarcar, executar em conjunto ou monitorar.",
      },
      { property: "og:title", content: "Calendário de serviços | Ilha Inteligente — Recife" },
      {
        property: "og:description",
        content:
          "Planejamento integrado de intervenções urbanas com detecção automática de sobreposições.",
      },
    ],
  }),
  component: CalendarioPage,
});

const TIPO_ICON: Record<TipoConflito, typeof RefreshCcw> = {
  remarcar: RefreshCcw,
  agrupar: Layers,
  monitorar: TriangleAlert,
};

const TIPO_CLASS: Record<TipoConflito, string> = {
  remarcar: "bg-critico/10 text-critico border-critico/30",
  agrupar: "bg-baixo/12 text-baixo border-baixo/35",
  monitorar: "bg-moderado/14 text-moderado border-moderado/40",
};

const STATUS_LABEL = {
  confirmado: "Confirmado",
  previsto: "Previsto",
  "em-revisao": "Em revisão",
} as const;

const SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MESES = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

function CalendarioPage() {
  const { perfil } = usePerfil();
  const [diaSelecionado, setDiaSelecionado] = useState<number | null>(11);
  const [conflitoAberto, setConflitoAberto] = useState<string | null>(CONFLITOS[0]?.id ?? null);

  const { ano, mes } = MES_REFERENCIA;
  const primeiroDiaSemana = new Date(ano, mes, 1).getDay();
  const diasNoMes = new Date(ano, mes + 1, 0).getDate();

  const celulas = useMemo(() => {
    const arr: (number | null)[] = Array.from({ length: primeiroDiaSemana }, () => null);
    for (let d = 1; d <= diasNoMes; d++) arr.push(d);
    while (arr.length % 7 !== 0) arr.push(null);
    return arr;
  }, [primeiroDiaSemana, diasNoMes]);

  const diasEmConflito = useMemo(() => {
    const set = new Set<number>();
    for (const c of CONFLITOS) {
      for (const sid of c.servicos) {
        const s = servicoPorId(sid);
        if (s) diasDoServico(s).forEach((d) => set.add(d));
      }
    }
    return set;
  }, []);

  const conflitosOrdenados = useMemo(
    () =>
      [...CONFLITOS].sort((a, b) => {
        const prio = (c: Conflito) =>
          perfil.temasPrioritarios.indexOf(
            servicoPorId(c.servicos[0])?.tema ?? "alagamento",
          );
        return prio(a) - prio(b);
      }),
    [perfil],
  );

  const servicosDoDia = diaSelecionado ? servicosNoDia(diaSelecionado) : [];

  return (
    <AppShell>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-border pb-5">
        <div>
          <p className="label-inst">{perfil.secretaria}</p>
          <h1 className="mt-1 text-2xl font-semibold">Calendário integrado de serviços</h1>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
            Agenda de obras e eventos na ilha, analisada pelo copiloto de IA para identificar
            sobreposições e sugerir remarcação ou execução conjunta, reduzindo o distúrbio à
            população.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-sm border border-primary/30 bg-primary/5 px-3.5 py-2 text-sm">
          <Sparkles className="size-4 text-primary" />
          <span>
            <span className="font-semibold">{CONFLITOS.length} conflitos</span> detectados pelo
            copiloto
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-5 xl:grid-cols-[1.35fr_1fr]">
        {/* Calendário */}
        <section className="rounded-md border border-border bg-card shadow-panel">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
            <h2 className="flex items-center gap-2 text-sm font-semibold">
              <CalendarClock className="size-4 text-muted-foreground" />
              {MESES[mes]} de {ano}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-muted-foreground">
              {(Object.keys(TEMAS) as (keyof typeof TEMAS)[]).map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <span className={`size-2 rounded-full ${TEMA_DOT[t]}`} />
                  {TEMAS[t].nome}
                </span>
              ))}
            </div>
          </header>

          <div className="grid grid-cols-7 border-b border-border bg-secondary/40">
            {SEMANA.map((d) => (
              <span
                key={d}
                className="px-2 py-2 text-center text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground"
              >
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {celulas.map((dia, i) => {
              if (dia === null)
                return <div key={`v-${i}`} className="min-h-[92px] border-b border-r border-border/60 bg-secondary/20" />;
              const servicos = servicosNoDia(dia);
              const emConflito = diasEmConflito.has(dia) && servicos.length > 1;
              const ativo = diaSelecionado === dia;
              return (
                <button
                  key={dia}
                  onClick={() => setDiaSelecionado(dia)}
                  className={`min-h-[92px] border-b border-r border-border/60 p-1.5 text-left transition-colors hover:bg-secondary/60 ${
                    ativo ? "bg-primary/8 ring-1 ring-inset ring-primary/40" : ""
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">
                      {String(dia).padStart(2, "0")}
                    </span>
                    {emConflito && <TriangleAlert className="size-3 text-critico" />}
                  </span>
                  <span className="mt-1 flex flex-col gap-1">
                    {servicos.slice(0, 3).map((s) => (
                      <span
                        key={s.id}
                        className="flex items-center gap-1 truncate rounded-[3px] bg-secondary px-1 py-0.5 text-[10px] leading-tight"
                      >
                        <span className={`size-1.5 shrink-0 rounded-full ${TEMA_DOT[s.tema]}`} />
                        <span className="truncate">{s.titulo}</span>
                      </span>
                    ))}
                    {servicos.length > 3 && (
                      <span className="text-[10px] text-muted-foreground">
                        +{servicos.length - 3}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-border px-4 py-3.5">
            <h3 className="text-sm font-semibold">
              {diaSelecionado
                ? `${String(diaSelecionado).padStart(2, "0")} de ${MESES[mes]} · ${servicosDoDia.length} serviço(s)`
                : "Selecione um dia"}
            </h3>
            <ul className="mt-2 space-y-2">
              {servicosDoDia.map((s) => {
                const confs = conflitosDoServico(s.id);
                return (
                  <li key={s.id} className="rounded-sm border border-border bg-background p-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`size-2 rounded-full ${TEMA_DOT[s.tema]}`} />
                      <span className="text-sm font-medium">{s.titulo}</span>
                      <span className="rounded-[3px] border border-border px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {STATUS_LABEL[s.status]}
                      </span>
                      {confs.map((c) => (
                        <span
                          key={c.id}
                          className={`rounded-[3px] border px-1.5 py-0.5 text-[10px] font-medium ${TIPO_CLASS[c.tipo]}`}
                        >
                          {TIPO_CONFLITO_LABEL[c.tipo]}
                        </span>
                      ))}
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {s.local} · {s.orgao} · {s.impactoVia}
                    </p>
                  </li>
                );
              })}
              {!servicosDoDia.length && (
                <li className="text-sm text-muted-foreground">Nenhum serviço agendado neste dia.</li>
              )}
            </ul>
          </div>
        </section>

        {/* Recomendações do copiloto */}
        <section className="rounded-md border border-border bg-card shadow-panel">
          <header className="flex items-center justify-between border-b border-border px-4 py-3">
            <h2 className="text-sm font-semibold">Recomendações do copiloto</h2>
            <span className="label-inst">priorizadas por perfil</span>
          </header>
          <ul className="divide-y divide-border">
            {conflitosOrdenados.map((c) => {
              const Icon = TIPO_ICON[c.tipo];
              const aberto = conflitoAberto === c.id;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => setConflitoAberto(aberto ? null : c.id)}
                    className="flex w-full gap-3 px-4 py-3.5 text-left transition-colors hover:bg-secondary/50"
                  >
                    <span
                      className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-sm border ${TIPO_CLASS[c.tipo]}`}
                    >
                      <Icon className="size-3.5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-medium">
                          {TIPO_CONFLITO_LABEL[c.tipo]} — {c.janela}
                        </span>
                        <SeverityBadge severidade={c.severidade} />
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">{c.local}</span>
                      <span className="mt-1.5 block text-sm text-muted-foreground">
                        {c.servicos
                          .map((sid) => servicoPorId(sid)?.titulo)
                          .filter(Boolean)
                          .join("  ·  ")}
                      </span>
                    </span>
                  </button>
                  {aberto && (
                    <div className="space-y-3 border-t border-border/70 bg-background px-4 py-3.5 pl-[3.4rem]">
                      <div>
                        <p className="label-inst">Diagnóstico</p>
                        <p className="mt-1 text-sm text-muted-foreground">{c.diagnostico}</p>
                      </div>
                      <div>
                        <p className="label-inst">Recomendação</p>
                        <p className="mt-1 text-sm">{c.recomendacao}</p>
                      </div>
                      <p className="inline-flex rounded-sm bg-secondary px-2 py-1 text-xs text-muted-foreground">
                        {c.ganho}
                      </p>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          <footer className="border-t border-border px-4 py-3 text-xs text-muted-foreground">
            Análise gerada sobre {SERVICOS.length} serviços agendados por 4 órgãos. Dados fictícios
            de protótipo.
          </footer>
        </section>
      </div>
    </AppShell>
  );
}
