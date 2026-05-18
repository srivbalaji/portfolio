import React, { useEffect, useRef } from 'react'

const Spark = () => {
  const sparkRef = useRef(null)

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

    if (sparkRef.current) {
      observer.observe(sparkRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section 
      ref={sparkRef}
      className="py-24 px-6 max-w-4xl mx-auto"
      style={{ opacity: 0 }}
    >
      <div className="mb-12">
        <h2 className="text-4xl md:text-5xl font-light mb-8 text-deep-forest">Spark</h2>
        <div className="w-16 h-0.5 bg-sage-green/30 mb-12"></div>
      </div>

      <div className="space-y-8 text-lg md:text-xl text-charcoal/80 leading-relaxed font-light">
        <p>
          What motivates me is the intersection of systems and robotics—where software meets hardware, 
          where algorithms meet physical constraints, and where elegant solutions emerge from understanding 
          the problem deeply.
        </p>
        <p>
          I'm drawn to problems that require engineering judgment: when to optimize and when to keep it simple, 
          how to balance performance with maintainability, and how to build systems that are robust in the 
          face of uncertainty. These aren't just technical questions—they're questions about how to think 
          clearly and build thoughtfully.
        </p>
        <p>
          The kind of problems I care about are the ones where the solution isn't obvious, where constraints 
          shape creativity, and where good engineering makes a real difference. Whether it's optimizing a 
          control loop for a robot, designing a low-power embedded system, or building software that others 
          will build on, I want to work on things that matter.
        </p>
        <p className="text-moss-green/80 italic">
          Quiet intention, thoughtful engineering, systems that work.
        </p>
      </div>
    </section>
  )
}

export default Spark
