import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/AppShell";
import { TEMA_DOT } from "@/components/SeverityBadge";
import { usePerfil } from "@/lib/perfil-context";
import { responderMock, type MensagemChat } from "@/lib/chat-mock";
import { TEMAS } from "@/lib/ilha-data";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";
import { Send, Radar, Plus, MessageSquare } from "lucide-react";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "Copiloto IA | Ilha Inteligente" },
      {
        name: "description",
        content:
          "Copiloto conversacional para consultar indicadores da Ilha do Recife e simular intervenções urbanas em linguagem natural.",
      },
      { property: "og:title", content: "Copiloto IA | Ilha Inteligente" },
      {
        property: "og:description",
        content: "Pergunte sobre alagamento, calor, arborização e patrimônio — e simule cenários.",
      },
    ],
  }),
  component: ChatPage,
});

const SUGESTOES = [
  "Qual área tem maior risco de alagamento essa semana?",
  "Como está a cobertura arbórea no Bairro do Recife?",
  "E se plantássemos árvores na Rua da Aurora?",
  "Quais bens tombados estão em situação crítica?",
];

interface Conversa {
  id: string;
  titulo: string;
  mensagens: MensagemChat[];
}

function ChatPage() {
  const { perfil } = usePerfil();

  const saudacao = useMemo<MensagemChat>(
    () => ({
      id: "inicial",
      autor: "ia",
      texto: `Olá. Sou o copiloto do gêmeo digital da Ilha do Recife. Estou com a visão de ${perfil.nome} carregada e posso responder sobre alagamento, calor urbano, arborização e patrimônio — ou simular uma intervenção que você descrever.`,
    }),
    [perfil.nome],
  );

  const [conversas, setConversas] = useState<Conversa[]>([
    { id: "c-1", titulo: "Nova conversa", mensagens: [saudacao] },
  ]);
  const [ativaId, setAtivaId] = useState("c-1");
  const [texto, setTexto] = useState("");
  const [pensando, setPensando] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fimRef = useRef<HTMLDivElement>(null);

  const ativa = conversas.find((c) => c.id === ativaId) ?? conversas[0];

  useEffect(() => {
    fimRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ativa?.mensagens, pensando]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [ativaId]);

  const novaConversa = () => {
    const id = `c-${Date.now()}`;
    setConversas((cs) => [
      { id, titulo: "Nova conversa", mensagens: [{ ...saudacao, id: `inicial-${id}` }] },
      ...cs,
    ]);
    setAtivaId(id);
    setTexto("");
  };

  const enviar = (valor: string) => {
    const pergunta = valor.trim();
    if (!pergunta || pensando) return;
    setConversas((cs) =>
      cs.map((c) =>
        c.id === ativaId
          ? {
              ...c,
              titulo:
                c.titulo === "Nova conversa"
                  ? pergunta.slice(0, 42) + (pergunta.length > 42 ? "…" : "")
                  : c.titulo,
              mensagens: [...c.mensagens, { id: `u-${Date.now()}`, autor: "gestor", texto: pergunta }],
            }
          : c,
      ),
    );
    setTexto("");
    setPensando(true);
    setTimeout(() => {
      const resposta = responderMock(pergunta, perfil);
      setConversas((cs) =>
        cs.map((c) => (c.id === ativaId ? { ...c, mensagens: [...c.mensagens, resposta] } : c)),
      );
      setPensando(false);
      inputRef.current?.focus();
    }, 700);
  };

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[220px_minmax(0,1fr)_260px]">
        {/* Histórico */}
        <aside className="order-2 lg:order-1">
          <div className="flex items-center justify-between">
            <p className="label-inst">Histórico</p>
            <button
              onClick={novaConversa}
              className="inline-flex items-center gap-1 rounded-sm border border-border px-2 py-1 text-xs transition-colors hover:bg-secondary"
            >
              <Plus className="size-3.5" /> Nova
            </button>
          </div>
          <div className="mt-3 space-y-1">
            {conversas.map((c) => (
              <button
                key={c.id}
                onClick={() => setAtivaId(c.id)}
                className={cn(
                  "flex w-full items-start gap-2 rounded-sm px-2.5 py-2 text-left text-sm transition-colors",
                  c.id === ativaId
                    ? "bg-secondary font-medium text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60",
                )}
              >
                <MessageSquare className="mt-0.5 size-3.5 shrink-0" />
                <span className="line-clamp-2">{c.titulo}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Chat central */}
        <section className="order-1 flex min-w-0 flex-col lg:order-2">
          <div className="border-b border-border pb-4 text-center">
            <p className="label-inst">Copiloto IA · respostas simuladas no MVP</p>
            <h1 className="mt-1 text-2xl font-semibold">Converse com os dados da ilha</h1>
          </div>

          <div className="mx-auto mt-4 flex h-[62vh] min-h-[440px] w-full max-w-3xl flex-col rounded-md border border-border bg-card shadow-panel">
            <div className="flex-1 space-y-5 overflow-y-auto px-4 py-5">
              {ativa?.mensagens.map((m) => (
                <Bolha key={m.id} m={m} />
              ))}
              {pensando && (
                <p className="animate-pulse text-sm text-muted-foreground">
                  Consultando o gêmeo digital…
                </p>
              )}
              <div ref={fimRef} />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                enviar(texto);
              }}
              className="border-t border-border p-3"
            >
              <div className="flex items-end gap-2 rounded-sm border border-input bg-background p-2">
                <textarea
                  ref={inputRef}
                  rows={2}
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      enviar(texto);
                    }
                  }}
                  placeholder="Pergunte sobre os indicadores ou descreva uma intervenção…"
                  className="max-h-32 flex-1 resize-none bg-transparent px-1 text-sm outline-none placeholder:text-muted-foreground"
                />
                <button
                  type="submit"
                  disabled={!texto.trim() || pensando}
                  className="inline-flex size-9 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
                  aria-label="Enviar mensagem"
                >
                  <Send className="size-4" />
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Sugestões + contexto */}
        <aside className="order-3 space-y-4">
          <section className="rounded-md border border-border bg-card p-3 shadow-panel">
            <p className="label-inst">Perguntas sugeridas</p>
            <div className="mt-2 grid gap-1.5">
              {SUGESTOES.map((s) => (
                <button
                  key={s}
                  onClick={() => enviar(s)}
                  className="rounded-sm border border-border px-2.5 py-2 text-left text-xs leading-snug transition-colors hover:bg-secondary"
                >
                  {s}
                </button>
              ))}
            </div>
          </section>

          <section className="rounded-md border border-border bg-surface p-3 text-xs text-muted-foreground">
            <p className="label-inst">Contexto ativo</p>
            <p className="mt-2 text-foreground">{perfil.secretaria}</p>
            <p className="mt-1">
              Camadas priorizadas:{" "}
              {perfil.temasPrioritarios.slice(0, 2).map((t) => (
                <span key={t} className="mr-2 inline-flex items-center gap-1.5">
                  <span className={`size-2 rounded-full ${TEMA_DOT[t]}`} />
                  <span className="text-foreground">{TEMAS[t].nome}</span>
                </span>
              ))}
            </p>
            <p className="mt-3">
              Simulações citadas no chat podem ser abertas no{" "}
              <Link to="/mapa" className="font-medium text-primary underline-offset-2 hover:underline">
                mapa interativo
              </Link>
              .
            </p>
          </section>
        </aside>
      </div>
    </AppShell>
  );
}

function Bolha({ m }: { m: MensagemChat }) {
  if (m.autor === "gestor") {
    return (
      <div className="flex justify-end">
        <p className="max-w-[80%] rounded-md bg-primary px-3.5 py-2.5 text-sm text-primary-foreground">
          {m.texto}
        </p>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-sm bg-secondary text-secondary-foreground">
        <Radar className="size-4" />
      </span>
      <div className="min-w-0 flex-1 space-y-3">
        <p className="whitespace-pre-line text-sm leading-relaxed">{m.texto}</p>
        {m.simulacao && (
          <div className="rounded-sm border border-border bg-surface p-3">
            <p className="label-inst">Simulação estimada · {m.simulacao.local}</p>
            <p className="mt-1 text-sm font-medium">{m.simulacao.intervencao}</p>
            <ul className="mt-2 space-y-1.5">
              {m.simulacao.linhas.map((l) => (
                <li key={l.rotulo} className="flex items-center justify-between text-xs">
                  <span>{l.rotulo}</span>
                  <span
                    className={cn(
                      "font-mono",
                      l.melhora ? "text-baixo" : "text-muted-foreground",
                    )}
                  >
                    {l.antes} → {l.depois}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              to="/mapa"
              className="mt-3 inline-block text-xs font-medium text-primary underline-offset-2 hover:underline"
            >
              Ver no mapa e ajustar parâmetros →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
