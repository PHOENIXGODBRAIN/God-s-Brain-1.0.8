
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { playNeuralLink, playCosmicClick, playError, playMenuSelect, playDataOpen } from '../../utils/sfx';
import { 
  ArrowLeft, Dna, Lock, Zap, Activity, Sun, Network, RotateCw, Layers, Eye, 
  Minimize2, Waves, Grip, CircleDashed, Wind, Dice5, RefreshCw, Compass, Minus, 
  Plus, Triangle, Info, Brain, ChevronRight, X, User, Star
} from 'lucide-react';
import { UserProfile } from '../../types';

interface NeuronBuilderProps {
  archetype: string; 
  onComplete: (avatarUrl: string) => void;
  onUpdateProfile?: (updates: Partial<UserProfile>) => void;
  onBack: () => void;
  isUnlocked: boolean; 
  user?: UserProfile;
}

export const NeuronBuilder: React.FC<NeuronBuilderProps> = ({ archetype, onComplete, onUpdateProfile, onBack, isUnlocked, user }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const getTheme = () => {
      const base = {
          SCIENTIST: { color: '#00FFFF', label: 'THE SCIENTIST', path: 'SCIENTIFIC' },
          MYSTIC: { color: '#FFD700', label: 'THE MYSTIC', path: 'RELIGIOUS' },
          ACTIVE_NODE: { color: '#A855F7', label: 'ACTIVE NODE', path: 'BLENDED' },
          ARCHITECT: { color: '#F43F5E', label: 'THE ARCHITECT', path: 'SCIENTIFIC' }, 
          SEEKER: { color: '#F97316', label: 'THE SEEKER', path: 'RELIGIOUS' },
          ALCHEMIST: { color: '#10B981', label: 'THE ALCHEMIST', path: 'BLENDED' }
      };
      return base[archetype as keyof typeof base] || base.ACTIVE_NODE;
  };
  const theme = getTheme();

  // --- STATE RESTORATION ---
  const [somaColor, setSomaColor] = useState(theme.color);
  const [nucleusColor, setNucleusColor] = useState('#FFFFFF');
  const [somaSize, setSomaSize] = useState(50);
  const [nucleusSize, setNucleusSize] = useState(30);
  const [armLength, setArmLength] = useState(50);
  const [armThickness, setArmThickness] = useState(40);
  const [waviness, setWaviness] = useState(30);
  const [spikeFactor, setSpikeFactor] = useState(0);
  const [spikeAngle, setSpikeAngle] = useState(45);
  const [aspectRatio, setAspectRatio] = useState(50);
  const [bodyDistortion, setBodyDistortion] = useState(10);
  const [somaLum, setSomaLum] = useState(50);
  const [textureDensity, setTextureDensity] = useState(20);
  const [textureStyle, setTextureStyle] = useState('BIO_SYNAPSE');
  const [spineStyle, setSpineStyle] = useState('SOLID');
  const [zoom, setZoom] = useState(1.0);
  const [spookySpeed, setSpookySpeed] = useState(10);
  const [pulseIntensity, setPulseIntensity] = useState(20);
  const [trailLevel, setTrailLevel] = useState(15);
  const [showDossier, setShowDossier] = useState(false);
  
  const rotationRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const currentSkill = user?.startingSkill || "Neural Link";

  // --- HANDLER RESTORATION ---
  const handleMouseDown = (e: any) => {
    isDraggingRef.current = true;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    lastMousePosRef.current = { x: clientX, y: clientY };
  };

  const handleMouseMove = (e: any) => {
    if (!isDraggingRef.current) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const dx = clientX - lastMousePosRef.current.x;
    rotationRef.current += dx * 0.5;
    lastMousePosRef.current = { x: clientX, y: clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // --- RENDERING LOGIC ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    const resize = () => { if(canvas.parentElement) { canvas.width = canvas.parentElement.clientWidth; canvas.height = canvas.parentElement.clientHeight; } };
    window.addEventListener('resize', resize);
    resize();
    let frameId: number;
    let time = 0;
    const render = () => {
        time += 0.05;
        // FIX: Ensure trailLevel is accessible.
        const trailLimit = isUnlocked ? (trailLevel / 100 * 0.60) : (Math.min(trailLevel, 25) / 100 * 0.60);
        const trailAlpha = 0.68 - trailLimit; 
        if (trailLimit > 0) { ctx.fillStyle = `rgba(0, 0, 0, ${trailAlpha})`; ctx.fillRect(0, 0, canvas.width, canvas.height); } 
        else { ctx.clearRect(0, 0, canvas.width, canvas.height); }
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        const pulse = Math.sin(time) * 0.012 + 1; 
        // FIX: Ensure pulseIntensity is accessible.
        const heart = Math.sin(time * 3) * (pulseIntensity / 100 * 10); 
        
        // FIX: Ensure isDraggingRef, spookySpeed, and rotationRef are accessible.
        if (!isDraggingRef.current) {
            const activeSpooky = isUnlocked ? (spookySpeed / 100 * 0.25) : (Math.min(spookySpeed, 25) / 100 * 0.25);
            rotationRef.current += activeSpooky; 
        }

        ctx.save();
        ctx.translate(cx, cy);
        // FIX: Ensure zoom is accessible.
        const scaleFactor = (Math.min(canvas.width, canvas.height) / 450) * zoom; 
        ctx.scale(pulse * scaleFactor, pulse * scaleFactor);
        // FIX: Ensure rotationRef, armLength, somaSize, armThickness, waviness are accessible.
        const currentRot = rotationRef.current * Math.PI / 180;
        const reachFac = isUnlocked ? (armLength / 100) : (Math.min(armLength, 25) / 100);
        const armReach = 35 + (reachFac * 180); 
        const sSizeVal = 40 + (somaSize / 100 * 40);
        const startRad = sSizeVal * 0.85;
        const thickFac = isUnlocked ? (armThickness / 100) : (Math.min(armThickness, 50) / 100);
        const lineWidth = (thickFac * 20) + 2; 
        const flowIntensity = ((waviness / 100) * 0.012) + 0.004;

        // VIVID OVERCLOCK GLOW FOR PREMIUM
        if (isUnlocked) {
            ctx.shadowColor = theme.color;
            ctx.shadowBlur = 30 + Math.sin(time * 2) * 15;
        }

        for (let i = 0; i < 4; i++) {
            const baseAng = (Math.PI / 2) * i + (Math.PI / 4) + currentRot;
            const pts: {x: number, y: number}[] = [];
            for(let j = 0; j <= 12; j++) {
                const t = j / 12;
                const d = startRad + (armReach * t);
                const w = Math.sin((t * 6) + (time * 1.5)) * (flowIntensity * 100 * t); 
                pts.push({ x: Math.cos(baseAng + w * 0.05) * d, y: Math.sin(baseAng + w * 0.05) * d });
            }
            ctx.beginPath(); ctx.moveTo(pts[0].x, pts[0].y);
            for(let p of pts) ctx.lineTo(p.x, p.y);
            ctx.lineCap = 'round'; ctx.lineJoin = 'round'; 
            // FIX: Ensure somaColor is accessible.
            ctx.strokeStyle = somaColor; ctx.lineWidth = lineWidth; ctx.stroke();
            // FIX: Ensure spikeFactor, spikeAngle, spineStyle, somaColor are accessible.
            if (spikeFactor > 0) {
                 ctx.beginPath();
                 for(let j=2; j<pts.length-1; j+=3) {
                     const p = pts[j];
                     const dx = pts[j+1].x - p.x; const dy = pts[j+1].y - p.y;
                     const armTangent = Math.atan2(dy, dx);
                     const ang = armTangent + ((spikeAngle / 100 * 180) * Math.PI / 180);
                     const isThreads = spineStyle === 'THREADS';
                     const lenMult = isThreads ? 2.2 : 1.0;
                     const len = ((spikeFactor / 100 * 20) + 4) * lenMult;
                     const ex = p.x + Math.cos(ang)*len;
                     const ey = p.y + Math.sin(ang)*len;
                     ctx.moveTo(p.x, p.y);
                     if (isThreads) ctx.quadraticCurveTo(p.x + Math.cos(ang+0.4)*len*0.7, p.y + Math.sin(ang+0.4)*len*0.7, ex, ey);
                     else ctx.lineTo(ex, ey);
                 }
                 ctx.lineWidth = spineStyle === 'THREADS' ? 0.6 : 1.4; ctx.strokeStyle = somaColor; ctx.stroke();
            }
            const tip = pts[pts.length-1];
            ctx.save(); ctx.beginPath(); ctx.arc(tip.x, tip.y, lineWidth * 0.9, 0, Math.PI * 2);
            const tg = ctx.createRadialGradient(tip.x, tip.y, 0, tip.x, tip.y, lineWidth * 2.0);
            tg.addColorStop(0, '#ffffff'); tg.addColorStop(0.2, somaColor); tg.addColorStop(1, 'transparent');
            ctx.fillStyle = tg; ctx.shadowColor = somaColor; ctx.shadowBlur = isUnlocked ? 40 : 25; ctx.fill(); ctx.restore();
        }
        // FIX: Ensure aspectRatio, bodyDistortion, somaSize, somaColor, somaLum, textureDensity, textureStyle are accessible.
        ctx.save(); ctx.rotate(currentRot); const bodyRatio = 0.85 + (aspectRatio / 100) * 0.30; ctx.scale(bodyRatio, 1); 
        const sRad = sSizeVal; const dFac = bodyDistortion / 100;
        ctx.beginPath();
        for(let a=0; a<Math.PI*2; a+=0.1) {
            const noise = Math.sin(a * 4 + time) * (dFac * 7); const r = sRad + noise;
            const px = Math.cos(a) * r; const py = Math.sin(a) * r;
            if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.closePath();
        const g = ctx.createRadialGradient(-sRad*0.3, -sRad*0.3, sRad*0.05, 0, 0, sRad);
        g.addColorStop(0, '#ffffff99'); g.addColorStop(0.3, somaColor); g.addColorStop(0.85, '#000000aa'); g.addColorStop(1, 'transparent'); 
        ctx.fillStyle = g; ctx.shadowColor = theme.color; ctx.shadowBlur = (somaLum/100) * (isUnlocked ? 80 : 50); ctx.fill(); ctx.shadowBlur = 0;
        if (textureDensity > 0) {
            ctx.clip();
            if (textureStyle === 'POROUS') {
                for(let j=0; j<textureDensity * 1.4; j++) {
                    const r = (j * 137.5) * (Math.PI/180); const d = Math.sqrt(j / (textureDensity * 1.4)) * (sRad * 0.9);
                    const ox = Math.cos(r) * d; const oy = Math.sin(r) * d; const sz = (Math.sin(j) + 2) * 2.8;
                    ctx.beginPath(); ctx.arc(ox, oy, sz, 0, Math.PI*2); ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fill();
                }
            } else if (textureStyle === 'BIO_SYNAPSE') {
                ctx.beginPath();
                for(let j=0; j<textureDensity * 1.2; j++) {
                    const a = (j/textureDensity)*Math.PI*8 + time*0.1; const d = (Math.sin(j) * 0.5 + 0.5) * sRad * 0.8;
                    ctx.moveTo(0,0); ctx.quadraticCurveTo(Math.cos(a)*d*0.5, Math.sin(a)*d*0.5, Math.cos(a)*d, Math.sin(a)*d);
                }
                ctx.strokeStyle = 'rgba(0,0,0,0.45)'; ctx.lineWidth = 2.8; ctx.stroke();
            }
        }
        ctx.restore();
        // FIX: Ensure nucleusSize, nucleusColor are accessible.
        ctx.save(); ctx.rotate(currentRot); const nSize = Math.max(3.5, (nucleusSize / 100 * 24) + heart);
        ctx.beginPath(); ctx.arc(0, 0, nSize, 0, Math.PI * 2);
        const ng = ctx.createRadialGradient(0,0,1, 0,0, nSize);
        ng.addColorStop(0, '#FFFFFF'); ng.addColorStop(0.3, nucleusColor); ng.addColorStop(1, 'transparent');
        ctx.fillStyle = ng; ctx.shadowColor = nucleusColor; ctx.shadowBlur = 40; ctx.fill();
        ctx.restore(); ctx.restore();
        frameId = requestAnimationFrame(render);
    };
    render();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(frameId); };
  }, [somaLum, armLength, armThickness, waviness, spikeFactor, spikeAngle, somaColor, nucleusColor, aspectRatio, bodyDistortion, somaSize, nucleusSize, textureDensity, zoom, spookySpeed, pulseIntensity, trailLevel, textureStyle, theme, isUnlocked, spineStyle]);

  return (
    <div className="absolute inset-0 w-full h-full bg-transparent flex flex-col landscape:flex-row text-[#e0f2fe] font-mono overflow-hidden select-none">
      {/* LEFT: PREVIEW & NAME */}
      <div 
          ref={containerRef} 
          className="h-[45%] landscape:h-full landscape:w-[55%] relative flex flex-col items-center border-r border-white/5 cursor-grab active:cursor-grabbing group/preview overflow-hidden bg-transparent"
          // FIX: Ensure event handlers are accessible.
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
      >
          {/* IDENTITY BADGE - TOP CENTER */}
          <div className="absolute top-12 md:top-20 flex flex-col items-center z-20 w-full px-8 pointer-events-none">
              <div className="text-[10px] text-white/40 font-mono tracking-[0.5em] mb-3 uppercase">Neural Identity Module</div>
              
              <div className="flex flex-col items-center gap-1 mb-8 animate-fadeIn">
                <div 
                    // FIX: Ensure setShowDossier is accessible.
                    onClick={() => { playDataOpen(); setShowDossier(true); }}
                    className="pointer-events-auto flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full cursor-pointer hover:bg-white/10 hover:border-white/30 transition-all group/badge shadow-lg backdrop-blur-md"
                >
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-[10px] font-tech text-white uppercase tracking-widest">{theme.label}</span>
                    {isUnlocked && (
                        <div className="flex items-center gap-1.5 ml-2 px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 rounded-full">
                            <Star size={10} className="text-amber-500" fill="currentColor" />
                            <span className="text-[8px] font-bold text-amber-400 uppercase tracking-tighter">Awakened Node</span>
                        </div>
                    )}
                    <span className="text-gray-600 mx-1">|</span>
                    {/* FIX: Ensure currentSkill is accessible. */}
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest group-hover/badge:text-white transition-colors">{currentSkill}</span>
                    <Info size={12} className="text-gray-500 group-hover/badge:text-cyan-400" />
                </div>
              </div>
          </div>
          
          <canvas ref={canvasRef} className="absolute inset-0 z-10" />
      </div>
    </div>
  );
};
