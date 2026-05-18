export const profile = {
  name: 'Srivatsan Balaji',
  email: 'sribalaj@umich.edu',
  phone: '(248) 295-1773',
  linkedin: 'https://linkedin.com/in/srivb70',
  github: 'https://github.com/srivbalaji',
  location: 'Ann Arbor, MI',
  tagline: 'Embedded Systems · Robotics · Firmware',
  subtitle: 'Computer Engineering @ University of Michigan',
  gpa: '3.9 / 4.0',
  graduation: 'May 2028',
  minor: 'Mathematics',
  statement:
    'Building firmware and systems that move in the real world — swarm robotics, high-voltage EV controls, and low-power embedded hardware.',
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
    'Discrete Math',
    'Differential Equations',
    'Linear Algebra',
    'Multivariable Calculus',
  ],
}

export const experience = [
  {
    id: 'trackonomy',
    title: 'Firmware Engineering Intern (Incoming)',
    org: 'Trackonomy Systems',
    location: 'San Jose, CA',
    period: 'May 2026 – Aug 2026',
    points: [
      'Develop embedded firmware in C/C++ for IoT asset-tracking devices supporting enterprise shipping networks',
      'Collaborate with hardware teams to debug communication, optimize power usage, and improve reliability',
      'Integrate BLE and LoRa with ARM-based microcontrollers and onboard sensors for low-power, long-range tracking',
    ],
  },
  {
    id: 'atombot',
    title: 'Embedded Firmware Researcher',
    org: 'University of Michigan — Atombot Lab',
    location: 'Ann Arbor, MI',
    period: 'Jan 2026 – Present',
    points: [
      'Optimize embedded firmware on Raspberry Pi through a HAL to reduce real-time latency in robotics',
      'Deploy and validate FreeRTOS code, electronic components, and NFC interfaces with system-level testing',
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
      'Test and validate high-voltage embedded control systems; use Altium for schematic and PCB tests',
      'Develop microcontroller firmware in C for real-time BMS communication over CAN bus',
      'Engineered an integrated isolation board improving safety, robustness, and fault tolerance',
    ],
  },
  {
    id: 'computek',
    title: 'Software Development Intern',
    org: 'Computek Solutions',
    location: 'Novi, MI',
    period: 'Jul 2025 – Aug 2025',
    points: [
      'Developed C++ programs to automate financial modeling (FCFE, EBITDA, DCF), reducing analysis time by 70%',
      'Built reusable valuation libraries for equity-based transaction workflows',
      'Researched market trends and comparable companies to support VC deals',
    ],
  },
]

export const projects = [
  {
    id: 'sensor-logger',
    title: 'Low-Power Embedded Sensor Logger',
    status: 'ONGOING',
    description:
      'STM32 firmware logging accelerometer and temperature data with aggressive power optimization.',
    tech: ['C/C++', 'STM32', 'Deep Sleep', 'SD Card', 'UART/BLE'],
    details: [
      'Targeting <5% CPU utilization via interrupt-driven firmware and peripheral clock gating',
      'Integrating SD storage and UART/Bluetooth for real-time logging and offline analysis',
    ],
    image: '/assets/projects/sensor-logger.jpg',
    imageAlt: 'Sensor logger project',
  },
  {
    id: 'bluetooth-hw',
    title: 'Embedded Bluetooth Hardware',
    status: 'COMPLETE',
    description:
      'Custom Bluetooth transmitter for a Sony NWE-505 MP3 player — portable wireless audio from legacy hardware.',
    tech: ['Embedded C', 'PCB Design', 'BLE', 'Power Optimization'],
    details: [
      'Designed custom PCB layout and microcontroller firmware for wireless audio streaming',
      'Low-power communication system for battery efficiency and signal stability',
    ],
    image: '/assets/projects/bluetooth-hw.jpg',
    imageAlt: 'Bluetooth hardware project',
  },
  {
    id: 'spectrum',
    title: 'Real-Time Audio Spectrum Visualizer',
    status: 'COMPLETE',
    description:
      'FFT-based audio processing on STM32 with OLED visualization — real-time DSP on constrained hardware.',
    tech: ['Embedded C', 'STM32', 'FFT', 'OLED', 'Fixed-Point'],
    details: [
      'Reduced latency 30% through fixed-point arithmetic and optimized buffer management',
      'Designed UI demonstrating real-time DSP on microcontroller platform',
    ],
    image: '/assets/projects/spectrum.jpg',
    imageAlt: 'Audio spectrum visualizer',
  },
  {
    id: 'atombot-swarm',
    title: 'Atombot Lab — Swarm Robotics',
    status: 'ACTIVE',
    description:
      'Swarm robotics research: embedded systems, coordination, and performance-critical firmware.',
    tech: ['C/C++', 'FreeRTOS', 'CAN', 'Raspberry Pi', 'Robotics'],
    details: [
      'HAL optimization for real-time latency',
      'CAN control for wheel-legged kinematics',
    ],
    image: '/assets/projects/atombot.jpg',
    imageAlt: 'Atombot swarm robotics',
  },
  {
    id: 'spark-ev',
    title: 'SPARK Electric Racing',
    status: 'COMPLETE',
    description:
      'High-voltage embedded systems for electric racing — BMS, CAN, and isolation hardware.',
    tech: ['C', 'CAN', 'BMS', 'Altium', 'High Voltage'],
    details: [
      'Firmware for real-time BMS communication',
      'Isolation board for circuit leak protection',
    ],
    image: '/assets/projects/spark.jpg',
    imageAlt: 'SPARK electric racing',
  },
  {
    id: 'cad-pen',
    title: 'CAD Reverse Engineering',
    status: 'SIDE',
    description: 'Reverse-engineered a ballpoint pen in CAD for practice — form, fit, and modeling fundamentals.',
    tech: ['CAD', 'Solid Modeling'],
    details: ['Personal practice project from portfolio showcase'],
    image: '/assets/projects/cad-pen.jpg',
    imageAlt: 'CAD pen model',
  },
]

export const skills = {
  languages: ['C++', 'C', 'Python', 'Java', 'JavaScript', 'Verilog'],
  hardware: [
    'ESP32',
    'STM32',
    'I2C',
    'UART',
    'CAN',
    'FPGA',
    'Altium',
    'Git',
    'Jira',
  ],
}

export const navLinks = [
  { id: 'hero', label: 'HOME', icon: '◈' },
  { id: 'about', label: 'PROFILE', icon: '◇' },
  { id: 'projects', label: 'MISSIONS', icon: '▣' },
  { id: 'experience', label: 'LOG', icon: '▤' },
  { id: 'skills', label: 'SYSTEM', icon: '◎' },
  { id: 'contact', label: 'LINK', icon: '◉' },
]
