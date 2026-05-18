import { useState, useCallback, useEffect } from 'react'
import { AnimatePresence } from 'framer-motion'
import BootScreen from './components/BootScreen'
import HudHeader from './components/HudHeader'
import SideNav from './components/SideNav'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Experience from './components/Experience'
import Skills from './components/Skills'
import Contact from './components/Contact'
import MobileNav from './components/MobileNav'
import CircuitBackground from './components/CircuitBackground'
import HeroRadar, { RadarFixed } from './components/Radar'
import { useScrollSpy } from './hooks/useScrollSpy'
import { navLinks } from './data/resume'

const sectionIds = navLinks.map((l) => l.id)

export default function App() {
  const [booted, setBooted] = useState(false)
  const [tappedId, setTappedId] = useState(null)
  const scrollActive = useScrollSpy(sectionIds)
  const active = tappedId ?? scrollActive

  useEffect(() => {
    if (tappedId && scrollActive === tappedId) {
      setTappedId(null)
    }
  }, [scrollActive, tappedId])

  const navigate = useCallback((id) => {
    setTappedId(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <div className="scanlines min-h-screen relative">
      <CircuitBackground />
      {booted && (
        <RadarFixed
          active={active}
          onNavigate={navigate}
          visible={scrollActive !== 'hero'}
        />
      )}
      <AnimatePresence mode="wait">
        {!booted && <BootScreen key="boot" onComplete={() => setBooted(true)} />}
      </AnimatePresence>

      {booted && (
        <>
          <HudHeader />
          <SideNav active={active} onNavigate={navigate} />
          <MobileNav active={active} onNavigate={navigate} />
          <main className="relative z-10 pb-20 lg:pb-0">
            <Hero active={active} onNavigate={navigate} />
            <About />
            <Projects />
            <Experience />
            <Skills />
            <Contact />
          </main>
        </>
      )}
    </div>
  )
}
