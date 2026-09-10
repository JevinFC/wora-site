import { useCallback, useEffect, useRef, useState } from 'react'
import SpotifyEmbed from './SpotifyEmbed.jsx'
import { loadSpotifyIframeApi } from '../lib/spotifyIframeApi.js'
import { rotation } from '../data/rotation.js'

// Lecteur "en écoute" du hero.
//
// Au repos : le lecteur fait défiler les morceaux / artistes du collectif, un
// nouveau toutes les IDLE_MS (chargé mais en pause — pas de son, l'autoplay est
// de toute façon bloqué par les navigateurs).
//
// Dès qu'on lance la lecture : le défilement s'arrête, le morceau va au bout,
// puis le suivant s'enchaîne automatiquement — et ainsi de suite.
//
// Le défilement se met aussi en pause au survol / focus, peut être figé via le
// bouton, et ne démarre pas du tout en `prefers-reduced-motion`.

const IDLE_MS = 4000

const wantsReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function RotatingPlayer() {
  const containerRef = useRef(null)
  const hostWrapRef = useRef(null)
  const controllerRef = useRef(null)
  const autoplayTimerRef = useRef(null)

  const [index, setIndex] = useState(0)
  const [glitchTick, setGlitchTick] = useState(0) // relance le glitch à chaque changement
  const [engaged, setEngaged] = useState(false) // l'utilisateur a lancé la lecture
  const [hovering, setHovering] = useState(false)
  const [userRotating, setUserRotating] = useState(() => !wantsReducedMotion())
  const [reducedMotion, setReducedMotion] = useState(wantsReducedMotion)
  const [apiFailed, setApiFailed] = useState(false)

  const indexRef = useRef(0)
  const engagedRef = useRef(false)
  const playRef = useRef({ started: false, ratio: 0, wasPlaying: false })

  useEffect(() => {
    indexRef.current = index
  }, [index])
  useEffect(() => {
    engagedRef.current = engaged
  }, [engaged])

  // Charge un morceau de la rotation ; `autoplay` enchaîne la lecture.
  const goTo = useCallback((next, autoplay) => {
    const len = rotation.length
    const i = ((next % len) + len) % len
    indexRef.current = i
    setIndex(i)
    setGlitchTick((t) => t + 1)
    playRef.current = { started: false, ratio: 0, wasPlaying: false }

    const controller = controllerRef.current
    if (!controller) return
    try {
      controller.loadUri(rotation[i].uri)
    } catch {
      /* ignore */
    }

    if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current)
    if (autoplay) {
      autoplayTimerRef.current = setTimeout(() => {
        try {
          controllerRef.current?.play()
        } catch {
          /* ignore */
        }
      }, 450)
    }
  }, [])

  // --- Mise en place de l'API iFrame Spotify ---
  useEffect(() => {
    let cancelled = false
    let host = null
    const failTimer = setTimeout(() => {
      if (!cancelled) setApiFailed(true)
    }, 6000)

    const handleUpdate = (event) => {
      const data = (event && event.data) || {}
      const duration = Number(data.duration) || 0
      const position = Number(data.position) || 0
      const ratio = duration > 0 ? position / duration : 0
      const state = playRef.current

      if (!data.isPaused) {
        state.started = true
        state.wasPlaying = true
        state.ratio = ratio
        if (!engagedRef.current) {
          engagedRef.current = true
          setEngaged(true)
        }
        // Certaines lectures se terminent sans repasser en "pause".
        if (ratio >= 0.999) {
          state.wasPlaying = false
          goTo(indexRef.current + 1, true)
        }
        return
      }

      // En pause : soit le morceau est allé au bout → on enchaîne,
      // soit l'utilisateur a mis en pause lui-même → on ne touche à rien.
      if (state.wasPlaying && state.started && state.ratio >= 0.98) {
        state.wasPlaying = false
        goTo(indexRef.current + 1, true)
      }
    }

    loadSpotifyIframeApi()
      .then((IFrameAPI) => {
        if (cancelled || !hostWrapRef.current) return
        clearTimeout(failTimer)
        host = document.createElement('div')
        hostWrapRef.current.appendChild(host)
        IFrameAPI.createController(
          host,
          { uri: rotation[0].uri, width: '100%', height: '152' },
          (controller) => {
            if (cancelled) {
              try {
                controller.destroy()
              } catch {
                /* ignore */
              }
              return
            }
            controllerRef.current = controller
            controller.addListener('playback_update', handleUpdate)
            requestAnimationFrame(() => {
              const iframe = hostWrapRef.current?.querySelector('iframe')
              if (iframe) {
                iframe.style.width = '100%'
                iframe.style.border = '0'
                iframe.style.borderRadius = '4px'
              }
            })
          },
        )
      })
      .catch(() => {
        if (!cancelled) setApiFailed(true)
      })

    return () => {
      cancelled = true
      clearTimeout(failTimer)
      if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current)
      try {
        controllerRef.current?.destroy()
      } catch {
        /* ignore */
      }
      controllerRef.current = null
      if (host && host.parentNode) host.parentNode.removeChild(host)
      // Filet de sécurité si `destroy()` n'a pas retiré l'iframe.
      if (hostWrapRef.current) hostWrapRef.current.replaceChildren()
    }
  }, [goTo])

  // --- Suivi de prefers-reduced-motion ---
  useEffect(() => {
    if (typeof window.matchMedia !== 'function') return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => setReducedMotion(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  // --- Défilement au repos ---
  const canRotate =
    rotation.length > 1 && !engaged && userRotating && !hovering && !reducedMotion

  useEffect(() => {
    if (!canRotate) return
    const id = setInterval(() => goTo(indexRef.current + 1, false), IDLE_MS)
    return () => clearInterval(id)
  }, [canRotate, goTo])

  if (apiFailed || rotation.length === 0) {
    const first = rotation[0]
    return first ? (
      <SpotifyEmbed spotifyId={first.id} type={first.type} label={first.label} />
    ) : null
  }

  const current = rotation[index]
  const count = `${String(index + 1).padStart(2, '0')} / ${String(rotation.length).padStart(2, '0')}`
  const multi = rotation.length > 1

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      onFocus={() => setHovering(true)}
      onBlur={(e) => {
        // relatedTarget nul = focus parti vers l'iframe Spotify (autre document)
        // ou nulle part : on reste en pause, c'est l'état sûr.
        if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) {
          setHovering(false)
        }
      }}
    >
      <div className="mb-3 flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate">
        <span className="glow-dot inline-block h-2 w-2 shrink-0" />
        <span className="flex-1 truncate">
          {engaged ? 'lecture' : 'en écoute'} · {current.label}
        </span>
        {multi && !engaged && (
          <button
            type="button"
            onClick={() => setUserRotating((v) => !v)}
            className="hover-glow shrink-0"
            aria-label={
              userRotating
                ? 'Figer le défilement des morceaux'
                : 'Reprendre le défilement automatique des morceaux'
            }
          >
            {userRotating ? '❚❚' : '▶'} {count}
          </button>
        )}
        {multi && engaged && <span className="shrink-0">{count}</span>}
      </div>
      <div className="relative">
        <div ref={hostWrapRef} className="min-h-[152px]" />
        {glitchTick > 0 && (
          <span
            key={glitchTick}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-white mix-blend-difference"
            style={{ animation: 'wora-track-glitch 320ms steps(1, end) both' }}
          />
        )}
      </div>
    </div>
  )
}
