// Chargement unique de l'API iFrame de Spotify.
//
// Elle permet de piloter un lecteur intégré : changer de morceau (`loadUri`),
// lancer la lecture (`play`) et — surtout — recevoir des événements
// `playback_update` (position / durée / pause) pour savoir quand un morceau est
// allé au bout. Aucune clé, aucun compte : c'est le même mécanisme que les
// lecteurs embed classiques, juste scriptable.
//
// https://developer.spotify.com/documentation/embeds/references/iframe-api

let promise

export function loadSpotifyIframeApi() {
  if (promise) return promise

  promise = new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('pas de window'))
      return
    }
    if (window.__spotifyIframeApi) {
      resolve(window.__spotifyIframeApi)
      return
    }

    const previous = window.onSpotifyIframeApiReady
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      if (typeof previous === 'function') previous(IFrameAPI)
      window.__spotifyIframeApi = IFrameAPI
      resolve(IFrameAPI)
    }

    if (!document.querySelector('script[data-spotify-iframe-api]')) {
      const script = document.createElement('script')
      script.src = 'https://open.spotify.com/embed/iframe-api/v1'
      script.async = true
      script.dataset.spotifyIframeApi = 'true'
      script.onerror = () => reject(new Error("l'API iFrame Spotify n'a pas pu être chargée"))
      document.body.appendChild(script)
    }
  })

  return promise
}
