
import React, { useEffect, useRef } from 'react';
import { UserPath } from '../types';

interface CosmicBackgroundProps {
  path?: UserPath;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ path = UserPath.NONE }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  const getConfig = (p: UserPath) => {
    switch (p) {
      case UserPath.SCIENTIFIC:
        return {
          colors: ['#00FFFF', '#3B82F6'], 
          lineColor: 'rgba(0, 255, 255, ',
          particleCount: 120,
          connectionDist: 150,
          forceRadius: 200,
          speedMod: 0.5
        };
      case UserPath.RELIGIOUS:
        return {
          colors: ['#A855F7', '#6366F1'], 
          lineColor: 'rgba(168, 85, 247, ',
          particleCount: 100,
          connectionDist: 180,
          forceRadius: 300,
          speedMod: 0.3
        };
      case UserPath.BLENDED:
        return {
          colors: ['#FFD700', '#FF4500'], 
          lineColor: 'rgba(255, 215, 0, ',
          particleCount: 150,
          connectionDist: 140,
          forceRadius: 250,
          speedMod: 1.2
        };
      default:
        return {
          colors: ['#00FFFF', '#FFD700', '#A855F7'], 
          lineColor: 'rgba(255, 255, 255, ',
          particleCount: 110,
          connectionDist: 140,
          forceRadius: 250,
          speedMod: 0.6
        };
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId: number;
    const config = getConfig(path);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;

      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * config.speedMod;
        this.vy = (Math.random() - 0.5) * config.speedMod;
        this.size = Math.random() * 2 + 0.5;
        this.color = config.colors[Math.floor(Math.random() * config.colors.length)];
      }

      update() {
        const dx = mouseRef.current.x - this.x;
        const dy = mouseRef.current.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < config.forceRadius) {
          const force = (config.forceRadius - distance) / config.forceRadius;
          const dir = path === UserPath.SCIENTIFIC ? 1 : -1; 
          this.vx += (dx / distance) * force * 0.5 * dir;
          this.vy += (dy / distance) * force * 0.5 * dir;
        }

        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95; 
        this.vy *= 0.95;

        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }

      draw() {
        if (!ctx) return;
        const pulse = Math.sin(Date.now() * 0.002 + this.x) * 0.3 + 0.7;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = pulse;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }
    }

    let particles: Particle[] = [];
    const init = () => {
      particles = [];
      for (let i = 0; i < config.particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < config.connectionDist) {
            const opacity = 1 - (distance / config.connectionDist);
            ctx.strokeStyle = config.lineColor + (opacity * 0.3) + ')';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }

      particles.forEach(p => {
        p.update();
        p.draw();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    };

    const handleMouseMove = (e: MouseEvent) => {
        mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    handleResize();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [path]);

  return (
    <div className="fixed inset-0 z-[-1] bg-black">
       <canvas ref={canvasRef} className="block w-full h-full" />
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.7)_100%)] pointer-events-none"></div>
    </div>
  );
};
