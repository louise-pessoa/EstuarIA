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
      "Duas obras vão fechar a mesma rua ao mesmo tempo por 4 dias: a obra de drenagem (Emlurb) e a troca do asfalto (Mobilidade). O asfalto novo seria colocado antes de a vala da drenagem ser fechada.",
    recomendacao:
      "Mudar a troca do asfalto para 17 a 21 de agosto, depois que a drenagem terminar. Assim o asfalto não precisa ser refeito e a rua fica aberta para as lojas.",
    ganho: "Economia de cerca de R$ 310 mil e 4 dias a menos de rua fechada",
  },
  {
    id: "c2",
    tipo: "agrupar",
    severidade: "alto",
    servicos: ["s6", "s7"],
    local: "Av. Dantas Barreto · Santo Antônio",
    janela: "6 e 7 de agosto",
    diagnostico:
      "A limpeza dos bueiros e a troca das lâmpadas ocupam a mesma faixa da avenida em dias parecidos. Hoje, cada uma teria seu próprio desvio de trânsito.",
    recomendacao:
      "Fazer as duas juntas, de 5 a 8 de agosto, com um só desvio e a mesma sinalização.",
    ganho: "Um bloqueio de trânsito a menos e 40% menos gasto com sinalização",
  },
  {
    id: "c3",
    tipo: "remarcar",
    severidade: "alto",
    servicos: ["s5", "s8"],
    local: "Praça do Marco Zero · Bairro do Recife",
    janela: "22 e 23 de agosto",
    diagnostico:
      "A feira cultural espera 8 mil pessoas, mas parte da praça vai estar fechada pela obra do piso. Sobram poucas saídas em caso de emergência.",
    recomendacao:
      "Parar a obra de 21 a 24 de agosto ou passar essa etapa para setembro. O evento continua na data marcada.",
    ganho: "Evita aglomeração em espaço apertado",
  },
  {
    id: "c4",
    tipo: "agrupar",
    severidade: "moderado",
    servicos: ["s2", "s4"],
    local: "Recife Antigo (Rua da Moeda / Rua do Apolo)",
    janela: "12 a 20 de agosto",
    diagnostico:
      "O restauro das fachadas e o plantio de árvores acontecem a 250 metros um do outro e fecham calçadas no mesmo caminho de quem anda a pé.",
    recomendacao:
      "Manter as datas, mas usar o mesmo canteiro de obras, a mesma coleta de entulho e um só aviso para o comércio. As árvores ainda dão sombra às fachadas restauradas.",
    ganho: "Menos custo de logística e prédios mais protegidos do sol",
  },
  {
    id: "c5",
    tipo: "monitorar",
    severidade: "moderado",
    servicos: ["s9"],
    local: "Forte das Cinco Pontas · São José",
    janela: "18 a 27 de agosto",
    diagnostico:
      "Nesses dias a maré deve passar de 2,2 metros. A vala aberta da obra pode encher de água.",
    recomendacao:
      "Manter a data, mas cavar fora dos horários de maré alta e deixar uma bomba de água pronta.",
    ganho: "Menos risco de ter que refazer o serviço",
  },
];

export const TIPO_CONFLITO_LABEL: Record<TipoConflito, string> = {
  remarcar: "Mudar a data",
  agrupar: "Fazer junto",
  monitorar: "Ficar de olho",
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
