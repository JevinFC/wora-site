import { releasedTracks } from './tracks.js'

// Ce qui défile dans le lecteur "en écoute" du hero : uniquement les morceaux
// listés dans src/data/tracks.js (ceux qui ont un spotifyId). Ajoutes-en ou
// retires-en là-bas, la rotation suit.
//
// Chaque entrée : { type: 'track', id, uri, label }
//  - uri   : passé à l'API iFrame de Spotify (spotify:track:…)
//  - id    : utilisé par le lecteur de repli si l'API ne se charge pas
//  - label : affiché au-dessus du lecteur

export const rotation = releasedTracks.map((track) => ({
  type: 'track',
  id: track.spotifyId,
  uri: `spotify:track:${track.spotifyId}`,
  label: track.title,
}))
