// Agenda de serviços urbanos (mockada) + análise de conflitos "produzida pelo copiloto IA".
import type { Severidade, Tema } from "./ilha-data";

export type StatusServico = "confirmado" | "previsto" | "em-revisao";

export interface ServicoAgendado {
  id: string;
  titulo: string;
  orgao: string;
  bairro: string;
  local: string;
  tema: Tema;
  /** ISO date (YYYY-MM-DD) */
  inicio: string;
  fim: string;
  status: StatusServico;
  impactoVia: string;
  descricao: string;
}

/** Mês de referência do protótipo. */
export const MES_REFERENCIA = { ano: 2026, mes: 7 }; // agosto/2026 (0-indexed)

export const SERVICOS: ServicoAgendado[] = [
  {
    id: "s1",
    titulo: "Obra de drenagem profunda",
    orgao: "Emlurb",
    bairro: "Bairro do Recife",
    local: "Rua do Bom Jesus",
    tema: "alagamento",
    inicio: "2026-08-04",
    fim: "2026-08-14",
    status: "confirmado",
    impactoVia: "Via interditada (mão única)",
    descricao: "Ampliação de galeria e troca de bocas de lobo em 3 quarteirões.",
  },
  {
    id: "s2",
    titulo: "Restauro de fachadas tombadas",
    orgao: "Secretaria de Cultura e Patrimônio",
    bairro: "Bairro do Recife",
    local: "Rua da Moeda",
    tema: "patrimonio",
    inicio: "2026-08-10",
    fim: "2026-08-28",
    status: "confirmado",
    impactoVia: "Calçada bloqueada + andaimes",
    descricao: "Tratamento de umidade ascendente e recomposição de reboco.",
  },
  {
    id: "s3",
    titulo: "Recapeamento asfáltico",
    orgao: "Autarquia de Mobilidade Urbana",
    bairro: "Bairro do Recife",
    local: "Rua do Bom Jesus",
    tema: "calor",
    inicio: "2026-08-11",
    fim: "2026-08-15",
    status: "previsto",
    impactoVia: "Via totalmente interditada",
    descricao: "Fresagem e recapeamento de 600 m de pista.",
  },
  {
    id: "s4",
    titulo: "Plantio arbóreo em calçada",
    orgao: "Secretaria de Meio Ambiente",
    bairro: "Bairro do Recife",
    local: "Rua do Apolo",
    tema: "arborizacao",
    inicio: "2026-08-12",
    fim: "2026-08-20",
    status: "previsto",
    impactoVia: "Meia calçada por trecho",
    descricao: "Abertura de 40 covas drenantes e plantio de porte médio.",
  },
  {
    id: "s5",
    titulo: "Requalificação de piso frio",
    orgao: "Secretaria de Meio Ambiente",
    bairro: "Bairro do Recife",
    local: "Praça do Marco Zero",
    tema: "calor",
    inicio: "2026-08-17",
    fim: "2026-08-29",
    status: "em-revisao",
    impactoVia: "Praça parcialmente fechada",
    descricao: "Piso de alta refletância e pergolado vegetado.",
  },
  {
    id: "s6",
    titulo: "Limpeza preventiva de galerias",
    orgao: "Emlurb",
    bairro: "Santo Antônio",
    local: "Av. Dantas Barreto",
    tema: "alagamento",
    inicio: "2026-08-05",
    fim: "2026-08-07",
    status: "confirmado",
    impactoVia: "Faixa da direita ocupada",
    descricao: "Desobstrução de bocas de lobo antes do pico de chuvas.",
  },
  {
    id: "s7",
    titulo: "Modernização de iluminação pública",
    orgao: "Autarquia de Mobilidade Urbana",
    bairro: "Santo Antônio",
    local: "Av. Dantas Barreto",
    tema: "patrimonio",
    inicio: "2026-08-06",
    fim: "2026-08-12",
    status: "previsto",
    impactoVia: "Faixa da direita ocupada",
    descricao: "Substituição de luminárias por LED com temperatura controlada.",
  },
  {
    id: "s8",
    titulo: "Feira cultural do Marco Zero",
    orgao: "Secretaria de Cultura e Patrimônio",
    bairro: "Bairro do Recife",
    local: "Praça do Marco Zero",
    tema: "patrimonio",
    inicio: "2026-08-22",
    fim: "2026-08-23",
    status: "confirmado",
    impactoVia: "Evento com público estimado de 8 mil pessoas",
    descricao: "Programação cultural de fim de semana no polo do Recife Antigo.",
  },
  {
    id: "s9",
    titulo: "Drenagem perimetral do Forte",
    orgao: "Secretaria de Cultura e Patrimônio",
    bairro: "São José",
    local: "Forte das Cinco Pontas",
    tema: "alagamento",
    inicio: "2026-08-18",
    fim: "2026-08-27",
    status: "previsto",
    impactoVia: "Entorno com cerca de obra",
    descricao: "Correção de drenagem para conter salinização da alvenaria histórica.",
  },
  {
    id: "s10",
    titulo: "Poda programada de arborização",
    orgao: "Secretaria de Meio Ambiente",
    bairro: "Boa Vista",
    local: "Rua da Aurora",
    tema: "arborizacao",
    inicio: "2026-08-24",
    fim: "2026-08-26",
    status: "previsto",
    impactoVia: "Estacionamento suspenso",
    descricao: "Poda de condução em 120 exemplares do corredor.",
  },
];

export type TipoConflito = "remarcar" | "agrupar" | "monitorar";

export interface Conflito {
  id: string;
  tipo: TipoConflito;
  severidade: Severidade;
  servicos: string[];
  local: string;
  janela: string;
  diagnostico: string;
  recomendacao: string;
  ganho: string;
}

/** "Saída do copiloto": conflitos detectados sobre a agenda acima. */
export const CONFLITOS: Conflito[] = [
  {
    id: "c1",
    tipo: "remarcar",
    severidade: "critico",
    servicos: ["s1", "s3"],
    local: "Rua do Bom Jesus · Bairro do Recife",
    janela: "11 a 14 de agosto",
    diagnostico:
      "Drenagem profunda (Emlurb) e recapeamento (Mobilidade) se sobrepõem por 4 dias na mesma via, ambos com interdição total. O recapeamento cobriria o trecho antes do fechamento da vala de drenagem.",
    recomendacao:
      "Remarcar o recapeamento para 17 a 21 de agosto, após a conclusão da drenagem. Evita refazer o pavimento e mantém a via aberta para o comércio da Rua do Bom Jesus.",
    ganho: "Economia estimada de R$ 310 mil e 4 dias a menos de interdição",
  },
  {
    id: "c2",
    tipo: "agrupar",
    severidade: "alto",
    servicos: ["s6", "s7"],
    local: "Av. Dantas Barreto · Santo Antônio",
    janela: "6 e 7 de agosto",
    diagnostico:
      "Limpeza de galerias e troca de luminárias ocupam a mesma faixa da direita em dias parcialmente coincidentes, com dois desvios de tráfego separados.",
    recomendacao:
      "Executar em conjunto entre 5 e 8 de agosto com um único plano de desvio e sinalização compartilhada.",
    ganho: "Uma interdição a menos e redução de 40% no custo de sinalização",
  },
  {
    id: "c3",
    tipo: "remarcar",
    severidade: "alto",
    servicos: ["s5", "s8"],
    local: "Praça do Marco Zero · Bairro do Recife",
    janela: "22 e 23 de agosto",
    diagnostico:
      "A feira cultural com público de 8 mil pessoas acontece com a praça parcialmente fechada pela obra de piso frio, reduzindo rotas de evacuação.",
    recomendacao:
      "Suspender a frente de obra de 21 a 24 de agosto ou remarcar a etapa de pavimentação para setembro, mantendo o evento na data.",
    ganho: "Risco de aglomeração em área reduzida eliminado",
  },
  {
    id: "c4",
    tipo: "agrupar",
    severidade: "moderado",
    servicos: ["s2", "s4"],
    local: "Recife Antigo (Rua da Moeda / Rua do Apolo)",
    janela: "12 a 20 de agosto",
    diagnostico:
      "Restauro de fachadas e plantio arbóreo ocorrem a 250 m de distância, com bloqueios de calçada simultâneos no mesmo circuito de pedestres.",
    recomendacao:
      "Manter as datas, mas unificar canteiro, logística de resíduos e comunicação ao comércio local. O plantio ainda reduz a incidência solar sobre as fachadas restauradas.",
    ganho: "Logística compartilhada e ganho cruzado em conservação",
  },
  {
    id: "c5",
    tipo: "monitorar",
    severidade: "moderado",
    servicos: ["s9"],
    local: "Forte das Cinco Pontas · São José",
    janela: "18 a 27 de agosto",
    diagnostico:
      "A janela coincide com previsão de marés de sizígia acima de 2,2 m, o que pode inundar a vala aberta da drenagem perimetral.",
    recomendacao:
      "Manter a data, mas programar as escavações fora das janelas de preamar e prever bombeamento de contingência.",
    ganho: "Redução do risco de retrabalho por alagamento da obra",
  },
];

export const TIPO_CONFLITO_LABEL: Record<TipoConflito, string> = {
  remarcar: "Remarcar",
  agrupar: "Executar em conjunto",
  monitorar: "Monitorar",
};

export function servicoPorId(id: string) {
  return SERVICOS.find((s) => s.id === id);
}

/** Dias (1-31) cobertos por um serviço dentro do mês de referência. */
export function diasDoServico(s: ServicoAgendado): number[] {
  const [, , di] = s.inicio.split("-").map(Number);
  const [, , df] = s.fim.split("-").map(Number);
  const dias: number[] = [];
  for (let d = di; d <= df; d++) dias.push(d);
  return dias;
}

export function servicosNoDia(dia: number) {
  return SERVICOS.filter((s) => diasDoServico(s).includes(dia));
}

export function conflitosDoServico(id: string) {
  return CONFLITOS.filter((c) => c.servicos.includes(id));
}
