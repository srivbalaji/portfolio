import { useState, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import BootScreen from './components/BootScreen'
import PortfolioShell from './components/PortfolioShell'

export default function App() {
  const [booted, setBooted] = useState(false)
  const [initialSection, setInitialSection] = useState('hero')
  const [fromIntro, setFromIntro] = useState(false)

  const handleBootComplete = useCallback(() => {
    setFromIntro(true)
    setBooted(true)
  }, [])

  const handleBootNavigate = useCallback((id) => {
    setInitialSection(id)
  }, [])

  const handleIntroEntryDone = useCallback(() => {
    setFromIntro(false)
  }, [])

  return (
    <div className="scanlines min-h-screen relative bg-void">
      <AnimatePresence mode="wait">
        {!booted && (
          <BootScreen key="boot" onComplete={handleBootComplete} onNavigate={handleBootNavigate} />
        )}
      </AnimatePresence>

      {booted && (
        <PortfolioShell
          initialSection={initialSection}
          entryFromIntro={fromIntro}
          onIntroEntryDone={handleIntroEntryDone}
        />
      )}
    </div>
  )
}
