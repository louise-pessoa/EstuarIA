// Respostas mockadas do "copiloto IA" — sem integração com modelo real no MVP.
import {
  INTERVENCOES,
  PONTOS,
  TEMAS,
  estadoBase,
  menorEhMelhor,
  simular,
  type Perfil,
  type Tema,
} from "./ilha-data";

export interface LinhaSimulacao {
  rotulo: string;
  antes: number;
  depois: number;
  melhora: boolean;
}

export interface MensagemChat {
  id: string;
  autor: "gestor" | "ia";
  texto: string;
  simulacao?: {
    local: string;
    intervencao: string;
    linhas: LinhaSimulacao[];
  };
}

const norm = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

function detectarTema(q: string): Tema | null {
  if (/(alaga|enchent|chuva|drenag|mare|agua)/.test(q)) return "alagamento";
  if (/(calor|temperatura|termic|sombra|quente)/.test(q)) return "calor";
  if (/(arvore|arboriz|plantio|verde|copa)/.test(q)) return "arborizacao";
  if (/(patrimon|tombad|fachada|historic|casario|igreja|forte)/.test(q)) return "patrimonio";
  return null;
}

function detectarBairro(q: string): string | null {
  if (/bairro do recife|marco zero|bom jesus|apolo|moeda/.test(q)) return "Bairro do Recife";
  if (/boa vista|aurora|13 de maio|gracas/.test(q)) return "Boa Vista";
  if (/santo antonio|guararapes|dantas barreto|santa isabel/.test(q)) return "Santo Antônio";
  if (/sao jose|cinco pontas|estelita/.test(q)) return "São José";
  return null;
}

function detectarIntervencao(q: string) {
  if (/(planta|arvore|arboriz)/.test(q)) return INTERVENCOES.find((i) => i.id === "plantio")!;
  if (/(drenag|galeria|boca de lobo|obra)/.test(q))
    return INTERVENCOES.find((i) => i.id === "drenagem")!;
  if (/(piso|pavimento|sombread|pergola|refletan)/.test(q))
    return INTERVENCOES.find((i) => i.id === "piso-frio")!;
  if (/(restaur|fachada|reboco)/.test(q)) return INTERVENCOES.find((i) => i.id === "fachada")!;
  if (/(jardim de chuva|infiltra)/.test(q))
    return INTERVENCOES.find((i) => i.id === "jardim-chuva")!;
  return null;
}

export function responderMock(pergunta: string, perfil: Perfil): MensagemChat {
  const q = norm(pergunta);
  const id = `ia-${Date.now()}`;
  const tema = detectarTema(q);
  const bairro = detectarBairro(q);
  const intervencao = detectarIntervencao(q);
  const ehSimulacao = /(e se|simul|caso |cenario|impacto de|o que acontece)/.test(q) || !!intervencao;

  if (ehSimulacao && intervencao) {
    const local = bairro ?? "Bairro do Recife";
    const base = estadoBase(local);
    const linhas: LinhaSimulacao[] = simular(local, intervencao).map((r) => ({
      rotulo: r.rotulo,
      antes: r.antes,
      depois: r.depois,
      melhora: menorEhMelhor(r.tema) ? r.depois < r.antes : r.depois > r.antes,
    }));
    const principal = intervencao.impacto[intervencao.temaAlvo] ?? 0;
    return {
      id,
      autor: "ia",
      texto: `Fiz a conta para "${intervencao.nome}" em ${local}.\n\nA nota de ${TEMAS[intervencao.temaAlvo].nome.toLowerCase()} muda cerca de ${Math.abs(principal)} pontos. Os outros temas também sentem o efeito. O serviço leva ${intervencao.prazo} e custa cerca de ${intervencao.custo}. Hoje a nota está em ${base[intervencao.temaAlvo]} de 100.`,
      simulacao: { local, intervencao: intervencao.nome, linhas },
    };
  }

  if (tema) {
    const pontos = PONTOS.filter(
      (p) => p.tema === tema && (!bairro || p.bairro === bairro),
    ).sort((a, b) =>
      menorEhMelhor(tema) ? b.valor - a.valor : a.valor - b.valor,
    );
    const pior = pontos[0];
    if (pior) {
      const lista = pontos
        .slice(0, 3)
        .map((p) => `• ${p.nome} (${p.bairro}) — ${p.valor} ${TEMAS[tema].unidade}`)
        .join("\n");
      return {
        id,
        autor: "ia",
        texto: `Sobre ${TEMAS[tema].nome.toLowerCase()}${bairro ? ` em ${bairro}` : " na ilha"}, o lugar que mais precisa de atenção é ${pior.nome}.\n\n${pior.detalhe}\n\nOs três primeiros da lista:\n${lista}\n\nQuem mediu: ${pior.fonte}, ${pior.atualizadoEm}. Se quiser, eu mostro como ficaria depois de uma melhoria nesse lugar.`,
      };
    }
  }

  return {
    id,
    autor: "ia",
    texto: `Ainda não sei responder isso. Como ${perfil.nome}, posso falar sobre ${perfil.temasPrioritarios
      .map((t) => TEMAS[t].nome.toLowerCase())
      .join(", ")}. Por exemplo: "qual lugar tem mais risco de alagar esta semana?" ou "e se a gente plantar árvores na Rua da Aurora?".`,
  };
}
