import { useEffect, useState, type Dispatch, type ReactNode } from 'react'
import { BL, CASES } from './cases'
import type { Case, Clue } from './types'
import { MainMenu, type View } from './MainMenu'
import { setLast } from './state'
import { applySettings, loadSettings, saveSettings } from './settings'
import { tick, unlock } from './audio'
import { Scene, StaticScene } from './Scene'
import { CUTS } from './svg'
import { useGame, type Action, type GameState, type Tab } from './state'

const clueOf = (cs: Case, id: string): Clue => cs.clues.find((c) => c.id === id)!

type D = Dispatch<Action>

/* ---------- Menu do caso ---------- */
function Menu({ cs, s, d, onHome }: { cs: Case; s: GameState; d: D; onHome: () => void }) {
  return (
    <>
      <div className="mbg">
        <StaticScene id={cs.bg} slice />
      </div>
      <div className="menu">
        <div className="label">
          Caso nº {cs.no} · {cs.kind}
        </div>
        <h2 className="mt">
          {cs.titleLines[0]}
          <br />
          {cs.titleLines[1]}
        </h2>
        <p className="mtag">{cs.tagline}</p>
        <div className="mbtns">
          {s.started && (
            <button className="btn" onClick={() => d({ type: 'cont' })}>
              Continuar · {s.clues.length}/{cs.clues.length} evidências
            </button>
          )}
          <button className={'btn' + (s.started ? ' ghost' : '')} onClick={() => d({ type: 'new' })}>
            Novo jogo
          </button>
          <button className="btn ghost" onClick={() => d({ type: 'replay' })}>
            Rever abertura
          </button>
          <button className="btn ghost" onClick={() => d({ type: 'how' })}>
            Como jogar
          </button>
          <button className="btn ghost" onClick={onHome}>
            ‹ Todos os casos
          </button>
        </div>
        {s.how && (
          <div className="card" style={{ maxWidth: 360, background: '#000b' }}>
            <p style={{ margin: 0 }}>
              1. Examine as quatro cenas e toque nos pontos dourados.
              <br />
              2. Interrogue os suspeitos e apresente evidências para flagrar mentiras.
              <br />
              3. Ligue as pistas a cada pessoa no quadro.
              <br />
              4. Acuse culpado, método e motivo.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

/* ---------- Cutscene ---------- */
function Cutscene({ cs, s, d }: { cs: Case; s: GameState; d: D }) {
  const cut = s.cut!
  const frame = CUTS[cs.id][cut.id][cut.i]
  useEffect(() => {
    const t = setTimeout(() => d({ type: 'cnext' }), frame.d || 6500)
    return () => clearTimeout(t)
  }, [cut.id, cut.i, frame.d, d])
  return (
    <div className="cut" key={cut.id + cut.i} onClick={() => d({ type: 'cnext' })}>
      {frame.sc && (
        <div className="cframe">
          <div className={'kb ' + (frame.z || '')}>
            <StaticScene id={frame.sc} people={frame.p} />
          </div>
        </div>
      )}
      <div className={'ctx' + (frame.sc ? '' : ' big')}>{frame.t}</div>
      <button
        className="cskip"
        onClick={(e) => {
          e.stopPropagation()
          d({ type: 'cskip' })
        }}
      >
        Pular ›
      </button>
    </div>
  )
}

/* ---------- Abas ---------- */
function ScenesTab({ cs, s, d }: { cs: Case; s: GameState; d: D }) {
  const found = cs.scenes[s.scene].h.filter((h) => s.clues.includes(h[0])).length
  return (
    <div className="sec sc-tab">
      <div className="chips">
        {Object.keys(cs.scenes).map((k) => (
          <button key={k} className="chip" aria-pressed={s.scene === k} onClick={() => d({ type: 'scene', id: k })}>
            {cs.scenes[k].n}
          </button>
        ))}
      </div>
      <div className="scene">
        <Scene id={s.scene} scenes={cs.scenes} found={s.clues} onClue={(id) => d({ type: 'clue', id })} />
        <div className="caption">{cs.scenes[s.scene].d}</div>
      </div>
      <p className="label" style={{ marginTop: 12 }}>
        {found} de 2 objetos examinados aqui · toque nos pontos dourados
      </p>
    </div>
  )
}

function SuspectsTab({ cs, s, d }: { cs: Case; s: GameState; d: D }) {
  if (s.sel) {
    const p = cs.suspects.find((x) => x.id === s.sel)!
    const lg = s.log[p.id] ?? []
    return (
      <div className="sec dlg">
        <div className="dlg-l">
          <button className="btn ghost" onClick={() => d({ type: 'back' })}>
            ‹ Suspeitos
          </button>
          <div className="sus" style={{ marginTop: 12, borderColor: 'var(--brass)' }}>
            <div className="avatar">{p.ini}</div>
            <div>
              <b>{p.name}</b>
              <span>{p.role}</span>
            </div>
          </div>
          <div className="card">
            <div className="label">Perguntar</div>
            {p.qs.map((q, i) => (
              <button
                key={i}
                className="q"
                disabled={lg.some((l) => l.k === 'q' + i)}
                onClick={() => d({ type: 'ask', i })}
              >
                {q[0]}
              </button>
            ))}
          </div>
          <div className="card">
            <div className="label">Apresentar evidência</div>
            {s.clues.length ? (
              s.clues.map((id) => (
                <button
                  key={id}
                  className="q"
                  disabled={lg.some((l) => l.k === id)}
                  onClick={() => d({ type: 'show', id })}
                >
                  {clueOf(cs, id).t}
                </button>
              ))
            ) : (
              <p className="empty">Você ainda não tem evidências para apresentar.</p>
            )}
          </div>
        </div>
        <div className="dlg-r">
          {lg.length === 0 && <p className="empty dlg-hint">As respostas do interrogatório aparecem aqui.</p>}
          {lg.length > 0 && (
            <div className="log">
              {lg.map((l, i) => (
                <div key={i}>
                  <div className="ask">{l.q}</div>
                  <p className="ans">{l.a}</p>
                  {l.f && <span className={'badge b-' + l.f}>{BL[l.f]}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }
  return (
    <div className="sec">
      <div className="label">{cs.suspectsLabel}</div>
      <div className="grid" style={{ marginTop: 10 }}>
        {cs.suspects.map((p) => {
          const n = (s.log[p.id] ?? []).length
          return (
            <button key={p.id} className="sus" onClick={() => d({ type: 'sus', id: p.id })}>
              <div className="avatar">{p.ini}</div>
              <div>
                <b>{p.name}</b>
                <span>
                  {p.role}
                  {n ? ` · ${n} registro${n > 1 ? 's' : ''}` : ''}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function BoardTab({ cs, s, d }: { cs: Case; s: GameState; d: D }) {
  if (!s.clues.length)
    return (
      <div className="sec">
        <p className="empty">O quadro está vazio. Examine as cenas para coletar evidências.</p>
      </div>
    )
  return (
    <div className="sec">
      <div className="label">Fios vermelhos</div>
      <div className="cols">
        {cs.suspects.map((p) => {
          const l = s.clues.filter((id) => s.pins[id] === p.id)
          return (
            <div className="col" key={p.id}>
              <h3>
                {p.name} · {l.length}
              </h3>
              {l.length ? (
                <ul>
                  {l.map((id) => (
                    <li key={id}>{clueOf(cs, id).t}</li>
                  ))}
                </ul>
              ) : (
                <p className="empty">Nada ligado a esta pessoa.</p>
              )}
            </div>
          )
        })}
      </div>
      <div className="label" style={{ marginTop: 22 }}>
        Evidências coletadas
      </div>
      <div className="notes">
        {s.clues.map((id) => {
          const c = clueOf(cs, id)
          return (
            <div className="note" key={id}>
              <div className="where">{cs.scenes[c.sc].n}</div>
              <h3>{c.t}</h3>
              <p>{c.x}</p>
              <div className="pins">
                <span className="label" style={{ color: '#22251f99' }}>
                  Aponta para
                </span>
                {cs.suspects.map((p) => (
                  <button
                    key={p.id}
                    className="pin"
                    aria-pressed={s.pins[id] === p.id}
                    onClick={() => d({ type: 'pin', id, s: p.id })}
                  >
                    {p.ini}
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function AccuseTab({ cs, s, d }: { cs: Case; s: GameState; d: D }) {
  const a = s.acc
  const ok = a.s !== null && a.m !== null && a.r !== null
  const opt = (label: string, pressed: boolean, onClick: () => void, key: string | number) => (
    <button key={key} className="opt" aria-pressed={pressed} onClick={onClick}>
      {label}
    </button>
  )
  let result: ReactNode = null
  if (s.res) {
    const win = s.res === 'win'
    const q = s.clues.length
    const w: string[] = []
    if (a.s !== cs.win.s) w.push('o culpado')
    if (a.m !== cs.win.m) w.push('o método')
    if (a.r !== cs.win.r) w.push('o motivo')
    result = (
      <div className="result">
        <div className={'stamp' + (win ? '' : ' bad')}>{win ? 'CASO RESOLVIDO' : 'ACUSAÇÃO FALHA'}</div>
        {win ? (
          <>
            {cs.win.text.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p>
              <b>Classificação:</b> {cs.ranks.find(([min]) => q >= min)![1]}
            </p>
            <p>
              <button className="btn" onClick={() => d({ type: 'reset' })}>
                Jogar de novo
              </button>
            </p>
          </>
        ) : (
          <>
            <p>
              Algo não fecha: revise {w.join(', ')}. Volte às cenas e aos interrogatórios, procure contradições e tente
              de novo.
            </p>
            <p>
              <button className="btn ghost" onClick={() => d({ type: 'retry' })}>
                Revisar o caso
              </button>
            </p>
          </>
        )}
      </div>
    )
  }
  return (
    <div className="sec">
      <div className="label">Acusação formal{s.tries ? ` · tentativa ${s.tries + 1}` : ''}</div>
      {s.clues.length < 5 && <p className="empty">Você tem {s.clues.length} evidências. Com menos de 5, é palpite.</p>}
      <div className="acc3">
        <div className="card">
          <div className="label">Quem matou?</div>
          {cs.suspects.map((p) => opt(p.name, a.s === p.id, () => d({ type: 'acc', k: 's', v: p.id }), p.id))}
        </div>
        <div className="card">
          <div className="label">Como foi feito?</div>
          {cs.met.map((t, i) => opt(t, a.m === i, () => d({ type: 'acc', k: 'm', v: i }), i))}
        </div>
        <div className="card">
          <div className="label">Por quê?</div>
          {cs.mot.map((t, i) => opt(t, a.r === i, () => d({ type: 'acc', k: 'r', v: i }), i))}
        </div>
      </div>
      <p style={{ marginTop: 16 }}>
        <button className="btn" disabled={!ok} onClick={() => d({ type: 'accuse' })}>
          Acusar
        </button>
      </p>
      {result}
    </div>
  )
}

/* ---------- Folha de evidência e navegação ---------- */
function Sheet({ cs, s, d }: { cs: Case; s: GameState; d: D }) {
  if (!s.open) return null
  const c = clueOf(cs, s.open)
  const close = () => d({ type: 'close' })
  return (
    <div className="sheet-bg" onClick={close}>
      <div className="sheet" role="dialog" aria-label={c.t} onClick={(e) => e.stopPropagation()}>
        <div className="label">
          {s.fresh ? 'Nova evidência · ' : ''}
          {cs.scenes[c.sc].n}
        </div>
        <div className="note" style={{ marginTop: 10 }}>
          <h3>{c.t}</h3>
          <p>{c.x}</p>
        </div>
        <p style={{ marginTop: 14 }}>
          <button className="btn" onClick={close}>
            Guardar no quadro
          </button>
        </p>
      </div>
    </div>
  )
}

const TABS: [Tab, string][] = [
  ['cenas', 'Cenas'],
  ['susp', 'Suspeitos'],
  ['quadro', 'Quadro'],
  ['acusar', 'Acusar'],
]

/* ---------- App ---------- */
function CaseGame({ cs, onHome, resume }: { cs: Case; onHome: () => void; resume: boolean }) {
  const [s, d] = useGame(cs)
  useEffect(() => {
    if (resume) d({ type: 'cont' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const cutKey = s.cut ? s.cut.id + s.cut.i : ''

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [s.tab, s.sel, s.menu, cutKey])

  if (s.cut) return <Cutscene cs={cs} s={s} d={d} />
  if (s.menu || !s.started) return <Menu cs={cs} s={s} d={d} onHome={onHome} />

  return (
    <>
      <div className="top">
        <button className="mbtn" aria-label="Menu principal" onClick={() => d({ type: 'menu' })}>
          ☰
        </button>
        <h1>{cs.title}</h1>
        <div className="count">
          Evidências {s.clues.length}/{cs.clues.length}
        </div>
      </div>
      {s.tab === 'cenas' && <ScenesTab cs={cs} s={s} d={d} />}
      {s.tab === 'susp' && <SuspectsTab cs={cs} s={s} d={d} />}
      {s.tab === 'quadro' && <BoardTab cs={cs} s={s} d={d} />}
      {s.tab === 'acusar' && <AccuseTab cs={cs} s={s} d={d} />}
      <Sheet cs={cs} s={s} d={d} />
      <nav className="nav" aria-label="Seções">
        {TABS.map(([id, label]) => (
          <button key={id} aria-current={s.tab === id ? 'true' : undefined} onClick={() => d({ type: 'tab', id })}>
            {label}
          </button>
        ))}
      </nav>
    </>
  )
}

export default function App() {
  const [view, setView] = useState<View>('main')
  const [cid, setCid] = useState<string | null>(null)
  const [resume, setResume] = useState(false)
  const [settings, setSettings] = useState(loadSettings)
  const cs = CASES.find((c) => c.id === cid)

  useEffect(() => {
    applySettings(settings)
    saveSettings(settings)
  }, [settings])

  useEffect(() => {
    const first = () => unlock()
    const click = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('button')) tick()
    }
    window.addEventListener('pointerdown', first, { once: true })
    document.addEventListener('click', click)
    return () => {
      window.removeEventListener('pointerdown', first)
      document.removeEventListener('click', click)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.case = cs ? cs.theme : 'home'
    window.scrollTo(0, 0)
  }, [cs, view])

  if (!cs)
    return (
      <MainMenu
        view={view}
        setView={setView}
        settings={settings}
        setSettings={setSettings}
        onOpen={(id, res) => {
          setLast(id)
          setResume(res)
          setCid(id)
        }}
      />
    )
  return (
    <CaseGame
      key={cs.id}
      cs={cs}
      resume={resume}
      onHome={() => {
        setCid(null)
        setView('cases')
      }}
    />
  )
}
