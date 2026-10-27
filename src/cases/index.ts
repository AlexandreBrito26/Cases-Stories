import type { Case, Flag } from '../types'
import { valverde } from './valverde'
import { imperial } from './imperial'
import { aurora } from './aurora'
import { origem } from './origem'
import { galeria } from './galeria'
import { farol } from './farol'

export const CASES: Case[] = [origem, valverde, imperial, aurora, galeria, farol]

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
