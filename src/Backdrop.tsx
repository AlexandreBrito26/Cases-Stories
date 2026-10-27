import { useEffect, useRef, useState } from 'react'
import { StaticScene } from './Scene'

/* Fundo animado do menu principal e da pausa: cena em SVG com movimento lento de câmera,
   camada de partículas em canvas (chuva, poeira, brasas, vaga-lumes), névoa, relâmpagos e luz oscilante.
   Respeita as Opções (gráficos baixos, movimento reduzido) e prefers-reduced-motion. */

type Mote = 'dust' | 'embers' | 'fireflies' | 'none'
interface Theme {
  rain: number // quantidade de gotas (0 = sem chuva)
  wind: number // inclinação da chuva (px por px de queda)
  speed: number // velocidade da chuva (1 = normal)
  mote: Mote
  motes: number
  fog: number // 0..1
  fogColor: string
  lightning: boolean
  beam: boolean // facho giratório (farol)
  warm: boolean // luz quente oscilante
}
const BASE: Theme = { rain: 0, wind: 0.22, speed: 1, mote: 'dust', motes: 26, fog: 0.5, fogColor: '170,190,200', lightning: false, beam: false, warm: true }
const THEMES: Record<string, Partial<Theme>> = {
  origem: { rain: 120, mote: 'dust', lightning: true },
  valverde: { rain: 170, mote: 'embers', motes: 22, lightning: true, fogColor: '150,170,190' },
  imperial: { rain: 0, mote: 'dust', motes: 38, fogColor: '200,120,130', fog: 0.4 },
  aurora: { rain: 0, mote: 'fireflies', motes: 22, fogColor: '190,160,120', fog: 0.55 },
  galeria: { rain: 0, mote: 'dust', motes: 30, fogColor: '200,200,210', fog: 0.3 },
  farol: { rain: 230, wind: 0.5, speed: 1.3, mote: 'none', motes: 0, lightning: true, beam: true, warm: false, fog: 0.7, fogColor: '150,175,190' },
  silencio: { rain: 70, mote: 'dust', motes: 24, fogColor: '170,200,210' },
  trem: { rain: 150, wind: 1.1, speed: 1.7, mote: 'dust', motes: 12, warm: true, fogColor: '120,140,160', fog: 0.35 },
}
const themeOf = (id: string): Theme => ({ ...BASE, ...(THEMES[id] || { rain: 100 }) })

export interface Slide { id: string; theme: string }

/** Detecta se as animações devem rodar (Opções + prefers-reduced-motion). */
function useLive() {
  const get = () => {
    const r = document.documentElement.dataset
    const reduce = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches
    return !reduce && r.fx !== 'low' && r.motion !== 'off'
  }
  const [live, setLive] = useState(get)
  useEffect(() => {
    const up = () => setLive(get())
    const mo = new MutationObserver(up)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-fx', 'data-motion'] })
    const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null
    mq?.addEventListener?.('change', up)
    return () => {
      mo.disconnect()
      mq?.removeEventListener?.('change', up)
    }
  }, [])
  return live
}

interface Drop { x: number; y: number; l: number; v: number; a: number }
interface Splash { x: number; y: number; t: number; max: number }
interface Particle { x: number; y: number; r: number; p: number; s: number; vx: number; vy: number }

function Particles({ theme }: { theme: Theme }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const th = useRef(theme)
  th.current = theme
  useEffect(() => {
    const cv = ref.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx) return
    let w = 0, h = 0, raf = 0, last = 0, alive = true
    const lowPower = (navigator.hardwareConcurrency || 4) <= 4
    let drops: Drop[] = [], splashes: Splash[] = [], motes: Particle[] = []
    const rnd = (a: number, b: number) => a + Math.random() * (b - a)
    const seed = () => {
      const t = th.current
      const k = (w < 640 ? 0.55 : 1) * (lowPower ? 0.7 : 1)
      drops = Array.from({ length: Math.round(t.rain * k) }, () => ({ x: rnd(-50, w + 50), y: rnd(0, h), l: rnd(10, 26), v: rnd(620, 980), a: rnd(0.1, 0.38) }))
      motes = Array.from({ length: t.mote === 'none' ? 0 : Math.round(t.motes * k) }, () => ({ x: rnd(0, w), y: rnd(0, h), r: rnd(0.7, t.mote === 'fireflies' ? 2.6 : 1.9), p: rnd(0, 6.28), s: rnd(0.4, 1.2), vx: rnd(-6, 6), vy: t.mote === 'embers' ? rnd(-46, -16) : rnd(-9, -2) }))
    }
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = cv.clientWidth
      h = cv.clientHeight
      cv.width = Math.round(w * dpr)
      cv.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(cv)
    let prevKey = ''
    const frame = (now: number) => {
      if (!alive) return
      raf = requestAnimationFrame(frame)
      if (document.hidden) { last = now; return }
      const dt = Math.min((now - (last || now)) / 1000, 0.05)
      last = now
      const t = th.current
      const key = t.rain + '|' + t.mote + '|' + t.motes
      if (key !== prevKey) { prevKey = key; seed() }
      ctx.clearRect(0, 0, w, h)
      // chuva
      if (t.rain) {
        ctx.lineWidth = 1
        for (const d of drops) {
          d.y += d.v * t.speed * dt
          d.x += d.v * t.speed * dt * t.wind
          if (d.y > h) {
            if (Math.random() < 0.35 && splashes.length < 40) splashes.push({ x: d.x, y: h - rnd(0, h * 0.12), t: 0, max: rnd(0.25, 0.45) })
            d.y = -d.l
            d.x = rnd(-80, w + 40)
          }
          ctx.strokeStyle = `rgba(185,210,225,${d.a})`
          ctx.beginPath()
          ctx.moveTo(d.x, d.y)
          ctx.lineTo(d.x - d.l * t.wind, d.y - d.l)
          ctx.stroke()
        }
        for (let i = splashes.length - 1; i >= 0; i--) {
          const s = splashes[i]
          s.t += dt
          if (s.t > s.max) { splashes.splice(i, 1); continue }
          const k = s.t / s.max
          ctx.strokeStyle = `rgba(185,210,225,${0.3 * (1 - k)})`
          ctx.beginPath()
          ctx.ellipse(s.x, s.y, 2 + k * 9, 0.8 + k * 2.4, 0, 0, 6.283)
          ctx.stroke()
        }
      }
      // partículas de ambiente
      for (const m of motes) {
        m.p += dt * m.s * 2
        m.x += (m.vx + Math.sin(m.p) * 10) * dt
        m.y += m.vy * dt
        if (m.y < -10) { m.y = h + 10; m.x = rnd(0, w) }
        if (m.x < -10) m.x = w + 10
        if (m.x > w + 10) m.x = -10
        const pulse = 0.5 + 0.5 * Math.sin(m.p * 1.7)
        if (t.mote === 'embers') {
          ctx.fillStyle = `rgba(255,${130 + pulse * 70 | 0},60,${0.25 + pulse * 0.5})`
          ctx.beginPath(); ctx.arc(m.x, m.y, m.r * (0.6 + pulse * 0.5), 0, 6.283); ctx.fill()
        } else if (t.mote === 'fireflies') {
          const g = ctx.createRadialGradient(m.x, m.y, 0, m.x, m.y, m.r * 6)
          g.addColorStop(0, `rgba(220,255,150,${0.15 + pulse * 0.75})`)
          g.addColorStop(1, 'rgba(220,255,150,0)')
          ctx.fillStyle = g
          ctx.beginPath(); ctx.arc(m.x, m.y, m.r * 6, 0, 6.283); ctx.fill()
        } else {
          ctx.fillStyle = `rgba(255,232,176,${0.1 + pulse * 0.32})`
          ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, 6.283); ctx.fill()
        }
      }
    }
    raf = requestAnimationFrame(frame)
    return () => {
      alive = false
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [])
  return <canvas ref={ref} className="bd-canvas" aria-hidden="true" />
}

/** Relâmpagos em intervalos aleatórios. */
function Lightning({ on }: { on: boolean }) {
  const el = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!on) return
    let timer = 0
    const fire = () => {
      const n = el.current
      if (n && !document.hidden) {
        n.classList.remove('go')
        void n.offsetWidth
        n.classList.add('go')
      }
      timer = window.setTimeout(fire, 7000 + Math.random() * 11000)
    }
    timer = window.setTimeout(fire, 3500 + Math.random() * 4000)
    return () => clearTimeout(timer)
  }, [on])
  return <div ref={el} className="bd-bolt" aria-hidden="true" />
}

export function Backdrop({ slides, interval = 13000 }: { slides: Slide[]; interval?: number }) {
  const live = useLive()
  const [idx, setIdx] = useState(0)
  const [prev, setPrev] = useState<number | null>(null)
  const n = slides.length
  const idxRef = useRef(0)
  useEffect(() => {
    if (n < 2 || !live) return
    const t = window.setInterval(() => {
      if (document.hidden) return
      const i = idxRef.current
      const nx = (i + 1) % n
      idxRef.current = nx
      setPrev(i)
      setIdx(nx)
    }, interval)
    return () => clearInterval(t)
  }, [n, interval, live])
  useEffect(() => {
    if (prev === null) return
    const t = window.setTimeout(() => setPrev(null), 2200)
    return () => clearTimeout(t)
  }, [prev])
  const cur = slides[Math.min(idx, n - 1)]
  const th = themeOf(cur.theme)
  const layer = (i: number, cls: string) => (
    <div className={'bd-slide ' + cls} key={i + ':' + slides[i].id}>
      <StaticScene id={slides[i].id} slice />
    </div>
  )
  return (
    <div className={'mbg bd' + (live ? ' live' : '')} style={{ ['--bd-fog' as string]: th.fog, ['--bd-fogc' as string]: th.fogColor }}>
      {prev !== null && prev < n && layer(prev, 'out')}
      {layer(Math.min(idx, n - 1), prev !== null ? 'in' : '')}
      {live && (
        <>
          <div className="bd-fog a" aria-hidden="true" />
          <div className="bd-fog b" aria-hidden="true" />
          {th.beam && <div className="bd-beam" aria-hidden="true" />}
          {th.warm && <div className="bd-warm" aria-hidden="true" />}
          <Particles theme={th} />
          <Lightning on={th.lightning} />
        </>
      )}
    </div>
  )
}
