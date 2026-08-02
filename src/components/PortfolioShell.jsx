import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import MechViewport from './MechViewport'
import MechCredit from './MechCredit'
import SectionRadar from './SectionRadar'
import HudDriftFeed from './HudDriftFeed'
import CockpitViewportOverlay from './cockpit/CockpitViewportOverlay'
import Hero from './Hero'
import About from './About'
import Projects from './Projects'
import Experience from './Experience'
import Skills from './Skills'
import Contact from './Contact'
import { navLinks, profile, experience } from '../data/resume'
import { CAMERA_NAV_DELAY_MS, CAMERA_TURN_MS } from '../config/mechModel'

const SECTIONS = {
  hero: Hero,
  about: About,
  projects: Projects,
  experience: Experience,
  skills: Skills,
  contact: Contact,
}
const panelVariants = {
  enter: (dir) => ({ opacity: 0, x: dir > 0 ? 22 : -22, filter: 'blur(2px)' }),
  center: { opacity: 1, x: 0, filter: 'blur(0px)' },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -16 : 16, filter: 'blur(2px)' }),
}

const TURN_MS = CAMERA_NAV_DELAY_MS + CAMERA_TURN_MS

export default function PortfolioShell({ initialSection = 'hero', entryFromIntro = false, onIntroEntryDone }) {
  const [active, setActive] = useState(initialSection)
  const [direction, setDirection] = useState(0)
  const [overlayVisible, setOverlayVisible] = useState(false)
  const timerRef = useRef(null)
  const [activeExperienceId, setActiveExperienceId] = useState(experience[0]?.id ?? null)
  const [holoChannel, setHoloChannel] = useState(null)
  const [holoHref, setHoloHref] = useState(null)

  const openHoloChannel = useCallback(({ channel, href }) => {
    setHoloChannel(channel)
    setHoloHref(href)
  }, [])

  const closeHoloChannel = useCallback(() => {
    setHoloChannel(null)
    setHoloHref(null)
  }, [])

  const followHoloChannel = useCallback(() => {
    if (!holoHref) return
    if (holoHref.startsWith('mailto:')) {
      window.location.href = holoHref
    } else if (holoChannel === 'RESUME') {
      const a = document.createElement('a')
      a.href = holoHref
      a.download = ''
      a.rel = 'noopener noreferrer'
      a.click()
    } else {
      window.open(holoHref, '_blank', 'noopener,noreferrer')
    }
    closeHoloChannel()
  }, [holoHref, holoChannel, closeHoloChannel])

  const showOverlayAfterTurn = useCallback((sectionId) => {
    if (timerRef.current) clearTimeout(timerRef.current)
    setOverlayVisible(false)
    if (sectionId === 'hero') return
    timerRef.current = setTimeout(() => setOverlayVisible(true), TURN_MS)
  }, [])

  useEffect(() => {
    showOverlayAfterTurn(initialSection)
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [initialSection, showOverlayAfterTurn])

  const scrollToExperienceEntry = useCallback(
    (jobId) => {
      const scrollToEl = () => {
        const el = document.getElementById(`exp-${jobId}`)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }

      setActiveExperienceId(jobId)
      if (active !== 'experience') {
        const prevIdx = navLinks.findIndex((l) => l.id === active)
        const nextIdx = navLinks.findIndex((l) => l.id === 'experience')
        setDirection(nextIdx >= prevIdx ? 1 : -1)
        setActive('experience')
        showOverlayAfterTurn('experience')
        window.setTimeout(scrollToEl, 480)
      } else {
        scrollToEl()
      }
    },
    [active, showOverlayAfterTurn],
  )

  const navigate = useCallback(
    (id) => {
      if (id === active) return
      if (id !== 'contact') closeHoloChannel()
      const prevIdx = navLinks.findIndex((l) => l.id === active)
      const nextIdx = navLinks.findIndex((l) => l.id === id)
      setDirection(nextIdx >= prevIdx ? 1 : -1)
      setActive(id)
      showOverlayAfterTurn(id)
    },
    [active, showOverlayAfterTurn, closeHoloChannel],
  )

  const ActiveSection = SECTIONS[active] ?? Hero
  const activeMeta = navLinks.find(l => l.id === active)

  return (
    <div className="shell-layout min-h-screen flex flex-col">
      <HudDriftFeed />
      <SectionRadar active={active} onNavigate={navigate} />

      <header className="shrink-0 z-30 flex items-center justify-between px-4 md:px-8 py-3 border-b border-gundam/20 bg-void/85 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="font-display text-lg md:text-xl text-ice tracking-wider">{profile.name.split(' ')[0]}</span>
          <span className="hidden sm:inline font-mono text-[9px] text-gundam/50 tracking-[0.25em]">PILOT · UM-AA</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[9px] text-cyan/50 pr-[7.5rem] md:pr-[9.5rem]">
          <span className="text-gundam animate-pulse">●</span>
          <span>{activeMeta?.label ?? 'Home'}</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        <nav className="shrink-0 lg:w-48 border-b lg:border-b-0 lg:border-r border-gundam/15 bg-panel/50 backdrop-blur-sm relative overflow-hidden">
          <ul className="relative z-10 flex lg:flex-col overflow-x-auto lg:overflow-visible px-2 py-2 lg:py-6 gap-1">
            {navLinks.map((link) => {
              const isActive = active === link.id
              return (
                <li key={link.id} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => navigate(link.id)}
                    className={`w-full flex items-center gap-3 px-3 lg:px-4 py-2.5 text-left transition-all border-l-2 lg:border-l-[3px] ${
                      isActive
                        ? 'bg-gundam/10 border-gundam text-ice'
                        : 'border-transparent text-ice/45 hover:text-gundam/90 hover:bg-gundam/5'
                    }`}
                  >
                    <span className="font-display text-sm">{link.icon}</span>
                    <span className="font-mono text-[10px] tracking-[0.12em] whitespace-nowrap">{link.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        <main className="flex-1 relative min-h-[50vh] lg:min-h-0 overflow-hidden">
          <div className="absolute inset-0 overflow-y-auto shell-scroll px-4 md:px-8 lg:px-10 py-6 md:py-8">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={active}
                custom={direction}
                variants={panelVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                className="max-w-2xl"
              >
                <ActiveSection embedded onNavigate={navigate} onOpenHolo={openHoloChannel} />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        <aside className="mech-panel relative shrink-0 h-[36vh] lg:h-auto lg:w-[44%] border-t lg:border-t-0 lg:border-l border-gundam/15 overflow-hidden">
          <MechViewport
            cameraTarget={active}
            showHangar
            idleSway
            enableOrbit={active === 'hero'}
            entryFromIntro={entryFromIntro && active === 'hero'}
            onEntrySettled={onIntroEntryDone}
          />
          <div
            className="absolute inset-0 pointer-events-none z-10"
            style={{
              background:
                'linear-gradient(90deg, rgba(8,4,10,0.75) 0%, transparent 28%), linear-gradient(0deg, rgba(8,4,10,0.45) 0%, transparent 18%)',
            }}
          />
          <CockpitViewportOverlay
            sectionId={active}
            visible={overlayVisible && active !== 'hero'}
            onNavigate={navigate}
            onScrollToExperience={scrollToExperienceEntry}
            activeExperienceId={activeExperienceId}
            onActiveExperienceChange={setActiveExperienceId}
            holoChannel={active === 'contact' ? holoChannel : null}
            onHoloClose={closeHoloChannel}
            onHoloOpen={followHoloChannel}
          />
          <div className="absolute bottom-3 right-3 left-3 z-30 flex justify-between items-end pointer-events-none">
            <span className="font-mono text-[8px] text-gundam/40 tracking-widest uppercase">
              Ext. · {activeMeta?.label}
            </span>
            <MechCredit compact />
          </div>
        </aside>
      </div>
    </div>
  )
}
