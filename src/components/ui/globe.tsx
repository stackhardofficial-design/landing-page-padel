"use client";

import createGlobe, { COBEOptions } from "cobe";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GlobeProps {
  className?: string;
  config?: Partial<COBEOptions>;
}

export function Globe({ className, config }: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const rotTarget = useRef({ phi: 0, theta: 0.25 });
  const rotCurrent = useRef({ phi: 0, theta: 0.25 });

  useEffect(() => {
    let animationFrameId: number;
    let globeInstance: ReturnType<typeof createGlobe> | null = null;

    if (!canvasRef.current) return;

    const width = canvasRef.current.offsetWidth || 500;
    const canvasResolution = Math.min(width * 2, 1200);

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: canvasResolution,
      height: canvasResolution,
      phi: rotCurrent.current.phi,
      theta: rotCurrent.current.theta,
      dark: 1,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.12, 0.14, 0.2],
      markerColor: [0.15, 0.75, 1], // Cyan brillante
      glowColor: [0.15, 0.35, 0.7],
      markers: [
        { location: [-32.8941726, -68.6900863], size: 0.1 }, // Power Padel Mendoza
      ],
      ...config,
    });
    globeInstance = globe;

    const onResize = () => {
      if (!canvasRef.current || !globeInstance) return;
      const newWidth = canvasRef.current.offsetWidth || 500;
      const newResolution = Math.min(newWidth * 2, 1200);
      globeInstance.update({
        width: newResolution,
        height: newResolution,
      });
    };
    window.addEventListener("resize", onResize);

    const animate = () => {
      if (!isDragging.current) {
        rotTarget.current.phi += 0.0035; // Rotación automática suave
      }

      // Interpolación suave (lerp) para una sensación táctil ultra fluida
      rotCurrent.current.phi += (rotTarget.current.phi - rotCurrent.current.phi) * 0.12;
      rotCurrent.current.theta += (rotTarget.current.theta - rotCurrent.current.theta) * 0.12;

      globe.update({
        phi: rotCurrent.current.phi,
        theta: rotCurrent.current.theta,
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    setTimeout(() => {
      if (canvasRef.current) {
        canvasRef.current.style.opacity = "1";
      }
    }, 120);

    return () => {
      cancelAnimationFrame(animationFrameId);
      globe.destroy();
      window.removeEventListener("resize", onResize);
    };
  }, [config]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture(e.pointerId);
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDragging.current) return;

    const deltaX = e.clientX - lastPos.current.x;
    const deltaY = e.clientY - lastPos.current.y;

    lastPos.current = { x: e.clientX, y: e.clientY };

    // Rotación bidireccional libre: horizontal (phi) y vertical (theta)
    rotTarget.current.phi += deltaX * 0.007;

    // Limitar el cabeceo vertical (theta) para que la esfera no se invierta
    const newTheta = rotTarget.current.theta - deltaY * 0.007;
    rotTarget.current.theta = Math.max(-0.45, Math.min(0.45, newTheta));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDragging.current = false;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // Ignorar si el puntero ya fue liberado
    }
    if (canvasRef.current) canvasRef.current.style.cursor = "grab";
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center relative w-full max-w-[500px] aspect-square mx-auto overflow-hidden select-none group",
        className
      )}
    >
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{ touchAction: "none" }}
        className="w-full h-full opacity-0 transition-opacity duration-700 cursor-grab active:cursor-grabbing [contain:layout_paint_size] transition-transform duration-300 group-hover:scale-[1.02]"
      />
    </div>
  );
}

export default Globe;
