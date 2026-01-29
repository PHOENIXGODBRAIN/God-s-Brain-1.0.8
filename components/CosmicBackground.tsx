
import React, { useEffect, useRef } from 'react';
import { UserPath } from '../types';

interface CosmicBackgroundProps {
  path?: UserPath;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({ path = UserPath.NONE }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 }); // Start off-screen

  // --- CONFIGURATION MATRIX ---
  const getConfig = (p: UserPath) => {
    switch (p) {
      case UserPath.SCIENTIFIC:
        return {
          // Precise, cold, analytical
          colors: ['rgba(0, 255, 255, ', 'rgba(59, 130, 246, '], // Cyan & Blue
          lineColor: 'rgba(0, 255, 255, ',
          speedMod: 0.4,
          particleCount: 160,
          connectionDistance: 120,
          interactionRadius: 200,
          bgGradient: ['#000000', '#0f172a'] // Slate tone
        };
      case UserPath.RELIGIOUS:
        return {
          // Deep, spiritual, pulsing
          colors: ['rgba(168, 85, 247, ', 'rgba(99, 102, 241, '], // Purple & Indigo
          lineColor: 'rgba(168, 85, 247, ',
          speedMod: 0.25,
          particleCount: 100,
          connectionDistance: 180,
          interactionRadius: 350,
          bgGradient: ['#000000', '#1e1b4b'] // Indigo tone
        };
      case UserPath.BLENDED:
        return {
          // High energy, wealth, power (Phoenix)
          colors: ['rgba(234, 179, 8, ', 'rgba(255, 69, 0, '], // Gold & Red-Orange
          lineColor: 'rgba(234, 179, 8, ',
          speedMod: 1.5,
          particleCount: 200,
          connectionDistance: 130,
          interactionRadius: 250,
          bgGradient: ['#000000', '#271005'] // Warm tone
        };
      case UserPath.NONE:
      default:
        return {
          // The Void / Genesis State
          colors: ['rgba(0, 255, 255, ', 'rgba(234, 179, 8, '], // Cyan & Gold mix
          lineColor: 'rgba(0, 255, 255, ',
          speedMod: 0.6,
          particleCount: 120,
          connectionDistance: 140,
          interactionRadius: 250,
          bgGradient: ['#000000', '#020617'] // Deep space
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

    interface Particle {
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        color: string;
        baseX: number; // For "home" position seeking if needed
        baseY: number;
    }

    let particles: Particle[] = [];

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
      init();
    };

    const init = () => {
      particles = [];
      for (let i = 0; i < config.particleCount; i++) {
        const size = Math.random() * 2 + 0.5;
        // Distribute colors from config
        const colorIdx = Math.floor(Math.random() * config.colors.length);
        const color = config.colors[colorIdx];
        
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * config.speedMod, 
          vy: (Math.random() - 0.5) * config.speedMod,
          size: size,
          color: color,
          baseX: Math.random() * width,
          baseY: Math.random() * height
        });
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    };
    
    const handleTouchMove = (e: TouchEvent) => {
        const rect = canvas.getBoundingClientRect();
        if(e.touches.length > 0) {
            mouseRef.current = {
                x: e.touches[0].clientX - rect.left,
                y: e.touches[0].clientY - rect.top
            };
        }
    }

    const draw = () => {
      if (!ctx) return;
      ctx.clearRect(0, 0, width, height);

      // Reactive Background Gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, config.bgGradient[0]);
      gradient.addColorStop(1, config.bgGradient[1]);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
      
      // Update and Draw Particles
      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
        
        // --- MOUSE INTERACTION (The "Fluid" Feel) ---
        const dx = mouseRef.current.x - p.x;
        const dy = mouseRef.current.y - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < config.interactionRadius) {
            const forceDirectionX = dx / distance;
            const forceDirectionY = dy / distance;
            const force = (config.interactionRadius - distance) / config.interactionRadius;
            
            // Gentle repulsion to create a path
            const repulsionStrength = 0.8;
            p.vx -= forceDirectionX * force * repulsionStrength;
            p.vy -= forceDirectionY * force * repulsionStrength;
        }

        // --- CONSTANT STORY FLOW ---
        // Add a tiny bit of constant drift to simulate camera movement through space
        // Scientist: Ordered drift. Seeker: Upward drift. Active: Forward drift.
        if (path === UserPath.RELIGIOUS) p.y -= 0.1; 
        else if (path === UserPath.BLENDED) p.x += 0.3;
        else p.x += 0.1; // Default
        
        // Velocity damping (friction)
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Apply Velocity
        p.x += p.vx;
        p.y += p.vy;

        // --- SCREEN WRAP ---
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw Particle (Star/Neuron)
        // Pulsing opacity
        const pulse = Math.sin(Date.now() * 0.003 + p.x) * 0.2 + 0.8;
        
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${pulse})`; 
        ctx.fill();
      }

      // --- NEURAL CONNECTIONS ---
      // Thinner lines for Scientist, thicker for Active
      ctx.lineWidth = path === UserPath.SCIENTIFIC ? 0.3 : 0.6;
      
      for (let a = 0; a < particles.length; a++) {
          for (let b = a + 1; b < particles.length; b++) {
              const dx = particles[a].x - particles[b].x;
              const dy = particles[a].y - particles[b].y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < config.connectionDistance) {
                  const opacity = 1 - (dist / config.connectionDistance);
                  // Use configured line color
                  ctx.strokeStyle = `${config.lineColor}${opacity * 0.4})`; 
                  ctx.beginPath();
                  ctx.moveTo(particles[a].x, particles[a].y);
                  ctx.lineTo(particles[b].x, particles[b].y);
                  ctx.stroke();
              }
          }
      }

      // --- CURSOR GLOW ---
      if (mouseRef.current.x > 0) {
          const mouseGlow = ctx.createRadialGradient(mouseRef.current.x, mouseRef.current.y, 0, mouseRef.current.x, mouseRef.current.y, 300);
          // Glow color matches theme
          const glowColor = path === UserPath.BLENDED ? 'rgba(234, 179, 8, 0.1)' : 
                            path === UserPath.RELIGIOUS ? 'rgba(168, 85, 247, 0.1)' : 
                            'rgba(0, 255, 255, 0.05)';
                            
          mouseGlow.addColorStop(0, glowColor);
          mouseGlow.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = mouseGlow;
          ctx.beginPath();
          ctx.arc(mouseRef.current.x, mouseRef.current.y, 300, 0, Math.PI*2);
          ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    
    // Set initial size
    resize();
    init();
    draw();

    return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
        cancelAnimationFrame(animationFrameId);
    };
  }, [path]); // Re-initialize when path changes

  return (
    <div className="fixed inset-0 z-[-1] bg-black transition-colors duration-1000">
        <canvas ref={canvasRef} className="absolute inset-0" />
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none"></div>
    </div>
  );
};
