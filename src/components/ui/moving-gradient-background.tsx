"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

export const MovingGradientBackground = ({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    const drawGradient = (currentTime: number) => {
      time = currentTime * 0.0002;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Create base gradient
      const baseGradient = ctx.createLinearGradient(
        0,
        0,
        canvas.width,
        canvas.height
      );
      baseGradient.addColorStop(0, "rgba(23, 23, 23, 1)"); // Dark background
      baseGradient.addColorStop(1, "rgba(38, 38, 38, 1)"); // Slightly lighter dark

      ctx.fillStyle = baseGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Create animated accent gradients
      const gradientSize = Math.min(canvas.width, canvas.height) * 0.8;

      // First accent gradient (purple-blue)
      const gradient1 = ctx.createRadialGradient(
        canvas.width * (0.5 + Math.sin(time) * 0.1),
        canvas.height * (0.3 + Math.cos(time * 0.8) * 0.1),
        0,
        canvas.width * (0.5 + Math.sin(time) * 0.1),
        canvas.height * (0.3 + Math.cos(time * 0.8) * 0.1),
        gradientSize
      );
      gradient1.addColorStop(0, "rgba(79, 70, 229, 0.08)"); // Indigo
      gradient1.addColorStop(0.5, "rgba(67, 56, 202, 0.05)"); // Darker indigo
      gradient1.addColorStop(1, "rgba(0, 0, 0, 0)");

      // Second accent gradient (pink-purple)
      const gradient2 = ctx.createRadialGradient(
        canvas.width * (0.5 + Math.cos(time * 1.1) * 0.1),
        canvas.height * (0.7 + Math.sin(time * 0.9) * 0.1),
        0,
        canvas.width * (0.5 + Math.cos(time * 1.1) * 0.1),
        canvas.height * (0.7 + Math.sin(time * 0.9) * 0.1),
        gradientSize
      );
      gradient2.addColorStop(0, "rgba(147, 51, 234, 0.08)"); // Purple
      gradient2.addColorStop(0.5, "rgba(126, 34, 206, 0.05)"); // Darker purple
      gradient2.addColorStop(1, "rgba(0, 0, 0, 0)");

      // Apply accent gradients
      ctx.fillStyle = gradient1;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = gradient2;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationFrameId = requestAnimationFrame(drawGradient);
    };

    resize();
    drawGradient(0);

    let resizeTimeout: NodeJS.Timeout;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(resize, 200);
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full -z-10"
      />
      <div className="absolute inset-0 bg-grid-white/[0.02] -z-10" />
      {children}
    </div>
  );
};
