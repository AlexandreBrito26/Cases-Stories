import { useMemo, useRef, useState, type ReactNode } from 'react'
import { exportarProgresso, importarProgresso } from './backup'
import { CASES } from './cases'
import { Emblem } from './Logo'
import { StaticScene } from './Scene'
import { Backdrop } from './Backdrop'
import { getLast, peek, resetAll } from './state'
import { DEFAULTS, type Settings } from './settings'
import { ACHIEVEMENTS, getAch } from './achievements'
import { fmtTempo, getStats } from './stats'
import { CAPITULOS, textoLore } from './lore'
import { getNome, setNome } from './nome'
import type { Case } from './types'

export type View = 'main' | 'cases' | 'options' | 'lore' | 'conquistas'

/** Espelho quebrado: estilhaços irradiando de um ponto de impacto, cada um com seu brilho. */
function Shards() {
  const shards = useMemo(() => {
    let a = 7
    const rnd = () => {
      a = (a + 0x6d2b79f5) | 0
      let t = Math.imul(a ^ (a >>> 15), 1 | a)
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296
    }
    const cx = 240
    const cy = 360
    const radii = [0, 80, 190, 380, 900]
    const n = 11
    const ang = Array.from({ length: n }, (_, i) => ((i + (rnd() - 0.5) * 0.5) / n) * Math.PI * 2)
    const pt = (ri: number, i: number): [number, number] => {
      const r = radii[ri] * (ri === 0 ? 0 : 0.85 + rnd() * 0.3)
      return [cx + Math.cos(ang[i % n]) * r, cy + Math.sin(ang[i % n]) * r]
    }
    const ring = radii.map((_, ri) => Array.from({ length: n }, (_, i) => pt(ri, i)))
    const out: { d: string; g: number; dx: number; dy: number; rot: number; o: number; delay: number }[] = []
    const push = (pts: [number, number][]) =>
      out.push({
        d: pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join(' '),
        g: Math.floor(rnd() * 3),
        dx: (rnd() - 0.5) * 5,
        dy: (rnd() - 0.5) * 5,
        rot: (rnd() - 0.5) * 1.6,
        o: 0.35 + rnd() * 0.65,
        delay: -rnd() * 9,
      })
    for (let i = 0; i < n; i++) push([[cx, cy], ring[1][i], ring[1][(i + 1) % n]])
    for (let r = 1; r < radii.length - 1; r++)
      for (let i = 0; i < n; i++) push([ring[r][i], ring[r + 1][i], ring[r + 1][(i + 1) % n], ring[r][(i + 1) % n]])
    return out
  }, [])
  return (
    <svg className="shards" viewBox="0 0 400 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id="sg0" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".16" />
          <stop offset=".5" stopColor="#9fc3d0" stopOpacity=".03" />
          <stop offset="1" stopColor="#000" stopOpacity=".35" />
        </linearGradient>
        <linearGradient id="sg1" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".05" />
          <stop offset=".6" stopColor="#d0a649" stopOpacity=".06" />
          <stop offset="1" stopColor="#fff" stopOpacity=".14" />
        </linearGradient>
        <linearGradient id="sg2" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity=".4" />
          <stop offset=".55" stopColor="#fff" stopOpacity=".02" />
          <stop offset="1" stopColor="#cfe6ee" stopOpacity=".18" />
        </linearGradient>
      </defs>
      {shards.map((s, i) => (
        <polygon
          key={i}
          className="shard"
          points={s.d}
          fill={`url(#sg${s.g})`}
          style={{
            transform: `translate(${s.dx}px,${s.dy}px) rotate(${s.rot}deg)`,
            transformOrigin: '240px 360px',
            opacity: s.o,
            animationDelay: s.delay + 's',
          }}
        />
      ))}
    </svg>
  )
}

function Switch({ on, onChange, label }: { on: boolean; onChange: (v: boolean) => void; label: string }) {
  return <button className="sw" role="switch" aria-checked={on} aria-label={label} onClick={() => onChange(!on)} />
}

function Row({ title, hint, children }: { title: string; hint?: string; children: ReactNode }) {
  return (
    <div className="orow">
      <div>
        <div className="otitle">{title}</div>
        {hint && <div className="ohint">{hint}</div>}
      </div>
      {children}
    </div>
  )
}

/** D3: estatísticas dos casos resolvidos. */
function EstatisticasView() {
  const st = getStats()
  const linhas = CASES.filter((c) => st[c.id])
  const totalRes = linhas.reduce((n, c) => n + st[c.id].resolvidos, 0)
  const totalAc = linhas.reduce((n, c) => n + st[c.id].acusacoes, 0)
  const totalTempo = linhas.reduce((n, c) => n + st[c.id].tempoMs, 0)
  const totalDicas = linhas.reduce((n, c) => n + st[c.id].dicas, 0)
  if (!linhas.length)
    return (
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="label">Estatísticas</div>
        <p className="empty">Resolva um caso para ver as estatísticas aqui.</p>
      </div>
    )
  return (
    <div className="card stats" style={{ marginBottom: 12 }}>
      <div className="label">Estatísticas</div>
      <div className="sumgrid">
        <div>
          <b>{totalRes}</b>casos resolvidos
        </div>
        <div>
          <b>{totalAc ? Math.round((totalRes / totalAc) * 100) : 0}%</b>taxa de acerto
        </div>
        <div>
          <b>{fmtTempo(totalTempo / totalRes)}</b>tempo médio
        </div>
        <div>
          <b>{(totalDicas / totalRes).toFixed(1)}</b>dicas por caso
        </div>
      </div>
      {linhas.map((c) => {
        const x = st[c.id]
        return (
          <p key={c.id} className="hist">
            <b>{c.title}</b>: {x.resolvidos}× · {fmtTempo(x.tempoMs / x.resolvidos)} · {x.acusacoes ? Math.round((x.resolvidos / x.acusacoes) * 100) : 0}% de acerto · {(x.dicas / x.resolvidos).toFixed(1)} dicas
          </p>
        )
      })}
    </div>
  )
}

function Back({ onClick, title }: { onClick: () => void; title: string }) {
  return (
    <div className="nhead">
      <button className="nback" aria-label="Voltar" onClick={onClick}>
        ‹
      </button>
      <h2>{title}</h2>
    </div>
  )
}

/** Carrossel do fundo do menu: começa pelo último caso jogado e passa pelos demais. */
function menuSlides(lastId?: string) {
  const i = Math.max(0, CASES.findIndex((c) => c.id === lastId))
  return CASES.map((_, k) => CASES[(i + k) % CASES.length]).map((c) => ({ id: c.bg, theme: c.id }))
}

function CaseCard({ cs, onOpen }: { cs: Case; onOpen: (id: string) => void }) {
  const p = peek(cs)
  const st = p.solved ? 'solved' : p.started ? 'open' : 'new'
  const label = p.solved ? 'Resolvido' : p.started ? `Em andamento · ${p.clues}/${cs.clues.length}` : 'Em aberto'
  return (
    <button className="ncase" onClick={() => onOpen(cs.id)} aria-label={`Abrir ${cs.title}`}>
      <span className="nthumb">
        <StaticScene id={cs.bg} slice />
      </span>
      <span className="nno">Caso nº {cs.no}</span>
      <span className="ntitle">{cs.title}</span>
      <span className="nsyn">{cs.synopsis}</span>
      <span className="nfoot">
        <span className={'nchip ' + st}>{label}</span>
        <span className="nmeta">
          {cs.place}
        </span>
      </span>
    </button>
  )
}

interface Props {
  view: View
  setView: (v: View) => void
  onOpen: (id: string, resume: boolean) => void
  settings: Settings
  setSettings: (s: Settings) => void
}

export function MainMenu({ view, setView, onOpen, settings, setSettings }: Props) {
  const [confirm, setConfirm] = useState(false)
  const [msgImport, setMsgImport] = useState('')
  const arquivoRef = useRef<HTMLInputElement>(null)
  const [nome, setNomeAtual] = useState(getNome)
  const [rascunho, setRascunho] = useState(nome)
  const set = (patch: Partial<Settings>) => setSettings({ ...settings, ...patch })
  const last = CASES.find((c) => c.id === getLast())
  const lp = last ? peek(last) : null
  const canCont = !!last && !!lp?.started

  return (
    <>
      <Backdrop slides={menuSlides(last?.id)} />
      <Shards />
      <main className="mm" key={view}>
        {view === 'main' && (
          <>
            <Emblem size={92} />
            <div className="brand">Arquivo de investigações</div>
            <h1 className="mirror" data-text={'Cases\nStories'}>
              Cases
              <br />
              Stories
            </h1>
            <p className="mtag">Cada caso é um dossiê. Cada dossiê guarda um culpado.</p>
            <nav className="nmenu" aria-label="Menu principal">
              <button className="nbtn primary" disabled={!canCont} onClick={() => last && onOpen(last.id, true)}>
                <span className="nl">Continuar</span>
                <span className="ns">
                  {canCont && last && lp
                    ? `${last.title} · ${lp.solved ? 'Resolvido' : `${lp.clues}/${last.clues.length} evidências`}`
                    : 'Nenhum caso em andamento'}
                </span>
              </button>
              <button className="nbtn" onClick={() => setView('cases')}>
                <span className="nl">Casos</span>
                <span className="ns">{CASES.length} dossiês no arquivo</span>
              </button>
              <button className="nbtn" onClick={() => setView('lore')}>
                <span className="nl">Quem é você</span>
                <span className="ns">{getAch().includes('origem') ? nome : 'História fechada'}</span>
              </button>
              <button className="nbtn" onClick={() => setView('conquistas')}>
                <span className="nl">Conquistas</span>
                <span className="ns">
                  {getAch().length} de {ACHIEVEMENTS.length}
                </span>
              </button>
              <button className="nbtn" onClick={() => setView('options')}>
                <span className="nl">Opções</span>
                <span className="ns">Som · Gráficos · Jogo</span>
              </button>
            </nav>
          </>
        )}

        {view === 'lore' && (
          <>
            <Back onClick={() => setView('main')} title="Quem é você" />
            <section className="lore">
              {getAch().includes('origem') ? (
                <>
                  <h3>{nome}</h3>
                  <div className="nomeform">
                    <label className="label" htmlFor="nome-input">
                      Nome do detetive
                    </label>
                    <div className="nomerow">
                      <input
                        id="nome-input"
                        className="nomein"
                        value={rascunho}
                        maxLength={30}
                        onChange={(e) => setRascunho(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') setNomeAtual(setNome(rascunho))
                        }}
                      />
                      <button
                        className="nsmall"
                        onClick={() => {
                          const salvo = setNome(rascunho)
                          setNomeAtual(salvo)
                          setRascunho(salvo)
                        }}
                      >
                        Salvar
                      </button>
                      <button
                        className="nsmall"
                        onClick={() => {
                          const salvo = setNome('')
                          setNomeAtual(salvo)
                          setRascunho(salvo)
                        }}
                      >
                        Original
                      </button>
                    </div>
                  </div>
                  {textoLore(nome).map((t, i) => (
                    <p key={i}>{t}</p>
                  ))}
                  {CAPITULOS.map((cap) => {
                    const resolvidos = CASES.filter((c) => peek(c).solved).length
                    const aberto = resolvidos >= cap.precisa
                    return (
                      <section key={cap.n}>
                        <div className="capitulo">
                          Capítulo {cap.n} · {aberto ? cap.titulo : 'bloqueado'}
                        </div>
                        {aberto ? (
                          cap.paragrafos.map((t, i) => <p key={i}>{t.replace('{nome}', nome)}</p>)
                        ) : (
                          <p className="empty">Resolva {cap.precisa} casos para abrir este capítulo.</p>
                        )}
                      </section>
                    )
                  })}
                </>
              ) : (
                <p className="empty">Esta história ainda está fechada. Resolva o Caso 000 para abri-la.</p>
              )}
            </section>
          </>
        )}

        {view === 'conquistas' && (
          <>
            <Back onClick={() => setView('main')} title="Conquistas" />
            <section className="nlist" aria-label="Conquistas">
              <EstatisticasView />
              {ACHIEVEMENTS.map((a) => {
                const ok = getAch().includes(a.id)
                return (
                  <div key={a.id} className={'ach' + (ok ? ' on' : '')}>
                    <span className="nno">{ok ? '✓' : '•'}</span>
                    <div>
                      <b>{a.title}</b>
                      <span>{a.desc}</span>
                    </div>
                  </div>
                )
              })}
            </section>
          </>
        )}

        {view === 'cases' && (
          <>
            <Back onClick={() => setView('main')} title="Casos" />
            <section className="nlist" aria-label="Casos">
              {CASES.map((c) => {
                const bloqueado = !!c.desafio && !CASES.filter((x) => !x.desafio).every((x) => peek(x).solved)
                if (bloqueado)
                  return (
                    <div key={c.id} className="ncase lock lock-desafio" aria-disabled="true">
                      <span className="nno">Caso nº {c.no} · Desafio</span>
                      <span className="ntitle">Fechado</span>
                      <span className="redact" style={{ width: '90%' }} />
                      <span className="nchip new">Zere os outros casos</span>
                    </div>
                  )
                return <CaseCard key={c.id} cs={c} onOpen={(id) => onOpen(id, false)} />
              })}
              <div className="ncase lock" aria-disabled="true">
                <span className="nno">Caso nº {String(CASES.length).padStart(3, '0')}</span>
                <span className="ntitle">Futuros casos</span>
                <span className="redact" style={{ width: '90%' }} />
                <span className="redact" style={{ width: '64%' }} />
                <span className="nchip new">Em breve</span>
              </div>
            </section>
          </>
        )}

        {view === 'options' && (
          <>
            <Back onClick={() => setView('main')} title="Opções" />
            <section className="osec">
              <h3>Som</h3>
              <Row title="Volume geral" hint={settings.vol + '%'}>
                <input
                  className="rng"
                  type="range"
                  min={0}
                  max={100}
                  value={settings.vol}
                  aria-label="Volume geral"
                  onChange={(e) => set({ vol: Number(e.target.value) })}
                />
              </Row>
              <Row title="Chuva ambiente" hint="Som contínuo de tempestade">
                <Switch on={settings.ambient} onChange={(v) => set({ ambient: v })} label="Chuva ambiente" />
              </Row>
              <Row title="Efeitos de interface" hint="Tique ao tocar nos botões">
                <Switch on={settings.sfx} onChange={(v) => set({ sfx: v })} label="Efeitos de interface" />
              </Row>
              <Row title="Trilha musical" hint="Música de cada caso e cômodo">
                <Switch on={settings.music} onChange={(v) => set({ music: v })} label="Trilha musical" />
              </Row>
              <Row title="Volume da trilha" hint={settings.musicVol + '%'}>
                <input
                  className="rng"
                  type="range"
                  min={0}
                  max={100}
                  value={settings.musicVol}
                  aria-label="Volume da trilha"
                  disabled={!settings.music}
                  onChange={(e) => set({ musicVol: Number(e.target.value) })}
                />
              </Row>
            </section>
            <section className="osec">
              <h3>Gráficos</h3>
              <Row title="Qualidade dos efeitos" hint="Baixa desliga chuva, relâmpagos e poeira">
                <div className="seg" role="group" aria-label="Qualidade">
                  {(['high', 'low'] as const).map((q) => (
                    <button key={q} aria-pressed={settings.quality === q} onClick={() => set({ quality: q })}>
                      {q === 'high' ? 'Alta' : 'Baixa'}
                    </button>
                  ))}
                </div>
              </Row>
              <Row title="Granulação de filme" hint="Textura sobre as cenas">
                <Switch on={settings.grain} onChange={(v) => set({ grain: v })} label="Granulação de filme" />
              </Row>
              <Row title="Animações" hint="Desligue para reduzir movimento">
                <Switch on={settings.motion} onChange={(v) => set({ motion: v })} label="Animações" />
              </Row>
            </section>
            <section className="osec">
              <h3>Jogo</h3>
              <Row title="Exportar progresso" hint="Baixa um arquivo com todos os casos e conquistas">
                <button className="nsmall" onClick={exportarProgresso}>
                  Exportar
                </button>
              </Row>
              <Row title="Importar progresso" hint={msgImport || 'Carrega um arquivo exportado antes'}>
                <button className="nsmall" onClick={() => arquivoRef.current?.click()}>
                  Importar
                </button>
                <input
                  ref={arquivoRef}
                  type="file"
                  accept="application/json,.json"
                  hidden
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    importarProgresso(f)
                      .then((n) => {
                        setMsgImport(`${n} registros importados. Recarregando…`)
                        setTimeout(() => location.reload(), 600)
                      })
                      .catch(() => setMsgImport('Arquivo inválido.'))
                    e.target.value = ''
                  }}
                />
              </Row>
              <Row title="Restaurar opções" hint="Volta som e gráficos ao padrão">
                <button className="nsmall" onClick={() => setSettings(DEFAULTS)}>
                  Restaurar
                </button>
              </Row>
              <Row title="Apagar progresso" hint="Remove evidências e casos resolvidos">
                {confirm ? (
                  <span className="nconf">
                    <button
                      className="nsmall danger"
                      onClick={() => {
                        resetAll(CASES.map((c) => c.key))
                        setConfirm(false)
                      }}
                    >
                      Confirmar
                    </button>
                    <button className="nsmall" onClick={() => setConfirm(false)}>
                      Cancelar
                    </button>
                  </span>
                ) : (
                  <button className="nsmall danger" onClick={() => setConfirm(true)}>
                    Apagar
                  </button>
                )}
              </Row>
            </section>
          </>
        )}
      </main>
    </>
  )
}
