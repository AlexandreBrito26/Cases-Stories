/* Caso 000 · Onde Tudo Começou — cômodos com direção de arte "cinematográfica":
   perspectiva, luz volumétrica, silhuetas em primeiro plano e props que contam a história. */
export const R = (x: number, y: number, w: number, h: number, f: string, o = 1, x2 = '') =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${f}"${o !== 1 ? ` opacity="${o}"` : ''} ${x2}/>`
export const E = (cx: number, cy: number, rx: number, ry: number, f: string, o = 1, x2 = '') =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${f}"${o !== 1 ? ` opacity="${o}"` : ''} ${x2}/>`
export const P = (d: string, f: string, o = 1, x2 = '') => `<path d="${d}" fill="${f}"${o !== 1 ? ` opacity="${o}"` : ''} ${x2}/>`
export const L = (d: string, s: string, w = 1, o = 1) => `<path d="${d}" stroke="${s}" stroke-width="${w}" fill="none"${o !== 1 ? ` opacity="${o}"` : ''}/>`
export const SCR = 'style="mix-blend-mode:screen"'
export const grad = (id: string, stops: [number, string, number?][], v = true) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="${v ? 0 : 1}" y2="${v ? 1 : 0}">` +
  stops.map(([o, c, a]) => `<stop offset="${o}" stop-color="${c}"${a !== undefined ? ` stop-opacity="${a}"` : ''}/>`).join('') +
  '</linearGradient>'
export const glow = (id: string, c: string, a = 0.9) =>
  `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${a}"/><stop offset=".45" stop-color="${c}" stop-opacity="${a * 0.3}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`

/** Chão em perspectiva: linhas convergindo para um ponto de fuga. */
export function floorLines(horizon: number, vx: number, color: string, o = 0.35, step = 36) {
  let s = ''
  for (let x = -180; x <= 540; x += step) s += L(`M${vx + (x - vx) * 0.28} ${horizon}L${x} 224`, color, 0.8, o)
  for (const y of [horizon + 8, horizon + 20, horizon + 36, horizon + 58]) s += L(`M0 ${y}H360`, color, 0.8, o * 0.8)
  return s
}

/* ───────────────────────── HALL DE ENTRADA ───────────────────────── */
const hal = () => {
  let s = `<defs>${grad('hw', [[0, '#0d1219'], [0.65, '#1f2831'], [1, '#2b353f']])}${grad('hf', [[0, '#120b08'], [1, '#46311f']])}
${grad('hb', [[0, '#b4d4ee', 0.6], [1, '#b4d4ee', 0]])}${glow('hg', '#ffd9a0')}${glow('hm', '#9cc4e8', 0.55)}
${grad('hrun', [[0, '#3a1218'], [1, '#6a232b']])}</defs>`
  // parede + lambril
  s += R(0, 0, 360, 152, 'url(#hw)')
  for (let x = 6; x < 360; x += 30) s += L(`M${x} 22V100`, '#000', 1, 0.18)
  s += R(0, 98, 360, 54, '#161d24') + R(0, 96, 360, 4, '#2f3a44') + R(0, 150, 360, 4, '#0b0f13')
  for (let x = 0; x < 360; x += 36) s += R(x + 5, 106, 26, 38, '#1a232b') + L(`M${x + 5} 106h26v38h-26z`, '#2e3a44', 0.8, 0.8)
  s += R(0, 20, 360, 7, '#0b0f13') + R(0, 27, 360, 2, '#34404a', 0.7)
  // quadros
  s += R(128, 44, 40, 48, '#7c5f2e') + R(131, 47, 34, 42, '#0f1317') + P('M134 89Q148 66 162 89Z', '#222a31') + E(148, 62, 7, 8, '#232b33') + E(148, 62, 7, 8, '#6a5a3a', 0.12)
  s += R(180, 52, 22, 28, '#6b5026') + R(182, 54, 18, 24, '#1b2229') + L('M184 74l5-8 4 5 4-9 3 12', '#44525c', 1)
  // porta da frente (esquerda) com bandeira iluminada pela chuva/lua
  s += R(18, 36, 80, 118, '#0a0d10') + R(22, 40, 72, 112, '#2a1b13')
  s += R(28, 46, 60, 22, '#6f98bd', 0.55) + R(28, 46, 60, 22, 'url(#hb)', 1) + L('M58 46v22M28 57h60', '#0a0d10', 2)
  s += `<g clip-path="url(#hwc)"><rect class="rain" x="20" y="30" width="80" height="60" fill="url(#rn)" opacity=".7"/></g>`
  s += `<clipPath id="hwc"><rect x="28" y="46" width="60" height="22"/></clipPath>`
  s += R(30, 76, 26, 32, '#1f130d') + R(62, 76, 26, 32, '#1f130d') + R(30, 114, 26, 30, '#1f130d') + R(62, 114, 26, 30, '#1f130d')
  s += L('M30 76h26v32h-26zM62 76h26v32h-26zM30 114h26v30h-26zM62 114h26v30h-26z', '#4a3222', 1, 0.8)
  s += E(86, 112, 3, 3, '#d0a649') + R(84, 114, 4, 8, '#8a6c2a') // maçaneta
  s += R(22, 150, 72, 3, '#b8d8f0', 0.55) // luz de fora vazando sob a porta
  // lustre apagado
  s += L('M180 22V42', '#050607', 1.6) + E(180, 48, 30, 6, '#201a14') + E(180, 47, 30, 6, '#6b5a3a', 0.35)
  for (const dx of [-28, -14, 0, 14, 28]) s += R(180 + dx - 1.5, 38, 3, 9, '#8a7a5a', 0.6) + L(`M${180 + dx} 52v8`, '#3a3226', 1.2)
  s += E(180, 64, 5, 7, '#6b5a3a', 0.5) + E(180, 62, 2, 3, '#ffd9a0', 0.25)
  // escada à direita
  s += P('M248 154L360 62V154Z', '#0e1318') + P('M248 154L360 62V70L256 154Z', '#1e2830')
  for (let i = 0; i < 8; i++) {
    const x = 256 + i * 13.5, y = 148 - i * 11
    s += R(x, y, 13.5, 6, '#2a2018') + R(x, y, 13.5, 1.6, '#5b4630', 0.8) + R(x + 2, y, 9, 1.4, '#7a2a30', 0.55)
  }
  s += L('M254 118L360 34', '#6a5230', 3) + L('M254 119L360 36', '#a8854a', 1, 0.6)
  for (let i = 0; i < 9; i++) s += L(`M${258 + i * 12.5} ${126 - i * 9.4}V${150 - i * 11}`, '#4a3a24', 1.4)
  s += R(246, 98, 8, 56, '#4a3622') + E(250, 96, 6, 4, '#7a5e30') + R(244, 150, 12, 5, '#2a1e14')
  // mesa lateral junto à porta (recibo) e abajur aceso
  s += R(38, 124, 40, 4, '#3b2a1b') + R(41, 128, 4, 24, '#2b1e13') + R(71, 128, 4, 24, '#2b1e13')
  s += P('M52 124l5-3 9 1 4 3z', '#e8dfc4', 0.9) + L('M55 123l8 0', '#6a6048', 0.6, 0.7)
  // aparador (console) + abajur
  s += R(116, 116, 74, 5, '#4b351f') + R(118, 121, 70, 6, '#2d2014') + R(122, 127, 5, 26, '#2d2014') + R(179, 127, 5, 26, '#2d2014')
  s += P('M146 116l3-18h14l3 18z', '#f3d28a', 0.95) + R(154, 116, 4, 4, '#6b5026')
  s += E(156, 104, 46, 40, 'url(#hg)', 1, SCR)
  s += E(156, 119, 30, 5, '#ffd9a0', 0.18, SCR)
  s += R(168, 106, 8, 10, '#1e2a22') + E(172, 105, 3, 2, '#6a1d28')
  // tapete vermelho com bordas douradas em perspectiva
  s += R(0, 152, 360, 72, 'url(#hf)') + floorLines(152, 180, '#000', 0.42)
  s += P('M146 152H214L276 224H88Z', 'url(#hrun)') + L('M150 152L96 224M210 152L268 224', '#c79a3e', 1.6, 0.75) + L('M154 152L106 224M206 152L258 224', '#c79a3e', 0.7, 0.5)
  // facho de luz fria vindo da bandeira da porta
  s += P('M26 68L90 68L190 224L-34 224Z', '#9cc4e8', 0.15, SCR)
  s += P('M30 70L86 70L150 224L-6 224Z', '#b4d4ee', 0.12, SCR)
  // pegadas de lama (da porta ao tapete)
  const steps: [number, number, number][] = [[62, 176, 1], [76, 169, 0], [92, 176, 1], [108, 168, 0], [128, 173, 1], [150, 166, 0], [172, 172, 1], [196, 159, 0]]
  for (const [x, y, f] of steps) s += E(x, y, 4.5, 2.2, '#0f0a07', 0.82, `transform="rotate(${f ? -18 : 14} ${x} ${y})"`) + E(x - 1, y - 0.6, 2, 0.8, '#3b2a1a', 0.5)
  s += E(200, 152, 6, 2.6, '#0c0805', 0.85) + E(206, 150, 3, 1.4, '#2f2214', 0.6)
  // poça d'água na soleira refletindo o azul
  s += E(60, 156, 28, 3.6, '#7fa6c8', 0.28, SCR)
  // primeiro plano: guarda-chuvas e sombra do pilar
  s += R(0, 152, 26, 72, '#030405', 0.92) + P('M26 152Q38 172 28 224H0V152Z', '#030405', 0.55)
  s += P('M6 120L14 150V170L8 170Z', '#050607') + P('M2 130Q12 112 22 128L14 150Z', '#07090b') + R(12, 110, 2, 40, '#07090b')
  s += P('M340 224V170Q352 150 360 150V224Z', '#030405', 0.88)
  return s
}

/* ───────────────────────── SALA DE JANTAR ───────────────────────── */
const jan = () => {
  let s = `<defs>${grad('jw', [[0, '#1a110f'], [1, '#33211c']])}${grad('jf', [[0, '#120b0a'], [1, '#2c1c14']])}${grad('jc', [[0, '#5a1b24'], [1, '#2a0c12']], false)}
${grad('jt', [[0, '#8c8670'], [1, '#52503f']])}${grad('jd', [[0, '#4e4b3c'], [1, '#100f0b']])}${glow('jg', '#ffcf86', 0.95)}${glow('jm', '#9cc4e8', 0.45)}</defs>`
  // papel de parede adamascado + lambril
  s += R(0, 0, 360, 150, 'url(#jw)')
  for (let x = 0; x < 360; x += 22) for (let y = 30; y < 100; y += 22) s += E(x + 11, y + 11, 3, 5, '#3f2a24', 0.55)
  s += R(0, 96, 360, 56, '#1d130f') + R(0, 94, 360, 4, '#4a3224') + R(0, 20, 360, 6, '#0f0807') + R(0, 26, 360, 2, '#5a4030', 0.7)
  for (let x = 6; x < 360; x += 40) s += L(`M${x} 104h28v40h-28z`, '#4a3224', 1, 0.7)
  // janela grande com cortinas de veludo e tempestade
  s += R(58, 34, 96, 66, '#0b1219') + R(62, 38, 88, 58, '#355068', 0.9)
  s += R(62, 38, 88, 58, 'url(#jm)', 0.9)
  s += `<clipPath id="jwc"><rect x="62" y="38" width="88" height="58"/></clipPath><g clip-path="url(#jwc)"><rect class="rain" x="56" y="20" width="100" height="100" fill="url(#rn)" opacity=".85"/></g>`
  s += P('M110 38l-8 22 7 0-6 20 14-26-7 0 7-16z', '#dfeaff', 0.14) + L('M106 38v58M62 66h88', '#0b1219', 2.4)
  s += P('M48 30H78Q80 72 70 108H48Z', 'url(#jc)') + P('M166 30H136Q134 72 144 108H166Z', 'url(#jc)')
  for (let i = 0; i < 5; i++) s += L(`M${52 + i * 5} 32V106`, '#000', 1, 0.3) + L(`M${160 - i * 5} 32V106`, '#000', 1, 0.3)
  s += R(44, 28, 126, 5, '#a8854a') + E(44, 30, 4, 4, '#c79a3e') + E(170, 30, 4, 4, '#c79a3e')
  s += R(54, 98, 104, 5, '#2a1b13')
  // quadro + quadro de chaves (gancho vazio)
  s += R(188, 42, 46, 38, '#7c5f2e') + R(191, 45, 40, 32, '#161a16') + P('M193 77L205 60l9 8 8-13 9 22z', '#2a3a2e') + E(222, 54, 4, 4, '#a8a070', 0.5)
  s += R(246, 82, 34, 40, '#4b351f') + R(249, 85, 28, 34, '#201710') + L('M251 95h24M251 108h24', '#3a2a1a', 1)
  for (const kx of [255, 263, 271]) s += E(kx, 96, 1.5, 1.5, '#a8854a') + (kx !== 263 ? L(`M${kx} 98v7`, '#8a6c2a', 1) + E(kx, 108, 3, 3, '#a8854a', 0.9) : '')
  s += E(263, 96, 2.2, 2.2, '#d0a649') + E(263, 96, 5, 5, '#d0a649', 0.2, SCR) + E(263, 110, 6, 6, '#c8503a', 0.0)
  // lustre aceso
  s += L('M210 20V38', '#050505', 1.6) + E(210, 44, 24, 5, '#2a1f14') + E(210, 43, 24, 5, '#a8854a', 0.5)
  for (const dx of [-22, -11, 0, 11, 22]) s += R(210 + dx - 1.4, 32, 2.8, 10, '#e8dfc4') + E(210 + dx, 30, 1.8, 3, '#ffe3a0') + E(210 + dx, 29, 9, 9, 'url(#jg)', 0.9, SCR)
  s += E(210, 56, 110, 40, 'url(#jg)', 0.35, SCR)
  // chão
  s += R(0, 152, 360, 72, 'url(#jf)') + floorLines(152, 180, '#000', 0.4, 40)
  s += P('M70 152H290L350 224H10Z', '#2a0e13', 0.7) + L('M74 152L18 224M286 152L342 224', '#a8854a', 1, 0.45)
  // cadeiras ao fundo (uma puxada para trás, vazia)
  for (const cx of [86, 146, 206, 266]) s += R(cx - 15, 78, 30, 38, '#1f130d') + R(cx - 11, 82, 22, 30, '#341e18') + L(`M${cx - 11} 82h22v30h-22z`, '#5a3a28', 0.8, 0.7)
  s += `<g transform="rotate(-9 318 120)">` + R(300, 82, 32, 44, '#1f130d') + R(304, 86, 24, 36, '#341e18') + L('M304 86h24v36h-24z', '#5a3a28', 0.8, 0.7) + `</g>`
  s += P('M298 150l22 3-2 9-22-4z', '#e8e2d2', 0.85) // guardanapo caído
  // mesa em perspectiva posta para cinco
  s += P('M52 104H318L350 150H20Z', 'url(#jt)') + P('M20 150H350V224H20Z', 'url(#jd)')
  s += L('M20 150H350', '#fff', 1, 0.2)
  for (let x = 36; x < 350; x += 20) s += L(`M${x} 152V224`, '#000', 1, 0.14)
  s += P('M20 150H350V158H20Z', '#000', 0.2)
  for (const [px, py, k] of [[84, 128, 0], [136, 132, 1], [190, 134, 2], [244, 132, 3], [298, 128, 4]] as [number, number, number][]) {
    s += E(px, py + 2, 22, 5.6, '#000', 0.25) + E(px, py, 20, 5, '#efe9d6') + E(px, py, 13, 3.3, '#cfc7ac') + E(px, py - 1, 8, 1.8, '#f4f0e2')
    s += L(`M${px - 30} ${py - 4}v8M${px + 28} ${py - 4}v8`, '#c9c2b0', 1.2, 0.8)
    if (k !== 1) s += R(px - 3, py - 22, 6, 18, '#cfe0e6', 0.35) + E(px, py - 22, 4.5, 1.4, '#cfe0e6', 0.5)
  }
  // copo com batom (c4) + garrafa aberta + taça
  s += R(116, 98, 8, 14, '#cfe0e6', 0.55) + E(120, 98, 4, 1.4, '#e8f2f6', 0.7) + E(120, 97, 2.4, 1, '#b02a3a', 0.95) + E(120, 112, 5, 1.4, '#000', 0.22)
  s += R(152, 90, 10, 22, '#0f1a12') + R(155, 80, 4, 12, '#0f1a12') + R(155, 78, 4, 3, '#a8854a') + R(153, 96, 8, 8, '#d8d0b6', 0.55)
  s += R(172, 100, 7, 12, '#5a0f1c', 0.6) + E(175.5, 100, 3.6, 1.2, '#7a1d2d', 0.9)
  // candelabro central aceso
  s += R(207, 104, 6, 26, '#a8854a') + E(210, 131, 10, 2.6, '#8a6c2a') + R(194, 104, 32, 2.4, '#a8854a')
  for (const dx of [-14, 0, 14]) s += R(210 + dx - 1.8, 92, 3.6, 13, '#efe9d6') + P(`M${210 + dx} 85q-3.4 4 0 8q3.4-4 0-8z`, '#ffcf6a') + E(210 + dx, 88, 16, 16, 'url(#jg)', 1, SCR)
  s += E(210, 124, 90, 14, '#ffcf86', 0.14, SCR)
  // facho de luar da janela no chão
  s += P('M62 96L150 96L240 224L-10 224Z', '#9cc4e8', 0.09, SCR)
  // primeiro plano
  s += R(0, 160, 18, 64, '#030203', 0.9) + R(342, 160, 18, 64, '#030203', 0.9)
  return s
}

/* ───────────────────────── ESCRITÓRIO ───────────────────────── */
const esc = () => {
  let s = `<defs>${grad('ew', [[0, '#0e1a15'], [1, '#1f332a']])}${grad('ef', [[0, '#0f0b08'], [1, '#33241a']])}${glow('eg', '#ffd27a', 0.95)}${glow('ec', '#7ad2a0', 0.4)}${glow('em', '#9cc4e8', 0.45)}
${grad('ed', [[0, '#5b3b22'], [1, '#2f1e12']])}${grad('ec2', [[0, '#7a1d2d'], [1, '#3a0d16']])}</defs>`
  s += R(0, 0, 360, 152, 'url(#ew)') + R(0, 20, 360, 6, '#0a100d') + R(0, 26, 360, 2, '#4a3a24', 0.7)
  // lambril de madeira
  s += R(0, 98, 360, 54, '#1a120b') + R(0, 96, 360, 4, '#4a3420')
  for (let x = 4; x < 360; x += 34) s += L(`M${x} 106h26v38h-26z`, '#3a2818', 1, 0.8)
  // estante de livros cheia (esquerda)
  s += R(10, 30, 92, 124, '#120b07') + R(14, 34, 84, 116, '#1e140d')
  const cols = ['#5a1f26', '#2b3d52', '#4a3a1c', '#2c4a3a', '#6a4a22', '#3a2b4a', '#7a5a2a']
  for (let sh = 0; sh < 5; sh++) {
    const y = 36 + sh * 23
    s += R(14, y + 19, 84, 3, '#3a2818')
    let x = 17
    for (let i = 0; i < 12 && x < 92; i++) {
      const w = 4 + ((i * 7 + sh * 3) % 4), h = 13 + ((i * 5 + sh * 2) % 7)
      s += R(x, y + 19 - h, w, h, cols[(i + sh * 2) % cols.length], 0.9)
      x += w + 0.6
    }
  }
  // globo
  s += E(112, 108, 11, 11, '#27456a') + L('M101 108H123M112 97V119', '#c79a3e', 0.7, 0.6) + L('M104 100Q112 108 104 116', '#c79a3e', 0.6, 0.5) + R(108, 118, 8, 22, '#2b1c10') + E(112, 141, 9, 2.5, '#2b1c10')
  // janela com chuva (direita) + cortina
  s += R(228, 34, 100, 66, '#0a1118') + R(232, 38, 92, 58, '#2d4a62') + R(232, 38, 92, 58, 'url(#em)')
  s += `<clipPath id="ewc"><rect x="232" y="38" width="92" height="58"/></clipPath><g clip-path="url(#ewc)"><rect class="rain" x="226" y="20" width="104" height="100" fill="url(#rn)" opacity=".85"/></g>`
  s += L('M278 38v58M232 67h92', '#0a1118', 2.4) + P('M222 30H246Q246 70 238 104H222Z', '#17352a') + P('M334 30H312Q312 70 320 104H334Z', '#17352a')
  s += R(220, 28, 120, 4, '#a8854a', 0.8)
  s += P('M232 96H324L370 224H190Z', '#9cc4e8', 0.08, SCR)
  // relógio de parede
  s += E(184, 52, 15, 15, '#2a1b10') + E(184, 52, 12.5, 12.5, '#d8cfb4') + L('M184 52V43M184 52l7 4', '#1a120b', 1.4) + E(184, 52, 2, 2, '#1a120b')
  // piso + tapete persa
  s += R(0, 152, 360, 72, 'url(#ef)') + floorLines(152, 180, '#000', 0.4, 38)
  s += P('M92 160H274L318 214H48Z', 'url(#ec2)') + P('M104 165H262L298 208H68Z', '#2a0c14', 0.7) + L('M92 160H274L318 214H48Z', '#c79a3e', 1.2, 0.7)
  s += E(183, 186, 36, 11, '#a8854a', 0.4) + E(183, 186, 22, 6, '#2a0c14', 0.8)
  // cadeira de couro atrás da mesa
  s += P('M146 150V96Q146 80 180 80Q214 80 214 96V150Z', '#24150d') + P('M152 148V98Q152 88 180 88Q208 88 208 98V148Z', '#3a2316') + L('M152 98H208M152 112H208M152 126H208', '#0f0a06', 1, 0.5)
  // mesa de trabalho
  s += R(98, 124, 154, 7, 'url(#ed)') + R(98, 124, 154, 1.6, '#a8854a', 0.6) + R(104, 131, 142, 32, '#2a190d') + R(108, 135, 64, 24, '#35210f') + R(176, 135, 66, 24, '#35210f')
  s += L('M108 135h64v24h-64zM176 135h66v24h-66z', '#6a4a28', 0.8, 0.8) + E(140, 147, 3, 3, '#c79a3e') + E(209, 147, 3, 3, '#c79a3e')
  s += R(104, 163, 8, 24, '#1c110a') + R(238, 163, 8, 24, '#1c110a')
  // papéis, caneta e mata-borrão
  s += P('M186 123l32-3 3 3-32 3z', '#e3d8b0', 0.9) + P('M200 119l30-5 3 3-30 5z', '#d8cfb4', 0.7) + R(224, 118, 22, 5, '#1a2a22') + L('M206 121l22-8', '#0a0a0a', 1.4)
  // caixa de joias — tampa forçada, vazia (c1)
  s += R(148, 113, 24, 11, '#6a4a1c') + R(148, 113, 24, 2, '#c79a3e') + P('M147 113L171 113 176 97 152 97Z', '#7a561e') + P('M152 97L176 97 175 99 153 99Z', '#c79a3e', 0.8) + R(151, 114, 18, 6, '#7a1d2d')
  s += E(160, 118, 10, 3, '#000', 0.4) + L('M146 112l6 -5', '#e8dfc4', 1, 0.7) + E(160, 123, 16, 3, '#000', 0.3)
  // abajur verde aceso — fonte principal de luz
  s += R(118, 112, 3, 12, '#a8854a') + E(119.5, 124, 8, 2.4, '#a8854a') + P('M107 98Q119 84 134 98L132 108H109Z', '#1f5a3a') + P('M107 98Q119 84 134 98L132 100Q120 88 109 100Z', '#7ad2a0', 0.4)
  s += E(121, 110, 52, 38, 'url(#eg)', 1, SCR) + E(121, 126, 36, 8, '#ffd27a', 0.22, SCR) + E(121, 112, 24, 18, 'url(#ec)', 0.5, SCR)
  // aparador/secretária à direita com agenda (c5)
  s += R(272, 106, 70, 48, '#241609') + R(270, 102, 74, 5, '#4b351f') + R(270, 102, 74, 1.4, '#a8854a', 0.6) + R(276, 112, 28, 38, '#2e1c0e') + R(310, 112, 28, 38, '#2e1c0e')
  s += L('M276 112h28v38h-28zM310 112h28v38h-28z', '#6a4a28', 0.8, 0.8) + E(300, 130, 2, 2, '#c79a3e') + E(314, 130, 2, 2, '#c79a3e')
  s += P('M286 100L316 98L318 102L288 104Z', '#e3d8b0', 0.9) + L('M290 101l22-1M290 103l22-1', '#22251f', 0.7, 0.55) + P('M300 97l16-1 0 3-16 1z', '#7a1d2d', 0.8) + E(326, 98, 3, 5, '#a8854a', 0.85)
  s += E(306, 96, 26, 10, '#ffd27a', 0.18, SCR)
  // fumaça de charuto no ar + poeira em contraluz
  s += P('M232 122Q240 112 234 102Q228 94 238 86', 'none', 1, 'stroke="#d8d0b6" stroke-width="2" opacity=".12"')
  // primeiro plano: poltrona em silhueta + vinheta lateral
  s += P('M0 224V150Q4 132 24 130Q44 132 44 156V224Z', '#040605', 0.95) + P('M342 224V170Q348 156 360 154V224Z', '#040605', 0.9)
  return s
}

/* ───────────────────────── QUARTO DE HÓSPEDES ───────────────────────── */
const qua = () => {
  let s = `<defs>${grad('qw', [[0, '#14111d'], [1, '#2d2640']])}${grad('qf', [[0, '#0f0c14'], [1, '#2a2030']])}${glow('qm', '#aec6e8', 0.6)}${glow('qg', '#ffd9a0', 0.5)}
${grad('qb', [[0, '#6b6280'], [1, '#2e283c']])}${grad('qs', [[0, '#cfd6e8', 0.55], [1, '#cfd6e8', 0]])}</defs>`
  s += R(0, 0, 360, 152, 'url(#qw)') + R(0, 20, 360, 6, '#0a0810') + R(0, 26, 360, 2, '#4a4262', 0.7)
  for (let x = 14; x < 360; x += 28) s += L(`M${x} 30V150`, '#000', 1, 0.16)
  s += R(0, 108, 360, 44, '#1d1830') + R(0, 106, 360, 3, '#463e60')
  // janela grande com cortina branca e luar (direita)
  s += R(258, 34, 84, 80, '#0a0d14') + R(262, 38, 76, 72, '#3a5878') + R(262, 38, 76, 72, 'url(#qm)')
  s += `<clipPath id="qwc"><rect x="262" y="38" width="76" height="72"/></clipPath><g clip-path="url(#qwc)"><rect class="rain" x="256" y="20" width="90" height="110" fill="url(#rn)" opacity=".9"/></g>`
  s += L('M300 38v72M262 74h76', '#0a0d14', 2.2) + P('M250 30H276Q278 80 268 120H250Z', '#cfd6e8', 0.28) + P('M350 30H324Q322 80 332 120H350Z', '#cfd6e8', 0.28)
  s += E(284, 54, 14, 14, '#eef2ff', 0.28, SCR)
  s += P('M262 110H338L330 224H160Z', 'url(#qs)', 0.5, SCR) + P('M268 112H332L300 224H170Z', '#cfd6e8', 0.07, SCR)
  // quadro torto e espelho
  s += R(32, 44, 34, 44, '#5a4a2e') + R(35, 47, 28, 38, '#171421') + P('M37 83Q49 62 61 83Z', '#2c3248') + E(49, 58, 5, 5, '#8fa8c8', 0.4)
  s += R(196, 44, 38, 30, '#3a3150') + R(199, 47, 32, 24, '#262034') + L('M202 68l10-14 8 10 8-14', '#4a4262', 1)
  // piso + tapete
  s += R(0, 152, 360, 72, 'url(#qf)') + floorLines(152, 180, '#000', 0.4, 38)
  s += P('M30 178H250L282 214H0Z', '#241a38', 0.9) + L('M30 178H250L282 214H0Z', '#8a7ab0', 1, 0.4)
  // cama: cabeceira, colcha, travesseiros
  s += R(30, 62, 170, 68, '#1a1424') + R(36, 66, 158, 60, '#2a2238') + L('M36 66h158v60h-158z', '#4a4262', 1, 0.8)
  for (let x = 52; x < 190; x += 24) s += L(`M${x} 70V124`, '#000', 1, 0.3)
  s += P('M30 128H200L206 160H24Z', 'url(#qb)') + R(24, 160, 182, 16, '#1c1628') + R(30, 176, 6, 18, '#120d1c') + R(194, 176, 6, 18, '#120d1c')
  s += E(70, 126, 22, 8, '#d8d0e4', 0.85) + E(70, 124, 22, 5, '#efe8f4', 0.5) + E(150, 126, 22, 8, '#d8d0e4', 0.8) + E(150, 124, 22, 5, '#efe8f4', 0.45)
  s += P('M24 160H206L206 166H24Z', '#000', 0.25)
  s += P('M40 150Q100 140 170 150L180 160H30Z', '#8a7ab0', 0.28)
  // mala aberta sobre a cama (c7) — roupas reviradas, pacote de veludo
  s += P('M56 146L124 146L134 166L46 166Z', '#2a1a12') + P('M56 146L124 146L128 154L52 154Z', '#3a261a') + L('M56 146H124L134 166H46Z', '#8a6c2a', 1, 0.7)
  s += P('M52 144L128 144L122 118L60 118Z', '#4a3322') + P('M60 118L122 118L120 122L62 122Z', '#8a6c2a', 0.6) + R(64, 124, 54, 16, '#2a1a12', 0.9)
  s += P('M62 154Q72 140 84 150Q96 142 108 152L112 160H58Z', '#8f3a46') + P('M84 150Q98 138 112 150L116 160H90Z', '#d8d0b6', 0.9) + P('M52 160Q62 150 72 158L76 166H48Z', '#3a4a6a')
  s += R(82, 146, 18, 13, '#5a0f2a') + P('M82 146L100 146L102 143L84 143Z', '#7a1d3a') + L('M84 152h14', '#d0a649', 0.9, 0.8) + E(91, 152, 10, 8, '#ff9fb4', 0.12, SCR)
  s += P('M118 160Q130 154 136 164L120 168Z', '#c9c2d8', 0.8) + P('M124 164L150 168L146 172Z', '#d8d0e4', 0.7)
  // criado-mudo com abajur e relógio parado (c8)
  s += R(208, 128, 46, 5, '#4a3a2c') + R(210, 133, 42, 36, '#2a1f18') + R(214, 138, 34, 12, '#35281e') + L('M214 138h34v12h-34z', '#6a4a28', 0.8, 0.7) + E(231, 144, 2, 2, '#c79a3e') + R(210, 169, 5, 14, '#1a120d') + R(247, 169, 5, 14, '#1a120d')
  s += P('M222 112L226 98H238L242 112Z', '#4a4262') + R(231, 112, 2, 16, '#6b6280') + E(232, 128, 9, 2, '#6b6280')
  s += E(232, 100, 20, 20, 'url(#qg)', 0.3, SCR)
  s += E(234, 125, 7, 2, '#000', 0.3) + E(233, 123, 6, 6, '#c9d0e0') + E(233, 123, 4.4, 4.4, '#e8e2d2') + L('M233 123V120M233 123l3 -1', '#1a1a22', 0.8) + L('M227 124Q222 126 220 128M239 124Q246 128 250 128', '#a8854a', 1.2)
  s += E(233, 124, 12, 6, '#cfd6e8', 0.16, SCR)
  // primeiro plano: guarda-roupa / sombra
  s += R(0, 152, 22, 72, '#030208', 0.9) + P('M342 224V176Q350 160 360 158V224Z', '#030208', 0.85)
  return s
}

export const ROOM_DRAW_000: Record<string, () => string> = { of_hal: hal, of_jan: jan, of_esc: esc, of_qua: qua }

/** Luzes (gradientes "screen") sobrepostas pelo FX() — afinadas por cômodo. */
export const ROOM_LT_000: Record<string, any[][]> = {
  of_hal: [[156, 100, 110, '#ffd9a0', 0.4], [62, 70, 90, '#9cc4e8', 0.3]],
  of_jan: [[210, 80, 150, '#ffcf86', 0.45], [104, 70, 80, '#9cc4e8', 0.2]],
  of_esc: [[121, 110, 120, '#ffd27a', 0.5], [280, 70, 80, '#9cc4e8', 0.22]],
  of_qua: [[300, 70, 110, '#aec6e8', 0.4], [232, 100, 60, '#ffd9a0', 0.15]],
}
