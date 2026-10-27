/* Trilha procedural por caso e por cômodo (WebAudio, sem arquivos).
   Cada caso tem uma base (andamento, harmonia, timbre); cada cômodo
   sobrescreve parte dela e pode transpor a harmonia (shift, em semitons). */
import { musicOut } from './audio'

interface Track {
  bpm: number
  beats: number // batidas por compasso
  chords: number[][] // frequências de cada acorde (progressão em loop)
  scale: number[] // notas da melodia
  pad: OscillatorType
  padCut: number
  lead: OscillatorType
  density: number // chance de nota da melodia por batida
  pulse: boolean // batida grave de tensão
}

type Room = Partial<Track> & { shift?: number }

const BASE: Record<string, { track: Track; rooms: Record<string, Room> }> = {
  // Valverde: mansão, homicídio. Lento, sombrio.
  valverde: {
    track: {
      bpm: 58,
      beats: 4,
      chords: [
        [73.42, 110, 146.83, 174.61], // Dm
        [58.27, 87.31, 116.54, 146.83], // Bb
        [49.0, 73.42, 98.0, 116.54], // Gm
        [55, 82.41, 110, 138.59], // A
      ],
      scale: [293.66, 349.23, 392.0, 440, 523.25, 587.33, 698.46],
      pad: 'sawtooth',
      padCut: 480,
      lead: 'sine',
      density: 0.22,
      pulse: true,
    },
    rooms: {
      esc: { bpm: 54, padCut: 380, density: 0.15, pulse: true }, // Escritório: lareira, corpo na poltrona
      coz: { bpm: 66, pad: 'triangle', padCut: 700, lead: 'triangle', density: 0.3, pulse: false, shift: 2 }, // Cozinha: cafés, louça
      bib: { bpm: 70, pad: 'sawtooth', padCut: 600, lead: 'sine', density: 0.35, pulse: false, shift: -2 }, // Biblioteca: discussão
      qua: { bpm: 48, pad: 'sine', padCut: 300, density: 0.1, pulse: true, shift: -5 }, // Quarto: sono, mala aberta
    },
  },
  // Imperial: teatro, valsa em 3/4, dramática.
  imperial: {
    track: {
      bpm: 84,
      beats: 3,
      chords: [
        [110, 164.81, 220, 261.63], // Am
        [87.31, 130.81, 174.61, 220], // F
        [82.41, 123.47, 164.81, 207.65], // E
        [110, 164.81, 220, 261.63], // Am
      ],
      scale: [440, 493.88, 523.25, 587.33, 659.25, 698.46, 830.61, 880],
      pad: 'triangle',
      padCut: 1400,
      lead: 'triangle',
      density: 0.5,
      pulse: false,
    },
    rooms: {
      cam: { bpm: 92, pad: 'triangle', padCut: 1800, density: 0.55, shift: 3 }, // Camarim: brilho, maquiagem
      pal: { bpm: 76, pad: 'sawtooth', padCut: 1000, lead: 'sine', density: 0.4, shift: -3 }, // Palco: queda, tragédia
      bil: { bpm: 100, pad: 'triangle', padCut: 1200, lead: 'triangle', density: 0.6 }, // Bilheteria: caixa, agitação
      cab: { bpm: 66, pad: 'sine', padCut: 900, lead: 'sine', density: 0.25, shift: -1 }, // Cabine: painéis, silêncio técnico
    },
  },
  // Aurora: vinícola, noite da colheita. Quente, pentatônica maior.
  aurora: {
    track: {
      bpm: 72,
      beats: 4,
      chords: [
        [130.81, 196, 261.63, 329.63], // C
        [110, 164.81, 220, 261.63], // Am
        [87.31, 130.81, 174.61, 220], // F
        [98, 146.83, 196, 246.94], // G
      ],
      scale: [523.25, 587.33, 659.25, 783.99, 880, 1046.5],
      pad: 'sine',
      padCut: 2000,
      lead: 'triangle',
      density: 0.45,
      pulse: false,
    },
    rooms: {
      aad: { bpm: 64, padCut: 1200, density: 0.35, shift: -2 }, // Adega: madeira, barricas
      alg: { bpm: 78, pad: 'sawtooth', padCut: 700, lead: 'square', density: 0.3, pulse: true }, // Lagar: maquinário, corpo
      aof: { bpm: 68, lead: 'triangle', density: 0.3, shift: 2 }, // Escritório: pastas, quadro de avisos
      apa: { bpm: 60, padCut: 2400, lead: 'sine', density: 0.5, shift: 3 }, // Parreiral: noite aberta, lua
    },
  },
}

BASE.origem = {
  track: {
    bpm: 66,
    beats: 4,
    chords: [
      [130.81, 196, 261.63, 329.63],
      [110, 164.81, 220, 261.63],
      [87.31, 130.81, 174.61, 220],
      [98, 146.83, 196, 246.94],
    ],
    scale: [523.25, 587.33, 659.25, 783.99, 880],
    pad: 'triangle',
    padCut: 1100,
    lead: 'sine',
    density: 0.3,
    pulse: false,
  },
  rooms: {},
}

BASE.galeria = {
  track: {
    bpm: 70,
    beats: 4,
    chords: [
      [110, 164.81, 220, 261.63],
      [87.31, 130.81, 174.61, 220],
      [98, 146.83, 196, 246.94],
      [110, 164.81, 220, 261.63],
    ],
    scale: [440, 523.25, 587.33, 659.25, 783.99],
    pad: 'sine',
    padCut: 900,
    lead: 'sine',
    density: 0.3,
    pulse: false,
  },
  rooms: {
    gal: { bpm: 66, density: 0.25 },
    res: { bpm: 72, lead: 'triangle', density: 0.35, shift: 2 },
    cof: { bpm: 60, pad: 'sawtooth', padCut: 600, pulse: true, shift: -3 },
    ter: { bpm: 64, padCut: 1600, density: 0.4, shift: 3 },
  },
}

BASE.farol = {
  track: {
    bpm: 62,
    beats: 4,
    chords: [
      [87.31, 130.81, 174.61, 220],
      [73.42, 110, 146.83, 174.61],
      [58.27, 87.31, 116.54, 146.83],
      [65.41, 98, 130.81, 164.81],
    ],
    scale: [349.23, 392, 440, 523.25, 587.33],
    pad: 'sine',
    padCut: 800,
    lead: 'sine',
    density: 0.25,
    pulse: false,
  },
  rooms: {
    tor: { bpm: 56, pad: 'sawtooth', padCut: 500, pulse: true, shift: -2 },
    cas: { bpm: 64, lead: 'triangle', density: 0.3 },
    anc: { bpm: 60, pad: 'triangle', padCut: 1400, density: 0.3, shift: 2 },
    dep: { bpm: 70, pad: 'sawtooth', padCut: 600, density: 0.35, pulse: true, shift: -4 },
  },
}

BASE.trem = {
  track: {
    bpm: 80,
    beats: 4,
    chords: [
      [98, 146.83, 196, 246.94],
      [87.31, 130.81, 174.61, 220],
      [110, 164.81, 220, 261.63],
      [98, 146.83, 196, 246.94],
    ],
    scale: [392, 440, 493.88, 587.33, 659.25],
    pad: 'triangle',
    padCut: 1000,
    lead: 'triangle',
    density: 0.35,
    pulse: false,
  },
  rooms: {
    vag: { bpm: 84, density: 0.5, shift: 2 },
    cab: { bpm: 70, pad: 'sine', density: 0.2, shift: -2 },
    pla: { bpm: 76, padCut: 1600, lead: 'sine' },
    loc: { bpm: 96, pad: 'sawtooth', padCut: 700, pulse: true, shift: -3 },
  },
}
BASE.silencio = {
  track: {
    bpm: 50,
    beats: 4,
    chords: [
      [65.41, 98, 130.81, 164.81],
      [58.27, 87.31, 116.54, 146.83],
      [55, 82.41, 110, 138.59],
      [65.41, 98, 130.81, 164.81],
    ],
    scale: [261.63, 293.66, 329.63, 392],
    pad: 'sine',
    padCut: 400,
    lead: 'sine',
    density: 0.12,
    pulse: true,
  },
  rooms: {
    esp: { bpm: 46, density: 0.08 },
    por: { bpm: 52, pad: 'sawtooth', padCut: 300, shift: -4 },
    jar: { bpm: 56, padCut: 700, density: 0.2, shift: 3 },
    sot: { bpm: 48, pulse: false, density: 0.15 },
  },
}

function resolve(theme: string, room: string): Track | null {
  const b = BASE[theme]
  if (!b) return null
  const r: Room = b.rooms[room] ?? {}
  const { shift = 0, ...over } = r
  const k = Math.pow(2, shift / 12)
  const t: Track = { ...b.track, ...over } as Track
  return {
    ...t,
    chords: t.chords.map((c) => c.map((f) => f * k)),
    scale: t.scale.map((f) => f * k),
  }
}

let track: Track | null = null
let timer: number | null = null
let nextT = 0
let step = 0

function osc(ctx: AudioContext, out: AudioNode, type: OscillatorType, f: number, t: number, dur: number, peak: number, attack: number) {
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = type
  o.frequency.setValueAtTime(f, t)
  g.gain.setValueAtTime(0.0001, t)
  g.gain.exponentialRampToValueAtTime(peak, t + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur)
  o.connect(g)
  g.connect(out)
  o.start(t)
  o.stop(t + dur + 0.05)
}

function scheduleBeat(ctx: AudioContext, out: GainNode, tr: Track, n: number, t: number, beat: number) {
  const bar = Math.floor(n / tr.beats)
  const b = n % tr.beats
  const chord = tr.chords[bar % tr.chords.length]
  const barDur = beat * tr.beats

  if (b === 0) {
    // Pad: acorde sustentado no início de cada compasso
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = tr.padCut
    filter.connect(out)
    for (const f of chord) {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = tr.pad
      o.frequency.setValueAtTime(f, t)
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.025, t + 1.2)
      g.gain.exponentialRampToValueAtTime(0.0001, t + barDur + 0.8)
      o.connect(g)
      g.connect(filter)
      o.start(t)
      o.stop(t + barDur + 1)
    }
    // Baixo uma oitava abaixo da raiz
    osc(ctx, out, 'sine', chord[0] / 2, t, barDur * 0.95, 0.12, 0.05)
  }

  if (tr.pulse && (b === 0 || b === 2)) {
    // Batida de coração: tensão constante
    osc(ctx, out, 'sine', 55, t, 0.25, 0.09, 0.02)
  }

  if (Math.random() < tr.density) {
    const f = tr.scale[Math.floor(Math.random() * tr.scale.length)]
    const len = beat * (Math.random() < 0.5 ? 1 : 2)
    osc(ctx, out, tr.lead, f, t + (Math.random() * beat) / 3, len, 0.045, 0.03)
  }
}

let group: GainNode | null = null

/** Desvanece o grupo antigo e o descarta depois que terminar. */
function retire(g: GainNode) {
  const m = musicOut()
  if (!m) return
  g.gain.setTargetAtTime(0, m.ctx.currentTime, 0.5)
  setTimeout(() => g.disconnect(), 3000)
}

function tickScheduler() {
  const m = musicOut()
  if (!m || !track) return
  const { ctx, out } = m
  if (!group) {
    // Grupo novo entra com fade-in, sem cortar o anterior de forma seca
    group = ctx.createGain()
    group.gain.setValueAtTime(0, ctx.currentTime)
    group.gain.setTargetAtTime(1, ctx.currentTime, 0.6)
    group.connect(out)
  }
  const beat = 60 / track.bpm
  if (nextT < ctx.currentTime) nextT = ctx.currentTime + 0.1
  while (nextT < ctx.currentTime + 0.4) {
    scheduleBeat(ctx, group, track, step, nextT, beat)
    nextT += beat
    step++
  }
}

/** Troca a trilha para o cômodo aberto (tema do caso + id da cena), com fade cruzado. */
export function playTrack(theme: string, room: string) {
  if (group) {
    retire(group)
    group = null
  }
  track = resolve(theme, room)
  step = 0
  nextT = 0
  if (timer === null) timer = window.setInterval(tickScheduler, 120)
  tickScheduler()
}

/** Para a trilha com fade (as notas já agendadas terminam sozinhas). */
export function stopTrack() {
  track = null
  if (group) {
    retire(group)
    group = null
  }
  if (timer !== null) {
    clearInterval(timer)
    timer = null
  }
}
