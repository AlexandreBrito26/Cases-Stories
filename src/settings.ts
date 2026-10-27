import { setAudio } from './audio'

export interface Settings {
  vol: number
  ambient: boolean
  sfx: boolean
  music: boolean
  musicVol: number
  quality: 'high' | 'low'
  grain: boolean
  motion: boolean
}

export const DEFAULTS: Settings = {
  vol: 70,
  ambient: true,
  sfx: true,
  music: true,
  musicVol: 60,
  quality: 'high',
  grain: true,
  motion: true,
}
const KEY = 'cases-stories-settings-v1'

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...DEFAULTS, ...JSON.parse(raw) }
  } catch {
    /* ignora */
  }
  return DEFAULTS
}

export function saveSettings(s: Settings) {
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* ignora */
  }
}

/** Aplica gráficos via atributos no <html> e som via WebAudio. */
export function applySettings(s: Settings) {
  const r = document.documentElement
  r.dataset.fx = s.quality
  r.dataset.grain = s.grain ? 'on' : 'off'
  r.dataset.motion = s.motion ? 'on' : 'off'
  setAudio(s.vol, s.ambient, s.sfx, s.music, s.musicVol)
}
