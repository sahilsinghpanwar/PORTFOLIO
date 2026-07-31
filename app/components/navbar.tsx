'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Home } from 'lucide-react';
import { cn } from '../lib/utils';

const navLinks = [
  { label: 'Home', href: '#hero', icon: true },
  { label: 'About', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('#hero');
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);

      const sections = ['hero', 'about', 'projects', 'contact'];
      let currentActive = '';
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= window.innerHeight * 0.45 && rect.bottom >= window.innerHeight * 0.45) {
            currentActive = '#' + section;
            break;
          }
        }
      }
      
      if (currentActive) {
        setActiveSection(currentActive);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); 
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = (href: string) => {
    document.body.style.overflow = '';
    setMobileOpen(false);
    setTimeout(() => {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 60);
  };

  return (
    <>
      <style>{`
        @keyframes sheen {
          0% { left: -50%; }
          30% { left: 150%; }
          100% { left: 150%; }
        }
        .rounded-inherit {
          border-radius: inherit;
        }
      `}</style>



      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="fixed top-12 inset-x-0 z-50 pointer-events-none"
      >
        <div
          className={cn(
            'mx-auto transition-all duration-500 ease-out pointer-events-auto relative overflow-hidden flex flex-col',
            mobileOpen
              ? 'w-[90%] max-w-[400px] p-5 rounded-3xl bg-black/90 border border-white/[0.08] backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.9)]'
              : scrolled
                ? 'w-fit py-2 px-3 rounded-full bg-black/40 border border-white/[0.08] backdrop-blur-2xl shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),0_20px_50px_rgba(0,0,0,0.9)]'
                : 'w-[92%] sm:w-fit py-3 px-4 sm:px-6 rounded-full bg-black/20 border border-white/[0.04] backdrop-blur-md'
          )}
        >
          <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none rounded-inherit">
            <div className="absolute inset-y-0 w-1/3 -left-[50%] bg-gradient-to-r from-transparent via-white/[0.03] to-transparent skew-x-30 animate-[sheen_4s_linear_infinite]" />
          </div>

          <div className="flex md:hidden items-center justify-between w-full relative z-10 transition-all duration-300">
            <span className="text-white font-mono tracking-widest text-[10px] font-black uppercase">
              SAHIL PANWAR
            </span>
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>

          <nav className="hidden md:flex items-center gap-1.5 relative z-10">
            {navLinks.map((link) => {
              const isActive = activeSection === link.href;
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  onMouseEnter={() => setHoveredLink(link.href)}
                  onMouseLeave={() => setHoveredLink(null)}
                  className="px-5 py-2.5 text-xs font-semibold tracking-wide transition-all duration-300 rounded-full cursor-pointer relative group flex items-center justify-center"
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-white rounded-full z-0 shadow-[0_4px_12px_rgba(255,255,255,0.25)]"
                      transition={{ type: 'spring', stiffness: 350, damping: 28 }}
                    />
                  )}

                  {hoveredLink === link.href && !isActive && (
                    <motion.div
                      layoutId="hoverNavPill"
                      className="absolute inset-0 bg-white/[0.06] rounded-full z-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    />
                  )}

                  <span
                    className={cn(
                      "relative z-10 transition-colors duration-300 font-extrabold tracking-widest uppercase text-[10px] sm:text-xs flex items-center justify-center gap-1.5",
                      isActive ? "text-black" : "text-white/60 group-hover:text-white"
                    )}
                  >
                    {link.icon ? (
                      <Home size={14} className="stroke-[2.5]" />
                    ) : link.label === 'Projects' ? (
                      'Work'
                    ) : (
                      link.label
                    )}
                  </span>
                </button>
              );
            })}
          </nav>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full flex flex-col gap-2 mt-4 relative z-10 md:hidden"
              >
                <div className="h-px bg-white/10 w-full mb-2" />
                {navLinks.map((link, i) => {
                  const isActive = activeSection === link.href;
                  return (
                    <motion.button
                      key={link.href}
                      type="button"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => handleNavClick(link.href)}
                      className={cn(
                        "w-full text-center py-3 text-sm font-bold tracking-widest uppercase rounded-xl cursor-pointer transition-all border flex items-center justify-center gap-2",
                        isActive
                          ? "bg-white text-black border-white shadow-[0_4px_12px_rgba(255,255,255,0.15)]"
                          : "text-white/60 border-transparent hover:bg-white/[0.04] hover:text-white"
                      )}
                    >
                      {link.icon ? (
                        <>
                          <Home size={14} className="stroke-[2.5]" />
                          <span>Home</span>
                        </>
                      ) : link.label === 'Projects' ? (
                        'Work'
                      ) : (
                        link.label
                      )}
                    </motion.button>
                  );
                })}
                

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    </>
  );
}
