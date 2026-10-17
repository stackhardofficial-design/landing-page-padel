"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
  useInView,
} from "framer-motion";

/* ============================================================================
   1. PRELOADER CINEMATOGRÁFICO DE INGENIERÍA ($20K AGENCY GRADE)
   ============================================================================ */
export function LuxuryPreloader() {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 22) + 14;
      if (current >= 100) {
        setProgress(100);
        clearInterval(interval);
        setTimeout(() => setIsDone(true), 260);
      } else {
        setProgress(current);
      }
    }, 55);

    return () => clearInterval(interval);
  }, []);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="luxury-preloader"
          initial={{ opacity: 1 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[9999] bg-neutral-950 text-white flex flex-col justify-between p-6 sm:p-12 select-none pointer-events-auto border-b border-sky-500/30"
        >
          {/* Barra superior de telemetría */}
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-[0.28em] text-neutral-400">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
              POWER PADEL CLUB • MENDOZA
            </span>
            <span className="hidden sm:inline">
              FIP STANDARD 20x10M • 800 LUX LED
            </span>
            <span>SYS // INIT</span>
          </div>

          {/* Centro tipográfico */}
          <div className="my-auto max-w-4xl">
            <div className="overflow-hidden mb-3">
              <motion.span
                initial={{ y: "100%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-block text-xs font-mono uppercase tracking-[0.3em] text-sky-400 font-bold"
              >
                INGENIERÍA EN CARBONO & COMPLEJO PANORÁMICO
              </motion.span>
            </div>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-4xl sm:text-7xl font-extrabold uppercase tracking-tight leading-none text-white"
              >
                POWER PADEL
              </motion.h2>
            </div>
          </div>

          {/* Contador numérico gigante e indicador de carga */}
          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-neutral-400 space-y-1">
                <p>CALIBRANDO PLANO 3D ISOMÉTRICO...</p>
                <p className="text-sky-400">GPS: -32.8941726, -68.6900863</p>
              </div>
              <div className="font-mono text-5xl sm:text-7xl font-black tracking-tighter text-white leading-none">
                {String(progress).padStart(2, "0")}
                <span className="text-sky-400 text-2xl sm:text-4xl">%</span>
              </div>
            </div>
            <div className="w-full h-[2px] bg-neutral-800 overflow-hidden">
              <motion.div
                className="h-full bg-sky-400"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.15, ease: "linear" }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ============================================================================
   2. CURSOR PERSONALIZADO CON FÍSICA Y DETECCIÓN CONTEXTUAL (data-cursor)
   ============================================================================ */
export function CustomCursor() {
  const [isFinePointer, setIsFinePointer] = useState(false);
  const [cursorLabel, setCursorLabel] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const dotX = useSpring(mouseX, { stiffness: 750, damping: 35 });
  const dotY = useSpring(mouseY, { stiffness: 750, damping: 35 });
  const ringX = useSpring(mouseX, { stiffness: 240, damping: 24 });
  const ringY = useSpring(mouseY, { stiffness: 240, damping: 24 });

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine)");
    setIsFinePointer(media.matches);
    if (!media.matches) return;

    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorEl = target.closest("[data-cursor]") as HTMLElement | null;
      const interactiveEl = target.closest("a, button, input, [role='button']");

      if (cursorEl) {
        setCursorLabel(cursorEl.getAttribute("data-cursor") || "");
        setIsHovered(true);
      } else if (interactiveEl) {
        setCursorLabel("");
        setIsHovered(true);
      } else {
        setCursorLabel("");
        setIsHovered(false);
      }
    };

    const handleDown = () => setIsPressed(true);
    const handleUp = () => setIsPressed(false);

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mousedown", handleDown, { passive: true });
    window.addEventListener("mouseup", handleUp, { passive: true });
    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
    };
  }, [mouseX, mouseY]);

  if (!isFinePointer) return null;

  return (
    <>
      {/* Punto de precisión central */}
      <motion.div
        style={{ x: dotX, y: dotY }}
        className={`fixed top-0 left-0 z-[999] pointer-events-none -translate-x-1/2 -translate-y-1/2 rounded-full transition-transform duration-150 ${
          cursorLabel
            ? "w-0 h-0 opacity-0"
            : "w-2 h-2 bg-sky-400 mix-blend-difference"
        }`}
      />

      {/* Anillo / Píldora magnética contextual */}
      <motion.div
        style={{ x: ringX, y: ringY }}
        animate={{
          width: cursorLabel ? 108 : isHovered ? 50 : 32,
          height: cursorLabel ? 34 : isHovered ? 50 : 32,
          scale: isPressed ? 0.88 : 1,
          borderRadius: 999,
        }}
        transition={{ type: "spring", stiffness: 320, damping: 24 }}
        className={`fixed top-0 left-0 z-[998] pointer-events-none -translate-x-1/2 -translate-y-1/2 flex items-center justify-center transition-colors duration-200 ${
          cursorLabel
            ? "bg-sky-400 text-neutral-950 shadow-[0_10px_30px_rgba(56,189,248,0.45)] border border-white/50"
            : isHovered
            ? "border border-sky-400 bg-sky-400/10 backdrop-blur-[2px]"
            : "border border-white/40 mix-blend-difference"
        }`}
      >
        {cursorLabel && (
          <motion.span
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-[9px] font-mono font-black uppercase tracking-[0.18em] whitespace-nowrap px-2.5 flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-neutral-950" />
            {cursorLabel}
          </motion.span>
        )}
      </motion.div>
    </>
  );
}

/* ============================================================================
   3. REVELADO DE IMAGEN CON CORTINA FLUIDA + PARALLAX INTERNO ROBUSTO
   ============================================================================ */
interface RevealImageProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  parallaxOffset?: number;
  delay?: number;
  cursorText?: string;
}

export function RevealImage({
  src,
  alt,
  className = "",
  imgClassName = "",
  parallaxOffset = 22,
  delay = 0,
  cursorText,
}: RevealImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${parallaxOffset}px`, `${parallaxOffset}px`]
  );

  return (
    <div
      ref={containerRef}
      data-cursor={cursorText}
      className={`relative overflow-hidden bg-neutral-900 ${className}`}
    >
      {/* Cortina doble de ingeniería que se retira */}
      <motion.div
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration: 0.75,
          delay,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{ transformOrigin: "bottom" }}
        className="absolute inset-0 z-20 bg-neutral-950 pointer-events-none"
      />
      <motion.div
        initial={{ scaleY: 1 }}
        whileInView={{ scaleY: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration: 0.6,
          delay: delay + 0.08,
          ease: [0.76, 0, 0.24, 1],
        }}
        style={{ transformOrigin: "bottom" }}
        className="absolute inset-0 z-20 bg-sky-500/80 pointer-events-none"
      />

      {/* Contenedor de la imagen con escala y entrada suave */}
      <motion.div
        initial={{ scale: 1.14, opacity: 0.85 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          duration: 1.05,
          delay: delay + 0.05,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="w-full h-full relative"
      >
        <motion.img
          style={{ y }}
          src={src}
          alt={alt}
          className={`w-full h-full object-cover scale-[1.08] transition-transform duration-700 ease-out group-hover:scale-[1.13] ${imgClassName}`}
        />
      </motion.div>
    </div>
  );
}

/* ============================================================================
   4. SPLIT-TEXT REVEAL (TÍTULOS EMERGIENDO DESDE MÁSCARA INFERIOR)
   ============================================================================ */
interface SplitTextRevealProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "span";
  delay?: number;
}

export function SplitTextReveal({
  text,
  className = "",
  as: Tag = "h2",
  delay = 0,
}: SplitTextRevealProps) {
  const words = text.split(" ");

  return (
    <Tag className={`font-display ${className}`}>
      {words.map((word, idx) => (
        <span
          key={`${word}-${idx}`}
          className="inline-block overflow-hidden align-bottom mr-[0.26em] pb-1"
        >
          <motion.span
            initial={{ y: "115%", rotateZ: 2.5, opacity: 0 }}
            whileInView={{ y: "0%", rotateZ: 0, opacity: 1 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{
              duration: 0.72,
              delay: delay + idx * 0.04,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="inline-block will-change-transform"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Tag>
  );
}

/* ============================================================================
   5. TARJETA 3D INTERACTIVA CON TILT + SPOTLIGHT RADIAL SIGUIENDO EL CURSOR
   ============================================================================ */
interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  cursorText?: string;
  onClick?: () => void;
  glareColor?: string;
  maxTilt?: number;
}

export function TiltCard({
  children,
  className = "",
  cursorText,
  onClick,
  glareColor = "rgba(14, 165, 233, 0.16)",
  maxTilt = 5,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  const mousePxX = useMotionValue(0);
  const mousePxY = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 260, damping: 25 });
  const springY = useSpring(y, { stiffness: 260, damping: 25 });

  const rotateX = useTransform(springY, [0, 1], [maxTilt, -maxTilt]);
  const rotateY = useTransform(springX, [0, 1], [-maxTilt, maxTilt]);

  const glareBackground = useMotionTemplate`radial-gradient(440px circle at ${mousePxX}px ${mousePxY}px, ${glareColor}, transparent 80%)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const pxX = e.clientX - rect.left;
    const pxY = e.clientY - rect.top;
    mousePxX.set(pxX);
    mousePxY.set(pxY);
    x.set(pxX / rect.width);
    y.set(pxY / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      data-cursor={cursorText}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative group ${className}`}
    >
      {/* Brillo radial dinámico que sigue el puntero */}
      <motion.div
        style={{ background: glareBackground }}
        className="pointer-events-none absolute inset-0 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />
      {children}
    </motion.div>
  );
}

/* ============================================================================
   6. BOTÓN MAGNÉTICO CON ATRACCIÓN AL CURSOR
   ============================================================================ */
interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
  className?: string;
}

export function Magnetic({
  children,
  strength = 0.25,
  className = "",
}: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 200, damping: 16, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 200, damping: 16, mass: 0.5 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
}

/* ============================================================================
   7. CONTADOR NUMÉRICO ANIMADO CON FÍSICA SPRING (ODÓMETRO DE PRECISIÓN)
   ============================================================================ */
interface AnimatedCounterProps {
  value: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
  className = "",
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });
  const motionVal = useMotionValue(0);
  const springVal = useSpring(motionVal, {
    stiffness: 75,
    damping: 20,
    restDelta: 0.5,
  });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      motionVal.set(value);
    }
  }, [isInView, value, motionVal]);

  useEffect(() => {
    const unsubscribe = springVal.on("change", (latest) => {
      setDisplay(Math.round(latest));
    });
    return () => unsubscribe();
  }, [springVal]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString("es-AR")}
      {suffix}
    </span>
  );
}

/* ============================================================================
   8. GRÁFICO RADAR DE TELEMETRÍA SVG PARA PALAS POWER PADEL
   ============================================================================ */
interface RadarTelemetryProps {
  power: number;
  control: number;
  rebound: number;
  spin?: number;
  sweetspot?: number;
  dark?: boolean;
}

export function RadarTelemetry({
  power,
  control,
  rebound,
  spin = 92,
  sweetspot = 90,
  dark = false,
}: RadarTelemetryProps) {
  const size = 210;
  const center = size / 2;
  const radius = 72;

  const metrics = [
    { label: "POTENCIA", value: power },
    { label: "CONTROL", value: control },
    { label: "REBOTE", value: rebound },
    { label: "EFECTO 3D", value: spin },
    { label: "PUNTO DULCE", value: sweetspot },
  ];

  const getPoint = (index: number, pct: number) => {
    const angle = (Math.PI * 2 * index) / metrics.length - Math.PI / 2;
    const r = (pct / 100) * radius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return `${x},${y}`;
  };

  const polygonPoints = metrics
    .map((m, idx) => getPoint(idx, m.value))
    .join(" ");

  return (
    <div className="flex flex-col items-center justify-center">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Anillos concéntricos de referencia */}
        {[25, 50, 75, 100].map((lvl) => (
          <polygon
            key={lvl}
            points={metrics.map((_, idx) => getPoint(idx, lvl)).join(" ")}
            fill="none"
            stroke={dark ? "rgba(255,255,255,0.12)" : "rgba(9,9,11,0.12)"}
            strokeWidth="1"
            strokeDasharray={lvl === 100 ? "none" : "2 2"}
          />
        ))}

        {/* Ejes radiales */}
        {metrics.map((_, idx) => {
          const end = getPoint(idx, 100).split(",");
          return (
            <line
              key={idx}
              x1={center}
              y1={center}
              x2={end[0]}
              y2={end[1]}
              stroke={dark ? "rgba(255,255,255,0.12)" : "rgba(9,9,11,0.12)"}
              strokeWidth="1"
            />
          );
        })}

        {/* Polígono activo de telemetría */}
        <motion.polygon
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          points={polygonPoints}
          fill="rgba(14, 165, 233, 0.26)"
          stroke="#0ea5e9"
          strokeWidth="2.2"
          style={{ transformOrigin: `${center}px ${center}px` }}
        />

        {/* Puntos de vértice y etiquetas */}
        {metrics.map((m, idx) => {
          const [px, py] = getPoint(idx, m.value).split(",").map(Number);
          const [lx, ly] = getPoint(idx, 126).split(",").map(Number);
          return (
            <g key={m.label}>
              <circle
                cx={px}
                cy={py}
                r="3.5"
                fill="#0ea5e9"
                stroke={dark ? "#09090b" : "#ffffff"}
                strokeWidth="1.5"
              />
              <text
                x={lx}
                y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                className="font-mono text-[8px] font-bold uppercase tracking-wider"
                fill={dark ? "#d4d4d8" : "#27272a"}
              >
                {m.label} ({m.value})
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
