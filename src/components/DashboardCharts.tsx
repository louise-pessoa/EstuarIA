import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { PONTOS, TEMAS, type Tema } from "@/lib/ilha-data";
import { CONFLITOS, SERVICOS, TIPO_CONFLITO_LABEL } from "@/lib/agenda-data";

const COR: Record<Tema, string> = {
  alagamento: "var(--tema-alagamento)",
  calor: "var(--tema-calor)",
  arborizacao: "var(--tema-arborizacao)",
  patrimonio: "var(--tema-patrimonio)",
};

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 4,
  fontSize: 12,
  color: "var(--foreground)",
} as const;

/** Gráfico de barras: pontos críticos por bairro e severidade. */
export function GraficoBairros() {
  const bairros = Array.from(new Set(PONTOS.map((p) => p.bairro)));
  const dados = bairros.map((b) => {
    const dos = PONTOS.filter((p) => p.bairro === b);
    const row: Record<string, string | number> = { bairro: b.replace("Bairro do ", "") };
    (Object.keys(TEMAS) as Tema[]).forEach((t) => {
      const pts = dos.filter((p) => p.tema === t);
      row[t] = pts.length
        ? Math.round(pts.reduce((s, p) => s + (p.severidade === "critico" ? 100 : p.severidade === "alto" ? 72 : p.severidade === "moderado" ? 45 : 18), 0) / pts.length)
        : 0;
    });
    return row;
  });

  return (
    <section className="rounded-md border border-border bg-card shadow-panel">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Onde os problemas são maiores, por bairro</h2>
        <span className="label-inst">nota de 0 a 100</span>
      </header>
      <div className="h-[280px] px-2 py-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={dados} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
            <XAxis dataKey="bairro" tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
            <YAxis tick={{ fontSize: 11 }} stroke="var(--muted-foreground)" />
            <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "var(--secondary)" }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {(Object.keys(TEMAS) as Tema[]).map((t) => (
              <Bar key={t} dataKey={t} name={TEMAS[t].nome} fill={COR[t]} radius={[2, 2, 0, 0]} />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

/** Gráfico de setores: distribuição dos serviços agendados por tema. */
export function GraficoServicos() {
  const dados = (Object.keys(TEMAS) as Tema[])
    .map((t) => ({
      tema: t,
      nome: TEMAS[t].nome,
      valor: SERVICOS.filter((s) => s.tema === t).length,
    }))
    .filter((d) => d.valor > 0);

  return (
    <section className="rounded-md border border-border bg-card shadow-panel">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Serviços marcados, por tema</h2>
        <span className="label-inst">{SERVICOS.length} neste mês</span>
      </header>
      <div className="h-[280px] px-2 py-3">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={dados}
              dataKey="valor"
              nameKey="nome"
              innerRadius={52}
              outerRadius={88}
              paddingAngle={2}
              stroke="var(--card)"
            >
              {dados.map((d) => (
                <Cell key={d.tema} fill={COR[d.tema]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}

/** Card compacto: conflitos de agenda por tipo de recomendação. */
export function ResumoConflitos() {
  const tipos = ["remarcar", "agrupar", "monitorar"] as const;
  return (
    <section className="rounded-md border border-border bg-card shadow-panel">
      <header className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold">Serviços que atrapalham uns aos outros</h2>
      </header>
      <ul className="divide-y divide-border">
        {tipos.map((t) => {
          const n = CONFLITOS.filter((c) => c.tipo === t).length;
          return (
            <li key={t} className="flex items-baseline justify-between px-4 py-3">
              <span className="text-sm">{TIPO_CONFLITO_LABEL[t]}</span>
              <span className="font-mono text-sm">{n}</span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
