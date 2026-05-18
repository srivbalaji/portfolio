import React, { useEffect, useRef } from 'react'

const Leadership = () => {
  const leadershipRef = useRef(null)

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

    if (leadershipRef.current) {
      observer.observe(leadershipRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section 
      ref={leadershipRef}
      className="py-24 px-6 max-w-4xl mx-auto"
      style={{ opacity: 0 }}
    >
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-light mb-8 text-deep-forest">Leadership & Impact</h2>
        <div className="w-16 h-0.5 bg-sage-green/30 mb-12"></div>
      </div>

      <div className="bg-white/80 backdrop-blur-sm rounded-gentle p-8 md:p-12 shadow-soft border border-sage-green/10">
        <div className="mb-6">
          <h3 className="text-2xl md:text-3xl font-light text-deep-forest mb-2">International Director</h3>
          <p className="text-moss-green font-medium">Organization Name</p>
        </div>

        <div className="space-y-6 text-lg text-charcoal/80 leading-relaxed font-light">
          <p>
            Serving as International Director has been about scale, responsibility, and service. 
            Leading initiatives that span multiple countries and cultures requires systems thinking 
            at a different level—understanding how different parts of a complex organization interact, 
            how communication flows across boundaries, and how to build structures that enable others 
            to succeed.
          </p>
          <p>
            This role has taught me that effective leadership is quiet and intentional. It's about 
            creating the conditions for others to do their best work, removing obstacles, and 
            building systems that outlast individual contributions. The impact isn't always visible 
            immediately, but it compounds over time.
          </p>
          <p>
            I've learned to think in terms of leverage—how to make decisions that create positive 
            ripple effects, how to build processes that scale, and how to maintain quality and 
            intention even as scope grows.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Leadership
