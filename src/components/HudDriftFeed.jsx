import { motion } from 'framer-motion'

const LEFT_DRIFTS = [
  { id: 'l1', text: 'CAN · 0x4A', top: '12%', delay: 0 },
  { id: 'l2', text: 'RTOS · OK', top: '28%', delay: 2 },
  { id: 'l3', text: 'I2C · 400kHz', top: '44%', delay: 4 },
  { id: 'l4', text: 'BMS · NOM', top: '58%', delay: 6 },
  { id: 'l5', text: 'ADC · 12b', top: '72%', delay: 8 },
  { id: 'l6', text: 'FW · v2.1', top: '86%', delay: 10 },
]

const RIGHT_DRIFTS = [
  { id: 'r1', text: 'LINK · STABLE', top: '10%', delay: 1 },
  { id: 'r2', text: 'GYRO · CAL', top: '26%', delay: 3 },
  { id: 'r3', text: 'TORQ · 98%', top: '40%', delay: 5 },
  { id: 'r4', text: 'PHASE · LOCK', top: '54%', delay: 7 },
  { id: 'r5', text: 'RX · -42dBm', top: '68%', delay: 9 },
  { id: 'r6', text: 'TX · NOM', top: '82%', delay: 11 },
]

const MID_DRIFTS = [
  { id: 'm1', text: '0x7F · ACK', top: '22%', delay: 1.5, fromLeft: true },
  { id: 'm2', text: 'SYNC · UM-AA', top: '38%', delay: 3.5, fromLeft: false },
  { id: 'm3', text: 'HEAP · 64K', top: '52%', delay: 5.5, fromLeft: true },
  { id: 'm4', text: 'WDT · CLR', top: '66%', delay: 7.5, fromLeft: false },
]

const DRIFT_DURATION = 9

function DriftLine({ text, top, delay, fromLeft }) {
  return (
    <motion.span
      className={`absolute font-mono text-[8px] md:text-[9px] tracking-widest text-cyan/30 whitespace-nowrap pointer-events-none select-none hud-drift-line ${fromLeft ? 'hud-drift-left' : 'hud-drift-right'}`}
      style={{ top }}
      initial={{ opacity: 0 }}
      animate={{
        x: fromLeft ? ['-12%', '112%'] : ['112%', '-12%'],
        opacity: [0, 0.65, 0.65, 0],
      }}
      transition={{
        duration: DRIFT_DURATION,
        delay,
        repeat: Infinity,
        ease: 'linear',
        times: [0, 0.06, 0.94, 1],
      }}
    >
      <span className="hud-drift-trail" aria-hidden="true" />
      {text}
    </motion.span>
  )
}

/** Telemetry strings that drift across both sides of the GUI — hidden on compact viewports */
export default function HudDriftFeed() {
  return (
    <div className="hud-drift pointer-events-none fixed inset-0 z-[25] overflow-hidden hidden lg:block" aria-hidden="true">
      <div className="absolute inset-y-0 left-0 w-[38%] md:w-[26%] overflow-hidden">
        {LEFT_DRIFTS.map((d) => (
          <DriftLine key={d.id} text={d.text} top={d.top} delay={d.delay} fromLeft />
        ))}
      </div>
      <div className="absolute inset-y-0 left-[26%] right-[44%] hidden md:block overflow-hidden">
        {MID_DRIFTS.map((d) => (
          <DriftLine key={d.id} text={d.text} top={d.top} delay={d.delay} fromLeft={d.fromLeft} />
        ))}
      </div>
      <div className="absolute inset-y-0 right-0 w-[44%] md:w-[48%] overflow-hidden">
        {RIGHT_DRIFTS.map((d) => (
          <DriftLine key={d.id} text={d.text} top={d.top} delay={d.delay} fromLeft={false} />
        ))}
      </div>
    </div>
  )
}
