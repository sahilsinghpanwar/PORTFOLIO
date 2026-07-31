'use client';

import { motion } from 'framer-motion';
import { X, Mail, Link2, GitBranch, ArrowUpRight } from 'lucide-react';

const socials = [
  {
    label: 'X / Twitter',
    handle: '@SahilPanwa83j0',
    href: 'https://x.com/SahilPanwa83j0',
    icon: X,
  },
  {
    label: 'Email',
    handle: 'sahilpanwar0211@gmail.com',
    href: 'mailto:sahilpanwar0211@gmail.com',
    icon: Mail,
  },
  {
    label: 'LinkedIn',
    handle: 'Sahil Panwar',
    href: 'https://www.linkedin.com/in/sahil-singh-panwar-3870112a7/',
    icon: Link2,
  },
  {
    label: 'GitHub',
    handle: 'github.com/sahilsinghpanwar',
    href: 'https://github.com/sahilsinghpanwar',
    icon: GitBranch,
  },
];

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Tech Stack', href: '#stack' },
  { label: 'Contact', href: '#contact' },
];

export default function Footer() {
  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="relative border-t border-white/[0.06] bg-[#000000] overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      <div className="absolute inset-y-0 left-12 w-px bg-white/[0.02] pointer-events-none hidden lg:block" />
      <div className="absolute inset-y-0 right-12 w-px bg-white/[0.02] pointer-events-none hidden lg:block" />

      <div className="max-w-6xl mx-auto px-6 pt-10 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
          
          <div className="md:col-span-5 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center gap-3 mb-4 group cursor-none w-fit">
                <div className="w-9 h-9 rounded-full border border-white/20 bg-white/5 flex items-center justify-center transition-all duration-300 group-hover:bg-white group-hover:border-white">
                  <span className="text-white font-mono text-xs font-black tracking-widest uppercase transition-colors duration-300 group-hover:text-black">
                    SP
                  </span>
                </div>
                <span className="font-mono text-sm font-black tracking-[0.2em] text-white uppercase">
                  SAHIL PANWAR
                </span>
              </div>
              
              <p className="text-white/50 text-sm sm:text-base leading-relaxed max-w-sm font-light">
                Full Stack Developer specialized in engineering elite, high-performance web products and immersive digital experiences. Available for creative partnerships worldwide.
              </p>
            </div>

            <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/10 bg-white/[0.03] mt-6 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#a78bfa] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#a78bfa]"></span>
              </span>
              <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] text-[#a78bfa] font-bold uppercase">
                Open to Opportunities
              </span>
            </div>
          </div>

          <div className="md:col-span-3 md:pl-8">
            <p className="font-mono text-xs font-bold tracking-[0.25em] text-white/40 uppercase mb-5">
              Navigation
            </p>
            <nav className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollToSection(link.href)}
                  className="text-left font-mono text-xs sm:text-sm tracking-[0.18em] font-bold text-white/60 hover:text-white transition-all flex items-center gap-3 group cursor-none uppercase w-fit"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/30 group-hover:bg-white group-hover:scale-125 transition-all duration-300" />
                  {link.label === 'Tech Stack' ? 'STACK' : link.label.toUpperCase()}
                </button>
              ))}
            </nav>
          </div>

          <div className="md:col-span-4">
            <p className="font-mono text-xs font-bold tracking-[0.25em] text-white/40 uppercase mb-5">
              Connect
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-2.5">
              {socials.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/15 text-white/60 hover:text-white transition-all duration-300 group cursor-none"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border border-white/10 bg-white/[0.03] flex items-center justify-center group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
                        <Icon size={14} className="transition-transform group-hover:scale-110" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-mono tracking-widest text-white/40 uppercase group-hover:text-white/60 transition-colors leading-none mb-1">
                          {social.label}
                        </p>
                        <p className="text-xs sm:text-sm font-semibold text-white/80 group-hover:text-white transition-colors truncate">
                          {social.handle}
                        </p>
                      </div>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="text-white/30 group-hover:text-white transition-all duration-300 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-center pt-6 border-t border-white/10 font-mono text-[10px] sm:text-xs tracking-[0.18em] text-white/50 uppercase text-center">
          <p>© {new Date().getFullYear()} SAHIL PANWAR. ALL RIGHTS RESERVED.</p>
        </div>
      </div>
    </footer>
  );
}
