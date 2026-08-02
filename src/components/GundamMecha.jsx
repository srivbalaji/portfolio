import { motion } from 'framer-motion'

/** Stylized mobile suit — CSS 3D + SVG layers (original design, not licensed IP) */
export default function GundamMecha({ phase }) {
  const zoom = phase === 'approach' || phase === 'cockpit'

  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      {/* Starfield */}
      <div className="absolute inset-0 opacity-40">
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-0.5 h-0.5 bg-ice rounded-full"
            style={{
              left: `${(i * 17) % 100}%`,
              top: `${(i * 23) % 100}%`,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: 2 + (i % 3), repeat: Infinity, delay: i * 0.05 }}
          />
        ))}
      </div>

      <motion.div
        className="relative w-[min(90vw,520px)] h-[min(85vh,680px)]"
        initial={{ scale: 0.15, rotateX: 18, rotateY: -12, z: -800 }}
        animate={
          phase === 'approach'
            ? { scale: 1.05, rotateX: 8, rotateY: 0, z: 0 }
            : phase === 'cockpit'
              ? { scale: 2.8, rotateX: 0, rotateY: 0, z: 400, opacity: 0 }
              : { scale: 0.15, rotateX: 18, rotateY: -12, z: -800 }
        }
        transition={{
          duration: phase === 'cockpit' ? 1.2 : 2.8,
          ease: phase === 'cockpit' ? [0.4, 0, 0.2, 1] : [0.22, 1, 0.36, 1],
        }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        <svg viewBox="0 0 400 520" className="w-full h-full drop-shadow-[0_0_60px_rgba(61,232,255,0.25)]">
          <defs>
            <linearGradient id="armorMain" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1a2840" />
              <stop offset="50%" stopColor="#2a3f5f" />
              <stop offset="100%" stopColor="#0f1828" />
            </linearGradient>
            <linearGradient id="armorAccent" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#c41e3a" />
              <stop offset="100%" stopColor="#8b1528" />
            </linearGradient>
            <linearGradient id="visorGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3de8ff" stopOpacity="0.2" />
              <stop offset="50%" stopColor="#3de8ff" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#3de8ff" stopOpacity="0.2" />
            </linearGradient>
          </defs>

          {/* Legs */}
          <rect x="155" y="380" width="35" height="120" rx="4" fill="url(#armorMain)" stroke="#3de8ff" strokeOpacity="0.2" />
          <rect x="210" y="380" width="35" height="120" rx="4" fill="url(#armorMain)" stroke="#3de8ff" strokeOpacity="0.2" />
          <rect x="148" y="470" width="48" height="28" rx="2" fill="#0a1224" stroke="#3de8ff" strokeOpacity="0.3" />
          <rect x="204" y="470" width="48" height="28" rx="2" fill="#0a1224" stroke="#3de8ff" strokeOpacity="0.3" />

          {/* Torso */}
          <path
            d="M130 200 L270 200 L285 340 L115 340 Z"
            fill="url(#armorMain)"
            stroke="#3de8ff"
            strokeOpacity="0.25"
            strokeWidth="1.5"
          />
          <rect x="175" y="220" width="50" height="80" rx="2" fill="url(#armorAccent)" opacity="0.85" />
          <rect x="188" y="240" width="24" height="40" fill="#0a1224" opacity="0.6" />

          {/* Cockpit window target (zoom destination) */}
          <ellipse cx="200" cy="255" rx="28" ry="22" fill="#050810" stroke="#3de8ff" strokeWidth="2" opacity="0.9" />
          <ellipse cx="200" cy="255" rx="22" ry="16" fill="url(#visorGlow)" opacity="0.7">
            <animate attributeName="opacity" values="0.4;0.9;0.4" dur="2s" repeatCount="indefinite" />
          </ellipse>

          {/* Shoulders */}
          <path d="M95 195 L130 210 L125 280 L70 260 Z" fill="url(#armorMain)" stroke="#3de8ff" strokeOpacity="0.2" />
          <path d="M305 195 L270 210 L275 280 L330 260 Z" fill="url(#armorMain)" stroke="#3de8ff" strokeOpacity="0.2" />
          <rect x="55" y="200" width="45" height="55" rx="3" fill="url(#armorAccent)" opacity="0.7" />
          <rect x="300" y="200" width="45" height="55" rx="3" fill="url(#armorAccent)" opacity="0.7" />

          {/* Arms */}
          <rect x="45" y="255" width="28" height="100" rx="4" fill="url(#armorMain)" stroke="#3de8ff" strokeOpacity="0.15" />
          <rect x="327" y="255" width="28" height="100" rx="4" fill="url(#armorMain)" stroke="#3de8ff" strokeOpacity="0.15" />

          {/* Head / V-fin */}
          <path d="M165 120 L200 60 L235 120 L220 175 L180 175 Z" fill="url(#armorMain)" stroke="#3de8ff" strokeOpacity="0.3" />
          <path d="M200 60 L185 95 M200 60 L215 95" stroke="#3de8ff" strokeWidth="2" opacity="0.6" />
          <rect x="178" y="130" width="44" height="18" rx="2" fill="url(#visorGlow)" opacity="0.8" />

          {/* Backpack thrusters */}
          <rect x="160" y="175" width="80" height="35" rx="4" fill="#0a1224" stroke="#3de8ff" strokeOpacity="0.2" />
          <circle cx="175" cy="192" r="8" fill="#3de8ff" opacity="0.3">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.5s" repeatCount="indefinite" />
          </circle>
          <circle cx="225" cy="192" r="8" fill="#3de8ff" opacity="0.3">
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1.5s" repeatCount="indefinite" begin="0.3s" />
          </circle>
        </svg>

        {zoom && (
          <motion.div
            className="absolute inset-0 border-2 border-cyan/30 pointer-events-none"
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: [0, 0.5, 0.2] }}
            transition={{ duration: 2.8 }}
          />
        )}
      </motion.div>
    </div>
  )
}
