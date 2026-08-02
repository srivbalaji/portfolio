import { motion } from 'framer-motion'
import { navLinks } from '../data/resume'
import MechCredit from './MechCredit'

const sectors = navLinks

const MAP_SECTORS = [
  { id: 'hero', label: 'HOME', code: 'A-01', x: 138, y: 6 },
  { id: 'about', label: 'PROFILE', code: 'B-02', x: 18, y: 48 },
  { id: 'projects', label: 'MISSIONS', code: 'C-03', x: 258, y: 48 },
  { id: 'experience', label: 'LOG', code: 'D-04', x: 18, y: 132 },
  { id: 'skills', label: 'SYSTEM', code: 'E-05', x: 258, y: 132 },
  { id: 'contact', label: 'LINK', code: 'F-06', x: 138, y: 152 },
]

const MAP_CENTER = { x: 160, y: 108 }

function SectorNode({ x, y, w, h, code, sub, onClick, active }) {
  return (
    <g
      onClick={onClick}
      className="cursor-pointer"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={1}
        fill={active ? 'rgba(61,232,255,0.22)' : 'rgba(10,24,40,0.75)'}
        stroke={active ? '#3de8ff' : 'rgba(61,232,255,0.35)'}
        strokeWidth={active ? 1.2 : 0.7}
      />
      <line x1={x + 3} y1={y + 3} x2={x + w - 3} y2={y + 3} stroke={active ? '#3de8ff' : 'rgba(61,232,255,0.25)'} strokeWidth={0.5} />
      <text x={x + w / 2} y={y + h / 2 - 1} textAnchor="middle" fill={active ? '#fff' : '#3de8ff'} fontSize="6.5" fontFamily="monospace" fontWeight="bold">
        {code}
      </text>
      {sub && (
        <text x={x + w / 2} y={y + h - 4} textAnchor="middle" fill={active ? '#a0f0ff' : 'rgba(61,232,255,0.55)'} fontSize="4.5" fontFamily="monospace">
          {sub}
        </text>
      )}
    </g>
  )
}

function TacticalDisplay({ selectedId, onSelect }) {
  const active = sectors.find((s) => s.id === selectedId)

  return (
    <div className="relative w-full h-full overflow-hidden bg-[#060e18]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 320 180" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="tacticalGrid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(61,232,255,0.08)" strokeWidth="0.35" />
          </pattern>
          <linearGradient id="horizon" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0c1828" />
            <stop offset="100%" stopColor="#040810" />
          </linearGradient>
        </defs>

        <rect width="320" height="180" fill="url(#horizon)" />
        <rect width="320" height="180" fill="url(#tacticalGrid)" />

        <circle cx={MAP_CENTER.x} cy={MAP_CENTER.y} r="58" fill="none" stroke="rgba(61,232,255,0.12)" strokeWidth="0.5" />
        <circle cx={MAP_CENTER.x} cy={MAP_CENTER.y} r="38" fill="none" stroke="rgba(61,232,255,0.18)" strokeWidth="0.6" strokeDasharray="3 4" />
        <circle cx={MAP_CENTER.x} cy={MAP_CENTER.y + 8} r="22" fill="none" stroke="rgba(255,77,106,0.3)" strokeWidth="0.7" />

        <line x1={MAP_CENTER.x} y1="52" x2={MAP_CENTER.x} y2="158" stroke="rgba(61,232,255,0.2)" strokeWidth="0.5" />
        <line x1="100" y1={MAP_CENTER.y + 8} x2="220" y2={MAP_CENTER.y + 8} stroke="rgba(61,232,255,0.2)" strokeWidth="0.5" />

        {MAP_SECTORS.map((sec) => {
          const cx = sec.x + 22
          const cy = sec.y + 11
          const isActive = selectedId === sec.id
          return (
            <line
              key={`link-${sec.id}`}
              x1={MAP_CENTER.x}
              y1={MAP_CENTER.y + 8}
              x2={cx}
              y2={cy}
              stroke={isActive ? 'rgba(61,232,255,0.65)' : 'rgba(61,232,255,0.1)'}
              strokeWidth={isActive ? 1 : 0.4}
            />
          )
        })}

        {MAP_SECTORS.map((sec) => (
          <SectorNode
            key={sec.id}
            x={sec.x}
            y={sec.y}
            w="44"
            h="22"
            code={sec.code}
            sub={sec.label}
            onClick={() => onSelect(sec.id)}
            active={selectedId === sec.id}
          />
        ))}

        <rect x="96" y="2" width="128" height="14" fill="rgba(6,14,24,0.92)" stroke="rgba(61,232,255,0.3)" strokeWidth="0.5" />
        <text x="160" y="12" textAnchor="middle" fill="#3de8ff" fontSize="6" fontFamily="monospace">
          {`ROUTE · ${active?.label ?? 'HOME'} · ${active?.icon ?? '◈'}`}
        </text>
      </svg>

      <div className="absolute bottom-1.5 left-2 right-2 flex justify-between text-[6px] font-mono text-cyan/40 pointer-events-none">
        <span>GRID 04-A</span>
        <span className="text-hud">● {MAP_SECTORS.length} NODES</span>
        <span>UM-AA</span>
      </div>
    </div>
  )
}

function SideMonitor({ label, delay }) {
  return (
    <div className="w-full h-full bg-[#060e18] relative overflow-hidden">
      <div className="absolute inset-0 p-2 space-y-1">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex gap-1 items-center">
            <span className="text-[5px] text-cyan/25 font-mono w-4">{String(i + 1).padStart(2, '0')}</span>
            <div className="flex-1 h-[2px] bg-cyan/8 overflow-hidden">
              <motion.div
                className="h-full bg-cyan/35"
                initial={{ width: '20%' }}
                animate={{ width: `${35 + ((i * 11 + delay * 5) % 50)}%` }}
                transition={{ duration: 1.8, repeat: Infinity, repeatType: 'reverse', delay: i * 0.1 }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="absolute bottom-0.5 left-1.5 text-[5px] text-cyan/30 font-mono tracking-wider">{label}</p>
    </div>
  )
}

function ConsoleButton({ sector, onSelect, active }) {
  return (
    <motion.button
      type="button"
      onClick={(e) => {
        e.stopPropagation()
        onSelect(sector.id)
      }}
      className={`relative flex flex-col items-center justify-center min-h-[48px] p-1.5 border transition-all ${
        active
          ? 'border-cyan bg-cyan/15 shadow-[0_0_20px_rgba(61,232,255,0.25)]'
          : 'border-cyan/20 bg-[#080f18] hover:border-cyan/50 hover:bg-cyan/5'
      }`}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      <span className="font-display text-base text-cyan">{sector.icon}</span>
      <span className="font-mono text-[7px] tracking-[0.2em] text-cyan/60 mt-0.5">{sector.label}</span>
      {active && <span className="absolute top-1 right-1 w-1 h-1 rounded-full bg-cyan animate-pulse" />}
    </motion.button>
  )
}

export default function CockpitInterface({ onSelect, onLaunch, selectedId }) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#040810]">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 45% at 50% 28%, rgba(61,232,255,0.1) 0%, transparent 55%), linear-gradient(180deg, #030608 0%, #0a1018 50%, #040608 100%)',
        }}
      />

      {/* Main HUD cluster */}
      <div className="absolute top-[5%] md:top-[6%] left-0 right-0 flex justify-center items-start gap-2 md:gap-4 px-3 md:px-8">
        <motion.div
          className="hidden md:block w-[16%] aspect-[4/3] border border-cyan/25 bg-[#060e18]"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="h-4 border-b border-cyan/15 px-2 flex items-center">
            <span className="text-[7px] font-mono text-cyan/45 tracking-wider">AUX.01</span>
          </div>
          <div className="h-[calc(100%-16px)]">
            <SideMonitor label="TELEMETRY" delay={0} />
          </div>
        </motion.div>

        <motion.div
          className="w-[88%] md:w-[52%] aspect-[16/10] border border-cyan/35 bg-[#060e18] shadow-[0_0_40px_rgba(61,232,255,0.12)]"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.08 }}
        >
          <div className="h-5 border-b border-cyan/20 px-3 flex items-center justify-between">
            <span className="text-[8px] font-mono text-cyan/70 tracking-[0.2em]">NAVIGATION MAP</span>
            <span className="text-[7px] text-hud font-mono animate-pulse">● ONLINE</span>
          </div>
          <div className="h-[calc(100%-20px)]">
            <TacticalDisplay selectedId={selectedId} onSelect={onSelect} />
          </div>
        </motion.div>

        <motion.div
          className="hidden md:block w-[16%] aspect-[4/3] border border-cyan/25 bg-[#060e18]"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="h-4 border-b border-cyan/15 px-2 flex items-center">
            <span className="text-[7px] font-mono text-cyan/45 tracking-wider">AUX.02</span>
          </div>
          <div className="h-[calc(100%-16px)]">
            <SideMonitor label="DATA STREAM" delay={1} />
          </div>
        </motion.div>
      </div>

      {/* Console deck */}
      <motion.div
        className="absolute bottom-[14%] md:bottom-[12%] left-[4%] right-[4%] md:left-[8%] md:right-[8%]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="border border-cyan/20 bg-[#0a1018]/95 backdrop-blur-sm p-3 md:p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <div className="flex items-center justify-between mb-2">
            <p className="font-mono text-[9px] text-cyan/50 tracking-[0.25em]">SECTOR SELECT</p>
            <p className="font-mono text-[8px] text-cyan/30">PILOT INTERFACE v2.0</p>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2 mb-3">
            {sectors.map((sector) => (
              <ConsoleButton
                key={sector.id}
                sector={sector}
                onSelect={onSelect}
                active={selectedId === sector.id}
              />
            ))}
          </div>

          <div className="flex items-center justify-between gap-4">
            <div className="hidden md:flex flex-wrap gap-2 flex-1">
              {sectors.map((s) => (
                <span
                  key={s.id}
                  className={`font-mono text-[7px] tracking-wider px-2 py-0.5 border ${
                    selectedId === s.id ? 'border-cyan/60 text-cyan bg-cyan/10' : 'border-cyan/15 text-cyan/35'
                  }`}
                >
                  {s.label}
                </span>
              ))}
            </div>
            <motion.button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onLaunch?.()
              }}
              className="shrink-0 px-8 py-2.5 border border-hud bg-hud/10 font-mono text-[10px] tracking-[0.3em] text-hud hover:bg-hud/20 hover:shadow-[0_0_20px_rgba(107,255,184,0.2)] transition-shadow"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ENGAGE
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="absolute bottom-3 left-4 z-20">
        <MechCredit compact />
      </div>

      <p className="absolute top-4 left-0 right-0 text-center z-10 pointer-events-none font-mono text-[9px] tracking-[0.3em] text-cyan/40">
        SELECT DESTINATION · CONFIRM WITH ENGAGE
      </p>
    </div>
  )
}
