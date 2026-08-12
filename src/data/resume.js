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
  subtitle: 'Computer Engineering @ University of Michigan',
  gpa: '3.9 / 4.0',
  graduation: 'May 2028',
  minor: 'Mathematics',
  statement:
    'Building firmware and systems that move in the real world — SoC bring-up, heterogeneous multicore, robotics, and high-voltage embedded controls.',
  interests: [
    'Travel & food',
    'Fantasy novels',
    'Music',
    'Wearable tech & robotics',
    'Things people actually use',
  ],
}

export const education = {
  school: 'University of Michigan',
  degree: 'B.S.E. Computer Engineering',
  minor: 'Mathematics',
  location: 'Ann Arbor, MI',
  graduation: 'May 2028',
  gpa: '3.9/4.0',
  awards: [
    'BPA C++ Programming — 2nd Place (Regional)',
    'BPA Financial Analyst Team Captain — 1st Place (Regional)',
    'HOSA College Physics — 2nd Place (State)',
    'BPA National Torch Leadership Award',
  ],
  coursework: [
    'Data Structures & Algorithms',
    'Digital Logic Design',
    'Discrete Mathematics',
    'Linear Algebra',
    'Multivariable Calculus',
    'Differential Equations',
  ],
  inProgress: [
    'EECS 370 — Computer Organization',
    'EECS 471 — Applied Parallel Programming (GPUs/CUDA)',
    'EECS 470 — Computer Architecture (Winter 2027)',
  ],
}

export const experience = [
  {
    id: 'trackonomy',
    title: 'Firmware Engineering Intern',
    org: 'Trackonomy Systems',
    location: 'San Jose, CA',
    period: 'May 2026 – Aug 2026',
    points: [
      'Brought up Cortex-M7 on NXP i.MX 8M Plus under Linux remoteproc — end-to-end RPMsg/OpenAMP across resource-table placement, virtio vring, and MU doorbell handshake',
      'Reduced sustained suspend current from 78.9 mA to 73.5 mA (~7% below Linux suspend floor) via PCA9450C PMIC standby programming and per-rail cut-safety mapping',
      'Root-caused four heterogeneous-boot failures across device tree and firmware: ELF load-address mismatch, memory-region ordering, compatible string, and FreeRTOS tick/clock mismatch',
      'Isolated a kernel-side mailbox defect by control experiment on imx_rproc.c / imx-mailbox.c; brought six I2C/ADC sensors online on Opulinks OPL1800 (Cortex-M3)',
    ],
  },
  {
    id: 'atombot',
    title: 'Embedded Firmware Researcher',
    org: 'University of Michigan — Atombot Lab',
    location: 'Ann Arbor, MI',
    period: 'Jan 2026 – Present',
    points: [
      'Optimize embedded firmware on Raspberry Pi through a HAL to reduce real-time latency in robotics applications',
      'Deploy and validate FreeRTOS code and NFC interfaces with system-level testing',
      'Develop firmware and CAN control algorithms in C/C++ for wheel-legged kinematics',
    ],
  },
  {
    id: 'spark',
    title: 'High Voltage Embedded Software Developer',
    org: 'SPARK Electric Racing',
    location: 'Ann Arbor, MI',
    period: 'Sep 2025 – Jan 2026',
    points: [
      'Developed microcontroller firmware in C for real-time BMS communication over CAN bus',
      'Engineered an integrated isolation board improving safety, robustness, and fault tolerance against circuit leaks',
      'Validated high-voltage control systems using Altium for schematic and PCB review',
    ],
  },
  {
    id: 'computek',
    title: 'Software Development Intern',
    org: 'Computek Solutions',
    location: 'Novi, MI',
    period: 'Jul 2025 – Aug 2025',
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
    url: 'https://github.com/srivbalaji/User-Space-Thread-Scheduler',
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
    url: 'https://github.com/srivbalaji/Audio-Spectrum-Visualizer',
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
  {
    id: 'portfolio-site',
    title: 'Gundam Cockpit Portfolio',
    status: 'COMPLETE',
    url: 'https://sbalaji.vercel.app',
    description:
      'Interactive Gundam cockpit portfolio — 3D Freedom Gundam boot sequence, warp intro, sector navigation, and holo comms bay.',
    tech: ['React', 'Three.js', 'Vite', 'Tailwind', 'Framer Motion'],
    details: [
      'Boot FSM: hangar warp (faceIntro→face dolly) → pilot-link face framing → LINK ESTABLISHED → portfolio shell at Home',
      'Section camera FSM: idle at section.end → 200ms nav delay → one continuous three-point arc (current.end → next.start → next.end) with locked canonical end poses',
      'Six tab presets each define start/end keyframes + mechRotY; Contact keeps low rear-quarter upward look; Home enables orbit only when idle at hero.end',
      'Cockpit shell: Comms Bay holo previews (resume PDF embed), experience timeline scroll-sync, peripheral warp streaks, arc camera rig in MechViewport',
      'Deployed at sbalaji.vercel.app — static Vite build, no server secrets',
    ],
    image: '/assets/projects/portfolio-site.jpg',
    imageAlt: 'Gundam cockpit boot screen — pilot link face framing with Freedom Gundam',
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
    'ESP32',
    'Cortex-A53/M7/M3',
    'I2C',
    'SPI',
    'UART',
    'CAN',
    'ADC',
    'FPGA',
    'Altium',
  ],
  tools: ['Keil MDK', 'ARM GNU', 'CMake/Ninja', 'Git', 'Jira', 'GDB', 'WSL2', 'dtc'],
}

export const navLinks = [
  { id: 'hero', label: 'Home', icon: '◈' },
  { id: 'about', label: 'About', icon: '◇' },
  { id: 'projects', label: 'Projects', icon: '▣' },
  { id: 'experience', label: 'Experience', icon: '▤' },
  { id: 'skills', label: 'Skills', icon: '◎' },
  { id: 'contact', label: 'Contact', icon: '◉' },
]
