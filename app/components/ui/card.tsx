'use client';

import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

export function Card({ children, className, hover = true, glow = false }: CardProps) {
  return (
    <motion.div
      whileHover={hover ? { y: -4, scale: 1.01 } : {}}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={cn(
        'glass-card rounded-2xl relative overflow-hidden',
        glow && 'animate-pulse-glow',
        className
      )}
    >
      {/* Subtle inner gradient top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
      {children}
    </motion.div>
  );
}
