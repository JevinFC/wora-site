import Wordmark from './Wordmark.jsx'

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-ink/15 bg-tape/40">
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Wordmark className="text-xl" />
        <div className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.16em] text-slate">
          <a href="#" className="hover-glow">Instagram</a>
          <a href="#" className="hover-glow">Spotify</a>
          <a href="mailto:contact@example.com" className="hover-glow">
            contact@example.com
          </a>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 pb-8 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-slate/60">
        WORA-001 · MMXXVI
      </div>
    </footer>
  )
}
