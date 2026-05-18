import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { profile } from '../data/resume'

export default function HudHeader() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const dateStr = time.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
  const timeStr = time.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-8 py-3 bg-panel/80 backdrop-blur-xl border-b border-cyan/20"
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.3, type: 'spring', stiffness: 80 }}
    >
      <motion.div className="flex items-center gap-3" whileHover={{ scale: 1.02 }}>
        <span className="font-display text-cyan text-lg font-bold tracking-widest">
          UM-AA
        </span>
        <span className="hidden sm:inline hud-text text-ice/60">|</span>
        <span className="hidden sm:inline font-ui text-sm text-ice/80 tracking-wider">
          {profile.name.toUpperCase()}
        </span>
      </motion.div>

      <div className="flex items-center gap-4 md:gap-8">
        <div className="hidden md:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-hud animate-pulseHud" />
          <span className="hud-text text-hud">ONLINE</span>
        </div>
        <div className="font-display text-right">
          <p className="text-ice text-sm md:text-base font-semibold tracking-wider">
            {timeStr}
          </p>
          <p className="hud-text text-[10px] text-cyan/60">{dateStr}</p>
        </div>
      </div>
    </motion.header>
  )
}
