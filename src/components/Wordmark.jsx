// Logo "wORA" partagé par le hero et le header — un seul endroit à modifier.
//
// - "w" bas-de-casse réduit (0.82em), "ORA" en capitales
// - chaque groupe barré via line-through : le trait se cale au milieu optique des
//   glyphes quelle que soit la taille du mot, et "se coupe" entre le w et le ORA
// - blanc, halo défini en `em` (donc proportionnel à la taille), légèrement penché
// - glitch : passe `glitch` pour la courte secousse périodique
//
// La taille et les marges se règlent sur l'élément parent (font-size héritée).

const GLOW =
  '0 0 0.022em rgba(255,255,255,0.9), 0 0 0.07em rgba(255,255,255,0.6), 0 0 0.16em rgba(255,255,255,0.45), 0 0 0.34em rgba(255,255,255,0.25)'

export default function Wordmark({ className = '', glitch = false }) {
  return (
    <span
      className={`inline-block select-none font-display font-black leading-[0.8] text-white ${className}`}
      style={{
        transform: 'skewX(-3deg)',
        textShadow: GLOW,
        animation: glitch ? 'wora-logo-glitch 8s steps(1, end) infinite' : undefined,
      }}
    >
      <span className="align-baseline text-[0.82em] line-through decoration-white decoration-[0.12em]">
        w
      </span>
      <span className="line-through decoration-white decoration-[0.1em]">ORA</span>
    </span>
  )
}
