// Les artistes du collectif, et rien d'autre.
//
// Chaque artiste est représenté sur le site par le lecteur "artiste" de Spotify.
// Ce lecteur est alimenté par Spotify en direct : quand un artiste sort un son,
// il apparaît dans son lecteur sans qu'on touche au code ni qu'on redéploie le site.
//
// Pour ajouter un artiste : Spotify > page de l'artiste > ... > Partager >
// Copier le lien, et colle le lien tel quel dans "url" ci-dessous. Pas besoin
// de nettoyer le lien, le "?si=..." et le "/intl-fr/" sont retirés tout seuls.
//
// Portraits : dépose un fichier dans src/assets/artists/ nommé d'après l'artiste
// en minuscules (siradji.jpg, ibiscus.jpg, ...). jpg / png / webp acceptés.
// Format idéal : carré (150x150 suffit). Sans fichier, la case retombe sur
// l'initiale de l'artiste — rien ne casse. Voir src/assets/artists/README.md.

/**
 * Extrait l'identifiant Spotify d'un lien d'artiste.
 *
 * Accepte les formes qu'on obtient en copiant depuis l'app ou le web :
 *   https://open.spotify.com/intl-fr/artist/2UaXRsTt9ZRXIEcmztge2s?si=iKEW...
 *   https://open.spotify.com/artist/2UaXRsTt9ZRXIEcmztge2s
 *   spotify:artist:2UaXRsTt9ZRXIEcmztge2s
 *
 * Renvoie null si le lien n'est pas reconnu — le lecteur affiche alors un encadré
 * d'aide au lieu de casser la page.
 */
export function artistIdFromUrl(url) {
  const match = /artist[/:]([A-Za-z0-9]{22})/.exec(url ?? '')
  return match ? match[1] : null
}

const profiles = [
  {
    name: 'Siradji',
    alias: 'D.I.N.E',
    url: 'https://open.spotify.com/intl-fr/artist/0LM7pe0xJsd5QjSfKZsNIu?si=1csG9WH2S-6_kiRakySbkg',
  },
  {
    name: 'Ibiscus',
    url: 'https://open.spotify.com/intl-fr/artist/2RNGOAgRk3ZXDrdz2FElbJ?si=1UBcBfJHRImW6J2Z8QFpnw',
  },
  {
    name: 'atsimh',
    url: 'https://open.spotify.com/intl-fr/artist/5gLykXcgfnHPNUhDVFoFbD?si=tHE-JXjkS5iLLhBqNPaeEQ',
  },
  {
    name: 'tibry',
    url: 'https://open.spotify.com/intl-fr/artist/2fBoYHWQRjDfoW2j9D9CIH?si=F90NufkPQqmFHzFRj1sGtA',
  },
  {
    name: 'raadmo',
    url: 'https://open.spotify.com/intl-fr/artist/2UaXRsTt9ZRXIEcmztge2s?si=iKEW1aNzSUqmWaM_XBTgYg',
  },
  {
    name: 'adana',
    url: 'https://open.spotify.com/intl-fr/artist/7G6ncnZgfSxGHbESbt74eC?si=b7rYjgp4TF6w-VhLV7WleQ',
  },
  {
    name: 'yowx',
    url: 'https://open.spotify.com/intl-fr/artist/2Z4xdEpufwOqFzCVFjscir?si=hKIDhzWvR0ydo2l8LQTnjA',
  },
  {
    name: 'Rosa Cliver',
    url: 'https://open.spotify.com/intl-fr/artist/3FKMeBPGn13W9MsIcdYcuh?si=OrVtZuqZSxWjFYPgd9esWA',
  },
]

// Portraits chargés depuis src/assets/artists/. Le bundler ne référence que les
// fichiers réellement présents ; un artiste sans image reçoit simplement `null`.
const portraits = import.meta.glob('../assets/artists/*.{jpg,jpeg,png,webp,avif}', {
  eager: true,
  import: 'default',
})

function portraitForSlug(slug) {
  const hit = Object.entries(portraits).find(([path]) =>
    path.toLowerCase().includes(`/${slug}.`),
  )
  return hit ? hit[1] : null
}

export const artists = profiles.map((profile) => {
  const spotifyId = artistIdFromUrl(profile.url)
  const slug = profile.name.toLowerCase()
  return {
    ...profile,
    spotifyId,
    slug,
    image: portraitForSlug(slug),
    // Lien "propre" (sans le ?si= de partage) pour le bouton vers le profil.
    profileUrl: `https://open.spotify.com/artist/${spotifyId}`,
  }
})
