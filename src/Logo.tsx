import { EMBLEM_INNER } from './emblem'

/** Emblema do jogo: uma lupa cuja lente é um espelho quebrado, com uma fechadura. */
export function Emblem({ size = 88 }: { size?: number }) {
  return (
    <svg
      className="emblem"
      viewBox="0 0 200 200"
      width={size}
      height={size}
      role="img"
      aria-label="Cases Stories"
      dangerouslySetInnerHTML={{ __html: EMBLEM_INNER }}
    />
  )
}
