# Portraits des artistes

Dépose ici une image par artiste. Le nom du fichier = le nom de l'artiste **en
minuscules**, avec l'extension d'origine.

| # | Artiste | Fichier attendu |
|---|---------|-----------------|
| 1 | Siradji (D.I.N.E) | `siradji.jpg` |
| 2 | Ibiscus          | `ibiscus.jpg` |
| 3 | atsimh           | `atsimh.jpg` |
| 4 | tibry            | `tibry.jpg` |
| 5 | raadmo           | `raadmo.jpg` |
| 6 | adana            | `adana.jpg` |
| 7 | yowx             | `yowx.jpg` |

- Extensions acceptées : `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`.
- Format : carré de préférence (150×150 suffit, la case et le panneau les
  affichent en petit). Les images sont automatiquement passées en noir & blanc
  contrasté et assombries par le CSS (`.artist-portrait` dans `src/index.css`)
  pour homogénéiser des sources disparates.
- Fichier absent = la case affiche l'initiale de l'artiste à la place. Rien ne
  casse, le build passe quand même.

Après avoir ajouté / retiré un fichier, relance `npm run dev` (Vite recharge le
glob au démarrage).
