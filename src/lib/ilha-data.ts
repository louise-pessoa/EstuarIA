// Dados mockados / fictícios da Ilha do Recife para o MVP "Ilha Inteligente".
// Nenhuma integração externa: tudo é gerado localmente e é plausível, não real.

export type Tema = "alagamento" | "calor" | "arborizacao" | "patrimonio";

export type PerfilId = "meio-ambiente" | "patrimonio" | "defesa-civil" | "mobilidade";

export interface Perfil {
  id: PerfilId;
  nome: string;
  secretaria: string;
  temasPrioritarios: Tema[];
}

export const PERFIS: Perfil[] = [
  {
    id: "meio-ambiente",
    nome: "Meio Ambiente",
    secretaria: "Secretaria de Meio Ambiente e Sustentabilidade",
    temasPrioritarios: ["arborizacao", "calor", "alagamento", "patrimonio"],
  },
  {
    id: "patrimonio",
    nome: "Patrimônio Histórico",
    secretaria: "Secretaria de Cultura e Patrimônio",
    temasPrioritarios: ["patrimonio", "alagamento", "calor", "arborizacao"],
  },
  {
    id: "defesa-civil",
    nome: "Defesa Civil",
    secretaria: "Coordenadoria Municipal de Defesa Civil",
    temasPrioritarios: ["alagamento", "calor", "patrimonio", "arborizacao"],
  },
  {
    id: "mobilidade",
    nome: "Mobilidade",
    secretaria: "Autarquia de Mobilidade Urbana",
    temasPrioritarios: ["alagamento", "calor", "arborizacao", "patrimonio"],
  },
];

export const TEMAS: Record<
  Tema,
  { nome: string; unidade: string; descricao: string; corVar: string }
> = {
  alagamento: {
    nome: "Alagamento",
    unidade: "nota de risco",
    descricao: "Chance de a água acumular nas ruas e entrar nos imóveis",
    corVar: "var(--tema-alagamento)",
  },
  calor: {
    nome: "Calor",
    unidade: "°C de sensação",
    descricao: "Lugares onde faz mais calor na rua",
    corVar: "var(--tema-calor)",
  },
  arborizacao: {
    nome: "Árvores",
    unidade: "% de sombra",
    descricao: "Quanto das calçadas tem árvore e sombra",
    corVar: "var(--tema-arborizacao)",
  },
  patrimonio: {
    nome: "Prédios históricos",
    unidade: "estado de conservação",
    descricao: "Como estão as fachadas e os prédios tombados",
    corVar: "var(--tema-patrimonio)",
  },
};

export type Severidade = "critico" | "alto" | "moderado" | "baixo";

export interface Ponto {
  id: string;
  nome: string;
  bairro: string;
  /** coordenadas geográficas reais (WGS84) */
  lat: number;
  lng: number;
  tema: Tema;
  /** valor principal do indicador */
  valor: number;
  severidade: Severidade;
  detalhe: string;
  fonte: string;
  atualizadoEm: string;
}

export const BAIRROS = [
  "Bairro do Recife",
  "Boa Vista",
  "Santo Antônio",
  "São José",
  "Cabanga",
] as const;

export const PONTOS: Ponto[] = [
  // --- Alagamento ---
  {
    id: "al-1",
    nome: "Rua do Bom Jesus",
    bairro: "Bairro do Recife",
    lat: -8.0625,
    lng: -34.8722,
    tema: "alagamento",
    valor: 87,
    severidade: "critico",
    detalhe:
      "Cota baixa e galeria com assoreamento. Registro de lâmina d'água de 28 cm na última maré de sizígia.",
    fonte: "Drone RC-02 + sensor de nível",
    atualizadoEm: "há 40 min",
  },
  {
    id: "al-2",
    nome: "Cais do Apolo",
    bairro: "Bairro do Recife",
    lat: -8.06,
    lng: -34.873,
    tema: "alagamento",
    valor: 74,
    severidade: "alto",
    detalhe: "Refluxo pela rede pluvial em maré alta combinada com chuva acima de 30 mm/h.",
    fonte: "Bike Gira #1187",
    atualizadoEm: "há 1 h",
  },
  {
    id: "al-3",
    nome: "Av. Dantas Barreto",
    bairro: "Santo Antônio",
    lat: -8.067,
    lng: -34.877,
    tema: "alagamento",
    valor: 52,
    severidade: "moderado",
    detalhe: "Bocas de lobo parcialmente obstruídas em três quarteirões.",
    fonte: "Drone RC-05",
    atualizadoEm: "há 3 h",
  },
  {
    id: "al-4",
    nome: "Cais José Estelita",
    bairro: "São José",
    lat: -8.0755,
    lng: -34.8745,
    tema: "alagamento",
    valor: 31,
    severidade: "baixo",
    detalhe: "Drenagem recém-revisada, escoamento dentro do esperado.",
    fonte: "Bike Gira #0942",
    atualizadoEm: "há 2 h",
  },

  // --- Calor urbano ---
  {
    id: "ca-1",
    nome: "Praça do Marco Zero",
    bairro: "Bairro do Recife",
    lat: -8.0631,
    lng: -34.8711,
    tema: "calor",
    valor: 41.2,
    severidade: "critico",
    detalhe: "Superfície pavimentada extensa, sombreamento inferior a 8% ao meio-dia.",
    fonte: "Drone térmico RC-02",
    atualizadoEm: "há 55 min",
  },
  {
    id: "ca-2",
    nome: "Av. Rio Branco",
    bairro: "Bairro do Recife",
    lat: -8.0645,
    lng: -34.8705,
    tema: "calor",
    valor: 38.4,
    severidade: "alto",
    detalhe: "Corredor com asfalto escuro e pouca ventilação cruzada à tarde.",
    fonte: "Bike Gira #1187",
    atualizadoEm: "há 1 h",
  },
  {
    id: "ca-3",
    nome: "Rua da Aurora",
    bairro: "Boa Vista",
    lat: -8.058,
    lng: -34.879,
    tema: "calor",
    valor: 34.6,
    severidade: "moderado",
    detalhe: "Brisa fluvial reduz sensação térmica, mas calçada sul tem sombra irregular.",
    fonte: "Bike Gira #0771",
    atualizadoEm: "há 2 h",
  },
  {
    id: "ca-4",
    nome: "Parque das Graças",
    bairro: "Boa Vista",
    lat: -8.0555,
    lng: -34.8815,
    tema: "calor",
    valor: 30.1,
    severidade: "baixo",
    detalhe: "Massa arbórea densa mantém temperatura 4,8 °C abaixo do entorno.",
    fonte: "Drone térmico RC-05",
    atualizadoEm: "há 4 h",
  },

  // --- Arborização ---
  {
    id: "ar-1",
    nome: "Rua do Apolo",
    bairro: "Bairro do Recife",
    lat: -8.061,
    lng: -34.8725,
    tema: "arborizacao",
    valor: 6,
    severidade: "critico",
    detalhe: "Apenas 4 exemplares adultos em 800 m de via; calçadas sem sombreamento.",
    fonte: "Visão computacional — bikes",
    atualizadoEm: "há 1 h",
  },
  {
    id: "ar-2",
    nome: "Praça do Arsenal",
    bairro: "Bairro do Recife",
    lat: -8.0615,
    lng: -34.8715,
    tema: "arborizacao",
    valor: 18,
    severidade: "alto",
    detalhe: "Cobertura concentrada em canteiro central; 12 covas vazias mapeadas.",
    fonte: "Drone RC-02",
    atualizadoEm: "há 3 h",
  },
  {
    id: "ar-3",
    nome: "Av. Guararapes",
    bairro: "Santo Antônio",
    lat: -8.0655,
    lng: -34.875,
    tema: "arborizacao",
    valor: 27,
    severidade: "moderado",
    detalhe: "Espécies de pequeno porte, copa jovem com baixo índice de sombra.",
    fonte: "Bike Gira #0942",
    atualizadoEm: "há 5 h",
  },
  {
    id: "ar-4",
    nome: "Parque 13 de Maio (borda)",
    bairro: "Boa Vista",
    lat: -8.0648,
    lng: -34.8802,
    tema: "arborizacao",
    valor: 63,
    severidade: "baixo",
    detalhe: "Cobertura consolidada, manutenção preventiva de poda em dia.",
    fonte: "Drone RC-05",
    atualizadoEm: "há 6 h",
  },

  // --- Patrimônio ---
  {
    id: "pa-1",
    nome: "Casario da Rua da Moeda",
    bairro: "Bairro do Recife",
    lat: -8.0628,
    lng: -34.8718,
    tema: "patrimonio",
    valor: 34,
    severidade: "critico",
    detalhe:
      "Umidade ascendente e destacamento de reboco em 3 fachadas tombadas. Agravado por alagamentos recorrentes.",
    fonte: "Fotogrametria por drone",
    atualizadoEm: "há 1 h",
  },
  {
    id: "pa-2",
    nome: "Forte das Cinco Pontas",
    bairro: "São José",
    lat: -8.0785,
    lng: -34.879,
    tema: "patrimonio",
    valor: 52,
    severidade: "alto",
    detalhe: "Manchas de salinização na alvenaria histórica e drenagem perimetral deficiente.",
    fonte: "Drone RC-05",
    atualizadoEm: "há 4 h",
  },
  {
    id: "pa-3",
    nome: "Igreja Madre de Deus",
    bairro: "Bairro do Recife",
    lat: -8.0605,
    lng: -34.8728,
    tema: "patrimonio",
    valor: 68,
    severidade: "moderado",
    detalhe: "Fissuras superficiais monitoradas; sem evolução nos últimos 90 dias.",
    fonte: "Fotogrametria por drone",
    atualizadoEm: "há 2 dias",
  },
  {
    id: "pa-4",
    nome: "Teatro Santa Isabel",
    bairro: "Santo Antônio",
    lat: -8.0648,
    lng: -34.8763,
    tema: "patrimonio",
    valor: 84,
    severidade: "baixo",
    detalhe: "Restauro concluído em 2024, conservação estável.",
    fonte: "Vistoria técnica + drone",
    atualizadoEm: "há 1 dia",
  },
];

export interface Indicador {
  tema: Tema;
  titulo: string;
  valor: string;
  descricao: string;
  variacao: number;
  severidade: Severidade;
}

export const INDICADORES: Indicador[] = [
  {
    tema: "alagamento",
    titulo: "Risco de alagamento",
    valor: "Alto",
    descricao: "6 de 24 trechos podem alagar nos próximos 2 dias",
    variacao: 12,
    severidade: "alto",
  },
  {
    tema: "calor",
    titulo: "Calor na rua",
    valor: "38,4 °C",
    descricao: "Sensação média às 14h nas ruas da ilha",
    variacao: 3,
    severidade: "alto",
  },
  {
    tema: "arborizacao",
    titulo: "Árvores e sombra",
    valor: "18,6 %",
    descricao: "A meta da cidade para o centro é 25% até 2028",
    variacao: -2,
    severidade: "moderado",
  },
  {
    tema: "patrimonio",
    titulo: "Prédios em atenção",
    valor: "9 imóveis",
    descricao: "Prédios tombados que estão piorando rápido",
    variacao: 2,
    severidade: "critico",
  },
];

export interface Alerta {
  id: string;
  tema: Tema;
  severidade: Severidade;
  titulo: string;
  corpo: string;
  quando: string;
  local: string;
}

export const ALERTAS: Alerta[] = [
  {
    id: "alerta-1",
    tema: "alagamento",
    severidade: "critico",
    titulo: "Rua do Bom Jesus pode alagar nos próximos 2 dias",
    corpo:
      "A maré vai chegar a 2,4 metros e a previsão é de 45 mm de chuva. A água pode subir até 30 cm na rua.",
    quando: "há 40 min",
    local: "Bairro do Recife",
  },
  {
    id: "alerta-2",
    tema: "patrimonio",
    severidade: "critico",
    titulo: "Casario da Rua da Moeda está piorando rápido",
    corpo:
      "As fotos feitas por drone mostram 11% a mais de reboco soltando desde o último voo.",
    quando: "há 1 h",
    local: "Bairro do Recife",
  },
  {
    id: "alerta-3",
    tema: "calor",
    severidade: "alto",
    titulo: "Calor forte continua no Marco Zero",
    corpo:
      "São 7 dias seguidos com mais de 40 °C de sensação às 14h. Menos de 8% da área tem sombra.",
    quando: "há 55 min",
    local: "Bairro do Recife",
  },
  {
    id: "alerta-4",
    tema: "arborizacao",
    severidade: "alto",
    titulo: "12 buracos de plantio vazios na Praça do Arsenal",
    corpo: "As câmeras das bikes Gira acharam 12 lugares prontos para plantar árvore agora.",
    quando: "há 3 h",
    local: "Bairro do Recife",
  },
  {
    id: "alerta-5",
    tema: "alagamento",
    severidade: "moderado",
    titulo: "Bueiros entupidos na Av. Dantas Barreto",
    corpo: "As câmeras viram bueiros parcialmente entupidos em três quarteirões.",
    quando: "há 3 h",
    local: "Santo Antônio",
  },
  {
    id: "alerta-6",
    tema: "patrimonio",
    severidade: "alto",
    titulo: "Sal está corroendo o Forte das Cinco Pontas",
    corpo: "A água não escoa bem em volta do forte e deixa a base das paredes sempre úmida.",
    quando: "há 4 h",
    local: "São José",
  },
];

export interface Frota {
  tipo: string;
  ativos: number;
  cobertura: string;
  ultimaColeta: string;
}

export const FROTA: Frota[] = [
  { tipo: "Drones", ativos: 6, cobertura: "82% da ilha", ultimaColeta: "há 40 min" },
  { tipo: "Bikes Gira com sensores", ativos: 34, cobertura: "61 km de ruas", ultimaColeta: "há 12 min" },
  { tipo: "Sensores de nível de água", ativos: 18, cobertura: "9 pontos que alagam", ultimaColeta: "há 5 min" },
];

// ---- Simulador de intervenções -------------------------------------------

export interface Intervencao {
  id: string;
  nome: string;
  descricao: string;
  temaAlvo: Tema;
  prazo: string;
  custo: string;
  /** impacto estimado por tema, em pontos percentuais do indicador */
  impacto: Partial<Record<Tema, number>>;
}

export const INTERVENCOES: Intervencao[] = [
  {
    id: "plantio",
    nome: "Plantar árvores na calçada",
    descricao: "40 árvores de porte médio, com canteiro que deixa a água entrar no solo.",
    temaAlvo: "arborizacao",
    prazo: "4 meses",
    custo: "R$ 380 mil",
    impacto: { arborizacao: 22, calor: -18, alagamento: -9, patrimonio: 3 },
  },
  {
    id: "drenagem",
    nome: "Obra para a água escoar melhor",
    descricao: "Aumentar as galerias embaixo da rua e trocar os bueiros por outros maiores.",
    temaAlvo: "alagamento",
    prazo: "11 meses",
    custo: "R$ 4,2 mi",
    impacto: { alagamento: -41, patrimonio: 14, calor: -2, arborizacao: 0 },
  },
  {
    id: "piso-frio",
    nome: "Piso que esquenta menos e sombra",
    descricao: "Piso claro que reflete o sol e cobertura com plantas na praça.",
    temaAlvo: "calor",
    prazo: "6 meses",
    custo: "R$ 1,1 mi",
    impacto: { calor: -26, arborizacao: 8, alagamento: -5, patrimonio: 2 },
  },
  {
    id: "fachada",
    nome: "Restaurar fachada de prédio histórico",
    descricao: "Tirar a umidade da parede, refazer o reboco e pintar de novo.",
    temaAlvo: "patrimonio",
    prazo: "8 meses",
    custo: "R$ 2,6 mi",
    impacto: { patrimonio: 38, alagamento: 0, calor: 0, arborizacao: 0 },
  },
  {
    id: "jardim-chuva",
    nome: "Jardim que absorve a chuva",
    descricao: "Canteiro com plantas da região que deixa a água da chuva entrar no solo.",
    temaAlvo: "alagamento",
    prazo: "3 meses",
    custo: "R$ 240 mil",
    impacto: { alagamento: -19, arborizacao: 11, calor: -7, patrimonio: 4 },
  },
];

export interface ResultadoSimulacao {
  tema: Tema;
  antes: number;
  depois: number;
  rotulo: string;
}

const clamp = (n: number) => Math.max(0, Math.min(100, n));

/** Estado base (0-100) de um ponto para cada tema, derivado dos dados mockados do bairro. */
export function estadoBase(bairro: string): Record<Tema, number> {
  const doBairro = (tema: Tema) => {
    const p = PONTOS.filter((x) => x.bairro === bairro && x.tema === tema);
    if (!p.length) return 45;
    const media = p.reduce((s, x) => s + x.valor, 0) / p.length;
    return tema === "calor" ? clamp((media - 26) * 6) : clamp(media);
  };
  return {
    alagamento: Math.round(doBairro("alagamento")),
    calor: Math.round(doBairro("calor")),
    arborizacao: Math.round(doBairro("arborizacao")),
    patrimonio: Math.round(doBairro("patrimonio")),
  };
}

export function simular(bairro: string, intervencao: Intervencao): ResultadoSimulacao[] {
  const base = estadoBase(bairro);
  return (Object.keys(base) as Tema[]).map((tema) => {
    const delta = intervencao.impacto[tema] ?? 0;
    return {
      tema,
      antes: base[tema],
      depois: clamp(Math.round(base[tema] + delta)),
      rotulo: rotuloTema(tema),
    };
  });
}

export function rotuloTema(tema: Tema) {
  return TEMAS[tema].nome;
}

/** Para alagamento e calor, menor é melhor. Para arborização e patrimônio, maior é melhor. */
export function menorEhMelhor(tema: Tema) {
  return tema === "alagamento" || tema === "calor";
}

export function severidadeLabel(s: Severidade) {
  return { critico: "Muito grave", alto: "Grave", moderado: "Preocupa", baixo: "Tranquilo" }[s];
}
