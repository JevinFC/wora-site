import RotatingPlayer from './RotatingPlayer.jsx'
import Wordmark from './Wordmark.jsx'
import { artists } from '../data/artists.js'

const roster = artists.map((a) => a.name.toUpperCase()).join('  ·  ')

export default function Hero() {
  return (
    <section id="top" className="mx-auto max-w-5xl px-6 pb-20 pt-14 sm:pb-28 sm:pt-20">
      <p className="mb-5 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-slate">
        // collectif de rap New Wave à Tours
      </p>

      <h1 className="-ml-1 text-[23vw] sm:text-[11.5rem]">
        <Wordmark glitch />
      </h1>

      <p className="mt-6 max-w-md font-body text-lg text-ink/70">
        Placeholder présentation du groupe, de l'univers / la musique
      </p>

      <p className="mt-6 max-w-xl font-mono text-[0.7rem] uppercase leading-relaxed tracking-[0.16em] text-slate/80">
        {roster}
      </p>

      <div className="mt-10 max-w-md border border-ink/15 bg-tape/60 p-4">
        <RotatingPlayer />
      </div>
    </section>
  )
}
