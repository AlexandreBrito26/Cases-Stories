/* D3: estatísticas de casos resolvidos (localStorage, uma chave). */
export interface CaseStats {
  resolvidos: number
  acusacoes: number // total de acusações, certas e erradas
  dicas: number
  tempoMs: number
  ultimoInicio: number // evita contar duas vezes a mesma partida
}

export type Stats = Record<string, CaseStats>
const KEY = 'cases-stories-stats-v1'

export function getStats(): Stats {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '{}')
  } catch {
    return {}
  }
}

/** Registra uma vitória uma única vez por partida (startedAt identifica a partida). */
export function registrarVitoria(caseId: string, dados: { startedAt: number; tries: number; hints: number }) {
  try {
    const st = getStats()
    const atual = st[caseId] ?? { resolvidos: 0, acusacoes: 0, dicas: 0, tempoMs: 0, ultimoInicio: 0 }
    if (dados.startedAt && atual.ultimoInicio === dados.startedAt) return
    const tempo = dados.startedAt ? Math.max(0, Date.now() - dados.startedAt) : 0
    st[caseId] = {
      resolvidos: atual.resolvidos + 1,
      acusacoes: atual.acusacoes + dados.tries + 1,
      dicas: atual.dicas + dados.hints,
      tempoMs: atual.tempoMs + tempo,
      ultimoInicio: dados.startedAt || atual.ultimoInicio,
    }
    localStorage.setItem(KEY, JSON.stringify(st))
  } catch {
    /* ignora */
  }
}

export const fmtTempo = (ms: number) => {
  const m = Math.round(ms / 60000)
  return m < 1 ? '< 1 min' : `${m} min`
}
