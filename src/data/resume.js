export const profile = {
  name: 'Srivatsan Balaji',
  email: 'sribalaj@umich.edu',
  phone: '(248) 295-1773',
  linkedin: 'https://linkedin.com/in/srivb70',
  github: 'https://github.com/srivbalaji',
  portfolio: 'https://sbalaji.vercel.app',
  resumeUrl: '/Srivatsan_Balaji_Resume.pdf',
  location: 'Ann Arbor, MI',
  tagline: 'Embedded Systems · Robotics · Firmware',
  subtitle: 'Computer Science @ University of Michigan',
  gpa: '3.9 / 4.0',
  graduation: '',
  minor: 'Philosophy',
  statement:
    'Building firmware: SoC bring-up, heterogeneous multicore, robotics, and high-voltage embedded controls.',
  interests: [
    'Travel & food',
    'Fantasy novels',
    'Music',
    'Friends & downtime',
  ],
}

export const education = {
  school: 'University of Michigan',
  degree: 'B.S.E. Computer Science',
  minor: 'Philosophy',
  location: 'Ann Arbor, MI',
  graduation: '',
  gpa: '3.9/4.0',
  awards: [
    'BPA C++ Programming — 2nd Place (Regional)',
    'BPA Financial Analyst Team Captain — 1st Place (Regional)',
    'HOSA College Physics — 2nd Place (State)',
    'BPA National Torch Leadership Award',
  ],
  coursework: [
    'EECS 281 — Data Structures & Algorithms',
    'EECS 270 — Digital Logic Design',
    'EECS 203 — Discrete Mathematics',
    'Linear Algebra',
    'Multivariable Calculus',
    'Differential Equations',
  ],
  inProgress: [
    'EECS 215 — Introduction to Electronic Circuits',
    'EECS 370 — Computer Organization',
  ],
  planned: [
    'EECS 373 — Intro to Embedded Systems Design',
    'EECS 470 — Computer Architecture',
    'EECS 471 — Applied Parallel Programming (GPUs/CUDA)',
  ],
}

export const experience = [
  {
    id: 'trackonomy',
    title: 'Firmware Engineering Intern',
    org: 'Trackonomy Systems',
    location: 'San Jose, CA',
    period: 'May 2026 – Aug 2026',
    logo: '/assets/work/logos/trackonomy.png',
    subsections: [
      {
        id: 'sapphire-m7',
        title: 'Sapphire Gateway MCU Removal',
        period: 'Weeks 1–8',
        summary: 'Cortex-M7 bring-up on NXP i.MX 8M Plus under Linux remoteproc.',
        bullets: [
          'Root-caused heterogeneous boot failures across device tree and firmware (load address, memory regions, FreeRTOS tick/clock)',
          'Stood up RPMsg/OpenAMP end-to-end — resource table, virtio vrings, Messaging Unit doorbells',
          'Cut sustained suspend current to 73.5 mA (~7% below the Linux suspend floor)',
        ],
        images: [
          {
            src: '/assets/work/trk/sapphire-gateway.png',
            alt: 'i.MX 8M Plus carrier board used during bring-up',
            caption: 'Carrier board',
          },
          {
            src: '/assets/work/trk/imx8m-plus-som.png',
            alt: 'EDM-G-8M-PLUS i.MX 8M Plus System-on-Module',
            caption: 'i.MX 8M Plus SoM',
          },
        ],
      },
      {
        id: 'aovx-opl',
        title: 'AOVX Tape Bringup',
        period: 'Weeks 8–13',
        summary: 'Board bring-up on Opulinks OPL1800 — toolchain, wireless, and sensors.',
        bullets: [
          'Ported a Keil/armcc SDK bring-up flow to ARMGCC and validated flash + board boot',
          'MQTT WiFi uplink demo; BLE advertising verified in nRF Connect',
          'Brought up I2C/ADC sensors — battery, temp, humidity, pressure, light, accel, RTC',
        ],
        images: [
          {
            src: '/assets/work/trk/aovx-tape-bringup.png',
            alt: 'AOVX hardware during bring-up with USB connected',
            caption: 'AOVX bring-up',
          },
          {
            src: '/assets/work/trk/opl-ble-advertising.png',
            alt: 'nRF Connect showing OPL BLE advertising packets',
            caption: 'BLE advertising',
          },
        ],
      },
    ],
  },
  {
    id: 'nadir',
    title: 'Co-Founder & CEO',
    org: 'Nadir AI',
    location: 'Ann Arbor, MI',
    period: 'Feb 2026 – Present',
    logo: '/assets/work/logos/nadir.png',
    url: 'https://nadirai.net',
    points: [
      'Building ADAS telemetry for commercial fleets — post-repair health monitoring that runs in shadow mode on existing telematics feeds',
      'Owning product roadmap, design, hardware validation, pilot structure, and growth',
      'Scoping shadow-mode pilots with fleets and repair networks; more at nadirai.net',
    ],
  },
  {
    id: 'atombot',
    title: 'Embedded Firmware Researcher',
    org: 'University of Michigan — Atombot Lab',
    location: 'Ann Arbor, MI',
    period: 'Jan 2026 – Present',
    logo: '/assets/work/logos/atombot.png',
    points: [
      'Optimize embedded firmware on Raspberry Pi through a HAL to reduce real-time latency in robotics applications',
      'Deploy and validate FreeRTOS code and motor interfaces with system-level testing',
      'Develop firmware and CAN control algorithms in C/C++ for wheel-legged kinematics',
    ],
    images: [
      {
        src: '/assets/about/robotics-atombot-machine.png',
        alt: 'Atombot Lab soft robotics poster — Kraken simulation and Atombot swarm unit',
        caption: 'Atombot · soft robotics',
      },
      {
        src: '/assets/about/robotics-wheel-leg.png',
        alt: 'Wheel-leg hybrid robot prototype on the lab bench',
        caption: 'Wheel-leg hybrid',
      },
    ],
  },
  {
    id: 'spark',
    title: 'High Voltage Embedded Software Developer',
    org: 'SPARK Electric Racing',
    location: 'Ann Arbor, MI',
    period: 'Sep 2025 – Jan 2026',
    logo: '/assets/work/logos/spark.png',
    points: [
      'Developed microcontroller firmware in C for real-time BMS communication over CAN bus',
      'Engineered an integrated isolation board improving safety, robustness, and fault tolerance against circuit leaks',
      'Validated high-voltage control systems using Altium for schematic and PCB review',
    ],
    images: [
      {
        src: '/assets/about/robotics-spark-motorcycle.png',
        alt: 'SPARK Electric Racing motorcycle with exposed high-voltage harness',
        caption: 'SPARK EV motorcycle',
      },
      {
        src: '/assets/about/robotics-spark-pcb.png',
        alt: 'SPARK incoming member PCB project held in hand',
        caption: 'SPARK PCB',
      },
    ],
  },
  {
    id: 'computek',
    title: 'Software Development Intern',
    org: 'Computek Solutions',
    location: 'Novi, MI',
    period: 'Jul 2025 – Aug 2025',
    logo: '/assets/work/logos/computek.png',
    points: [
      'Developed C++ programs automating financial modeling (FCFE, EBITDA, DCF), cutting analysis time by 70%',
      'Built reusable valuation libraries to streamline equity-based transaction workflows',
      'Researched market trends and comparable companies to support VC deals',
    ],
  },
]

export const projects = [
  {
    id: 'thread-scheduler',
    title: 'User-Space Thread Scheduler',
    status: 'ONGOING',
    period: 'Aug 2026 – Present',
    description:
      'User-space threading library with cooperative and preemptive multitasking — context switching in raw x86-64 assembly without std::thread.',
    tech: ['C++17', 'x86-64 Assembly', 'std::atomic', 'Lock-free'],
    details: [
      'Context switching saves/restores callee-saved registers, instruction pointer, and stack pointers',
      'Mutexes, spinlocks, condition variables, and lock-free SPSC ring buffer for inter-thread messaging',
      'Work-stealing thread pool benchmarked against std::thread across task granularity and core counts',
    ],
    image: '/assets/projects/thread-scheduler.jpg',
    imageAlt: 'CPU processor die — user-space thread scheduler',
  },
  {
    id: 'spectrum',
    title: 'Real-Time Audio Spectrum Visualizer',
    status: 'COMPLETE',
    period: 'Aug 2025 – Sep 2025',
    description:
      'FFT-based audio processing on STM32 with OLED visualization — real-time DSP on constrained hardware.',
    tech: ['Embedded C', 'STM32', 'FFT', 'OLED', 'Fixed-Point'],
    details: [
      'Reduced latency 30% through fixed-point arithmetic and optimized buffer management',
      'Developed FFT-based signal processing to visualize frequency spectrum on OLED display',
    ],
    image: '/assets/projects/spectrum.jpg',
    imageAlt: 'STM32 Nucleo development board used for audio spectrum visualization',
  },
]

export const skills = {
  languages: ['C', 'C++', 'Python', 'Verilog', 'ARM Assembly', 'Java', 'JavaScript'],
  systems: [
    'SoC Bring-up',
    'Linux BSP',
    'Device Tree',
    'remoteproc',
    'RPMsg/OpenAMP',
    'FreeRTOS',
    'Zephyr',
    'Yocto',
    'U-Boot',
    'PSCI/TF-A',
  ],
  hardware: [
    'i.MX 8M Plus',
    'STM32',
    'Cortex-A53/M7/M3',
    'I2C',
    'SPI',
    'UART',
    'CAN',
    'ADC',
    'Altium',
  ],
  tools: ['Keil MDK', 'ARM GNU', 'CMake/Ninja', 'Git', 'Jira', 'GDB', 'WSL2', 'dtc'],
}

/** Skill tag → related work / project holograms (deployment-bay selection shape) */
export const skillWorkMap = {
  C: [
    { kind: 'experience', id: 'spark' },
    { kind: 'experience', id: 'atombot' },
    { kind: 'project', id: 'spectrum' },
    { kind: 'experience', id: 'trackonomy' },
  ],
  'C++': [
    { kind: 'experience', id: 'computek' },
    { kind: 'project', id: 'thread-scheduler' },
    { kind: 'experience', id: 'atombot' },
  ],
  Python: [{ kind: 'experience', id: 'nadir' }],
  'ARM Assembly': [
    { kind: 'experience', id: 'trackonomy', subsectionId: 'sapphire-m7' },
  ],
  Java: [{ kind: 'experience', id: 'computek' }],
  JavaScript: [{ kind: 'experience', id: 'nadir' }],
  'SoC Bring-up': [
    { kind: 'experience', id: 'trackonomy', subsectionId: 'sapphire-m7' },
  ],
  'Linux BSP': [
    { kind: 'experience', id: 'trackonomy', subsectionId: 'sapphire-m7' },
  ],
  'Device Tree': [
    { kind: 'experience', id: 'trackonomy', subsectionId: 'sapphire-m7' },
  ],
  remoteproc: [
    { kind: 'experience', id: 'trackonomy', subsectionId: 'sapphire-m7' },
  ],
  'RPMsg/OpenAMP': [
    { kind: 'experience', id: 'trackonomy', subsectionId: 'sapphire-m7' },
  ],
  FreeRTOS: [
    { kind: 'experience', id: 'atombot' },
    { kind: 'experience', id: 'trackonomy', subsectionId: 'sapphire-m7' },
  ],
  Zephyr: [{ kind: 'experience', id: 'trackonomy' }],
  Yocto: [{ kind: 'experience', id: 'trackonomy' }],
  'U-Boot': [{ kind: 'experience', id: 'trackonomy' }],
  'PSCI/TF-A': [{ kind: 'experience', id: 'trackonomy' }],
  'i.MX 8M Plus': [
    { kind: 'experience', id: 'trackonomy', subsectionId: 'sapphire-m7' },
  ],
  STM32: [{ kind: 'project', id: 'spectrum' }],
  'Cortex-A53/M7/M3': [
    { kind: 'experience', id: 'trackonomy', subsectionId: 'sapphire-m7' },
    { kind: 'experience', id: 'trackonomy', subsectionId: 'aovx-opl' },
  ],
  I2C: [
    { kind: 'experience', id: 'trackonomy', subsectionId: 'aovx-opl' },
  ],
  SPI: [
    { kind: 'experience', id: 'trackonomy', subsectionId: 'aovx-opl' },
  ],
  UART: [
    { kind: 'experience', id: 'trackonomy', subsectionId: 'sapphire-m7' },
  ],
  CAN: [
    { kind: 'experience', id: 'spark' },
    { kind: 'experience', id: 'atombot' },
  ],
  ADC: [
    { kind: 'experience', id: 'trackonomy', subsectionId: 'aovx-opl' },
  ],
  Altium: [{ kind: 'experience', id: 'spark' }],
  'Keil MDK': [
    { kind: 'experience', id: 'trackonomy', subsectionId: 'aovx-opl' },
  ],
  'ARM GNU': [
    { kind: 'experience', id: 'trackonomy', subsectionId: 'aovx-opl' },
    { kind: 'experience', id: 'trackonomy', subsectionId: 'sapphire-m7' },
  ],
  'CMake/Ninja': [{ kind: 'project', id: 'thread-scheduler' }],
  Git: [
    { kind: 'experience', id: 'nadir' },
    { kind: 'experience', id: 'trackonomy' },
  ],
  Jira: [{ kind: 'experience', id: 'trackonomy' }],
  GDB: [
    { kind: 'experience', id: 'trackonomy', subsectionId: 'sapphire-m7' },
  ],
  WSL2: [{ kind: 'experience', id: 'trackonomy' }],
  dtc: [
    { kind: 'experience', id: 'trackonomy', subsectionId: 'sapphire-m7' },
  ],
}

export function relatedSelectionsForSkill(skill) {
  return skillWorkMap[skill] ?? []
}

export function skillSelectionKey(sel) {
  if (!sel?.id) return ''
  return `${sel.kind}:${sel.id}:${sel.subsectionId || ''}`
}

export const navLinks = [
  { id: 'hero', label: 'Home', icon: '◈' },
  { id: 'about', label: 'About', icon: '◇' },
  { id: 'work', label: 'Projects & Experience', icon: '▣' },
  { id: 'skills', label: 'Skills', icon: '◎' },
  { id: 'contact', label: 'Contact', icon: '◉' },
]

/**
 * Mixed projects + experience feed (newest-first).
 * kind: 'experience' | 'project'
 */
export const workFeed = [
  { kind: 'experience', refId: 'trackonomy' },
  { kind: 'project', refId: 'thread-scheduler' },
  { kind: 'experience', refId: 'nadir' },
  { kind: 'experience', refId: 'atombot' },
  { kind: 'experience', refId: 'spark' },
  { kind: 'project', refId: 'spectrum' },
  { kind: 'experience', refId: 'computek' },
]

export function resolveWorkFeed() {
  return workFeed
    .map((entry) => {
      if (entry.kind === 'experience') {
        const job = experience.find((e) => e.id === entry.refId)
        return job ? { kind: 'experience', ...job } : null
      }
      const project = projects.find((p) => p.id === entry.refId)
      return project ? { kind: 'project', ...project } : null
    })
    .filter(Boolean)
}

/** Resolve a selected deployment-bay entry from kind+id (+ optional subsectionId) */
export function resolveWorkEntry(selection) {
  if (!selection?.id) return null
  if (selection.kind === 'experience') {
    const job = experience.find((e) => e.id === selection.id)
    if (!job) return null
    if (selection.subsectionId) {
      const sub = job.subsections?.find((s) => s.id === selection.subsectionId)
      if (!sub) return { kind: 'experience', ...job }
      return {
        kind: 'experience',
        id: job.id,
        subsectionId: sub.id,
        title: sub.title,
        org: job.org,
        logo: job.logo,
        location: job.location,
        period: sub.period || job.period,
        url: job.url,
        parentTitle: job.title,
        summary: sub.summary,
        points: sub.bullets || [],
        images: sub.images || [],
      }
    }
    return { kind: 'experience', ...job }
  }
  if (selection.kind === 'project') {
    const project = projects.find((p) => p.id === selection.id)
    return project ? { kind: 'project', ...project } : null
  }
  return null
}
