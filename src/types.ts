export type Flag = 'contra' | 'clear' | 'adm' | 'crack'

export interface Suspect {
  id: string
  name: string
  role: string
  ini: string
  qs: [string, string, string?][] // 3º item: id da evidência que libera a pergunta
  re: Record<string, [string] | [string, Flag]>
}

export interface Clue {
  id: string
  sc: string
  t: string
  x: string
}

export interface SceneData {
  n: string
  d: string
  h: [string, number, number][]
}

export interface Case {
  id: string
  key: string // chave do localStorage
  theme: string
  no: string
  title: string
  titleLines: string[]
  kind: string
  tagline: string
  synopsis: string
  place: string
  bg: string // cena usada como fundo do menu
  suspectsLabel: string
  suspects: Suspect[]
  clues: Clue[]
  scenes: Record<string, SceneData>
  met: string[]
  mot: string[]
  win: { s: string; m: number; r: number; text: string[] }
  ranks: [number, string][]
  linha?: { id: string; h: string; t: string }[] // ordem correta da noite
  desafio?: boolean // só abre ao zerar os demais casos; pistas escondidas
  tutorial?: Partial<Record<'cenas' | 'susp' | 'quadro' | 'acusar', string>>
}
