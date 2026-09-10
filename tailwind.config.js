/** @type {import('tailwindcss').Config} */

// Direction artistique : sombre, "crade", new wave / post-punk.
// Palette monochrome — noir crasse, blanc os sali, une nuance de gris — sans
// aucun accent de couleur : les points forts se font au blanc lumineux (halo),
// via les classes `.glow-*` et `.hover-glow` de src/index.css. Les noms d'origine
// (paper / ink / tape…) sont conservés pour ne pas réécrire tout le markup :
//   paper = fond quasi-noir       ink  = texte / filets (blanc os)
//   tape  = surface relevée        slate = gris éteint (texte secondaire)
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#050505', // fond de page, quasi-noir
        tape: '#141310', // cartes / panneaux, à peine au-dessus du fond
        ink: '#CEC8B8', // blanc os légèrement sale — texte et filets
        slate: '#8C8676', // gris éteint pour le texte secondaire
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
