
import React, { useState, useEffect, useRef } from 'react';
import { Fingerprint, Loader2, ShieldCheck, ArrowLeft } from 'lucide-react';
import { playNeuralLink, playDataOpen, playCosmicClick } from '../../utils/sfx';

interface LoginPortalProps {
    onLoginSuccess: (email: string) => void;
}

// Particle Physics for Background
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export const LoginPortal: React.FC<LoginPortalProps> = ({ onLoginSuccess }) => {
  // Flow: LANDING (Fingerprint) -> LOGIN_FORM -> Success triggers callback immediately
  const [viewState, setViewState] = useState<'LANDING' | 'LOGIN_FORM' | 'WARP'>('LANDING');
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // --- PHYSICS ENGINE BACKGROUND (NEURAL GALAXY) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 100; 
    const connectionDist = 150;

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = Math.max(window.innerHeight, document.body.scrollHeight);
    };
    window.addEventListener('resize', resize);
    resize();

    // Init Particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            size: Math.random() * 2.5,
            color: Math.random() > 0.6 ? '#00FFFF' : '#ffffff'
        });
    }

    const animate = () => {
        if (viewState === 'WARP') {
            ctx.fillStyle = 'rgba(0,0,0,0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, canvas.width);
            gradient.addColorStop(0, 'rgba(0, 255, 255, 0.03)');
            gradient.addColorStop(0.5, 'rgba(76, 29, 149, 0.05)');
            gradient.addColorStop(1, 'transparent');
            ctx.fillStyle = gradient;
            ctx.fillRect(0,0, canvas.width, canvas.height);
        }

        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            
            if (viewState === 'WARP') {
                const cx = canvas.width / 2;
                const cy = window.innerHeight / 2; 
                const dx = p.x - cx;
                const dy = p.y - cy;
                p.x += dx * 0.15;
                p.y += dy * 0.15;
                p.size += 0.1;
                
                if (p.x < -100 || p.x > canvas.width + 100 || p.y < -100 || p.y > canvas.height + 100) {
                     p.x = Math.random() * canvas.width;
                     p.y = Math.random() * canvas.height;
                     p.size = 1;
                }
            } else {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            }

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = viewState === 'WARP' ? '#ffffff' : p.color;
            ctx.globalAlpha = viewState === 'WARP' ? 1 : 0.7;
            ctx.fill();
            ctx.globalAlpha = 1.0;

            if (viewState !== 'WARP') {
                for (let j = i + 1; j < particles.length; j++) {
                    let p2 = particles[j];
                    const dx = p.x - p2.x;
                    const dy = p.y - p2.y;
                    const dist = Math.sqrt(dx*dx + dy*dy);
                    if (dist < connectionDist) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        const opacity = 1 - (dist / connectionDist);
                        ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.15})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        }
        animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
        window.removeEventListener('resize', resize);
        cancelAnimationFrame(animationFrameId);
    };
  }, [viewState]);

  // --- ACTIONS ---

  const handleFingerprintClick = () => {
      playNeuralLink();
      setViewState('LOGIN_FORM');
  };

  const handleBack = () => {
      playCosmicClick();
      setViewState('LANDING');
  };

  const handleProviderLogin = (provider: 'google' | 'apple' | 'email') => {
    playDataOpen();
    setLoadingProvider(provider);
    
    setTimeout(() => {
        let email = 'node@universe.com';
        if (provider === 'google') email = 'user@gmail.com';
        if (provider === 'apple') email = 'user@icloud.com';
        
        setLoadingProvider(null);
        setViewState('WARP');
        playNeuralLink();
        
        // Trigger App Transition after animation
        setTimeout(() => {
            onLoginSuccess(email);
        }, 1500);
    }, 1500);
  };

  return (
    // MAIN CONTAINER: Absolute to fill parent, scrollable on Y
    <div className="absolute inset-0 w-full h-full bg-black flex flex-col overflow-y-auto custom-scrollbar font-mono text-white">
      
      {/* PHYSICS BACKGROUND (Fixed relative to this scrollable container would be nice, but absolute works) */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full pointer-events-none" />
      
      {/* WHITE FLASH OVERLAY */}
      <div className={`fixed inset-0 bg-white z-[60] pointer-events-none transition-opacity duration-1000 ease-in ${viewState === 'WARP' ? 'opacity-100 delay-1000' : 'opacity-0'}`}></div>

      {/* --- CONTENT WRAPPER: min-h-full to allow centering, but grows if content overflows --- */}
      <div className="relative z-10 w-full min-h-full flex flex-col">
        
        {/* --- SCROLLING TEXT HEADER --- */}
        <div className="w-full pt-16 pb-8 flex flex-col items-center justify-center overflow-hidden shrink-0">
            {/* Main Title */}
            <h1 className="text-5xl md:text-8xl font-tech text-white uppercase tracking-tighter mb-4 drop-shadow-[0_0_30px_rgba(0,255,255,0.6)] text-center relative z-20 mix-blend-screen">
                GOD'S BRAIN
            </h1>
            
            {/* Scrolling Marquees */}
            <div className="w-full overflow-hidden relative opacity-80 space-y-2">
                {/* Line 1: Purple, Left to Right */}
                <div className="whitespace-nowrap animate-scroll-left font-mono text-xs md:text-sm text-purple-500 tracking-[0.5em]">
                    THE ANATOMY OF THE DIVINE • THE ANATOMY OF THE DIVINE • THE ANATOMY OF THE DIVINE • THE ANATOMY OF THE DIVINE •
                </div>
                {/* Line 2: Orange, Right to Left (Opposite) */}
                <div className="whitespace-nowrap animate-scroll-right font-mono text-xs md:text-sm text-orange-500 tracking-[0.5em]">
                    AWAKENING TO THE GODS NODE • AWAKENING TO THE GODS NODE • AWAKENING TO THE GODS NODE • AWAKENING TO THE GODS NODE •
                </div>
            </div>
        </div>

        {/* --- INTERACTION AREA --- */}
        {/* flex-1 with my-auto centers it vertically if space allows, otherwise it flows naturally with scroll */}
        <div className={`flex-1 flex flex-col items-center justify-start my-auto py-12 px-6 transition-all duration-700 w-full ${viewState === 'WARP' ? 'scale-150 opacity-0 blur-sm' : 'opacity-100'}`}>
            
            {/* 1. LANDING STATE: FINGERPRINT */}
            {viewState === 'LANDING' && (
                <div className="text-center animate-scaleIn flex flex-col items-center pb-24">
                    <div 
                        className="relative group cursor-pointer mb-6 w-40 h-40 flex items-center justify-center" 
                        onClick={handleFingerprintClick}
                    >
                        {/* Glow Rings */}
                        <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping opacity-20"></div>
                        <div className="absolute inset-[-20px] rounded-full border border-cyan-500/10 animate-pulse-slow"></div>
                        <div className="absolute inset-0 rounded-full bg-cyan-500/5 blur-xl group-hover:bg-cyan-500/20 transition-all"></div>
                        
                        {/* Scanner Button */}
                        <div className="w-32 h-32 rounded-full bg-black/60 backdrop-blur-md border border-cyan-500/50 flex items-center justify-center shadow-[0_0_50px_rgba(0,255,255,0.2)] group-hover:bg-cyan-500/10 group-hover:scale-105 transition-all duration-500 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent translate-y-[-100%] group-hover:translate-y-[100%] transition-transform duration-1000"></div>
                            <Fingerprint className="w-16 h-16 text-cyan-400 animate-pulse" />
                        </div>
                    </div>

                    {/* Node Identification Text */}
                    <div className="text-[#00FFFF] text-[10px] uppercase tracking-[0.3em] font-mono mb-6 animate-pulse">
                        NODE IDENTIFICATION
                    </div>
                    
                    <p className="text-gray-400 text-xs font-mono max-w-xs mx-auto leading-relaxed opacity-70">
                        Touch scanner to initiate Identity Uplink.
                    </p>
                </div>
            )}

            {/* 2. LOGIN FORM STATE */}
            {viewState === 'LOGIN_FORM' && (
                <div className="w-full max-w-sm bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_0_60px_rgba(0,0,0,0.8)] animate-fadeIn relative mb-24">
                    <button 
                        onClick={handleBack}
                        className="absolute top-6 left-6 text-gray-500 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-full"
                        title="Abort"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>

                    <div className="text-center mb-8 mt-2">
                        <ShieldCheck className="w-10 h-10 text-cyan-500 mx-auto mb-4" />
                        <h2 className="text-xl font-tech text-white uppercase tracking-widest">Secure Uplink</h2>
                        <p className="text-[10px] text-gray-500 font-mono mt-1">Select authentication protocol</p>
                    </div>

                    <div className="space-y-4">
                        <button 
                            onClick={() => handleProviderLogin('google')}
                            disabled={!!loadingProvider}
                            className="w-full bg-white text-black font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 hover:bg-gray-200 transition-all active:scale-[0.98] group relative overflow-hidden"
                        >
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-5 h-5" alt="G" />
                            <span className="font-reading text-sm">Continue with Google</span>
                            {loadingProvider === 'google' && <div className="absolute inset-0 bg-white flex items-center justify-center"><Loader2 className="animate-spin w-4 h-4"/></div>}
                        </button>

                        <button 
                            onClick={() => handleProviderLogin('apple')}
                            disabled={!!loadingProvider}
                            className="w-full bg-[#1a1a1a] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-3 border border-white/10 hover:bg-[#333] transition-all active:scale-[0.98] relative overflow-hidden"
                        >
                            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.45-1.02 3.67-.9 2.56.28 3.73 1.7 3.73 1.7s-2.09 1.2-2.1 4.16c0 3.14 2.7 4.22 2.7 4.22s-1.87 5.25-4.43 7.75zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.17 2.37-2.05 4.31-3.74 4.25z"/></svg>
                            <span className="font-reading text-sm">Continue with Apple</span>
                            {loadingProvider === 'apple' && <div className="absolute inset-0 bg-black flex items-center justify-center"><Loader2 className="animate-spin w-4 h-4"/></div>}
                        </button>
                        
                        <button 
                            onClick={() => handleProviderLogin('email')}
                            disabled={!!loadingProvider}
                            className="w-full bg-transparent border border-white/20 text-gray-400 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/5 hover:text-white transition-all text-sm"
                        >
                            Manual Entry (Email)
                        </button>
                    </div>
                </div>
            )}
        </div>
      </div>
      
      {/* CSS For Marquee */}
      <style>{`
        @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
        }
        @keyframes scroll-right {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
        }
        .animate-scroll-left {
            animation: scroll-left 40s linear infinite;
        }
        .animate-scroll-right {
            animation: scroll-right 40s linear infinite;
        }
      `}</style>
    </div>
  );
};
