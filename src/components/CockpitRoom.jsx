import { motion } from 'framer-motion'

const monitors = [
  { label: 'SYS.DIAG', w: '28%', h: '22%', x: '4%', y: '8%', delay: 0.1 },
  { label: 'NAV.RADAR', w: '38%', h: '38%', x: '31%', y: '6%', delay: 0.25 },
  { label: 'PWR.CORE', w: '24%', h: '28%', x: '72%', y: '10%', delay: 0.15 },
  { label: 'COMMS', w: '22%', h: '20%', x: '6%', y: '38%', delay: 0.35 },
  { label: 'PILOT.PROFILE', w: '44%', h: '32%', x: '28%', y: '48%', delay: 0.2 },
  { label: 'MISSION.LOG', w: '22%', h: '30%', x: '74%', y: '42%', delay: 0.4 },
  { label: 'SENSORS', w: '30%', h: '18%', x: '8%', y: '72%', delay: 0.45 },
  { label: 'UM-AA LINK', w: '52%', h: '16%', x: '38%', y: '78%', delay: 0.5 },
]

export default function CockpitRoom({ visible }) {
  if (!visible) return null

  return (
    <motion.div
      className="absolute inset-0 bg-void overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Cockpit frame */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 50% 45%, rgba(61,232,255,0.08) 0%, transparent 60%), linear-gradient(180deg, #050810 0%, #0a1525 100%)',
        }}
      />

      {/* Curved HUD bezel */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M 0 0 H 100 V 100 H 0 Z M 5 12 Q 50 2 95 12 L 92 88 Q 50 98 8 88 Z"
          fill="rgba(5,8,16,0.85)"
          fillRule="evenodd"
        />
        <ellipse cx="50" cy="50" rx="42" ry="38" fill="none" stroke="rgba(61,232,255,0.15)" strokeWidth="0.3" />
      </svg>

      {/* Monitor grid */}
      <div className="absolute inset-[10%] md:inset-[12%]">
        {monitors.map((m) => (
          <motion.div
            key={m.label}
            className="absolute p3-panel overflow-hidden border border-cyan/30"
            style={{ width: m.w, height: m.h, left: m.x, top: m.y }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: m.delay, duration: 0.5 }}
          >
            <p className="hud-text text-[9px] md:text-xs text-cyan/70 px-2 pt-1.5 border-b border-cyan/10">
              {m.label}
            </p>
            <div className="p-2 h-[calc(100%-24px)] grid-bg relative">
              {m.label === 'NAV.RADAR' && (
                <div className="absolute inset-2 rounded-full border border-cyan/20 flex items-center justify-center">
                  <motion.div
                    className="w-1/2 h-1/2 rounded-full border border-hud/40"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                    style={{ borderTopColor: '#6bffb8' }}
                  />
                </div>
              )}
              {m.label === 'PILOT.PROFILE' && (
                <div className="text-[10px] md:text-xs font-ui text-ice/50 space-y-1 p-1">
                  <p>SRIVATSAN BALAJI</p>
                  <p className="text-cyan/60">COMP ENG · UMICH</p>
                  <p className="text-hud/70">STATUS: ONLINE</p>
                </div>
              )}
              {m.label === 'UM-AA LINK' && (
                <motion.p
                  className="font-display text-sm md:text-lg text-cyan tracking-widest text-center mt-2"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.2, repeat: Infinity }}
                >
                  ESTABLISHING LINK...
                </motion.p>
              )}
              <div className="absolute bottom-1 right-2 text-[8px] text-cyan/30 font-mono">OK</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Center reticle */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-cyan/40 rounded-full pointer-events-none"
        initial={{ scale: 2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      />
    </motion.div>
  )
}
