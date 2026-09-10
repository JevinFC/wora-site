import Header from './components/Header.jsx'
import Hero from './components/Hero.jsx'
import Artists from './components/Artists.jsx'
import TrackList from './components/TrackList.jsx'
import About from './components/About.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  return (
    <div className="grain min-h-screen bg-paper text-ink">
      <Header />
      <main>
        <Hero />
        <Artists />
        <TrackList />
        <About />
      </main>
      <Footer />
    </div>
  )
}
