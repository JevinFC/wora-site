import { useState } from 'react'
import SpotifyEmbed from './SpotifyEmbed.jsx'
import { releasedTracks } from '../data/tracks.js'

export default function TrackList() {
  const [openId, setOpenId] = useState(null)

  // Rien d'épinglé : on ne laisse pas une section vide sur la page.
  if (releasedTracks.length === 0) return null

  return (
    <section id="sons" className="max-w-5xl mx-auto px-6 py-20 border-t border-ink/12">
      <p className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-slate">
        // sélection
      </p>
      <h2 className="font-display font-black text-4xl sm:text-5xl uppercase tracking-tight mb-10">
        Sons
      </h2>

      <ul className="border-t border-ink/12">
        {releasedTracks.map((track, index) => {
          const isOpen = openId === track.id
          return (
            <li key={track.id} className="border-b border-ink/12">
              <button
                onClick={() => setOpenId(isOpen ? null : track.id)}
                className="w-full flex items-center gap-4 sm:gap-6 py-5 text-left group"
                aria-expanded={isOpen}
              >
                <span className="font-mono text-sm text-slate w-6 shrink-0">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="hover-glow font-display text-xl sm:text-2xl uppercase tracking-tight flex-1">
                  {track.title}
                </span>
                <span className="font-mono text-sm text-slate hidden sm:inline">
                  {track.duration}
                </span>
                <span className="hover-glow font-mono text-xs uppercase tracking-wide border border-ink/25 px-3 py-1 shrink-0">
                  {isOpen ? 'Fermer' : 'Écouter'}
                </span>
              </button>

              {isOpen && (
                <div className="pb-6">
                  <SpotifyEmbed spotifyId={track.spotifyId} label={track.title} />
                </div>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
