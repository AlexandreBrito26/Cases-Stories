/* Conquistas salvas em localStorage (fora dos saves de cada caso). */
import { TENTATIVAS_LIVRES } from './state'

export const ACHIEVEMENTS: { id: string; title: string; desc: string }[] = [
  { id: 'origem', title: 'Onde tudo começou', desc: 'Resolva o Caso 000.' },
  { id: 'valverde', title: 'Mansão Valverde', desc: 'Resolva o Caso Valverde.' },
  { id: 'imperial', title: 'Cortina fechada', desc: 'Resolva o Caso Imperial.' },
  { id: 'aurora', title: 'Safra perfeita', desc: 'Resolva o Caso Aurora.' },
  { id: 'sem-dicas', title: 'Olho treinado', desc: 'Resolva um caso sem usar nenhuma dica.' },
  { id: 'galeria', title: 'Quadro falso', desc: 'Resolva o Caso 004.' },
  { id: 'investigador', title: 'Sem rede de apoio', desc: 'Resolva um caso no modo investigador.' },
  { id: 'farol', title: 'Luz na costa', desc: 'Resolva o Caso 005.' },
  { id: 'trem', title: 'Último vagão', desc: 'Resolva o Caso 006.' },
  { id: 'silencio', title: 'Ouvido absoluto', desc: 'Resolva o Caso 007, o desafio.' },
  { id: 'todos', title: 'Arquivo completo', desc: 'Resolva todos os casos do arquivo.' },
]

const KEY = 'cases-stories-achievements-v1'

export function getAch(): string[] {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as string[]) : []
  } catch {
    return []
  }
}

export function grantAch(ids: string[]) {
  try {
    const cur = new Set(getAch())
    ids.forEach((i) => cur.add(i))
    localStorage.setItem(KEY, JSON.stringify([...cur]))
  } catch {
    /* ignora */
  }
}

/** Pontuação: começa em 1000. Até 10 erros são livres; depois cada erro tira 50. Cada dica tira 75. Modo investigador dobra. */
export function scoreOf(s: { tries: number; hints: number; investigador: boolean }): number {
  const erros = Math.max(0, s.tries - TENTATIVAS_LIVRES)
  return Math.max(0, 1000 - 50 * erros - 75 * s.hints) * (s.investigador ? 2 : 1)
}

const SKEY = 'cases-stories-scores-v1'

export function bestScore(id: string): number {
  try {
    const j = JSON.parse(localStorage.getItem(SKEY) || '{}')
    return j[id] ?? 0
  } catch {
    return 0
  }
}

export function saveScore(id: string, score: number) {
  try {
    const j = JSON.parse(localStorage.getItem(SKEY) || '{}')
    j[id] = Math.max(j[id] ?? 0, score)
    localStorage.setItem(SKEY, JSON.stringify(j))
  } catch {
    /* ignora */
  }
}
