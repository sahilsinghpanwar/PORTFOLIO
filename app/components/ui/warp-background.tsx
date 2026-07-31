'use client';

import { motion } from "framer-motion";
import type React from "react";
import { type HTMLAttributes, useCallback, useMemo, useState, useEffect } from "react";
import { cn } from "@/app/lib/utils";

interface WarpBackgroundProps extends HTMLAttributes<HTMLDivElement> {
   perspective?: number;
   beamsPerSide?: number;
   beamSize?: number;
   beamDelayMax?: number;
   beamDelayMin?: number;
   beamDuration?: number;
   gridColor?: string;
}

const Beam = ({
   width,
   x,
   delay,
   duration,
}: {
   width: string | number;
   x: string | number;
   delay: number;
   duration: number;
}) => {
   const ar = Math.floor(Math.random() * 10) + 1;

   // Monochrome & subtle silver-blue high-tech color accents (Optimized for visibility)
   const colors = [
     "linear-gradient(to bottom, rgba(255, 255, 255, 0.18), transparent)",   // Pure silver
     "linear-gradient(to bottom, rgba(255, 255, 255, 0.28), transparent)",   // Titanium
     "linear-gradient(to bottom, rgba(255, 255, 255, 0.10), transparent)",   // Soft ghost white
     "linear-gradient(to bottom, rgba(147, 197, 253, 0.14), transparent)",   // Subtle cyber blue
     "linear-gradient(to bottom, rgba(196, 181, 253, 0.14), transparent)",   // Subtle digital violet
   ];
   const background = useMemo(() => colors[Math.floor(Math.random() * colors.length)], []);

   return (
      <motion.div
         style={
            {
               "--x": `${x}`,
               "--width": `${width}`,
               "--aspect-ratio": `${ar}`,
               "--background": background,
            } as React.CSSProperties
         }
         className="absolute left-[var(--x)] top-0 [aspect-ratio:1/var(--aspect-ratio)] [background:var(--background)] [width:var(--width)]"
         initial={{ y: "100cqmax", x: "-50%" }}
         animate={{ y: "-100%", x: "-50%" }}
         transition={{
            duration,
            delay,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
         }}
      />
   );
};

export const WarpBackground: React.FC<WarpBackgroundProps> = ({
   perspective = 100,
   className,
   beamsPerSide = 3,
   beamSize = 5,
   beamDelayMax = 3,
   beamDelayMin = 0,
   beamDuration = 4, // Slightly slower and more professional
   gridColor = "rgba(255, 255, 255, 0.075)", // Visible elegant white grid lines
   ...props
}) => {
   const [mounted, setMounted] = useState(false);
   useEffect(() => {
      setMounted(true);
   }, []);

   const generateBeams = useCallback(() => {
      const beams = [];
      const cellsPerSide = Math.floor(100 / beamSize);
      const step = cellsPerSide / beamsPerSide;

      for (let i = 0; i < beamsPerSide; i++) {
         const x = Math.floor(i * step);
         const delay =
            Math.random() * (beamDelayMax - beamDelayMin) + beamDelayMin;
         beams.push({ x, delay });
      }
      return beams;
   }, [beamsPerSide, beamSize, beamDelayMax, beamDelayMin]);

   const topBeams = useMemo(() => generateBeams(), [generateBeams]);
   const rightBeams = useMemo(() => generateBeams(), [generateBeams]);
   const bottomBeams = useMemo(() => generateBeams(), [generateBeams]);
   const leftBeams = useMemo(() => generateBeams(), [generateBeams]);

   return (
      <div
         style={
            {
               "--perspective": `${perspective}px`,
               "--grid-color": gridColor,
               "--beam-size": `${beamSize}%`,
            } as React.CSSProperties
         }
         className={cn(
            "pointer-events-none absolute inset-0 size-full overflow-hidden [clip-path:inset(0)] [container-type:size] [perspective:var(--perspective)] [transform-style:preserve-3d]",
            className
         )}
         {...props}
      >
         <div className="absolute [transform-style:preserve-3d] [background-size:var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] [container-type:inline-size] [height:100cqmax] [transform-origin:50%_0%] [transform:rotateX(-90deg)] [width:100cqi]">
            {mounted && topBeams.map((beam, index) => (
               <Beam
                  key={`top-${index}`}
                  width={`${beamSize}%`}
                  x={`${beam.x * beamSize}%`}
                  delay={beam.delay}
                  duration={beamDuration}
               />
            ))}
         </div>
         <div className="absolute top-full [transform-style:preserve-3d] [background-size:var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] [container-type:inline-size] [height:100cqmax] [transform-origin:50%_0%] [transform:rotateX(-90deg)] [width:100cqi]">
            {mounted && bottomBeams.map((beam, index) => (
               <Beam
                  key={`bottom-${index}`}
                  width={`${beamSize}%`}
                  x={`${beam.x * beamSize}%`}
                  delay={beam.delay}
                  duration={beamDuration}
               />
            ))}
         </div>
         <div className="absolute left-0 top-0 [transform-style:preserve-3d] [background-size:var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] [container-type:inline-size] [height:100cqmax] [transform-origin:0%_0%] [transform:rotate(90deg)_rotateX(-90deg)] [width:100cqh]">
            {mounted && leftBeams.map((beam, index) => (
               <Beam
                  key={`left-${index}`}
                  width={`${beamSize}%`}
                  x={`${beam.x * beamSize}%`}
                  delay={beam.delay}
                  duration={beamDuration}
               />
            ))}
         </div>
         <div className="absolute right-0 top-0 [transform-style:preserve-3d] [background-size:var(--beam-size)_var(--beam-size)] [background:linear-gradient(var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_-0.5px_/var(--beam-size)_var(--beam-size),linear-gradient(90deg,_var(--grid-color)_0_1px,_transparent_1px_var(--beam-size))_50%_50%_/var(--beam-size)_var(--beam-size)] [container-type:inline-size] [height:100cqmax] [width:100cqh] [transform-origin:100%_0%] [transform:rotate(-90deg)_rotateX(-90deg)]">
            {mounted && rightBeams.map((beam, index) => (
               <Beam
                  key={`right-${index}`}
                  width={`${beamSize}%`}
                  x={`${beam.x * beamSize}%`}
                  delay={beam.delay}
                  duration={beamDuration}
               />
            ))}
         </div>
      </div>
   );
};
