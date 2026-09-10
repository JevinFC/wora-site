import { useCallback, useEffect, useRef, useState } from 'react'
import SpotifyEmbed from './SpotifyEmbed.jsx'
import { artists } from '../data/artists.js'

const initialOf = (name) => (name.trim()[0] || '?').toUpperCase()

// Overlay plein écran affiché quand une case est cliquée : flash rouge, panneau
// qui s'ouvre, puis le lecteur Spotify qui apparaît en dessous (animation décalée).
function ArtistReveal({ artist, index, onClose, triggerRef }) {
  const panelRef = useRef(null)
  const closeRef = useRef(null)
  const number = String(index + 1).padStart(2, '0')

  // Fermeture en deux temps : on joue d'abord l'animation (écrasement + dispersion),
  // puis on démonte pour de bon.
  const [closing, setClosing] = useState(false)
  const requestClose = useCallback(() => setClosing(true), [])

  useEffect(() => {
    if (!closing) return
    // Filet de sécurité si `animationend` ne se déclenche pas (durée de wora-crush-out).
    const timer = setTimeout(onClose, 480)
    return () => clearTimeout(timer)
  }, [closing, onClose])

  useEffect(() => {
    const trigger = triggerRef.current
    closeRef.current?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        requestClose()
        return
      }
      // Piège à focus : on garde la tabulation à l'intérieur du panneau.
      if (e.key !== 'Tab' || !panelRef.current) return
      const focusable = panelRef.current.querySelectorAll(
        'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
      // Rendre le focus à la case d'où on vient.
      trigger?.focus?.()
    }
  }, [requestClose, triggerRef])

  return (
    <div
      className={`fixed inset-0 z-[100] overflow-hidden ${closing ? 'pointer-events-none' : ''}`}
    >
      {/* Fond sombre, cliquable pour fermer. */}
      <button
        type="button"
        aria-label="Fermer la sélection"
        onClick={requestClose}
        className="absolute inset-0 bg-paper/92 backdrop-blur-sm"
        style={{
          animation: closing
            ? 'wora-fade-out 340ms ease forwards'
            : 'wora-fade 140ms steps(3, end) both',
        }}
      />

      <div className="absolute inset-0 overflow-y-auto">
        <div
          className="min-h-[100dvh] flex items-center justify-center p-0 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) requestClose()
          }}
        >
          <div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="roster-name"
            className="relative flex max-h-[100dvh] w-full max-w-2xl flex-col overflow-hidden bg-tape border-y-2 border-x-0 border-ink shadow-[0_0_50px_rgba(255,255,255,0.22)] sm:max-h-[calc(100dvh-3rem)] sm:border-2"
            style={{
              animation: closing
                ? 'wora-crush-out 440ms linear forwards'
                : 'wora-glitch-in 260ms linear both, wora-desaturate 480ms ease-out both',
            }}
            onAnimationEnd={(e) => {
              if (e.target === panelRef.current && e.animationName === 'wora-crush-out') {
                onClose()
              }
            }}
          >
            <div className="flex shrink-0 items-center justify-between border-b-2 border-ink px-4 py-2.5 sm:px-8 sm:py-3">
              <span className="font-mono text-xs uppercase tracking-[0.2em] text-slate">
                Personnage {number}
              </span>
              <button
                ref={closeRef}
                type="button"
                onClick={requestClose}
                className="hover-glow font-mono text-xs uppercase tracking-wide border border-ink/30 rounded-full px-3 py-1"
              >
                Fermer ✕
              </button>
            </div>

            {/* Corps : défile seulement en tout dernier recours (paysage sur
                très petit écran). En portrait, tout tient sans scroll. */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-8 sm:py-7">
              <div className="flex flex-row items-start gap-4 sm:gap-6">
                {artist.image ? (
                  <img
                    src={artist.image}
                    alt={`Portrait de ${artist.name}`}
                    width={160}
                    height={160}
                    className="h-16 w-16 shrink-0 border-2 border-ink/70 object-cover sm:h-32 sm:w-32"
                    style={{ filter: 'grayscale(1) contrast(1.12) brightness(0.85)' }}
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-ink/70 bg-paper font-display text-3xl font-black leading-none text-ink/25 sm:h-32 sm:w-32 sm:text-5xl">
                    {initialOf(artist.name)}
                  </div>
                )}

                <div style={{ transform: 'skewX(-3deg)' }}>
                  <div className="glow-accent font-mono text-xs sm:text-sm mb-1">// sélectionné</div>
                  <h3
                    id="roster-name"
                    className="font-display font-black text-3xl sm:text-6xl leading-[0.85] uppercase break-words"
                  >
                    {artist.name}
                  </h3>
                  {artist.alias && (
                    <div className="mt-1 font-display font-bold text-lg sm:text-2xl uppercase text-slate">
                      {artist.alias}
                    </div>
                  )}
                </div>
              </div>

              <a
                href={artist.profileUrl}
                target="_blank"
                rel="noreferrer"
                className="hover-glow mt-3 inline-block font-mono text-xs uppercase tracking-wide text-slate sm:mt-5"
              >
                Profil Spotify ↗
              </a>

              <div
                className="mt-4 border-t border-ink/15 pt-4 sm:mt-6 sm:pt-6"
                style={{ animation: 'wora-rise 280ms ease-out 300ms both' }}
              >
                {/* Bord à bord sur mobile : annule le px-4 du corps pour donner
                    au lecteur toute la largeur de l'écran (les écrans avec zoom
                    d'affichage passaient sous la largeur mini de l'embed Spotify). */}
                <div className="-mx-4 sm:mx-0">
                  <SpotifyEmbed
                    spotifyId={artist.spotifyId}
                    type="artist"
                    label={artist.name}
                    eager
                  />
                </div>
                <p className="mt-2 flex items-center gap-2 font-mono text-[0.65rem] text-slate sm:mt-3 sm:text-[0.7rem]">
                  <span className="glow-dot inline-block h-1.5 w-1.5 shrink-0 rounded-full" />
                  Mis à jour en direct par Spotify.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Crash glitch noir & blanc : recouvre tout ~0,6 s puis s'efface.
          pointer-events-none → n'empêche jamais de fermer le panneau. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 z-20 overflow-hidden pointer-events-none"
        style={{ animation: 'wora-glitch-clear 360ms ease-out forwards' }}
      >
        <div
          className="absolute inset-0"
          style={{ animation: 'wora-glitch-strobe 320ms linear forwards' }}
        />
        <div
          className="absolute inset-0 bg-[#111]"
          style={{ animation: 'wora-glitch-slice 260ms step-end forwards' }}
        />
        <div
          className="absolute inset-0 bg-[#e6e6e6]"
          style={{ animation: 'wora-glitch-slice-alt 260ms step-end forwards' }}
        />
        <div
          className="absolute inset-0 mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            animation: 'wora-noise-flicker 110ms steps(1, end) infinite',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(0,0,0,0.45) 0px, rgba(0,0,0,0.45) 1px, transparent 1px, transparent 3px)',
            animation: 'wora-scanroll 110ms linear infinite',
          }}
        />
      </div>
    </div>
  )
}

export default function Artists() {
  const [selected, setSelected] = useState(null)
  const triggerRef = useRef(null)
  const close = useCallback(() => setSelected(null), [])

  const openArtist = (artist, index, element) => {
    triggerRef.current = element
    setSelected({ artist, index })
  }

  return (
    <section id="artistes" className="max-w-5xl mx-auto px-6 py-20 border-t border-ink/12">
      <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-slate">
        // roster
      </p>
      <h2 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight">
        Artistes
      </h2>
      <p className="mt-3 font-mono text-xs uppercase tracking-[0.2em] text-slate">
        Choisis un membre du collectif
      </p>

      <ul className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {artists.map((artist, index) => (
          <li key={artist.spotifyId ?? artist.name}>
            <button
              type="button"
              onClick={(e) => openArtist(artist, index, e.currentTarget)}
              className="group relative flex aspect-square w-full flex-col justify-end overflow-hidden border-2 border-ink/70 bg-tape p-3 text-left transition-[transform,box-shadow,border-color] duration-150 ease-out hover:-translate-y-1 hover:border-white hover:shadow-[0_0_26px_rgba(255,255,255,0.28)] focus-visible:-translate-y-1 focus-visible:border-white focus-visible:shadow-[0_0_26px_rgba(255,255,255,0.28)]"
            >
              {artist.image ? (
                <>
                  <img
                    src={artist.image}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="artist-portrait pointer-events-none absolute inset-0 h-full w-full object-cover"
                  />
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-gradient-to-t from-paper via-paper/55 to-paper/5"
                  />
                </>
              ) : (
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -bottom-4 -right-2 select-none font-display text-[5.5rem] font-black leading-none text-ink/[0.07] transition-colors group-hover:text-white/20 sm:text-[6.5rem]"
                >
                  {initialOf(artist.name)}
                </span>
              )}
              <span className="hover-glow absolute left-2 top-2 border border-ink/30 bg-paper/80 px-1.5 py-1 font-mono text-[0.65rem] leading-none text-ink/80">
                {String(index + 1).padStart(2, '0')}
              </span>
              <span className="tile-label relative font-display text-xl font-extrabold uppercase leading-none sm:text-2xl">
                {artist.name}
              </span>
              {artist.alias && (
                <span className="tile-label relative mt-1 font-mono text-[0.7rem] text-ink/60">
                  {artist.alias}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>

      {selected && (
        <ArtistReveal
          artist={selected.artist}
          index={selected.index}
          onClose={close}
          triggerRef={triggerRef}
        />
      )}
    </section>
  )
}
