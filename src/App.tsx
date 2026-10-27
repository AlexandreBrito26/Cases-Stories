import { useEffect, useRef, useState, type Dispatch, type ReactNode } from 'react'
import { BL, CASES } from './cases'
import type { Case, Clue } from './types'
import { MainMenu, type View } from './MainMenu'
import { setLast } from './state'
import { applySettings, loadSettings, saveSettings } from './settings'
import { chime, tick, unlock } from './audio'
import { ACHIEVEMENTS, bestScore, grantAch, saveScore, scoreOf } from './achievements'
import { ARQUIVO } from './archive'
import { registrarVitoria } from './stats'
import { playTrack, stopTrack } from './music'
import { Scene, StaticScene } from './Scene'
import { Portrait, moodOf, type Mood } from './portraits'
import { CUTS } from './svg'
import { HINT_MAX, peek, useGame, type Action, type GameState, type LogEntry, type Tab } from './state'

const clueOf = (cs: Case, id: string): Clue => cs.clues.find((c) => c.id === id)!

/** B3: humor do suspeito pelo interrogatório. Três ou mais perguntas sem álibi deixam nervoso. */
const humorOf = (lg: LogEntry[]): Mood => {
  const f = lg.map((l) => l.f)
  if (lg.length >= 3 && !f.some(Boolean)) return 'nervoso'
  return moodOf(f)
}
const HUMOR: Record<Mood, string> = { serio: 'sereno', nervoso: 'inquieto', sorrindo: 'aliviado' }

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
          <button className="btn ghost" disabled={s.clues.length > 0} onClick={() => d({ type: 'modo' })}>
            Modo investigador · {s.investigador ? 'ligado' : 'desligado'}
          </button>
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
  const sc = cs.scenes[s.scene]
  const found = sc.h.filter((h) => s.clues.includes(h[0])).length
  const left = HINT_MAX - s.hints
  const done = s.clues.length >= cs.clues.length
  const arq = ARQUIVO[cs.id]?.[s.scene]
  const aberto = sc.h.every((h) => s.clues.includes(h[0]))
  return (
    <div className="sec sc-tab">
      <div className="chips">
        {Object.keys(cs.scenes).map((k) => (
          <button
            key={k}
            className={'chip' + (s.hint === k && !s.investigador ? ' hinted' : '')}
            aria-pressed={s.scene === k}
            onClick={() => d({ type: 'scene', id: k })}
          >
            {cs.scenes[k].n}
          </button>
        ))}
      </div>
      <div className="scene">
        <Scene
          id={s.scene}
          scenes={cs.scenes}
          found={s.clues}
          hidden={!!cs.desafio}
          onClue={(id) => {
            if (!s.clues.includes(id)) chime()
            d({ type: 'clue', id })
          }}
        />
        <div className="caption">{sc.d}</div>
      </div>
      <p className="label" style={{ marginTop: 12 }}>
        {found} de {sc.h.length} objetos examinados aqui · toque nos pontos dourados
      </p>
      {arq && (
        <div className="arq">
          {aberto ? (
            <>
              <b>Arquivo do cômodo</b>
              <p>{arq}</p>
            </>
          ) : (
            <p className="empty">Arquivo bloqueado: examine todos os objetos deste cômodo.</p>
          )}
        </div>
      )}
      <div className="hintbar">
        {s.investigador ? (
          <span className="hinttxt">Modo investigador: sem dicas. A pontuação vale o dobro.</span>
        ) : (
          <>
            <button className="btn ghost" disabled={left <= 0 || done} onClick={() => d({ type: 'hint' })}>
              Pedir dica · {left} restante{left === 1 ? '' : 's'}
            </button>
            {s.hint && !done && (
              <span className="hinttxt">
                Pista: ainda há algo em {cs.scenes[s.hint].n}. Dicas usadas tiram a conquista Olho treinado.
              </span>
            )}
          </>
        )}
      </div>
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
            <div className="avatar"><Portrait id={p.id} ini={p.ini} mood={humorOf(lg)} /></div>
            <div>
              <b>{p.name}</b>
              <span>{p.role}</span>
            </div>
          </div>
          <p className="humor">Parece {HUMOR[humorOf(lg)]}.</p>
          <div className="card">
            <div className="label">Perguntar</div>
            {p.qs.map((q, i) => {
              const bloqueada = !!q[2] && !s.clues.includes(q[2])
              return (
                <div key={i}>
                  <button
                    className="q"
                    disabled={bloqueada || lg.some((l) => l.k === 'q' + i)}
                    onClick={() => d({ type: 'ask', i })}
                  >
                    {bloqueada ? '🔒 ' : ''}
                    {q[0]}
                  </button>
                  {bloqueada && <p className="lockq">Libera ao apresentar a evidência certa.</p>}
                </div>
              )
            })}
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
                <div key={i} className={'entry' + (l.f === 'contra' ? ' contra' : '')}>
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
          const cc = (s.log[p.id] ?? []).filter((l) => l.f === 'contra').length
          return (
            <button key={p.id} className="sus" onClick={() => d({ type: 'sus', id: p.id })}>
              <div className="avatar"><Portrait id={p.id} ini={p.ini} mood={humorOf(s.log[p.id] ?? [])} /></div>
              <div>
                <b>{p.name}</b>
                <span>
                  {p.role}
                  {n ? ` · ${n} registro${n > 1 ? 's' : ''}` : ''}
                  {cc ? ` · ⚠ ${cc} ${cc > 1 ? 'contradições' : 'contradição'}` : ''}
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

function Summary({ cs, s }: { cs: Case; s: GameState }) {
  const all: LogEntry[] = Object.values(s.log).flatMap((v) => v ?? [])
  const count = (f: string) => all.filter((l) => l.f === f).length
  const withContra = cs.suspects.filter((p) => (s.log[p.id] ?? []).some((l) => l.f === 'contra')).map((p) => p.name)
  return (
    <div className="card summary">
      <div className="label">Resumo do caso</div>
      <div className="sumgrid">
        <div>
          <b>
            {s.clues.length}/{cs.clues.length}
          </b>
          evidências
        </div>
        <div>
          <b>{count('contra')}</b>contradições
        </div>
        <div>
          <b>{count('clear')}</b>álibis confirmados
        </div>
        <div>
          <b>{count('adm') + count('crack')}</b>confissões ou pressões
        </div>
      </div>
      <p className="empty">
        {withContra.length ? `Contradições registradas com: ${withContra.join(', ')}.` : 'Nenhuma contradição registrada ainda.'}
      </p>
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
    if (cs.linha && s.ordem.join() !== cs.linha.map((x) => x.id).join()) w.push('a ordem da noite')
    result = (
      <div className="result">
        <div className={'stamp' + (win ? '' : ' bad')}>{win ? 'CASO RESOLVIDO' : 'ACUSAÇÃO FALHA'}</div>
        {win ? (
          <>
            {cs.win.text.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            <p>
              <b>Dicas usadas:</b> {s.hints} de {HINT_MAX}
            </p>
            <p>
              <b>Pontuação:</b> {scoreOf(s)} · <b>Melhor:</b> {Math.max(bestScore(cs.id), scoreOf(s))}
            </p>
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
      <Summary cs={cs} s={s} />
      <div className="label">Acusação formal{s.tries ? ` · tentativa ${s.tries + 1}` : ''}</div>
      <p className="empty">Erros são livres até 10 tentativas. Depois, cada erro custa pontos.</p>
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
      {cs.linha && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="label">Ordem da noite · do primeiro ao último</div>
          {s.ordem.map((id, i) => {
            const ev = cs.linha!.find((x) => x.id === id)!
            return (
              <div key={id} className="ev">
                <span>{ev.h}</span>
                <span>{ev.t}</span>
                <button className="nsmall" disabled={i === 0} onClick={() => d({ type: 'mover', id, dir: -1 })} aria-label="Subir">
                  ↑
                </button>
                <button
                  className="nsmall"
                  disabled={i === s.ordem.length - 1}
                  onClick={() => d({ type: 'mover', id, dir: 1 })}
                  aria-label="Descer"
                >
                  ↓
                </button>
              </div>
            )
          })}
        </div>
      )}
      <p style={{ marginTop: 16 }}>
        <button className="btn" disabled={!ok} onClick={() => d({ type: 'accuse' })}>
          Acusar
        </button>
      </p>
      {result}
      {s.historico.length > 0 && (
        <div className="card hist" style={{ marginTop: 16 }}>
          <div className="label">Histórico de acusações</div>
          {s.historico.map((h, i) => (
            <p key={i}>{h}</p>
          ))}
        </div>
      )}
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
  const [fx, setFx] = useState<{ k: number; label: string } | null>(null)
  const prevScene = useRef(s.scene)
  useEffect(() => {
    if (prevScene.current === s.scene) return
    prevScene.current = s.scene
    if (document.documentElement.dataset.motion !== 'on') return
    setFx({ k: Date.now(), label: cs.scenes[s.scene].n })
    const t = setTimeout(() => setFx(null), 1500)
    return () => clearTimeout(t)
  }, [s.scene, cs])

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [s.tab, s.sel, s.menu, cutKey])

  useEffect(() => {
    playTrack(cs.theme, s.scene)
    return stopTrack
  }, [cs.theme, s.scene])

  useEffect(() => {
    if (s.res !== 'win') return
    const ids = [cs.id]
    if (s.hints === 0) ids.push('sem-dicas')
    if (s.investigador) ids.push('investigador')
    grantAch(ids)
    saveScore(cs.id, scoreOf(s))
    registrarVitoria(cs.id, { startedAt: s.startedAt, tries: s.tries, hints: s.hints })
    if (CASES.every((c) => c.id === cs.id || peek(c).solved)) grantAch(['todos'])
  }, [s.res, cs.id, s.hints, s.investigador])

  if (s.cut) return <Cutscene cs={cs} s={s} d={d} />
  if (s.menu || !s.started) return <Menu cs={cs} s={s} d={d} onHome={onHome} />

  return (
    <>
      {fx && (
        <div key={fx.k} className="sfade" aria-hidden>
          <span>{fx.label}</span>
        </div>
      )}
      <div className="top">
        <button className="mbtn" aria-label="Menu principal" onClick={() => d({ type: 'menu' })}>
          ☰
        </button>
        <h1>{cs.title}</h1>
        <div className="count">
          Evidências {s.clues.length}/{cs.clues.length}
        </div>
      </div>
      {cs.tutorial?.[s.tab] && <p className="tut">{cs.tutorial[s.tab]}</p>}
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
