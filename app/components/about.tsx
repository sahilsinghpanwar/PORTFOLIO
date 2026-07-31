'use client';

import { motion, useInView, Variants } from 'framer-motion';
import { useRef } from 'react';
import { InteractiveGlobe } from './ui/interactive-globe';


const fadeInUp: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const stagger: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.15 } },
};

const fadeIn: Variants = {
  hidden:  { opacity: 0, scale: 0.96 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.9, ease: 'easeOut' } },
};



export default function About() {
  const ref      = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" ref={ref} className="relative py-20 sm:py-28 lg:py-32 overflow-hidden bg-black">

      <div className="max-w-6xl mx-auto px-6 relative z-10">

        {/* Section label */}
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-8 h-px bg-white/30" />
          <span className="text-white/40 text-xs font-semibold tracking-widest uppercase">
            About Me
          </span>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid lg:grid-cols-2 gap-16 items-center"
        >
          <div className="space-y-8">
            <motion.h2
              variants={fadeInUp}
              className="text-4xl sm:text-5xl font-black text-white leading-tight"
            >
              Get to{' '}
              <span className="gradient-text">Know me</span>
            </motion.h2>

            {/* Tagline */}
            <motion.p variants={fadeInUp} className="text-white/70 text-xl font-medium leading-snug italic">
              Turning ideas into fast, modern, and impactful digital products.
            </motion.p>

            {/* Description */}
            <motion.p variants={fadeInUp} className="text-white/50 text-base leading-relaxed">
              I am a Full Stack Developer with a strong interest in building
              high-performance web applications that combine clean design with
              efficient functionality. From intuitive user interfaces to
              scalable backend architectures, I enjoy solving real-world
              problems through code and continuously improving my technical
              skills by working on challenging projects.
            </motion.p>
          </div>

          <motion.div
            variants={fadeIn}
            className="flex items-center justify-center"
          >
            <InteractiveGlobe size={460} />
          </motion.div>
        </motion.div>
      </div>

      <div className="section-divider mt-32 max-w-6xl mx-auto" />
    </section>
  );
}
