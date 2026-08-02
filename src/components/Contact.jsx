import { motion } from 'framer-motion'
import { profile } from '../data/resume'

export default function Contact({ embedded, onOpenHolo }) {
  const links = [
    { label: 'EMAIL', channel: 'EMAIL', href: `mailto:${profile.email}`, icon: '✉' },
    { label: 'LINKEDIN', channel: 'LINKEDIN', href: profile.linkedin, icon: '◉' },
    { label: 'GITHUB', channel: 'GITHUB', href: profile.github, icon: '◇' },
    { label: 'RESUME', channel: 'RESUME', href: profile.resumeUrl, icon: '▣' },
  ]

  return (
    <section id="contact" className={embedded ? 'pb-8' : 'py-24 px-6 md:px-12 lg:pl-32 pb-32'}>
      <div className={embedded ? 'text-left' : 'max-w-4xl mx-auto text-center'}>
        <motion.p className="hud-text text-gold mb-2" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          COMM LINK
        </motion.p>
        <motion.h2 className="section-title mb-8" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          CONNECT
        </motion.h2>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {links.map((link, i) => (
            <motion.button
              key={link.label}
              type="button"
              onClick={() => onOpenHolo?.({ channel: link.channel, href: link.href })}
              className="p3-panel hover-pop p-4 sm:p-6 flex items-center justify-center gap-3 sm:gap-4 group text-left w-full min-h-[52px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <span className="font-display text-2xl text-cyan group-hover:text-ice transition-colors">{link.icon}</span>
              <span className="font-ui text-lg tracking-[0.3em] text-ice/80 group-hover:text-cyan transition-colors">{link.label}</span>
            </motion.button>
          ))}
        </motion.div>

        <motion.p className="hud-text text-ice/40" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          {profile.location} · {profile.phone}
        </motion.p>
        <motion.p className="mt-2 font-mono text-[10px] text-cyan/45 tracking-wider" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          {profile.portfolio}
        </motion.p>
        <motion.p className="mt-8 font-display text-sm text-cyan/40 tracking-[0.5em]" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          END TRANSMISSION
        </motion.p>
      </div>
    </section>
  )
}
