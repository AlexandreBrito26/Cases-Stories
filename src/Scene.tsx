import { useId, useMemo } from 'react'
import type { SceneData } from './types'
import { sceneInner, sceneSvgScoped, type Person } from './svg'

/** Cena interativa com os pontos dourados de investigação. */
export function Scene({ id, scenes, found, onClue, hidden = false }: { id: string; scenes: Record<string, SceneData>; found: string[]; onClue: (c: string) => void; hidden?: boolean }) {
  return (
    <svg viewBox="0 0 360 220" role="img" aria-label={'Cena: ' + scenes[id].n}>
      <g dangerouslySetInnerHTML={{ __html: sceneInner(id) }} />
      {scenes[id].h.map(([cid, x, y]) => {
        const done = found.includes(cid)
        return (
          <g
            key={cid}
            className={'hot' + (done ? ' done' : '') + (hidden && !done ? ' hidden' : '')}
            tabIndex={0}
            role="button"
            aria-label={'Examinar objeto' + (done ? ' (já examinado)' : '')}
            onClick={() => onClue(cid)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClue(cid)
              }
            }}
          >
            <circle className="halo" cx={x} cy={y} r={17} />
            <circle className="dot" cx={x} cy={y} r={8} />
            {done && <path d={`M${x - 4} ${y}l3 3 5-6`} stroke="#0b1a12" strokeWidth={2} fill="none" />}
          </g>
        )
      })}
    </svg>
  )
}

/** Cena estática (fundo do menu e quadros das cutscenes). */
export function StaticScene({ id, people, slice }: { id: string; people?: Person[]; slice?: boolean }) {
  const uid = 'u' + useId().replace(/\W/g, '')
  const html = useMemo(() => sceneSvgScoped(id, uid, people, slice), [id, uid, people, slice])
  return <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: html }} />
}
