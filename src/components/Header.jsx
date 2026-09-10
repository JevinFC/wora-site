import Wordmark from './Wordmark.jsx'
import { releasedTracks } from '../data/tracks.js'

// La section "Sons" n'existe que s'il y a un titre épinglé — le lien de nav suit,
// pour ne jamais pointer vers une ancre absente de la page.
const links = [
  { href: '#artistes', label: 'Artistes' },
  ...(releasedTracks.length > 0 ? [{ href: '#sons', label: 'Sons' }] : []),
  { href: '#apropos', label: 'À propos' },
  { href: '#contact', label: 'Contact' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-ink/15 bg-paper/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <a href="#top" className="text-2xl" aria-label="wORA — haut de page">
          <Wordmark glitch />
        </a>
        <nav className="hidden items-center gap-7 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-slate sm:flex">
          {links.map((link) => (
            <a key={link.href} href={link.href} className="hover-glow">
              {link.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  )
}
