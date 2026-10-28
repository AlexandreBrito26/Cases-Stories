/* Áudio procedural (sem arquivos): chuva ambiente e um "tique" de interface. */
let ctx: AudioContext | null = null
let master: GainNode
let rain: GainNode
let music: GainNode
let cur = { vol: 70, ambient: true, sfx: true, music: true, musicVol: 60 }

function init() {
  if (ctx) return
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return
  ctx = new AC()
  master = ctx.createGain()
  master.connect(ctx.destination)
  music = ctx.createGain()
  music.gain.value = 0
  music.connect(master)
  // Reverb suave (resposta ao impulso sintética) para dar ambiente ao piano
  const irLen = Math.floor(ctx.sampleRate * 2.8)
  const ir = ctx.createBuffer(2, irLen, ctx.sampleRate)
  for (let ch = 0; ch < 2; ch++) {
    const data = ir.getChannelData(ch)
    for (let i = 0; i < irLen; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / irLen, 2.5)
  }
  const verb = ctx.createConvolver()
  verb.buffer = ir
  const wet = ctx.createGain()
  wet.gain.value = 0.4
  music.connect(verb)
  verb.connect(wet)
  wet.connect(master)
  const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
  const d = buf.getChannelData(0)
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
  const src = ctx.createBufferSource()
  src.buffer = buf
  src.loop = true
  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 500
  const lp = ctx.createBiquadFilter()
  lp.type = 'lowpass'
  lp.frequency.value = 3200
  rain = ctx.createGain()
  rain.gain.value = 0
  src.connect(hp)
  hp.connect(lp)
  lp.connect(rain)
  rain.connect(master)
  src.start()
}

function apply() {
  if (!ctx) return
  master.gain.setTargetAtTime(cur.vol / 100, ctx.currentTime, 0.05)
  rain.gain.setTargetAtTime(cur.ambient ? 0.05 : 0, ctx.currentTime, 0.4)
  music.gain.setTargetAtTime(cur.music ? (cur.musicVol / 100) * 0.8 : 0, ctx.currentTime, 0.4)
}

export function setAudio(vol: number, ambient: boolean, sfx: boolean, music: boolean, musicVol: number) {
  cur = { vol, ambient, sfx, music, musicVol }
  apply()
}

/** Chamar a partir de um gesto do usuário (política de autoplay). */
export function unlock() {
  init()
  void ctx?.resume()
  apply()
}

export function tick() {
  if (!ctx || !cur.sfx || cur.vol === 0) return
  const o = ctx.createOscillator()
  const g = ctx.createGain()
  o.type = 'triangle'
  o.frequency.setValueAtTime(620, ctx.currentTime)
  o.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.07)
  g.gain.setValueAtTime(0.07, ctx.currentTime)
  g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.09)
  o.connect(g)
  g.connect(master)
  o.start()
  o.stop(ctx.currentTime + 0.1)
}

/** Saída da trilha musical (null até o primeiro gesto do usuário). */
export function musicOut(): { ctx: AudioContext; out: GainNode } | null {
  return ctx && music ? { ctx, out: music } : null
}

/** Som curto ao encontrar uma evidência nova. */
export function chime() {
  if (!ctx || !cur.sfx || cur.vol === 0) return
  const c = ctx
  const t = c.currentTime
  ;[784, 1046.5].forEach((f, i) => {
    const o = c.createOscillator()
    const g = c.createGain()
    const at = t + i * 0.12
    o.type = 'sine'
    o.frequency.value = f
    g.gain.setValueAtTime(0.0001, at)
    g.gain.exponentialRampToValueAtTime(0.09, at + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, at + 0.5)
    o.connect(g)
    g.connect(master)
    o.start(at)
    o.stop(at + 0.55)
  })
}
