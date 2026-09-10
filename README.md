# wORA — site vitrine

Site React (Vite + Tailwind CSS) avec lecteurs Spotify intégrés, pensé comme point de
départ pour le rendez-vous. Rien n'est connecté à un vrai compte Spotify : les morceaux
s'affichent via les lecteurs embed publics de Spotify (aucune clé API, aucun compte
développeur nécessaire).

## Direction artistique

Sombre, « crade », new wave / post-punk. Palette **monochrome, aucun accent de
couleur** : fond quasi-noir (`paper`), blanc os sali (`ink`), gris éteint (`slate`),
`tape` pour les surfaces relevées. Les points forts (label « // sélectionné », puce
« en écoute », survols, focus, ombre du panneau artiste) se font au **blanc lumineux /
halo**, via les classes `.glow-accent`, `.glow-dot`, `.hover-glow` de `src/index.css`.
Les noms de tokens Tailwind ont gardé leur libellé d'origine mais pas leur sens : voir
le commentaire en tête de `tailwind.config.js`.

Le grime (grain fin + vignette) est empilé une seule fois au niveau de la page via
`.grain` dans `src/index.css` — réglages d'intensité indiqués en commentaire. Seule
animation permanente : un micro-glitch du logo toutes les ~8 s. Tout le mouvement (glitch
logo, crash du reveal artiste, transitions) est coupé si le navigateur est en
`prefers-reduced-motion`.

## Lancer le projet

```bash
npm install
npm run dev
```

Le site s'ouvre sur http://localhost:5173

## Structure

```
src/
  data/artists.js        <- les 7 artistes + leur lien Spotify (source des sorties auto)
  data/tracks.js         <- titres épinglés à la main (section "Sons" + rotation du hero)
  data/rotation.js       <- ce qui défile dans le lecteur "en écoute" du hero
  assets/artists/        <- portraits (siradji.jpg, ibiscus.jpg, ...) — voir le README du dossier
  lib/spotifyIframeApi.js <- chargement de l'API iFrame Spotify (pilotage du lecteur)
  components/
    SpotifyEmbed.jsx      <- le lecteur Spotify réutilisable (track/album/playlist/artist)
    RotatingPlayer.jsx    <- lecteur "en écoute" du hero : fait défiler les morceaux,
                              laisse le son se terminer quand on le lance
    Hero.jsx               <- gros titre + lecteur "en écoute"
    Artists.jsx            <- grille "sélection de personnage" : une case par artiste,
                              clic = reveal plein écran + lecteur Spotify alimenté en direct
    TrackList.jsx          <- sélection épinglée, un lecteur qui se déplie par titre
    About.jsx, Header.jsx, Footer.jsx
```

## Le lecteur « en écoute » du hero

Au repos, il **fait défiler** les morceaux listés dans `src/data/tracks.js` (rien
d'autre), en changeant toutes les quelques secondes (`IDLE_MS` dans
`RotatingPlayer.jsx`) — chargé mais en pause : pas de son, l'autoplay est bloqué par les
navigateurs de toute façon. Un court glitch marque chaque changement automatique.

Dès qu'on **lance la lecture**, le défilement s'arrête : le morceau va au bout, puis le
suivant s'enchaîne automatiquement, et ainsi de suite. Le défilement se met aussi en
pause au survol / focus, peut être figé via le bouton `❚❚`, et ne démarre pas du tout
si le navigateur est en `prefers-reduced-motion`.

Pour changer la rotation : ajoute / retire des titres dans `src/data/tracks.js`, la
rotation suit. Techniquement, ça s'appuie sur l'[API iFrame de Spotify](https://developer.spotify.com/documentation/embeds/references/iframe-api)
— toujours aucune clé, aucun compte. Si elle ne se charge pas, le lecteur retombe sur
un embed statique du premier morceau.

> Note : pour un visiteur non connecté à Spotify, chaque lecture est un extrait de ~30 s.
> Connecté, c'est le morceau entier — « laisser le son se terminer » suit ce que Spotify
> autorise.

## Les sorties se mettent à jour toutes seules

La section **Artistes** est une grille façon « sélection de personnage » : une case par
membre du collectif. Un clic ouvre l'artiste en plein écran (flash + panneau animé) avec
son lecteur Spotify (`open.spotify.com/embed/artist/…`) qui apparaît juste en dessous.
Fermeture par la croix, la touche Échap ou un clic sur le fond.

Ce lecteur est rempli par Spotify au moment où la page est chargée : **quand un artiste
sort un son, il apparaît sans qu'on touche au code ni qu'on redéploie le site.** Aucune
clé API, aucun compte développeur, aucune maintenance.

Une seule limite à connaître : le lecteur artiste affiche les titres **populaires** de
l'artiste, classés par Spotify. Une sortie toute fraîche met donc un peu de temps à
remonter en haut de la liste (le temps d'accumuler des écoutes). Elle est bien présente
sur le profil, mais pas forcément en première position le jour J.

Si un jour vous voulez que **la dernière sortie** apparaisse en avant dès le jour de
sortie, il faut passer par l'API Spotify (`GET /artists/{id}/albums`), ce qui demande
un client ID/secret gratuit et soit un script planifié qui régénère un JSON, soit une
petite fonction serverless. C'est faisable à tout moment sans jeter ce qui est là :
`src/data/artists.js` contient déjà les identifiants nécessaires.

### Ajouter ou retirer un artiste

Ouvre `src/data/artists.js` et ajoute une entrée à `profiles` :

1. Sur Spotify, va sur la page de l'artiste → `...` → Partager → Copier le lien.
2. Colle le lien **tel quel** dans `url`. Pas besoin de le nettoyer : le `/intl-fr/` et
   le `?si=...` sont retirés automatiquement par `artistIdFromUrl`.
3. `alias` est facultatif (utilisé pour Siradji, affiché « Siradji (D.I.N.E) »).

Si un lien n'est pas reconnu, le site n'explose pas : un encadré d'aide s'affiche à la
place du lecteur concerné.

## Épingler un morceau à la main (facultatif)

`src/data/tracks.js` sert uniquement à mettre un ou deux titres en avant dans une section
« Sons » séparée. Clic droit sur le titre → Partager → Copier le lien du morceau, puis
colle la partie après `/track/` (avant le `?`) dans `spotifyId`.

Un morceau sans `spotifyId` n'est pas affiché. Si la liste ne contient aucun titre
utilisable, la section « Sons » disparaît de la page **et** de la navigation — pas de
section vide, pas de lien mort.

Le composant `SpotifyEmbed` accepte `type="track"`, `"album"`, `"playlist"` ou `"artist"` :
il suffit de récupérer l'ID de la même façon (Partager → Copier le lien).

## Ce qui est volontairement en placeholder

- Le texte de la section "À propos"
- Les liens Instagram / Spotify / e-mail dans le footer
- Les portraits d'artistes : le code les affiche dès qu'ils sont déposés dans
  `src/assets/artists/` (sinon, la case montre l'initiale de l'artiste)

## Build de production

```bash
npm run build
```

Génère un dossier `dist/` prêt à déployer (Vercel, Netlify, etc.).
