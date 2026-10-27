import { NOME_PADRAO } from './lore'

const KEY = 'cases-stories-nome-v1'
const MAX = 30

export function getNome(): string {
  try {
    return localStorage.getItem(KEY) || NOME_PADRAO
  } catch {
    return NOME_PADRAO
  }
}

/** Salva o nome (sem espaços sobrando, até 30 caracteres). Vazio volta ao padrão. */
export function setNome(n: string): string {
  const limpo = n.trim().replace(/\s+/g, ' ').slice(0, MAX)
  const final = limpo || NOME_PADRAO
  try {
    if (final === NOME_PADRAO) localStorage.removeItem(KEY)
    else localStorage.setItem(KEY, final)
  } catch {
    /* ignora */
  }
  return final
}
