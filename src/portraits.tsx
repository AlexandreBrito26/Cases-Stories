/* Retratos em SVG dos suspeitos (personagens fictícios, sem fotos reais). */

type Hair = 'curto' | 'longo' | 'coque' | 'careca' | 'cacheado'
type Acc = 'brinco' | 'colar' | 'gravata' | 'lenco'

interface Look {
  skin: string
  hair: string
  style: Hair
  shirt: string
  bg: string
  beard?: boolean
  glasses?: boolean
  acc?: Acc
}

const LOOKS: Record<string, Look> = {
  // Valverde
  cec: { skin: '#e7b89a', hair: '#2b1d16', style: 'coque', shirt: '#3a4a5c', bg: '#2a3340', acc: 'colar' },
  rod: { skin: '#d9a987', hair: '#1d1a18', style: 'curto', shirt: '#6b2f2f', bg: '#2c2626', acc: 'gravata' },
  mar: { skin: '#b57d59', hair: '#8a8a8a', style: 'coque', shirt: '#4d6b4a', bg: '#2a3328', glasses: true },
  hei: { skin: '#f0c8a8', hair: '#c9c2b8', style: 'curto', shirt: '#2e3b4e', bg: '#222b38', beard: true, glasses: true, acc: 'gravata' },
  // Imperial
  liv: { skin: '#ecc1a1', hair: '#7a3b1e', style: 'longo', shirt: '#7a2c43', bg: '#3a2230', acc: 'brinco' },
  ota: { skin: '#e0b08c', hair: '#3b2f2a', style: 'curto', shirt: '#2d2d3a', bg: '#252530', beard: true, acc: 'gravata' },
  nil: { skin: '#8d5a3b', hair: '#151111', style: 'cacheado', shirt: '#5c5a2a', bg: '#2b2a1f', acc: 'lenco' },
  cai: { skin: '#f1cba9', hair: '#e0b93f', style: 'curto', shirt: '#1f4a4f', bg: '#1c2e30', glasses: true },
  // Aurora
  bia: { skin: '#e9bfa0', hair: '#4a2a1b', style: 'longo', shirt: '#8b3a3a', bg: '#3a2626', acc: 'brinco' },
  ire: { skin: '#d7a98a', hair: '#c8c8c8', style: 'coque', shirt: '#5e4a2d', bg: '#332a1d', glasses: true, acc: 'colar' },
  lui: { skin: '#9c6844', hair: '#111111', style: 'curto', shirt: '#3c5f4a', bg: '#22302a', beard: true },
  dan: { skin: '#e8b694', hair: '#5b4636', style: 'curto', shirt: '#4b2a3a', bg: '#2c1f28', beard: true, acc: 'gravata' },
  // Caso 000
  pe: { skin: '#c98f66', hair: '#2a2a2a', style: 'curto', shirt: '#1f1f1f', bg: '#1d1d1d', acc: 'gravata' },
  va: { skin: '#f3c9a9', hair: '#2a1b10', style: 'longo', shirt: '#c24c6c', bg: '#3b1f28', acc: 'brinco' },
  te: { skin: '#e1b38e', hair: '#e5e5e5', style: 'careca', shirt: '#506b7a', bg: '#273238', glasses: true },  // Caso 004 · Ateliê
  ma: { skin: '#e4b99a', hair: '#1a1a22', style: 'longo', shirt: '#2f3b4c', bg: '#1f2430', glasses: true, acc: 'colar' },
  ig: { skin: '#d8a27c', hair: '#4b3a2e', style: 'curto', shirt: '#4a4b2a', bg: '#26301f', beard: true },
  li: { skin: '#f4d2b8', hair: '#c24c2a', style: 'coque', shirt: '#6a2e4a', bg: '#332029', acc: 'brinco' },
  ke: { skin: '#e9c7a5', hair: '#cfcfcf', style: 'careca', shirt: '#2b2b2b', bg: '#202020', glasses: true, acc: 'gravata' },  // Caso 005 · Farol
  ro: { skin: '#dcaa88', hair: '#5a3a28', style: 'coque', shirt: '#4a5a6a', bg: '#1f2a36', acc: 'colar' },
  ti: { skin: '#c98f66', hair: '#1a1410', style: 'curto', shirt: '#2f4a5a', bg: '#1a2a34', beard: true },
  ar: { skin: '#b07a55', hair: '#d6d2cc', style: 'careca', shirt: '#4a4236', bg: '#2a2620', glasses: true, acc: 'gravata' },
  ce: { skin: '#f0cdb0', hair: '#2a1f1a', style: 'longo', shirt: '#1f3340', bg: '#17242e', acc: 'brinco' },
}

const fallback: Look = { skin: '#e0b08c', hair: '#3a3a3a', style: 'curto', shirt: '#3a3a3a', bg: '#262626' }

function hairBack(l: Look) {
  switch (l.style) {
    case 'longo':
      return <rect x="14" y="16" width="24" height="28" rx="10" fill={l.hair} />
    case 'coque':
      return (
        <>
          <circle cx="26" cy="7" r="5.5" fill={l.hair} />
          <path d="M14 22 C12 6 40 4 38 22 C34 14 20 13 14 22 Z" fill={l.hair} />
        </>
      )
    case 'cacheado':
      return (
        <>
          {[
            [15, 16],
            [20, 10],
            [26, 8],
            [32, 10],
            [37, 16],
            [15, 24],
            [37, 24],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="5" fill={l.hair} />
          ))}
        </>
      )
    case 'curto':
      return <path d="M15 22 C14 8 38 6 37 22 C34 14 22 13 15 22 Z" fill={l.hair} />
    case 'careca':
      return null
  }
}

export type Mood = 'serio' | 'nervoso' | 'sorrindo'

/** Expressão pela última resposta: álibi confirmado sorri, contradição ou pressão deixa nervoso. */
export function moodOf(flags: (string | null | undefined)[]): Mood {
  for (let i = flags.length - 1; i >= 0; i--) {
    const f = flags[i]
    if (f === 'clear') return 'sorrindo'
    if (f === 'contra' || f === 'crack') return 'nervoso'
    if (f === 'adm') return 'serio'
  }
  return 'serio'
}

/** Retrato de um suspeito. Usa o id do suspeito (único no jogo). */
export function Portrait({ id, ini, mood = 'serio' }: { id: string; ini: string; mood?: Mood }) {
  const l = LOOKS[id]
  if (!l) return <span>{ini}</span>
  return (
    <svg viewBox="0 0 52 52" role="img" aria-label={ini} width="100%" height="100%">
      <rect width="52" height="52" fill={l.bg} />
      <path d="M4 52 C6 40 16 36 26 36 C36 36 46 40 48 52 Z" fill={l.shirt} />
      {l.acc === 'colar' && <path d="M19 38 Q26 45 33 38" stroke="#c9a04a" strokeWidth="1.4" fill="none" />}
      {l.acc === 'gravata' && <path d="M26 37 L24 44 L26 50 L28 44 Z" fill="#8f2e2e" />}
      {l.acc === 'lenco' && <path d="M13 20 Q26 4 39 20 L37 24 Q26 12 15 24 Z" fill="#c24c6c" />}
      <rect x="21" y="30" width="10" height="10" fill={l.skin} />
      {hairBack(l)}
      <ellipse cx="26" cy="24" rx="10.5" ry="12.5" fill={l.skin} />
      {l.style !== 'careca' && l.style !== 'longo' && l.style !== 'cacheado' && (
        <path d="M15 22 C14 8 38 6 37 22 C34 14 22 13 15 22 Z" fill={l.hair} />
      )}
      {l.style === 'longo' && <path d="M15 22 C14 8 38 6 37 22 C34 15 22 14 15 22 Z" fill={l.hair} />}
      {l.beard && <path d="M16 28 Q18 38 26 39 Q34 38 36 28 Q32 33 26 33 Q20 33 16 28 Z" fill={l.hair} opacity="0.85" />}
      <circle cx="22" cy="24" r="1.3" fill="#222" />
      <circle cx="30" cy="24" r="1.3" fill="#222" />
      {mood === 'nervoso' ? (
        <>
          <path d="M19.5 19.8 L24.5 21.4" stroke="#2a1f18" strokeWidth="0.9" fill="none" />
          <path d="M27.5 21.4 L32.5 19.8" stroke="#2a1f18" strokeWidth="0.9" fill="none" />
          <path d="M22.5 31.5 Q24 30 25.5 31.5 Q27 33 28.5 31.5" stroke="#6b3a2a" strokeWidth="1" fill="none" />
        </>
      ) : mood === 'sorrindo' ? (
        <>
          <path d="M19.5 21 Q22 20 24.5 21" stroke="#2a1f18" strokeWidth="0.9" fill="none" />
          <path d="M27.5 21 Q30 20 32.5 21" stroke="#2a1f18" strokeWidth="0.9" fill="none" />
          <path d="M22.5 30 Q26 35 29.5 30" stroke="#6b3a2a" strokeWidth="1.1" fill="none" />
        </>
      ) : (
        <>
          <path d="M19.5 21 Q22 20 24.5 21" stroke="#2a1f18" strokeWidth="0.9" fill="none" />
          <path d="M27.5 21 Q30 20 32.5 21" stroke="#2a1f18" strokeWidth="0.9" fill="none" />
          <path d="M23 31 Q26 31.5 29 31" stroke="#6b3a2a" strokeWidth="1" fill="none" />
        </>
      )}
      {l.glasses && (
        <g stroke="#222" strokeWidth="0.9" fill="none">
          <circle cx="22" cy="24" r="3.6" />
          <circle cx="30" cy="24" r="3.6" />
          <path d="M25.6 24 H26.4" />
        </g>
      )}
      {l.acc === 'brinco' && (
        <>
          <circle cx="15.8" cy="29" r="1.4" fill="#c9a04a" />
          <circle cx="36.2" cy="29" r="1.4" fill="#c9a04a" />
        </>
      )}
    </svg>
  )
}
