// Sélection manuelle de morceaux à mettre en avant.
//
// ⚠️ Ce fichier n'est PLUS l'endroit où déclarer les nouvelles sorties : les sons
// qui sortent remontent tout seuls via les lecteurs artistes (voir src/data/artists.js).
// Cette liste sert à :
//   - la section "Sons" (elle disparaît du site et de la nav si la liste est vide) ;
//   - alimenter le lecteur "en écoute" du hero, qui fait défiler ces morceaux puis
//     la page de chaque artiste (voir src/data/rotation.js).
// Un morceau sans "spotifyId" est ignoré partout.
//
// Pour épingler un titre : Spotify > clic droit sur le son > Partager > Copier le lien.
// Le lien ressemble à https://open.spotify.com/track/XXXXXXXXXXXXXXXXXXXXXX
// Colle uniquement la partie après /track/ (avant le "?") dans "spotifyId".

export const tracks = [
  
  {
    id: 1,
    title: 'Fyn$hit',
    duration: '3:39',
    spotifyId: '3pmtFfraUM9zkNAYDZAIsH',
  },
  {
    id: 2,
    title: 'MEME QUAND JE CHANGE DE CITY',
    duration: '2:52',
    spotifyId: '79DOg5FM2qUMj0fj9s20yw',
  },
  {
    id: 3,
    title: 'RAP OU RIEN',
    duration: '2:08',
    spotifyId: '2LtnmASm5ReoL84REv7yEj',
  },
  {
    id: 4,
    title: 'Lassée trop vite',
    duration: '3:24',
    spotifyId: '0p2f5VmzAQg6IWov5Fn9Oq',
  },
  {
    id: 5,
    title: 'WAR MACHINE',
    duration: '3:29',
    spotifyId: '5avEnQR6mTxNyMT5r3CHLZ',
  },
  {
    id: 6,
    title: 'talgia',
    duration: '2:56',
    spotifyId: '5oHnayo3m1unWBdTM9gRdd',
  },
  {
    id: 7,
    title: 'phoenix',
    duration: '2:07',
    spotifyId: '5f7w6iMCONDQ9O1nerRusT',
  },
  {
    id: 8,
    title: 'Call me baby',
    duration: '1:51',
    spotifyId: '74KgymRV2bWujADS3elki6',
  },
  // { id: 2, title: 'Nom du son', duration: '0:00', spotifyId: '' },
]

// Ce que la page affiche réellement : les titres épinglés qui ont un ID Spotify.
export const releasedTracks = tracks.filter((track) => track.spotifyId)
