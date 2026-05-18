import { motion } from 'framer-motion'

const firmwareTerms = [
  'FIRMWARE',
  'FreeRTOS',
  'CAN BUS',
  'STM32',
  'HAL',
  'BLE',
  'I2C',
  'UART',
  'GPIO',
  'ISR',
  'DMA',
  'RTOS',
  'BOOTLOADER',
  '0xDEAD',
  'PWM',
  'ADC',
]

export default function CircuitBackground() {
  return (
    <motion.div
      className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
      aria-hidden
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* Circuit trace SVG pattern */}
      <svg className="absolute inset-0 w-full h-full circuit-traces" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="pcb" width="120" height="120" patternUnits="userSpaceOnUse">
            <path
              d="M0 60 H40 M80 60 H120 M60 0 V40 M60 80 V120 M40 40 H80 V80 H40 Z"
              fill="none"
              stroke="rgba(61, 232, 255, 0.06)"
              strokeWidth="1"
            />
            <circle cx="40" cy="60" r="2" fill="rgba(61, 232, 255, 0.12)" />
            <circle cx="80" cy="60" r="2" fill="rgba(61, 232, 255, 0.12)" />
            <circle cx="60" cy="40" r="2" fill="rgba(107, 255, 184, 0.1)" />
            <circle cx="60" cy="80" r="2" fill="rgba(107, 255, 184, 0.1)" />
          </pattern>
          <linearGradient id="traceGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(61, 232, 255, 0)" />
            <stop offset="50%" stopColor="rgba(61, 232, 255, 0.15)" />
            <stop offset="100%" stopColor="rgba(61, 232, 255, 0)" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#pcb)" />
        {/* Large decorative traces */}
        <path
          d="M-20 200 Q200 180 400 220 T800 200 T1200 240"
          fill="none"
          stroke="url(#traceGlow)"
          strokeWidth="1.5"
          opacity="0.4"
        />
        <path
          d="M100 600 Q350 550 600 620 T1100 580"
          fill="none"
          stroke="rgba(155, 123, 255, 0.12)"
          strokeWidth="1"
        />
        <path
          d="M50 400 H350 M350 400 V550 M350 550 H700 M700 550 V300"
          fill="none"
          stroke="rgba(61, 232, 255, 0.08)"
          strokeWidth="1"
          strokeDasharray="8 12"
        />
        <path
          d="M900 100 V400 M900 400 H1100 M1100 400 V700"
          fill="none"
          stroke="rgba(107, 255, 184, 0.07)"
          strokeWidth="1"
        />
      </svg>

      {/* Floating firmware labels */}
      {firmwareTerms.map((term, i) => (
        <motion.span
          key={term}
          className="absolute font-ui text-[10px] md:text-xs tracking-[0.35em] text-cyan/20 select-none"
          style={{
            left: `${8 + (i * 17) % 85}%`,
            top: `${5 + (i * 23) % 90}%`,
          }}
          animate={{
            opacity: [0.15, 0.35, 0.15],
            y: [0, -8, 0],
          }}
          transition={{
            duration: 6 + (i % 4),
            repeat: Infinity,
            delay: i * 0.4,
          }}
        >
          {term}
        </motion.span>
      ))}

      {/* Soft vignette so content stays readable */}
      <div className="absolute inset-0 bg-gradient-to-b from-void/40 via-transparent to-void/70" />
    </motion.div>
  )
}
