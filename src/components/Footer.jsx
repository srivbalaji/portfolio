import React, { useEffect, useRef } from 'react'

const Footer = () => {
  const footerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '50px' }
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <footer 
      ref={footerRef}
      className="py-16 px-6 border-t border-sage-green/10"
      style={{ opacity: 0 }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <div className="flex gap-6">
            <a 
              href="mailto:your.email@umich.edu" 
              className="text-charcoal/70 hover:text-moss-green transition-colors duration-300 font-light"
            >
              Email
            </a>
            <a 
              href="https://linkedin.com/in/yourprofile" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-charcoal/70 hover:text-moss-green transition-colors duration-300 font-light"
            >
              LinkedIn
            </a>
            <a 
              href="https://github.com/yourusername" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-charcoal/70 hover:text-moss-green transition-colors duration-300 font-light"
            >
              GitHub
            </a>
          </div>
          <a 
            href="/resume.pdf" 
            download
            className="px-6 py-2 bg-sage-green/10 hover:bg-sage-green/20 text-moss-green rounded-full transition-all duration-300 font-light text-sm"
          >
            Resume
          </a>
        </div>
        <p className="text-center text-charcoal/50 text-sm font-light">
          Built with intention. Quietly.
        </p>
      </div>
    </footer>
  )
}

export default Footer
