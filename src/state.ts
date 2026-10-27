import { useEffect, useMemo, useReducer } from 'react'
import type { Case, Flag } from './types'
import { CUTS } from './svg'

export type Tab = 'cenas' | 'susp' | 'quadro' | 'acusar'
export type CutId = 'intro' | 'end'

export interface LogEntry {
  k: string
  q: string
  a: string
  f?: Flag | null
}

export interface Accusation {
  s: string | null
  m: number | null
  r: number | null
}

export interface GameState {
  started: boolean
  tab: Tab
  scene: string
  sel: string | null
  clues: string[]
  pins: Partial<Record<string, string | null>>
  log: Partial<Record<string, LogEntry[]>>
  acc: Accusation
  res: 'win' | 'lose' | null
  tries: number
  open: string | null
  fresh: boolean
  menu: boolean
  how: boolean
  cut: { id: CutId; i: number } | null
}

export type Action =
  | { type: 'start' }
  | { type: 'tab'; id: Tab }
  | { type: 'scene'; id: string }
  | { type: 'clue'; id: string }
  | { type: 'close' }
  | { type: 'sus'; id: string }
  | { type: 'back' }
  | { type: 'ask'; i: number }
  | { type: 'show'; id: string }
  | { type: 'pin'; id: string; s: string }
  | { type: 'acc'; k: 's'; v: string }
  | { type: 'acc'; k: 'm' | 'r'; v: number }
  | { type: 'accuse' }
  | { type: 'cont' }
  | { type: 'menu' }
  | { type: 'how' }
  | { type: 'replay' }
  | { type: 'new' }
  | { type: 'cnext' }
  | { type: 'cskip' }
  | { type: 'retry' }
  | { type: 'reset' }

const fresh = (cs: Case): GameState => ({
  started: false,
  tab: 'cenas',
  scene: Object.keys(cs.scenes)[0],
  sel: null,
  clues: [],
  pins: {},
  log: {},
  acc: { s: null, m: null, r: null },
  res: null,
  tries: 0,
  open: null,
  fresh: false,
  menu: true,
  how: false,
  cut: null,
})

function init(cs: Case): GameState {
  const s = fresh(cs)
  try {
    const raw = localStorage.getItem(cs.key)
    if (raw) Object.assign(s, JSON.parse(raw))
  } catch {
    /* localStorage indisponível */
  }
  s.open = null
  s.cut = null
  s.menu = true
  return s
}

const newGame = (cs: Case, extra: Partial<GameState>): GameState => ({ ...fresh(cs), started: true, menu: false, ...extra })

export const makeReducer = (cs: Case) => (s: GameState, a: Action): GameState => {
  switch (a.type) {
    case 'start':
      return { ...s, started: true, cut: { id: 'intro', i: 0 } }
    case 'tab':
      return { ...s, tab: a.id, sel: null }
    case 'scene':
      return { ...s, scene: a.id }
    case 'clue': {
      const isNew = !s.clues.includes(a.id)
      return { ...s, clues: isNew ? [...s.clues, a.id] : s.clues, fresh: isNew, open: a.id }
    }
    case 'close':
      return { ...s, open: null, fresh: false }
    case 'sus':
      return { ...s, sel: a.id }
    case 'back':
      return { ...s, sel: null }
    case 'ask': {
      const p = cs.suspects.find((x) => x.id === s.sel)
      if (!p) return s
      const e: LogEntry = { k: 'q' + a.i, q: p.qs[a.i][0], a: p.qs[a.i][1] }
      return { ...s, log: { ...s.log, [p.id]: [...(s.log[p.id] ?? []), e] } }
    }
    case 'show': {
      const p = cs.suspects.find((x) => x.id === s.sel)
      if (!p) return s
      const r = p.re[a.id]
      const c = cs.clues.find((x) => x.id === a.id)!
      const e: LogEntry = {
        k: a.id,
        q: 'Você mostra: ' + c.t,
        a: r ? r[0] : 'Não vejo o que isso tem a ver comigo.',
        f: r && r[1] ? r[1] : null,
      }
      return { ...s, log: { ...s.log, [p.id]: [...(s.log[p.id] ?? []), e] } }
    }
    case 'pin':
      return { ...s, pins: { ...s.pins, [a.id]: s.pins[a.id] === a.s ? null : a.s } }
    case 'acc':
      return { ...s, acc: { ...s.acc, [a.k]: a.v } }
    case 'accuse': {
      const { s: who, m, r } = s.acc
      if (who === cs.win.s && m === cs.win.m && r === cs.win.r) return { ...s, res: 'win', cut: { id: 'end', i: 0 } }
      return { ...s, res: 'lose', tries: s.tries + 1 }
    }
    case 'cont':
      return { ...s, menu: false }
    case 'menu':
      return { ...s, menu: true, open: null }
    case 'how':
      return { ...s, how: !s.how }
    case 'replay':
      return { ...s, started: true, menu: false, cut: { id: 'intro', i: 0 } }
    case 'new':
      return newGame(cs, { cut: { id: 'intro', i: 0 } })
    case 'cnext': {
      if (!s.cut) return s
      const i = s.cut.i + 1
      return { ...s, cut: i >= CUTS[cs.id][s.cut.id].length ? null : { ...s.cut, i } }
    }
    case 'cskip':
      return { ...s, cut: null }
    case 'retry':
      return { ...s, res: null }
    case 'reset':
      return newGame(cs, {})
  }
}

export function useGame(cs: Case) {
  const reducer = useMemo(() => makeReducer(cs), [cs])
  const [state, dispatch] = useReducer(reducer, cs, init)
  useEffect(() => {
    try {
      localStorage.setItem(cs.key, JSON.stringify(state))
    } catch {
      /* ignora */
    }
  }, [state, cs.key])
  return [state, dispatch] as const
}

/** Lê o progresso salvo de um caso (para a tela inicial). */
export function peek(cs: Case): { started: boolean; clues: number; solved: boolean } {
  try {
    const raw = localStorage.getItem(cs.key)
    if (raw) {
      const j = JSON.parse(raw)
      return { started: !!j.started, clues: (j.clues ?? []).length, solved: j.res === 'win' }
    }
  } catch {
    /* ignora */
  }
  return { started: false, clues: 0, solved: false }
}

const LAST = 'cases-stories-last'
export function getLast(): string | null {
  try {
    return localStorage.getItem(LAST)
  } catch {
    return null
  }
}
export function setLast(id: string) {
  try {
    localStorage.setItem(LAST, id)
  } catch {
    /* ignora */
  }
}
/** Apaga o progresso de todos os casos. */
export function resetAll(keys: string[]) {
  try {
    keys.forEach((k) => localStorage.removeItem(k))
    localStorage.removeItem(LAST)
  } catch {
    /* ignora */
  }
}
