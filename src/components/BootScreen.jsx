import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import GundamHangar from './GundamHangar'

/**
 * Intro flow:
 * 1. Hangar — wide bay view, auto drift to face
 * 2. Face — head framing; user must click to continue
 * 3. Link — brief flash, enter portfolio Home (with sector hub)
 */
export default function BootScreen({ onComplete, onNavigate }) {
  const [phase, setPhase] = useState('hangar')
  const onCompleteRef = useRef(onComplete)
  const onNavigateRef = useRef(onNavigate)

  useEffect(() => {
    onCompleteRef.current = onComplete
    onNavigateRef.current = onNavigate
  }, [onComplete, onNavigate])

  useEffect(() => {
    const t1 = setTimeout(() => setPhase('face'), 1200)
    return () => clearTimeout(t1)
  }, [])

  const launch = () => {
    setPhase('link')
    setTimeout(() => {
      onNavigateRef.current?.('hero')
      onCompleteRef.current?.()
    }, 900)
  }

  const skip = () => {
    onNavigateRef.current?.('hero')
    onCompleteRef.current?.()
  }

  return (
    <motion.div
      className="fixed inset-0 z-[10000] overflow-hidden"
      style={{ backgroundColor: '#050810' }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      onKeyDown={(e) => {
        if (e.key === 'Escape') skip()
        if (e.key === 'Enter' && phase === 'face') launch()
      }}
      tabIndex={0}
      role="presentation"
    >
      <div className="scanlines absolute inset-0 pointer-events-none z-30 opacity-25" />

      <AnimatePresence mode="wait">
        {(phase === 'hangar' || phase === 'face') && (
          <motion.div
            key="hangar"
            className="absolute inset-0"
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.7 }}
          >
            <GundamHangar phase={phase} onFaceClick={launch} />
          </motion.div>
        )}
      </AnimatePresence>

      {phase === 'link' && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-void z-40"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="font-display text-2xl text-cyan tracking-[0.5em] animate-pulse">LINK ESTABLISHED</p>
        </motion.div>
      )}

      <button
        type="button"
        onClick={skip}
        className="absolute top-4 right-4 z-20 font-mono text-cyan/40 hover:text-cyan text-[10px] tracking-widest"
      >
        SKIP ›
      </button>
    </motion.div>
  )
}
