'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MagneticText } from '@/app/components/ui/morphing-cursor';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const cursorX = useSpring(mouseX, { stiffness: 450, damping: 35 });
  const cursorY = useSpring(mouseY, { stiffness: 450, damping: 35 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '16%']);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.06]);
  const bgOpacity = useTransform(scrollYProgress, [0, 0.85], [0.4, 0]);

  const contentY = useTransform(scrollYProgress, [0, 1], ['0px', '-90px']);
  const contentScale = useTransform(scrollYProgress, [0, 0.7], [1, 0.95]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  const maskVariants = {
    hidden: { clipPath: 'inset(50% 0% 50% 0%)' },
    visible: {
      clipPath: 'inset(0% 0% 0% 0%)',
      transition: { duration: 1.4, ease: [0.76, 0, 0.24, 1] as const, delay: 0.5 },
    },
  };

  return (
    <section
      id="hero"
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative min-h-screen bg-[#000000] text-white flex flex-col justify-between py-12 px-6 sm:px-12 overflow-hidden select-none cursor-none"
    >
      <motion.div
        style={{ y: bgY, scale: bgScale, opacity: bgOpacity }}
        className="absolute inset-0 z-0 pointer-events-none overflow-hidden select-none"
      >
        <img
          src="/background.jpg"
          alt="Halftone Digital Wave"
          className="w-full h-full object-cover object-center"
        />

        <div 
          className="absolute inset-0 z-1 pointer-events-none opacity-[0.4]"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(255, 255, 255, 0.4) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.4) 1px, transparent 1px)
            `,
            backgroundSize: '100px 100px',
          }}
        />

        <div className="absolute inset-0 bg-radial-vignette bg-gradient-to-b from-[#000000]/80 via-transparent to-[#000000] z-10" />
        
        <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-[#000000] to-transparent z-10" />
        <div className="absolute top-0 inset-x-0 h-48 bg-gradient-to-b from-[#000000] to-transparent z-10" />
        
      </motion.div>

      <div
        className="absolute bottom-0 left-0 right-0 h-64 z-20 pointer-events-none backdrop-blur-[24px] bg-gradient-to-t from-[#000000] via-[#000000]/85 to-transparent"
        style={{
          maskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)',
          WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,1) 0%, rgba(0,0,0,0.8) 50%, rgba(0,0,0,0) 100%)',
        }}
      />

      <div className="pt-6 relative z-10" />

      <motion.div
        style={{ y: contentY, scale: contentScale, opacity: contentOpacity }}
        className="relative z-10 flex-1 flex flex-col items-center justify-start pt-8 sm:pt-14 lg:pt-16 pb-8 w-full max-w-5xl mx-auto"
      >
        <motion.div
          variants={maskVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.8 }}
            className="mb-3 sm:mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03]"
          >
            <span className="w-1 h-1 rounded-full bg-white animate-ping shadow-[0_0_6px_#ffffff]" />
            <span className="font-mono text-[9px] tracking-[0.35em] text-white/50 uppercase">
              Hey, I&apos;m
            </span>
          </motion.div>

          <div className="flex flex-col items-center mb-6 sm:mb-8 w-full overflow-visible">
            <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl xl:text-[9.5rem] font-black leading-[0.88] tracking-tight uppercase flex flex-col select-none items-center text-center px-4 overflow-visible">
              <span className="text-white drop-shadow-[0_4px_30px_rgba(255,255,255,0.08)] px-2">
                SAHIL
              </span>
              <span
                className="mt-1 sm:mt-2 px-3 inline-block"
                style={{
                  WebkitTextStroke: '1.5px rgba(255,255,255,0.7)',
                  color: 'transparent',
                }}
              >
                PANWAR
              </span>
            </h1>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
            className="flex flex-col items-center gap-1.5 text-center mt-2"
          >
            <MagneticText
              text="FULL STACK"
              hoverText="FULL STACK"
              className="cursor-none"
              textClassName="text-white/80 text-lg sm:text-2xl md:text-3xl font-black tracking-tight uppercase text-center w-full block"
              hoverTextClassName="text-black text-lg sm:text-2xl md:text-3xl font-black tracking-tight uppercase text-center w-full block"
              circleClassName="bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              circleWidth={50}
              circleHeight={50}
            />
            <MagneticText
              text="DEVELOPER"
              hoverText="DEVELOPER"
              className="cursor-none"
              textClassName="text-lg sm:text-2xl md:text-3xl font-black tracking-tight uppercase text-center w-full block"
              hoverTextClassName="text-black text-lg sm:text-2xl md:text-3xl font-black tracking-tight uppercase text-center w-full block"
              circleClassName="bg-white shadow-[0_0_20px_rgba(255,255,255,0.4)]"
              circleWidth={50}
              circleHeight={50}
              style={{ WebkitTextStroke: '1px rgba(255,255,255,0.6)', color: 'transparent', textAlign: 'center' } as React.CSSProperties}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5, ease: 'easeOut' }}
            className="mt-6 sm:mt-8 flex flex-col items-center gap-5 text-center"
          >
            <p className="text-sm sm:text-base md:text-lg text-white/50 max-w-xl font-light tracking-wide leading-relaxed text-center px-4">
              I build and craft digital experiences<br className="hidden sm:inline" />
              that deliver real impact.
            </p>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-white text-[#000000] font-bold text-[10px] sm:text-xs uppercase tracking-widest hover:bg-white/95 hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_4px_30px_rgba(255,255,255,0.2)] group cursor-none"
            >
              Let&apos;s Connect
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.6, ease: 'easeOut' }}
        className="relative z-30 w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-t border-white/20 pt-8 font-mono text-[9px] sm:text-[10px] tracking-[0.2em] text-white uppercase"
      >
        <a
          href="mailto:sahilpanwar0211@gmail.com"
          className="text-white hover:text-[#a78bfa] transition-colors duration-300 cursor-pointer flex items-center gap-1.5 group"
        >
          sahilpanwar0211@gmail.com
          <ArrowRight size={11} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300" />
        </a>
        <div className="flex gap-8 text-white">
          <span>ROLE / FULL STACK DEVELOPER</span>
          <span>© 2026 EDITION</span>
        </div>
      </motion.div>

      <AnimatePresence>
        {isHovered && (
          <motion.div
            style={{ x: cursorX, y: cursorY, translateX: '-50%', translateY: '-50%' }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="pointer-events-none fixed top-0 left-0 z-50 hidden md:flex items-center gap-2"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="drop-shadow-[0_0_8px_#ffffff]">
              <path d="M4 3L20 11L13 13L11 20L4 3Z" fill="#ffffff" stroke="#000000" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
        
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
