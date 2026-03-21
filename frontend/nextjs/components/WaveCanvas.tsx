'use client';

import { useEffect, useRef } from 'react';

export default function WaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let time = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawWave = (
      yBase: number,
      amplitude: number,
      frequency: number,
      speed: number,
      opacity: number,
      lineWidth: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(0, yBase);

      for (let x = 0; x <= canvas.width; x += 2) {
        const y =
          yBase +
          Math.sin((x * frequency) / canvas.width + time * speed) * amplitude +
          Math.sin((x * frequency * 0.5) / canvas.width + time * speed * 1.3) *
            (amplitude * 0.4);
        ctx.lineTo(x, y);
      }

      ctx.strokeStyle = `rgba(180, 180, 180, ${opacity})`;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      time += 0.008;

      const midY = canvas.height * 0.55;

      drawWave(midY, 30, 6, 0.6, 0.12, 1);
      drawWave(midY + 15, 25, 5, 0.5, 0.08, 0.8);
      drawWave(midY - 10, 20, 7, 0.7, 0.06, 0.6);
      drawWave(midY + 30, 18, 4, 0.4, 0.05, 0.5);

      animationId = requestAnimationFrame(animate);
    };

    const handleVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(animationId);
      } else {
        animate();
      }
    };

    resize();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', handleVisibility);
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.9 }}
    />
  );
}
