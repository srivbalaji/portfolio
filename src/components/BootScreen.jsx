import { motion } from 'framer-motion'

export default function BootScreen({ onComplete }) {
  return (
    <motion.div
      className="fixed inset-0 z-[10000] flex flex-col items-center justify-center bg-void grid-bg"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.6 }}
    >
      <div className="absolute inset-0 gundam-stripe opacity-30" />
      <motion.div
        className="relative z-10 text-center px-8 max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <p className="hud-text mb-4 text-cyan">MOBILE SUIT INTERFACE v3.0</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold text-ice mb-2 tracking-widest">
          INITIALIZING
        </h1>
        <p className="font-ui text-gold/90 text-sm tracking-[0.3em] mb-10">
          ATLAS // METAPHOR PROTOCOL
        </p>
        <motion.div
          className="h-1 w-64 mx-auto bg-panelLight rounded overflow-hidden border border-cyan/30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-cyanDim via-cyan to-atlas"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.2, ease: 'easeInOut' }}
            onAnimationComplete={() => setTimeout(onComplete, 400)}
          />
        </motion.div>
        <motion.p
          className="hud-text mt-6 text-cyan/50"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          LOADING PILOT DATA...
        </motion.p>
      </motion.div>
    </motion.div>
  )
}
