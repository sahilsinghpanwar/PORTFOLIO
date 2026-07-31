'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { WarpBackground } from '@/app/components/ui/warp-background';
import { 
  Atom, 
  Terminal, 
  Flame, 
  Sparkles, 
  Database, 
  Cpu, 
  Shield, 
  Box, 
  GitBranch, 
  Package, 
  Lock,
  Code2
} from 'lucide-react';

const skills = [
  // Row 1: Frontend & Core JS/TS
  { name: 'Next.js' },
  { name: 'React.js' },
  { name: 'JavaScript' },
  { name: 'TypeScript' },
  { name: 'Tailwind CSS' },
  { name: 'Motion' },
  { name: 'Recharts' },
  { name: 'Shadcn UI' },
  { name: 'Zustand' },

  // Row 2: Backend, Database & Auth
  { name: 'Node.js' },
  { name: 'Express.js' },
  { name: 'MongoDB' },
  { name: 'PostgreSQL' },
  { name: 'Firebase' },
  { name: 'Supabase' },
  { name: 'Zod' },
  { name: 'Clerk' },
  { name: 'EJS' },

  // Row 3: Dev Tools & Templating
  { name: 'pnpm' },
  { name: 'Bun' },
  { name: 'Git' },
  { name: 'GitHub' },
  { name: 'Vercel' },
  { name: 'Docker' },
  { name: 'Render' },
  { name: 'Pug' },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  'React.js': Atom,
  'Next.js': () => (
    <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 180 180">
      <circle cx="90" cy="90" r="85" strokeWidth="10" />
      <path d="M140 140L75.5 56.5H65v67h10.5V72L128 140h12z" fill="currentColor" />
    </svg>
  ),
  JavaScript: () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M3 3h18v18H3V3zm10.5 13.5c0-.8.6-1.2 1.4-1.2.6 0 1.1.3 1.4.7l1.2-.8c-.6-.8-1.5-1.3-2.6-1.3-1.8 0-3 1.2-3 2.8 0 2.5 3.5 1.9 3.5 3.1 0 .5-.5.8-1.2.8-.8 0-1.4-.4-1.8-1.1l-1.3.8c.6 1.2 1.7 1.8 3.1 1.8 2 0 3.2-1.1 3.2-2.9 0-2.6-3.5-2-3.5-3.1zM8.3 18.9l1.4-.9c-.4-.7-.8-1.4-.8-2.2v-5.3H7.3v5.4c0 1.2.4 2.2 1 3z" />
    </svg>
  ),
  TypeScript: () => (
    <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="2" strokeWidth="2" />
      <path d="M10 10v4M12 10h4M14 10v7" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  'Tailwind CSS': () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C7.666 17.818 9.027 19 12.001 19c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z" />
    </svg>
  ),
  Motion: Sparkles,
  Recharts: () => (
    <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  'Shadcn UI': () => (
    <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M4 4h16v16H4z" />
      <path d="M4 12h16" />
    </svg>
  ),
  'Node.js': Cpu,
  'Express.js': Flame,
  PostgreSQL: () => (
    <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M12 3a9 9 0 0 0-9 9c0 3.3 1.8 6.2 4.5 7.7.5.3 1.1-.1 1.1-.7v-2.1c0-.5-.3-1-.8-1.2A5.9 5.9 0 0 1 5 12a7 7 0 1 1 12 4.9c-.4.3-.7.8-.7 1.3v1.9c0 .6.6 1 1.1.7 2.7-1.5 4.5-4.4 4.5-7.7a9 9 0 0 0-9-9z" />
    </svg>
  ),
  MongoDB: () => (
    <svg className="w-4 h-4 fill-none stroke-current" viewBox="0 0 24 24" strokeWidth="2">
      <path d="M12 2C8 6 8 13 12 22c4-9 4-16 0-20z" />
      <path d="M12 6a3 3 0 0 1 0 12" />
    </svg>
  ),
  Firebase: Flame,
  Supabase: () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M21.362 9.354H12V.302L2.638 14.646H12v9.052l9.362-14.344z" />
    </svg>
  ),
  Zustand: Box,
  Zod: Shield,
  Clerk: Lock,
  EJS: Code2,
  pnpm: Package,
  Bun: Terminal,
  Git: GitBranch,
  GitHub: () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  ),
  Vercel: () => (
    <svg className="w-4 h-4 fill-current stroke-none" viewBox="0 0 24 24">
      <path d="M24 22.525H0L12 1.737z" />
    </svg>
  ),
  Docker: () => (
    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
      <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.186v1.887c0 .102.083.185.185.185m-2.954-5.43h2.118a.185.185 0 00.186-.186V3.574a.185.185 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.186.186 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.118a.186.186 0 00.186-.186V6.29a.185.185 0 00-.186-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.956 0h2.118a.185.185 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.143a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.886 2.714h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.186v1.887c0 .102.082.185.185.185m-2.93 0h2.118a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H8.1a.185.185 0 00-.185.186v1.887c0 .102.083.185.185.185m-2.956 0h2.118a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.143a.186.186 0 00-.186.186v1.887c0 .102.084.185.186.185m-2.93 0h2.118a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.213a.185.185 0 00-.185.186v1.887c0 .102.083.185.185.185m0-2.714h2.118a.185.185 0 00.185-.186V6.29a.185.185 0 00-.185-.185H2.213a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m21.603 3.633a4.015 4.015 0 00-1.127-.373 5.485 5.485 0 00-1.687-.205c-.179 0-.358.007-.535.021a3.02 3.02 0 00-2.122 1.092l-.089.106a.434.434 0 01-.328.156H.452a.434.434 0 00-.434.434c0 .878.077 1.77.234 2.651a10.026 10.026 0 002.946 5.507A11.758 11.758 0 0011.085 24c4.686 0 8.847-2.723 10.638-6.945a.434.434 0 00-.063-.483 3.864 3.864 0 01-.637-1.116 4.316 4.316 0 01-.207-1.396 3.99 3.99 0 01.329-1.579c.07-.156.149-.31.238-.46a.434.434 0 00-.046-.487z" />
    </svg>
  ),
  Render: Package,
  Pug: Code2,
};

function SkillPill({ skill }: { skill: { name: string } }) {
  const IconComponent = iconMap[skill.name] || Terminal;

  return (
    <motion.div
      whileHover={{ scale: 1.06, y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="flex-shrink-0 flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/[0.15] transition-colors cursor-none backdrop-blur-sm group"
    >
      <span className="text-white/50 group-hover:text-white transition-colors duration-300">
        <IconComponent className="w-4 h-4" />
      </span>
      <span className="text-sm font-semibold text-white/70 group-hover:text-white whitespace-nowrap transition-colors select-none font-sans">
        {skill.name}
      </span>
    </motion.div>
  );
}

export default function TechStack() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  // Split into 3 rows for visual variety
  const row1 = skills.slice(0, 9);
  const row2 = skills.slice(9, 18);
  const row3 = skills.slice(18);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <section id="stack" ref={ref} className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-[#000000]">
      {/* Visual top highlighting line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.04] to-transparent pointer-events-none" />

      {/* Top Side Glass Blur Transition */}
      <div
        className="absolute top-0 left-0 right-0 h-48 z-20 pointer-events-none backdrop-blur-[24px] bg-gradient-to-b from-[#000000] via-[#000000]/30 to-transparent"
        style={{
          maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)',
        }}
      />

      {/* Radial glow */}
      <div className="absolute inset-0 bg-radial-section pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-white/[0.01] blur-[120px] rounded-full pointer-events-none" />

      {/* Premium Warp Background animation */}
      <WarpBackground className="opacity-[0.65] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 flex flex-col items-center"
        >
          {/* Pulsating Micro-typography tag */}
          <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] select-none">
            <span className="w-1 h-1 rounded-full bg-white animate-ping shadow-[0_0_6px_#ffffff]" />
            <span className="font-mono text-[9px] tracking-[0.35em] text-white/50 uppercase">
              Skills
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-[0.95] tracking-tighter uppercase select-none mb-6 flex flex-col items-center">
            <span className="text-white drop-shadow-[0_4px_30px_rgba(255,255,255,0.08)]">
              TECH
            </span>
            <span
              className="mt-1"
              style={{
                WebkitTextStroke: '1.5px rgba(255,255,255,0.7)',
                color: 'transparent',
              }}
            >
              ARSENAL
            </span>
          </h2>
          <p className="text-white/50 text-sm sm:text-base max-w-sm mx-auto font-light leading-relaxed">
            The tools and technologies I reach for when building world-class digital products.
          </p>
        </motion.div>

        {/* Skills Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex flex-col gap-4"
        >
          {/* Row 1 */}
          <div className="flex flex-wrap justify-center gap-3">
            {row1.map((skill) => (
              <motion.div key={skill.name} variants={itemVariants}>
                <SkillPill skill={skill} />
              </motion.div>
            ))}
          </div>
          {/* Row 2 */}
          <div className="flex flex-wrap justify-center gap-3">
            {row2.map((skill) => (
              <motion.div key={skill.name} variants={itemVariants}>
                <SkillPill skill={skill} />
              </motion.div>
            ))}
          </div>
          {/* Row 3 */}
          <div className="flex flex-wrap justify-center gap-3">
            {row3.map((skill) => (
              <motion.div key={skill.name} variants={itemVariants}>
                <SkillPill skill={skill} />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Dynamic running ticker with actual vector icons */}
        <div className="mt-20 overflow-hidden opacity-20 select-none pointer-events-none">
          <div className="flex animate-marquee whitespace-nowrap gap-8">
            {[...skills, ...skills].map((s, i) => {
              const Icon = iconMap[s.name] || Terminal;
              return (
                <span key={i} className="text-xs text-white/50 font-semibold tracking-wider flex-shrink-0 flex items-center gap-2.5 uppercase font-mono">
                  <Icon className="w-3.5 h-3.5" />
                  {s.name} ·
                </span>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Side Glass Blur Transition */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 z-20 pointer-events-none backdrop-blur-[24px] bg-gradient-to-t from-[#000000] via-[#000000]/30 to-transparent"
        style={{
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0) 100%)',
        }}
      />

      <div className="section-divider mt-32 max-w-6xl mx-auto" />
    </section>
  );
}
