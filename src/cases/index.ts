import type { Case, Flag } from '../types'
import { valverde } from './valverde'
import { imperial } from './imperial'
import { aurora } from './aurora'

export const CASES: Case[] = [valverde, imperial, aurora]

export const BL: Record<Flag, string> = {
  contra: 'Contradição',
  clear: 'Álibi confirmado',
  adm: 'Admite o motivo',
  crack: 'Pressionado',
}

export function sceneName(id: string): string {
  for (const c of CASES) if (c.scenes[id]) return c.scenes[id].n
  return id
}
