/* Fase B: linha do tempo da noite e perguntas condicionais por caso.
   Mantido fora dos arquivos de caso para não mexer no conteúdo base. */
import type { Case } from './types'

export const LINHA: Record<string, { id: string; h: string; t: string }[]> = {
  origem: [
    { id: 'g1', h: '21h50', t: 'Um táxi chega à mansão e sai logo em seguida' },
    { id: 'g2', h: '22h10', t: 'O relógio de Vânia para no quarto de hóspedes' },
    { id: 'g3', h: '23h00', t: 'Um encontro marcado na agenda da casa' },
    { id: 'g4', h: '00h10', t: 'A joia desaparece da caixa do escritório' },
  ],
  valverde: [
    { id: 'v1', h: '21h30', t: 'Marta prepara a bandeja do jantar' },
    { id: 'v2', h: '21h50', t: 'Ligação para o Hospital São Lucas, por 30 minutos' },
    { id: 'v3', h: '22h00', t: 'Dr. Heitor leva a bandeja ao Sr. Augusto' },
    { id: 'v4', h: '22h40', t: 'Augusto é encontrado morto na poltrona' },
  ],
  imperial: [
    { id: 'o1', h: '22h32', t: 'Otávio entra na coxia com a maleta de manutenção' },
    { id: 'o2', h: '22h45', t: 'Sérgio marca conversa no urdimento' },
    { id: 'o3', h: '22h58', t: 'Otávio sai da coxia, sem a maleta' },
    { id: 'o4', h: '23h05', t: 'Sérgio é achado no palco, após a queda' },
  ],
  aurora: [
    { id: 'a1', h: '20h48', t: 'O cartão de Dante abre a porta do lagar' },
    { id: 'a2', h: '20h52', t: 'O exaustor do lagar é desligado à mão' },
    { id: 'a3', h: '21h15', t: 'Dante volta à sala de degustação' },
    { id: 'a4', h: '21h45', t: 'Ângelo é achado no lagar' },
  ],
  galeria: [
    { id: 'k1', h: '18h00', t: 'O laudo da tela rara é assinado, na véspera' },
    { id: 'k2', h: '21h40', t: 'Igor começa a limpar a tela no ateliê' },
    { id: 'k3', h: '22h10', t: 'Eduardo envia a mensagem sobre o laudo' },
    { id: 'k4', h: '23h20', t: 'Eduardo é achado morto no ateliê' },
  ],
  trem: [
    { id: 'tr1', h: '21h30', t: 'Renato janta no vagão-restaurante, com taça de vinho' },
    { id: 'tr2', h: '22h40', t: 'A conta da mesa de Renato é paga sem assinatura' },
    { id: 'tr3', h: '02h00', t: 'O trem para na parada sem autorização' },
    { id: 'tr4', h: '03h00', t: 'Renato é achado morto na cabine 7' },
  ],
  silencio: [
    { id: 's1', h: '22h00', t: 'Benedita leva chá a Lorena, que está nervosa' },
    { id: 's2', h: '23h00', t: 'Olívia termina o ensaio na sala de espelhos' },
    { id: 's3', h: '23h30', t: 'O gerador do porão é desligado às pressas' },
    { id: 's4', h: '00h15', t: 'Lorena é achada morta no sótão' },
  ],
  farol: [
    { id: 'f1', h: '21h30', t: 'Tiago recolhe as redes e volta com o barco' },
    { id: 'f2', h: '23h00', t: 'A lâmpada do farol é desligada à mão' },
    { id: 'f3', h: '23h10', t: 'Joaquim sobe à torre para ver a luz' },
    { id: 'f4', h: '23h40', t: 'Joaquim é achado na base da escada' },
  ],
}

type Cond = [string, string, string]

/** Perguntas que só se abrem depois de apresentar a evidência indicada. */
export const CONDICIONAIS: Record<string, Record<string, Cond[]>> = {
  origem: { va: [['Você abriu a caixa de joias da sua tia?', 'Não. Ela guardava a chave consigo, sempre.', 'c1']] },
  valverde: { hei: [['O senhor levou a bandeja ao Augusto às 22h?', 'Levei. Entreguei e saí logo em seguida, para atender um paciente.', 'c3']] },
  imperial: { ota: [['Por que o senhor entrou na coxia com a maleta?', 'Manutenção da trava da grade. Ninguém me avisou que estava solta.', 'c7']] },
  aurora: { dan: [['O que você fez entre 21h05 e 21h15?', 'Fui ao lagar checar a temperatura dos tanques. Esqueci de mencionar.', 'c7']] },
  galeria: { ig: [['Por que o cofre estava entreaberto?', 'Eu nunca tive a combinação. Não sei quem abriu.', 'c5']] },
  trem: { gu: [['Você desceu na parada das 2h?', 'Não. Fiquei na cabine até o amanhecer, pensando na fusão.', 'c5']] },
  silencio: { hu: [['Você estava no porão quando a energia caiu?', 'Só desliguei o gerador para o reparo, como sempre faço.', 'c3']] },
  farol: { ar: [['Quem mais sabia a combinação da caixa de ferro?', 'Só o Joaquim e eu. A esposa, talvez, pelo que ele comentava.', 'c1']] },
}

/** Aplica linha do tempo e perguntas condicionais aos casos. */
export function enrich(c: Case): Case {
  const cond = CONDICIONAIS[c.id] ?? {}
  return {
    ...c,
    linha: LINHA[c.id],
    suspects: c.suspects.map((p) => ({ ...p, qs: [...p.qs, ...(cond[p.id] ?? [])] })),
  }
}
