/* D4: exporta e importa todo o progresso do jogo (chaves 'cases-stories-*') em um arquivo JSON. */
const PREFIXO = 'cases-stories-'
const VERSAO = 1

export function exportarProgresso() {
  const dados: Record<string, string> = {}
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && k.startsWith(PREFIXO)) dados[k] = localStorage.getItem(k) ?? ''
  }
  const blob = new Blob([JSON.stringify({ versao: VERSAO, dados }, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'cases-stories-progresso.json'
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/** Lê o arquivo e grava as chaves válidas. Devolve quantas foram importadas. */
export async function importarProgresso(arquivo: File): Promise<number> {
  const j = JSON.parse(await arquivo.text())
  if (!j || j.versao !== VERSAO || typeof j.dados !== 'object') throw new Error('arquivo inválido')
  let n = 0
  for (const [k, v] of Object.entries(j.dados)) {
    if (k.startsWith(PREFIXO) && typeof v === 'string') {
      localStorage.setItem(k, v)
      n++
    }
  }
  return n
}
