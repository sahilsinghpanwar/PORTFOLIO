'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowUpRight,
  GitBranch,
  ExternalLink,
  Cpu,
  Globe,
  Sparkles,
  Atom,
  Braces,
  Flame,
  Database,
  Code2,
  Compass,
  Package,
  Terminal,
  Box,
  Lock,
  Mic,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';


const techIconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  React:           Atom,
  'Next.js':       Globe,
  Vite:            Compass,
  TailwindCSS:     Sparkles,
  'Framer Motion': Sparkles,
  'Node.js':       Cpu,
  'Express.js':    Flame,
  'JWT Auth':      Lock,
  MongoDB:         Database,
  Cloudinary:      Box,
  'Socket.io':     Braces,
  'Gemini AI':     Sparkles,
  'Vapi AI':       Mic,
  Firebase:        Flame,
  Vercel:          Globe,
  Render:          Package,
  TypeScript:      Code2,
  Python:          Terminal,
};


interface ProjectData {
  id: string;
  title: string;
  subtitle: string;
  liveUrl: string;
  sourceUrl: string;
  image: string;
  paragraphs: string[];
  stack: string[];
}

const projectsData: ProjectData[] = [
  {
    id: 'Kanvas',
    title: 'Kanvas',
    subtitle: 'AI-Powered Collaborative Whiteboard',
    liveUrl: 'https://whiteboard-platform.vercel.app',
    sourceUrl: 'https://github.com/sahilsinghpanwar/Whiteboard-platform',
    image: '/projects/whiteboard-preview.png',
    paragraphs: [
      'Kanvas is a full-stack, production-grade collaborative whiteboard built for teams that need to think and build together — in real time. It combines a performant canvas engine, rich drawing primitives, and a deeply integrated Gemini AI assistant into a single seamless workspace.',
      'The backend is powered by Node.js + Express with Socket.io handling live multi-user sync, JWT authentication securing every session, and Cloudinary managing media uploads. The frontend is built with React + Vite + TailwindCSS for snappy load times and fluid interactions. All board state is persisted in MongoDB with efficient delta-sync to minimise bandwidth.',
      'AI capabilities are surfaced through a context-aware chat panel — users can ask Gemini to generate flowcharts, summarise sticky notes, or draft structured content that inserts directly onto the canvas as editable nodes.',
    ],
    stack: [
      'React', 'Vite', 'TailwindCSS', 'Framer Motion',
      'Node.js', 'Express.js', 'JWT Auth',
      'MongoDB', 'Cloudinary',
      'Socket.io', 'Gemini AI',
      'Vercel', 'Render',
    ],
  },
  {
    id: 'mockai',
    title: 'Mock.ai',
    subtitle: 'AI Voice-Powered Mock Interview Platform',
    liveUrl: 'https://mock-interview-seven-swart.vercel.app',
    sourceUrl: 'https://github.com/sahilsinghpanwar/mock-interview',
    image: '/projects/mock-interview-preview.png',
    paragraphs: [
      'Mock.ai is an intelligent voice-interactive mock interview platform designed to help candidates master technical, behavioral, and architectural interviews through realistic AI practice panels.',
      'Integrated with Vapi AI for low-latency conversational voice avatars and Gemini AI for real-time question generation and deep analytical grading. Candidates can converse naturally using their microphone, receive dynamic technical prompts, and get immediate detailed performance reports.',
      'Built using Next.js, React, and TypeScript with Firebase for secure data persistence and user management, styled with Tailwind CSS and Radix UI components, and deployed globally on Vercel.',
    ],
    stack: [
      'Next.js', 'React', 'TypeScript', 'TailwindCSS',
      'Framer Motion', 'Firebase', 'Vapi AI',
      'Gemini AI', 'Node.js', 'Vercel',
    ],
  },
  {
    id: 'resumai',
    title: 'ResumAI',
    subtitle: 'Next-Gen AI Resume Intelligence',
    liveUrl: 'https://ai-resume-builder-pi-orpin.vercel.app/',
    sourceUrl: 'https://github.com/sahilsinghpanwar/Ai-resume_builder',
    image: '/projects/ai-resume-builder-preview.png',
    paragraphs: [
      'ResumAI is an intelligent, automated resume creation platform that helps job seekers write, format, and polish ATS-optimized resumes in under 2 minutes.',
      'Powered by Gemini AI for smart content generation, automated bullet-point enhancement, and real-time resume tailoring. Features a live WYSIWYG preview editor, customizable sections, and high-fidelity PDF export.',
      'Architected with React, Vite, and Tailwind CSS on the frontend, backed by Node.js, Express.js, JWT authentication, and MongoDB for secure data persistence, hosted on Vercel.',
    ],
    stack: [
      'React', 'Vite', 'TailwindCSS', 'Framer Motion',
      'Node.js', 'Express.js', 'JWT Auth',
      'MongoDB', 'Gemini AI', 'Vercel',
    ],
  },
];


interface Particle {
  name: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  angle: number;
  angularVelocity: number;
  r: number;
  mass: number;
  inertia: number;
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
    filter: 'blur(6px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    filter: 'blur(6px)',
    transition: {
      duration: 0.35,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};


export default function Projects() {
  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [imageHovered, setImageHovered] = useState(false);
  const imageRef = useRef<HTMLAnchorElement>(null);

  const activeProject = projectsData[activeProjectIndex];

  const [currentParticles, setCurrentParticles] = useState<string[]>([]);
  const [dimensions, setDimensions] = useState({ width: 400, height: 500 });

  const containerRef    = useRef<HTMLDivElement>(null);
  const badgeRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const particlesRef    = useRef<Particle[]>([]);
  const mouseRef        = useRef({ x: 0, y: 0, active: false });
  const hoveredBadgeRef = useRef<number>(-1);

  const handlePrev = () => {
    setDirection(-1);
    setActiveProjectIndex((prev) => (prev === 0 ? projectsData.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveProjectIndex((prev) => (prev === projectsData.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width:  entry.contentRect.width  || 400,
          height: entry.contentRect.height || 500,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const { width, height } = dimensions;
    if (width <= 0 || height <= 0) return;

    const currentStack = activeProject.stack;
    const radius = width < 640 ? 40 : 48;

    particlesRef.current = currentStack.map((name, idx) => ({
      name,
      x: width / 2 + (Math.random() - 0.5) * 60,
      y: -60 - idx * 45,
      vx: (Math.random() - 0.5) * 1.2,
      vy: 2 + Math.random() * 1.5,
      angle: Math.random() * Math.PI * 2,
      angularVelocity: (Math.random() - 0.5) * 0.08,
      r: radius,
      mass: 1,
      inertia: 0.5 * radius * radius,
    }));
    setCurrentParticles([...currentStack]);
  }, [dimensions.width, activeProjectIndex]);

  useEffect(() => {
    let animId: number;

    const runPhysics = () => {
      if (!containerRef.current || particlesRef.current.length === 0) {
        animId = requestAnimationFrame(runPhysics);
        return;
      }

      const { width, height } = dimensions;
      const centerX = width  / 2;
      const centerY = height / 2;
      const mouse     = mouseRef.current;
      const particles = particlesRef.current;

      for (const p of particles) {
        const dx = centerX - p.x;
        const dy = centerY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > 1) {
          p.vx += (dx / dist) * 0.025;
          p.vy += (dy / dist) * 0.025;
        }
        p.vx += (Math.random() - 0.5) * 0.006;
        p.vy += (Math.random() - 0.5) * 0.006;
      }

      for (let iter = 0; iter < 4; iter++) {
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx  = p2.x - p1.x;
            const dy  = p2.y - p1.y;
            const dist    = Math.sqrt(dx * dx + dy * dy);
            const minDist = p1.r + p2.r + 4;

            if (dist < minDist && dist > 1) {
              const overlap = minDist - dist;
              const nx = dx / dist;
              const ny = dy / dist;

              p1.x -= nx * overlap * 0.5;
              p1.y -= ny * overlap * 0.5;
              p2.x += nx * overlap * 0.5;
              p2.y += ny * overlap * 0.5;

              const rvx = p2.vx - p1.vx;
              const rvy = p2.vy - p1.vy;
              const velAlongNormal = rvx * nx + rvy * ny;

              if (velAlongNormal < 0) {
                const restitution     = 0.5;
                const impulseStrength = -(1 + restitution) * velAlongNormal / (1 / p1.mass + 1 / p2.mass);
                const ix = nx * impulseStrength;
                const iy = ny * impulseStrength;

                p1.vx -= ix / p1.mass;
                p1.vy -= iy / p1.mass;
                p2.vx += ix / p2.mass;
                p2.vy += iy / p2.mass;

                const tx = -ny;
                const ty =  nx;
                const v1t = p1.vx * tx + p1.vy * ty - p1.angularVelocity * p1.r;
                const v2t = p2.vx * tx + p2.vy * ty + p2.angularVelocity * p2.r;
                const relativeTangentVel = v2t - v1t;
                const frictionCoeff   = 0.25;
                const frictionImpulse = -relativeTangentVel * frictionCoeff /
                  (1 / p1.mass + 1 / p2.mass + (p1.r * p1.r) / p1.inertia + (p2.r * p2.r) / p2.inertia);

                p1.vx -= (tx * frictionImpulse) / p1.mass;
                p1.vy -= (ty * frictionImpulse) / p1.mass;
                p2.vx += (tx * frictionImpulse) / p2.mass;
                p2.vy += (ty * frictionImpulse) / p2.mass;
                p1.angularVelocity -= (p1.r * frictionImpulse) / p1.inertia;
                p2.angularVelocity -= (p2.r * frictionImpulse) / p2.inertia;
              }
            }
          }
        }
      }

      // 3. Mouse proximity push
      if (mouse.active) {
        for (const p of particles) {
          const mdx   = p.x - mouse.x;
          const mdy   = p.y - mouse.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          const limit = 100;
          if (mdist < limit && mdist > 1) {
            const force = (limit - mdist) * 0.10;
            const fx = (mdx / mdist) * force;
            const fy = (mdy / mdist) * force;
            p.vx += fx;
            p.vy += fy;
            p.angularVelocity += (mdx * fy - mdy * fx) * 0.0006;
          }
        }
      }

      // 4. Damping, integration, boundary collisions & hover freeze
      const damping      = 0.94;
      const angDamping   = 0.92;
      const wallFriction = 0.06;

      for (let i = 0; i < particles.length; i++) {
        const p        = particles[i];
        const isHovered = hoveredBadgeRef.current === i;

        if (isHovered) {
          p.vx  *= 0.05;
          p.vy  *= 0.05;
          p.angularVelocity *= 0.05;
          p.angle *= 0.85;
        } else {
          p.vx *= damping;
          p.vy *= damping;
          p.angularVelocity *= angDamping;
          p.x += p.vx;
          p.y += p.vy;
          p.angle += p.angularVelocity;

          const pad = p.r;
          if (p.x < pad) {
            p.x = pad; p.vx *= -0.4;
            p.angularVelocity += p.vy * wallFriction / p.r;
          } else if (p.x > width - pad) {
            p.x = width - pad; p.vx *= -0.4;
            p.angularVelocity -= p.vy * wallFriction / p.r;
          }
          if (p.y < pad) {
            p.y = pad; p.vy *= -0.4;
            p.angularVelocity -= p.vx * wallFriction / p.r;
          } else if (p.y > height - pad) {
            p.y = height - pad; p.vy *= -0.4;
            p.angularVelocity += p.vx * wallFriction / p.r;
          }
        }

        const el = badgeRefs.current[i];
        if (el) {
          const posX     = p.x - p.r;
          const posY     = p.y - p.r;
          const angleDeg = (p.angle * 180 / Math.PI) % 360;
          el.style.transform = `translate3d(${posX.toFixed(1)}px,${posY.toFixed(1)}px,0) rotate(${angleDeg.toFixed(1)}deg)`;

          if (isHovered) {
            el.style.background    = 'rgba(255,255,255,0.10)';
            el.style.borderColor   = 'rgba(255,255,255,0.35)';
            el.style.boxShadow     = '0 0 20px rgba(255,255,255,0.12), 0 4px 25px rgba(0,0,0,0.5)';
            el.style.zIndex        = '20';
          } else {
            el.style.background    = '';
            el.style.borderColor   = '';
            el.style.boxShadow     = '';
            el.style.zIndex        = '';
          }
        }
      }

      animId = requestAnimationFrame(runPhysics);
    };

    animId = requestAnimationFrame(runPhysics);
    return () => cancelAnimationFrame(animId);
  }, [dimensions, currentParticles]);

  const handleBadgeClick = (idx: number) => {
    const p = particlesRef.current[idx];
    if (!p) return;
    const angle = Math.random() * Math.PI * 2;
    const speed = 7 + Math.random() * 4;
    p.vx = Math.cos(angle) * speed;
    p.vy = Math.sin(angle) * speed;
    p.angularVelocity = (Math.random() - 0.5) * 0.25;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true };
  };

  const handleMouseLeave = () => { mouseRef.current.active = false; };


  return (
    <section
      id="projects"
      className="relative bg-black py-20 sm:py-28 lg:py-32 overflow-hidden"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-[600px] w-[600px] rounded-full bg-violet-600/5 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-[500px] w-[500px] rounded-full bg-cyan-500/5 blur-[140px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[700px] w-[700px] rounded-full bg-white/[0.015] blur-[160px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-6 sm:px-12">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-mono font-semibold uppercase tracking-widest text-white/50">
                <span className="h-1.5 w-1.5 rounded-full bg-[#a78bfa] animate-pulse" />
                Featured Work
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-white leading-[1.05]">
              What I&apos;ve{' '}
              <span style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)', color: 'transparent' }}>
                Built
              </span>
            </h2>
            <p className="mt-3 max-w-xl text-sm sm:text-base text-white/40 font-light leading-relaxed">
              Explore interactive web platforms built with production-grade full-stack architectures and AI integrations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center gap-4 flex-shrink-0"
          >
            <div className="flex items-center gap-1.5 rounded-2xl border border-white/10 bg-white/[0.03] p-1.5 backdrop-blur-md">
              {projectsData.map((project, idx) => (
                <button
                  key={project.id}
                  onClick={() => {
                    setDirection(idx > activeProjectIndex ? 1 : -1);
                    setActiveProjectIndex(idx);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase transition-all duration-300 ${
                    activeProjectIndex === idx
                      ? 'bg-white text-black shadow-[0_4px_15px_rgba(255,255,255,0.15)]'
                      : 'text-white/40 hover:text-white hover:bg-white/5'
                  }`}
                >
                  0{idx + 1}. {project.title}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous project"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white active:scale-95 transition-all duration-300 cursor-pointer shadow-lg"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next project"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/70 hover:border-white/30 hover:bg-white/10 hover:text-white active:scale-95 transition-all duration-300 cursor-pointer shadow-lg"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </motion.div>
        </div>

        <div className="relative group/carousel">
          <button
            onClick={handlePrev}
            aria-label={`Previous project (${projectsData[(activeProjectIndex - 1 + projectsData.length) % projectsData.length].title})`}
            title={`Previous: ${projectsData[(activeProjectIndex - 1 + projectsData.length) % projectsData.length].title}`}
            className="absolute -left-3 sm:-left-6 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white/80 hover:text-white hover:border-white/50 hover:bg-white/10 hover:scale-110 active:scale-95 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <button
            onClick={handleNext}
            aria-label={`Next project (${projectsData[(activeProjectIndex + 1) % projectsData.length].title})`}
            title={`Next: ${projectsData[(activeProjectIndex + 1) % projectsData.length].title}`}
            className="absolute -right-3 sm:-right-6 top-1/2 -translate-y-1/2 z-30 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-black/80 text-white/80 hover:text-white hover:border-white/50 hover:bg-white/10 hover:scale-110 active:scale-95 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] transition-all duration-300 cursor-pointer"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={activeProject.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              className="grid lg:grid-cols-12 gap-6 lg:gap-12 items-start"
            >

            <div className="col-span-12 lg:col-span-8 flex flex-col h-full">
              <div className="flex flex-col h-full rounded-2xl border border-white/[0.06] bg-white/[0.02] backdrop-blur-md overflow-hidden relative">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />

                <a
                  ref={imageRef}
                  href={activeProject.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${activeProject.title} live demo`}
                  className="group block relative w-full overflow-hidden cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 flex-shrink-0"
                  onMouseEnter={() => setImageHovered(true)}
                  onMouseLeave={() => setImageHovered(false)}
                >
                  <div className="relative w-full overflow-hidden">
                    <img
                      src={activeProject.image}
                      alt={`${activeProject.title} — ${activeProject.subtitle}`}
                      className="w-full h-auto block transition-transform duration-700 ease-out group-hover:scale-[1.02]"
                      onError={(e) => {
                        const img = e.currentTarget;
                        if (!img.dataset.fallback) {
                          img.dataset.fallback = 'true';
                          img.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=1200&auto=format&fit=crop';
                        }
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                    <AnimatePresence>
                      {imageHovered && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-[2px]"
                        >
                          <motion.div
                            initial={{ scale: 0.85 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.85 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-md"
                          >
                            <ExternalLink className="h-3.5 w-3.5 text-white" />
                            <span className="font-mono text-[10px] font-bold tracking-widest uppercase text-white">
                              Open Live Demo
                            </span>
                          </motion.div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-lg border border-white/15 bg-black/70 px-2.5 py-1 backdrop-blur-md">
                      <Globe className="h-2.5 w-2.5 text-[#a78bfa]" />
                      <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-white/80">Live</span>
                    </div>

                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="flex h-6 w-6 items-center justify-center rounded-md border border-white/15 bg-black/60 backdrop-blur-md">
                        <ArrowUpRight className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                </a>

                <div className="flex flex-col flex-1 p-6 gap-4">

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-black tracking-tight text-white uppercase leading-none mb-0.5">
                        {activeProject.title}
                      </h3>
                      <p className="text-[10px] font-mono text-white/35 tracking-wider uppercase">
                        {activeProject.subtitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <a
                        href={activeProject.sourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="View source on GitHub"
                        className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-semibold text-white/60 uppercase tracking-wider hover:border-white/25 hover:bg-white/10 hover:text-white transition-all duration-300 cursor-pointer"
                      >
                        <GitBranch className="h-3 w-3" />
                        Source
                      </a>
                      <a
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Open live demo"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3 py-1.5 text-[10px] font-bold text-black uppercase tracking-wider hover:bg-white/90 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-[0_4px_15px_rgba(255,255,255,0.10)]"
                      >
                        Live Demo
                        <ArrowUpRight className="h-3 w-3" />
                      </a>
                    </div>
                  </div>

                  <div className="h-px w-full bg-white/[0.06]" />

                  <div className="space-y-3">
                    {activeProject.paragraphs.map((paragraph, i) => (
                      <p
                        key={i}
                        className={`text-[13px] leading-relaxed font-light ${
                          i === 0 ? 'text-white/60' : 'text-white/40'
                        }`}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </div>

                </div>
              </div>
            </div>

            <div className="col-span-12 lg:col-span-4 flex flex-col justify-center">

              <div className="w-full flex items-center justify-between mb-4 px-1">
                <span className="text-white text-sm font-bold font-mono tracking-wider uppercase flex items-center gap-2">
                  <Sparkles size={13} className="text-white animate-pulse" />
                  Tech Stack
                </span>
                <span className="text-white/25 text-[10px] font-mono tracking-widest uppercase">
                  {currentParticles.length} technologies
                </span>
              </div>

              <div
                ref={containerRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                className="relative w-full h-[400px] sm:h-[460px] lg:h-[600px] rounded-3xl overflow-hidden bg-black border border-white/[0.06] shadow-[0_20px_50px_rgba(0,0,0,0.8)] cursor-default select-none hover:border-white/15 transition-colors duration-500"
                style={{
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
                  backgroundSize:  '24px 24px',
                }}
              >
                <div className="absolute top-3 left-3  text-[10px] font-mono text-white/20 select-none pointer-events-none">+</div>
                <div className="absolute top-3 right-3 text-[10px] font-mono text-white/20 select-none pointer-events-none">+</div>
                <div className="absolute bottom-3 left-3  text-[10px] font-mono text-white/20 select-none pointer-events-none">+</div>
                <div className="absolute bottom-3 right-3 text-[10px] font-mono text-white/20 select-none pointer-events-none">+</div>

                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30 pointer-events-none z-10" />

                <div className="absolute inset-0 z-0">
                  {currentParticles.map((name, idx) => {
                    const IconComponent = techIconMap[name] || Code2;
                    return (
                      <div
                        key={`${activeProject.id}-${name}`}
                        ref={(el) => { badgeRefs.current[idx] = el; }}
                        onClick={() => handleBadgeClick(idx)}
                        onMouseEnter={() => { hoveredBadgeRef.current = idx; }}
                        onMouseLeave={() => { hoveredBadgeRef.current = -1; }}
                        className="absolute select-none rounded-full bg-white/[0.02] border border-white/10 text-white flex flex-col items-center justify-center gap-1 cursor-pointer pointer-events-auto shadow-[0_4px_25px_rgba(0,0,0,0.5)] backdrop-blur-[3px] active:scale-95 transition-[transform] duration-150 aspect-square group"
                        style={{
                          width:     dimensions.width < 640 ? '80px' : '96px',
                          height:    dimensions.width < 640 ? '80px' : '96px',
                          left:      0,
                          top:       0,
                          transform: 'translate3d(0px,0px,0) rotate(0deg)',
                          padding:   '8px',
                        }}
                      >
                        <IconComponent className="w-4 h-4 text-white/50 group-hover:text-white transition-colors duration-200" />
                        <span className="text-[9px] sm:text-[10px] leading-tight tracking-tight text-white/70 group-hover:text-white max-w-[70px] break-words uppercase font-mono font-bold select-none text-center transition-colors duration-200">
                          {name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
