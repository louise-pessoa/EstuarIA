import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { IlhaMap } from "@/components/IlhaMap";
import { SeverityBadge, TEMA_DOT } from "@/components/SeverityBadge";
import { usePerfil } from "@/lib/perfil-context";
import {
  INTERVENCOES,
  PONTOS,
  TEMAS,
  menorEhMelhor,
  simular,
  type Ponto,
  type Tema,
} from "@/lib/ilha-data";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

export const Route = createFileRoute("/mapa")({
  head: () => ({
    meta: [
      { title: "Mapa e testes de melhorias | Ilha Inteligente" },
      {
        name: "description",
        content:
          "Mapa da Ilha do Recife com enchente, calor, árvores e prédios históricos. Teste uma melhoria e veja como fica antes e depois.",
      },
      { property: "og:title", content: "Mapa e testes de melhorias | Ilha Inteligente" },
      {
        property: "og:description",
        content:
          "Veja rua por rua o que precisa de atenção e teste o efeito de uma obra antes de fazer.",
      },
    ],
  }),
  component: MapaPage,
});

const TODOS: Tema[] = ["alagamento", "calor", "arborizacao", "patrimonio"];

function MapaPage() {
  const { perfil } = usePerfil();
  const [temas, setTemas] = useState<Tema[]>(TODOS);
  const [ponto, setPonto] = useState<Ponto | null>(null);
  const [area, setArea] = useState<{ bairro: string; x: number; y: number } | null>(null);
  const [intervencaoId, setIntervencaoId] = useState<string | null>(null);

  const intervencao = INTERVENCOES.find((i) => i.id === intervencaoId) ?? null;
  const resultado = useMemo(
    () => (area && intervencao ? simular(area.bairro, intervencao) : null),
    [area, intervencao],
  );

  const toggle = (t: Tema) =>
    setTemas((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const sugeridas = [...INTERVENCOES].sort(
    (a, b) =>
      perfil.temasPrioritarios.indexOf(a.temaAlvo) - perfil.temasPrioritarios.indexOf(b.temaAlvo),
  );

  return (
    <AppShell>
      <div className="border-b border-border pb-5">
        <p className="label-inst">Mapa da ilha</p>
        <h1 className="mt-1 text-2xl font-semibold">Mapa da Ilha do Recife</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted-foreground">
          Clique em um ponto para ver o que foi medido ali. Clique em qualquer parte do mapa para
          testar uma melhoria e comparar como fica antes e depois.
        </p>
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <section className="rounded-md border border-border bg-card shadow-panel">
          <header className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-3">
            <span className="label-inst mr-1">Mostrar no mapa</span>
            {TODOS.map((t) => (
              <button
                key={t}
                onClick={() => toggle(t)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-sm border px-2.5 py-1 text-xs font-medium transition-colors",
                  temas.includes(t)
                    ? "border-primary/35 bg-primary/10 text-foreground"
                    : "border-border bg-card text-muted-foreground hover:bg-secondary",
                )}
              >
                <span className={`size-2 rounded-full ${TEMA_DOT[t]}`} />
                {TEMAS[t].nome}
              </button>
            ))}
          </header>

          <div className="aspect-[4/3] w-full">
            <IlhaMap
              temasAtivos={temas}
              selecionado={ponto}
              onSelect={(p) => {
                setPonto(p);
                setArea({ bairro: p.bairro, x: p.x, y: p.y });
              }}
              onSelectArea={(bairro, x, y) => {
                setArea({ bairro, x, y });
                setPonto(null);
              }}
              marcadorArea={area}
            />
          </div>

          <footer className="flex flex-wrap items-center gap-4 border-t border-border px-4 py-2.5 text-xs text-muted-foreground">
            <span>O que as cores querem dizer:</span>
            {[
              ["bg-critico", "Muito grave"],
              ["bg-alto", "Grave"],
              ["bg-moderado", "Preocupa"],
              ["bg-baixo", "Tranquilo"],
            ].map(([klass, label]) => (
              <span key={label} className="inline-flex items-center gap-1.5">
                <span className={`size-2 rounded-full ${klass}`} />
                {label}
              </span>
            ))}

            <span className="ml-auto">Desenho simplificado · dados de exemplo</span>
          </footer>
        </section>

        <aside className="space-y-5">
          {ponto && (
            <section className="rounded-md border border-border bg-card p-4 shadow-panel">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="label-inst">{TEMAS[ponto.tema].nome}</p>
                  <h2 className="mt-0.5 text-base font-semibold">{ponto.nome}</h2>
                  <p className="text-xs text-muted-foreground">{ponto.bairro}</p>
                </div>
                <SeverityBadge severidade={ponto.severidade} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground">{ponto.detalhe}</p>
              <dl className="mt-3 grid grid-cols-2 gap-3 border-t border-border pt-3 text-xs">
                <div>
                  <dt className="label-inst">Medida</dt>
                  <dd className="font-mono text-sm">
                    {ponto.valor} <span className="text-muted-foreground">{TEMAS[ponto.tema].unidade}</span>
                  </dd>
                </div>
                <div>
                  <dt className="label-inst">Quem mediu</dt>
                  <dd className="text-sm">{ponto.fonte}</dd>
                </div>
                <div className="col-span-2 text-muted-foreground">
                  Medido {ponto.atualizadoEm}
                </div>
              </dl>
            </section>
          )}

          <section className="rounded-md border border-border bg-card shadow-panel">
            <header className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-sm font-semibold">Teste uma melhoria</h2>
              {(area || intervencao) && (
                <button
                  onClick={() => {
                    setArea(null);
                    setIntervencaoId(null);
                    setPonto(null);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RotateCcw className="size-3.5" /> limpar
                </button>
              )}
            </header>

            <div className="space-y-4 p-4">
              <div>
                <p className="label-inst">1. Onde</p>
                <p className="mt-1 text-sm">
                  {area ? (
                    <span className="font-medium">{area.bairro}</span>
                  ) : (
                    <span className="text-muted-foreground">
                      Clique no mapa para escolher um lugar
                    </span>
                  )}
                </p>
              </div>

              <div>
                <p className="label-inst">2. O que fazer</p>
                <div className="mt-2 grid gap-2">
                  {sugeridas.map((i) => (
                    <button
                      key={i.id}
                      disabled={!area}
                      onClick={() => setIntervencaoId(i.id)}
                      className={cn(
                        "rounded-sm border px-3 py-2 text-left transition-colors disabled:opacity-50",
                        intervencaoId === i.id
                          ? "border-primary bg-primary/10"
                          : "border-border hover:bg-secondary",
                      )}
                    >
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <span className={`size-2 rounded-full ${TEMA_DOT[i.temaAlvo]}`} />
                        {i.nome}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {i.descricao}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {resultado && intervencao && (
                <div className="rounded-sm border border-border bg-surface p-3">
                  <p className="label-inst">3. Como fica antes e depois</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {intervencao.nome} em {area?.bairro} · leva {intervencao.prazo} · custa cerca de{" "}
                    {intervencao.custo}
                  </p>
                  <ul className="mt-3 space-y-3">
                    {resultado.map((r) => {
                      const delta = r.depois - r.antes;
                      const melhora = menorEhMelhor(r.tema) ? delta < 0 : delta > 0;
                      return (
                        <li key={r.tema}>
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium">{r.rotulo}</span>
                            <span
                              className={cn(
                                "font-mono",
                                delta === 0
                                  ? "text-muted-foreground"
                                  : melhora
                                    ? "text-baixo"
                                    : "text-critico",
                              )}
                            >
                              {r.antes} → {r.depois} ({delta > 0 ? "+" : ""}
                              {delta})
                            </span>
                          </div>
                          <div className="mt-1.5 space-y-1">
                            <Barra valor={r.antes} tom="muted" rotulo="antes" />
                            <Barra valor={r.depois} tom="ativo" rotulo="depois" />
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                  <p className="mt-3 border-t border-border pt-2 text-xs text-muted-foreground">
                    São contas aproximadas, feitas com dados de exemplo. Não substituem o projeto
                    feito por engenheiros.
                  </p>
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}

function Barra({
  valor,
  tom,
  rotulo,
}: {
  valor: number;
  tom: "muted" | "ativo";
  rotulo: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-10 text-[10px] uppercase tracking-wide text-muted-foreground">
        {rotulo}
      </span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn("h-full rounded-full", tom === "ativo" ? "bg-primary" : "bg-muted-foreground/45")}
          style={{ width: `${valor}%` }}
        />
      </div>
    </div>
  );
}
