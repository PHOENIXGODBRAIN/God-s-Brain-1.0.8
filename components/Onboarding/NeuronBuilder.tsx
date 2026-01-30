
import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { playNeuralLink, playCosmicClick, playError, playMenuSelect, playDataOpen } from '../../utils/sfx';
import { 
  ArrowLeft, Dna, Lock, Zap, Activity, Sun, Network, RotateCw, Layers, Eye, 
  Minimize2, Waves, Grip, CircleDashed, Wind, Dice5, RefreshCw, Compass, Minus, 
  Plus, Triangle, Info, Brain, ChevronRight, X, User, Star, ChevronDown, Edit2
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

const RANDOM_NAMES = [
    "Vector-7", "Zero-Point", "Aion-Prime", "Nexus-Alpha", "Zenith-X", 
    "Cipher-One", "Echo-Unit", "Solaris-9", "Quantum-V", "Helix-Core",
    "Omega-Node", "Synapse-Z", "Void-Walker", "Flux-State", "Neon-Pulse",
    "Carbon-6", "Silicon-Soul", "Ether-Mind", "Root-Admin", "Ghost-Shell"
];

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

  // STATE
  const [nodeName, setNodeName] = useState(user?.name || "Node-001");
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
  const [coherence, setCoherence] = useState(50); // Local sim for builder
  
  const rotationRef = useRef(0);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  const currentSkill = user?.startingSkill || "Neural Link";

  // Force color update if archetype changes props
  useEffect(() => {
      setSomaColor(theme.color);
  }, [archetype]);

  // Sync initial name
  useEffect(() => {
      if (user?.name) setNodeName(user.name);
  }, [user?.name]);

  // HANDLERS
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

  const generateRandomName = () => {
      playDataOpen();
      const rand = RANDOM_NAMES[Math.floor(Math.random() * RANDOM_NAMES.length)];
      setNodeName(rand);
  };

  const randomize = () => {
      playDataOpen();
      
      // Randomize UNLOCKED features only
      setSomaSize(Math.random() * 100);
      setNucleusSize(Math.random() * 80 + 10);
      setWaviness(Math.random() * 80);
      setAspectRatio(Math.random() * 60 + 20);
      setBodyDistortion(Math.random() * 40);
      setPulseIntensity(Math.random() * 80);
      setCoherence(Math.random() * 100);

      // Only randomize Premium features if user has Root Access
      if (isUnlocked) {
          setArmLength(Math.random() * 100);
          setArmThickness(Math.random() * 100);
          setSpikeFactor(Math.random() * 60);
          setSpikeAngle(Math.random() * 180);
          setSomaLum(Math.random() * 100);
          setSpookySpeed(Math.random() * 100);
      } else {
          // Reset premium sliders to default low values if locked (clean slate)
          setSpikeFactor(0);
          setArmLength(50);
          setArmThickness(40);
      }

      // STRICT RULE: Do not change color family. 
      // Reset color to archetype default to ensure brand consistency.
      setSomaColor(theme.color);
  };

  const captureAvatar = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      
      // Update the name in profile
      if (onUpdateProfile && nodeName.trim()) {
          onUpdateProfile({ name: nodeName });
      }

      playNeuralLink();
      const url = canvas.toDataURL('image/png');
      onComplete(url);
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
        const trailLimit = isUnlocked ? (trailLevel / 100 * 0.60) : (Math.min(trailLevel, 25) / 100 * 0.60);
        const trailAlpha = 0.68 - trailLimit; 
        if (trailLimit > 0) { ctx.fillStyle = `rgba(0, 0, 0, ${trailAlpha})`; ctx.fillRect(0, 0, canvas.width, canvas.height); } 
        else { ctx.clearRect(0, 0, canvas.width, canvas.height); }
        const cx = canvas.width / 2;
        
        // ADJUSTMENT: Lower the center point slightly to center visual weight
        const cy = (canvas.height / 2) + 20; 

        const pulse = Math.sin(time) * 0.012 + 1; 
        const heart = Math.sin(time * 3) * (pulseIntensity / 100 * 10); 
        
        if (!isDraggingRef.current) {
            const activeSpooky = isUnlocked ? (spookySpeed / 100 * 0.25) : (Math.min(spookySpeed, 25) / 100 * 0.25);
            rotationRef.current += activeSpooky; 
        }

        ctx.save();
        ctx.translate(cx, cy);
        const scaleFactor = (Math.min(canvas.width, canvas.height) / 450) * zoom; 
        ctx.scale(pulse * scaleFactor, pulse * scaleFactor);
        const currentRot = rotationRef.current * Math.PI / 180;
        const reachFac = isUnlocked ? (armLength / 100) : (Math.min(armLength, 25) / 100);
        const armReach = 35 + (reachFac * 180); 
        const sSizeVal = 40 + (somaSize / 100 * 40);
        const startRad = sSizeVal * 0.85;
        const thickFac = isUnlocked ? (armThickness / 100) : (Math.min(armThickness, 50) / 100);
        const lineWidth = (thickFac * 20) + 2; 
        const flowIntensity = ((waviness / 100) * 0.012) + 0.004;

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
            ctx.strokeStyle = somaColor; ctx.lineWidth = lineWidth; ctx.stroke();
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
      
      {/* --- SECTION 1: CANVAS & PREVIEW (TOP 45% on Mobile, LEFT 55% on Landscape) --- */}
      <div 
          ref={containerRef} 
          className="h-[45%] landscape:h-full landscape:w-[55%] relative flex flex-col items-center border-b landscape:border-b-0 landscape:border-r border-white/5 cursor-grab active:cursor-grabbing group/preview overflow-hidden bg-transparent"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleMouseDown}
          onTouchMove={handleMouseMove}
          onTouchEnd={handleMouseUp}
      >
          {/* HEADER NAV */}
          <div className="absolute top-4 left-4 z-20 flex gap-4 pointer-events-none">
              <button 
                onClick={onBack} 
                className="pointer-events-auto flex items-center gap-2 bg-black/40 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full text-xs uppercase tracking-widest text-gray-400 hover:text-white transition-all hover:bg-white/10 font-bold"
              >
                  <ArrowLeft size={16} /> Back
              </button>
          </div>

          {/* NAME INPUT & RANDOMIZER - TOP CENTER */}
          <div className="absolute top-16 md:top-20 flex flex-col items-center z-20 w-full px-8 pointer-events-none">
              <div className="text-xs text-white/40 font-mono tracking-[0.5em] mb-3 uppercase">Name Your Node</div>
              
              <div className="flex items-center gap-2 mb-6 animate-fadeIn pointer-events-auto">
                  <div className="relative group/input">
                      <input 
                        type="text" 
                        value={nodeName}
                        onChange={(e) => setNodeName(e.target.value)}
                        className="bg-black/60 backdrop-blur-md border border-white/20 text-center text-white font-tech uppercase tracking-widest py-2 px-4 rounded-xl focus:outline-none focus:border-[#00FFFF] transition-all w-48 md:w-64 text-sm md:text-base shadow-lg"
                        placeholder="NODE_IDENTITY"
                      />
                      <Edit2 size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 opacity-50 pointer-events-none" />
                  </div>
                  
                  <button 
                    onClick={generateRandomName}
                    style={{ borderColor: theme.color, color: theme.color }}
                    className="p-2.5 bg-black/60 backdrop-blur-md border rounded-xl hover:bg-white/10 transition-all shadow-lg group/rand"
                    title="Generate Random Identity"
                  >
                      <Dna size={18} className="group-hover/rand:rotate-180 transition-transform duration-700" />
                  </button>
              </div>

              {/* Archetype Badge */}
              <div 
                  onClick={() => { playDataOpen(); setShowDossier(true); }}
                  className="pointer-events-auto flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full cursor-pointer hover:bg-white/10 hover:border-white/30 transition-all group/badge backdrop-blur-md"
              >
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span className="text-xs font-tech text-white uppercase tracking-widest font-bold">{theme.label}</span>
                  <span className="text-gray-600 mx-1">|</span>
                  <span className="text-[10px] font-mono text-gray-400 uppercase tracking-widest group-hover/badge:text-white transition-colors font-bold">{currentSkill}</span>
              </div>
          </div>

          {/* COHERENCE METER OVERLAY */}
          <div className="absolute bottom-16 w-full max-w-sm px-8 pointer-events-none z-20 flex flex-col items-center">
              <div className="w-full flex justify-between text-[10px] font-mono uppercase tracking-widest text-gray-400 mb-1 font-bold">
                  <span>Entropy</span>
                  <span className="text-white">Coherence: {Math.round(coherence)}%</span>
                  <span>Syntropy</span>
              </div>
              <div className="w-full h-2 bg-black/60 rounded-full border border-white/20 overflow-hidden backdrop-blur-md">
                  <div className="h-full w-full bg-gradient-to-r from-red-500 via-transparent to-cyan-500 opacity-50"></div>
                  <div className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_10px_white] transition-all duration-1000" style={{ left: `${coherence}%` }}></div>
              </div>
          </div>
          
          <canvas ref={canvasRef} className="absolute inset-0 z-10" />
          
          <div className="absolute bottom-4 left-0 w-full text-center pointer-events-none">
              <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] animate-pulse font-bold">Drag to Rotate // Bio-Forge V1.1</div>
          </div>
      </div>

      {/* --- SECTION 2: CONTROLS (BOTTOM 55% on Mobile, RIGHT 45% on Landscape) --- */}
      <div className="flex-1 landscape:w-[45%] bg-black/80 backdrop-blur-xl border-t landscape:border-t-0 landscape:border-l border-white/10 flex flex-col overflow-hidden relative z-20">
          
          {/* Controls Header */}
          <div className="flex items-center justify-between p-5 border-b border-white/5 bg-black/40">
              <div className="flex items-center gap-4">
                  <Activity size={20} style={{ color: theme.color }} />
                  <span className="font-tech text-sm uppercase tracking-[0.2em] text-white font-bold">Genetic Modifiers</span>
              </div>
              <div className="px-3 py-1 bg-white/5 rounded border border-white/10 text-[10px] font-mono text-gray-400">
                  PARAMS: UNLOCKED
              </div>
          </div>

          {/* SCROLLABLE CONTROL LIST */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-10 pb-24">
              {/* Category: Structure */}
              <div className="space-y-5 animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest mb-2 font-bold">
                      <Network size={14} /> Structure
                  </div>
                  <ControlSlider label="Soma Density" value={somaSize} onChange={setSomaSize} icon={<CircleDashed size={14}/>} color={`accent-[${theme.color}]`} />
                  <ControlSlider label="Nucleus Core" value={nucleusSize} onChange={setNucleusSize} icon={<Minimize2 size={14}/>} color={`accent-[${theme.color}]`} />
              </div>

              {/* Category: Dendrites */}
              <div className="space-y-5 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest mb-2 font-bold">
                      <Activity size={14} /> Connectivity
                  </div>
                  <ControlSlider label="Axon Reach" value={armLength} onChange={setArmLength} locked={!isUnlocked} icon={<Maximize2 size={14}/>} color={`accent-[${theme.color}]`} />
                  <ControlSlider label="Signal Width" value={armThickness} onChange={setArmThickness} locked={!isUnlocked} icon={<Grip size={14}/>} color={`accent-[${theme.color}]`} />
                  <ControlSlider label="Synaptic Flow" value={waviness} onChange={setWaviness} icon={<Waves size={14}/>} color={`accent-[${theme.color}]`} />
              </div>

              {/* Category: Mutation (Premium) */}
              <div className="space-y-5 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
                  <div className="flex items-center gap-2 text-xs font-mono text-amber-500/80 uppercase tracking-widest mb-2 font-bold">
                      <Zap size={14} /> Advanced Mutation {isUnlocked ? '' : '(Locked)'}
                  </div>
                  <ControlSlider label="Spike Growth" value={spikeFactor} onChange={setSpikeFactor} locked={!isUnlocked} color="accent-amber-500" icon={<Triangle size={14}/>} />
                  <ControlSlider label="Geometry Distortion" value={spikeAngle} onChange={setSpikeAngle} locked={!isUnlocked} color="accent-amber-500" icon={<RotateCw size={14}/>} />
                  <ControlSlider label="Membrane Luminosity" value={somaLum} onChange={setSomaLum} locked={!isUnlocked} color="accent-amber-500" icon={<Sun size={14}/>} />
              </div>

              {/* Category: Physics */}
              <div className="space-y-5 animate-fadeIn" style={{ animationDelay: '0.4s' }}>
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-500 uppercase tracking-widest mb-2 font-bold">
                      <Wind size={14} /> Physics Engine
                  </div>
                  <ControlSlider label="Drift Velocity" value={spookySpeed} onChange={setSpookySpeed} locked={!isUnlocked} icon={<Wind size={14}/>} color={`accent-[${theme.color}]`} />
                  <ControlSlider label="Pulse Rate" value={pulseIntensity} onChange={setPulseIntensity} icon={<Activity size={14}/>} color={`accent-[${theme.color}]`} />
              </div>
          </div>

          {/* FOOTER ACTION - SPLIT LAYOUT */}
          <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black via-black/95 to-transparent z-30 flex gap-4">
              {/* Randomize Button (Left) */}
              <button 
                onClick={randomize} 
                style={{ borderColor: theme.color, color: theme.color }}
                className="p-4 rounded-xl bg-white/5 border hover:bg-white/10 transition-all group shadow-lg"
                title="Randomize Features"
              >
                  <Dice5 size={24} className="group-hover:rotate-180 transition-transform duration-500" />
              </button>

              {/* Finalize Button (Right) */}
              <button 
                onClick={captureAvatar} 
                style={{ 
                    backgroundColor: theme.color,
                    boxShadow: `0 0 30px ${theme.color}4d`
                }}
                className="flex-1 py-5 text-black font-tech text-base uppercase tracking-[0.25em] rounded-xl hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 font-bold shadow-xl"
              >
                  <CheckCircle size={20} className="fill-current" />
                  Finalize Biomass
              </button>
          </div>
      </div>

      {/* Info Modal */}
      {showDossier && (
          <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setShowDossier(false)}>
              <div className="bg-black border border-white/20 p-8 rounded-2xl max-w-sm w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
                  <button className="absolute top-4 right-4 text-gray-500 hover:text-white" onClick={() => setShowDossier(false)}><X size={24}/></button>
                  <h3 className="font-tech text-white text-2xl uppercase tracking-widest mb-6">Neural Identity</h3>
                  <div className="space-y-4 text-sm font-mono text-gray-400">
                      <p><strong style={{ color: theme.color }}>ARCHETYPE:</strong> {theme.label}</p>
                      <p><strong style={{ color: theme.color }}>PROTOCOL:</strong> {theme.path}</p>
                      <p><strong style={{ color: theme.color }}>SKILL:</strong> {currentSkill}</p>
                      <div className="h-px bg-white/10 my-4"></div>
                      <p className="italic opacity-70 leading-relaxed">"This configuration represents your node's unique signature within the God Brain network. Physical parameters (color, shape) influence resonance frequency."</p>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENT: SLIDER ---
const ControlSlider = ({ label, value, onChange, min = 0, max = 100, locked = false, color = "accent-cyan-400", icon }: any) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!locked) {
            onChange(Number(e.target.value));
        } else {
            playError();
        }
    };

    // Color string handling to ensure valid class names or style injection
    const accentClass = color.startsWith('accent-') ? color : `accent-[${color}]`;

    return (
        <div className={`group ${locked ? 'opacity-40 grayscale pointer-events-none' : ''}`}>
            <div className="flex justify-between items-end mb-2">
                <div className="flex items-center gap-2 text-gray-400 group-hover:text-white transition-colors">
                    {icon && <span className="opacity-70">{icon}</span>}
                    <label className="font-mono text-xs uppercase tracking-wider font-bold">{label}</label>
                </div>
                <div className="flex items-center gap-2">
                    {locked && <Lock size={12} className="text-amber-500" />}
                    <span className="font-mono text-xs font-bold text-white">{Math.round(value)}%</span>
                </div>
            </div>
            <div className="relative h-8 flex items-center">
                <input 
                    type="range" 
                    min={min} 
                    max={max} 
                    value={value} 
                    onChange={handleChange}
                    className={`w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer ${accentClass} outline-none`}
                />
            </div>
        </div>
    );
};

// Mock Icons for layout consistency
const Maximize2 = ({ size, className }: any) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <polyline points="15 3 21 3 21 9"></polyline>
      <polyline points="9 21 3 21 3 15"></polyline>
      <line x1="21" y1="3" x2="14" y2="10"></line>
      <line x1="3" y1="21" x2="10" y2="14"></line>
    </svg>
);

const CheckCircle = ({ size, className }: any) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
);
