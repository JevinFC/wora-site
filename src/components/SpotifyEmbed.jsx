// Lecteur Spotify réutilisable.
//
// "type" suit les URLs de Spotify : track, album, playlist, artist.
// Le lecteur "artist" se met à jour tout seul côté Spotify : c'est lui qui rend
// les nouvelles sorties visibles sur le site sans intervention.

const DEFAULT_HEIGHT = { track: 152, album: 352, playlist: 352, artist: 352 }

// `eager` : charge l'iframe tout de suite (à utiliser quand le lecteur est
// affiché suite à une action, p. ex. le panneau artiste — inutile d'attendre).
export default function SpotifyEmbed({ spotifyId, type = 'track', height, label, eager = false }) {
  if (!spotifyId) {
    return (
      <div className="border border-dashed border-slate/50 rounded-sm px-4 py-6 text-sm text-slate font-mono">
        Lien Spotify manquant ou non reconnu (voir <code>src/data/</code>).
      </div>
    )
  }

  return (
    <iframe
      title={label ? `Lecteur Spotify — ${label}` : `Lecteur Spotify — ${spotifyId}`}
      src={`https://open.spotify.com/embed/${type}/${spotifyId}?utm_source=generator&theme=0`}
      width="100%"
      height={height ?? DEFAULT_HEIGHT[type] ?? 152}
      style={{ borderRadius: '4px', border: 'none', display: 'block' }}
      allowFullScreen=""
      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
      loading={eager ? 'eager' : 'lazy'}
    />
  )
}
