import { motion } from 'framer-motion'
import MechViewport from './MechViewport'
import MechCredit from './MechCredit'
import WarpStreaks from './WarpStreaks'

/** Intro — face/shoulder framing from first frame, no wide gun shot */
export default function GundamHangar({ phase, onFaceClick }) {
  const atFace = phase === 'face'
  const initializing = !atFace

  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-[#030508] ${atFace ? 'cursor-pointer' : ''}`}
      onClick={atFace ? onFaceClick : undefined}
      onKeyDown={(e) => atFace && e.key === 'Enter' && onFaceClick?.()}
      role={atFace ? 'button' : 'presentation'}
      tabIndex={atFace ? 0 : -1}
    >
      <MechViewport
        cameraTarget="face"
        showHangar
        idleSway={false}
        hideWeapons
        introZoom={initializing}
        snapCamera={atFace}
      />

      <WarpStreaks active={initializing} />

      <motion.div
        className="absolute inset-0 pointer-events-none z-[6]"
        animate={{ opacity: initializing ? 0.5 : 0.22 }}
        style={{
          background:
            'radial-gradient(ellipse 55% 45% at 50% 50%, rgba(61,232,255,0.12) 0%, transparent 65%), radial-gradient(ellipse 50% 40% at 55% 42%, rgba(196,30,58,0.22) 0%, transparent 60%)',
        }}
      />

      <motion.div
        className="absolute bottom-8 left-0 right-0 text-center z-10 pointer-events-none px-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        {!atFace && (
          <p className="font-ui text-[10px] md:text-xs tracking-[0.35em] text-ice/70 drop-shadow-lg">
            COCKPIT LINK · UNIT UM-AA · INITIALIZING
          </p>
        )}
        {atFace && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <p className="font-ui text-xs md:text-sm tracking-[0.3em] text-gundam drop-shadow-lg">
              PILOT LINK · READY
            </p>
            <motion.p
              className="mt-3 font-mono text-[10px] md:text-xs tracking-[0.22em] text-ice/80 bg-gundam/20 inline-block px-4 py-2 border border-gundam/40"
              animate={{ opacity: [0.55, 1, 0.55] }}
              transition={{ duration: 2.2, repeat: Infinity }}
            >
              CLICK ANYWHERE TO INITIALIZE
            </motion.p>
          </motion.div>
        )}
      </motion.div>

      <div className="absolute bottom-2 left-3 z-10 pointer-events-auto">
        <MechCredit compact />
      </div>
    </div>
  )
}
