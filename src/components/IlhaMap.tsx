import { PONTOS, TEMAS, type Ponto, type Tema } from "@/lib/ilha-data";
import { SEV_FILL } from "@/components/SeverityBadge";
import { cn } from "@/lib/utils";

interface Props {
  temasAtivos: Tema[];
  selecionado?: Ponto | null;
  onSelect?: (p: Ponto) => void;
  onSelectArea?: (bairro: string, x: number, y: number) => void;
  marcadorArea?: { x: number; y: number } | null;
  className?: string;
}

/** Mapa esquemático da Ilha do Recife (representação estilizada, não cartográfica). */
export function IlhaMap({
  temasAtivos,
  selecionado,
  onSelect,
  onSelectArea,
  marcadorArea,
  className,
}: Props) {
  const pontos = PONTOS.filter((p) => temasAtivos.includes(p.tema));

  const handleBackground = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!onSelectArea) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const proximo = [...PONTOS].sort(
      (a, b) => (a.x - x) ** 2 + (a.y - y) ** 2 - ((b.x - x) ** 2 + (b.y - y) ** 2),
    )[0];
    onSelectArea(proximo.bairro, x, y);
  };

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      onClick={handleBackground}
      className={cn("h-full w-full cursor-crosshair select-none bg-agua", className)}
      role="img"
      aria-label="Mapa esquemático da Ilha do Recife com camadas de dados"
    >
      {/* massas de terra */}
      <g>
        <path
          d="M2 18 L26 12 L34 30 L30 62 L22 88 L4 92 Z"
          fill="var(--terra)"
          stroke="var(--border)"
          strokeWidth="0.4"
        />
        <path
          d="M40 8 L78 4 L86 22 L74 52 L56 66 L38 62 L34 34 Z"
          fill="var(--terra)"
          stroke="var(--border)"
          strokeWidth="0.4"
        />
        <path
          d="M24 62 L46 60 L52 78 L40 96 L20 94 Z"
          fill="var(--terra)"
          stroke="var(--border)"
          strokeWidth="0.4"
        />
      </g>

      {/* vias principais */}
      <g stroke="var(--border)" strokeWidth="0.5" fill="none" opacity="0.9">
        <path d="M42 10 L56 30 L64 24 L80 20" />
        <path d="M36 34 L60 32 L74 46" />
        <path d="M26 52 L44 62 L48 78" />
        <path d="M6 24 L28 30 L30 58" />
      </g>

      {/* pontes */}
      <g stroke="var(--muted-foreground)" strokeWidth="0.6" strokeDasharray="1.4 1" opacity="0.65">
        <path d="M30 30 L40 26" />
        <path d="M32 56 L40 58" />
        <path d="M44 60 L54 64" />
      </g>

      <g fontSize="2.3" fill="var(--muted-foreground)" fontWeight="600">
        <text x="60" y="14">
          BAIRRO DO RECIFE
        </text>
        <text x="7" y="38">
          BOA VISTA
        </text>
        <text x="38" y="52">
          SANTO ANTÔNIO
        </text>
        <text x="26" y="86">
          SÃO JOSÉ
        </text>
      </g>

      {marcadorArea && (
        <g>
          <circle
            cx={marcadorArea.x}
            cy={marcadorArea.y}
            r="5"
            fill="var(--primary)"
            opacity="0.14"
          />
          <circle
            cx={marcadorArea.x}
            cy={marcadorArea.y}
            r="1.6"
            fill="var(--primary)"
            stroke="var(--card)"
            strokeWidth="0.5"
          />
        </g>
      )}

      {pontos.map((p) => {
        const ativo = selecionado?.id === p.id;
        return (
          <g
            key={p.id}
            onClick={(e) => {
              e.stopPropagation();
              onSelect?.(p);
            }}
            className="cursor-pointer"
          >
            <title>{`${p.nome} — ${TEMAS[p.tema].nome}`}</title>
            <circle cx={p.x} cy={p.y} r={ativo ? 4.4 : 3.2} fill={SEV_FILL[p.severidade]} opacity="0.22" />
            <circle
              cx={p.x}
              cy={p.y}
              r={ativo ? 2 : 1.5}
              fill={SEV_FILL[p.severidade]}
              stroke={ativo ? "var(--foreground)" : "var(--card)"}
              strokeWidth="0.45"
            />
          </g>
        );
      })}
    </svg>
  );
}
