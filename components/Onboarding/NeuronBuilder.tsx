
import React, { useRef, useEffect, useState } from 'react';
import { playNeuralLink, playCosmicClick, playError, playMenuSelect } from '../../utils/sfx';
import { ArrowLeft, RefreshCw, Dna, Lock, Zap, Activity, CircleDashed, Sun, Gauge, Network, RotateCw, ZoomIn } from 'lucide-react';
import { UserProfile } from '../../types';

interface NeuronBuilderProps {
  archetype: string; 
  onComplete: (avatarUrl: string) => void;
  onUpdateProfile?: (updates: Partial<UserProfile>) => void;
  onBack: () => void;
}

const DNA_NAMES = [
    "Synapse-X1", "Neuro-7", "Cortex-Prime", "Axon-Delta", "Dendrite-V", 
    "Soma-Alpha", "Glial-9", "Myelin-Z", "Vesicle-Core", "Receptor-K", "Node-Zero", "Omni-Cell"
];

const COLORS = [
    { hex: '#FFFFFF', name: 'Quartz White', locked: false },
    { hex: '#FF4500', name: 'Mars Red', locked: false },
    { hex: '#10B981', name: 'Gaia Green', locked: false },
    { hex: '#00FFFF', name: 'Neon Cyan', locked: false },
    { hex: '#F59E0B', name: 'Solar Amber', locked: false },
    { hex: '#000000', name: 'Void Black', locked: true, type: 'PREMIUM' },
    { hex: '#E2E8F0', name: 'Platinum', locked: true, type: 'PREMIUM' },
    { hex: '#D946EF', name: 'Plasma Pink', locked: true, type: 'PREMIUM' }
];

export const NeuronBuilder: React.FC<NeuronBuilderProps> = ({ archetype, onComplete, onUpdateProfile, onBack }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // --- STATE: IDENTITY ---
  const [neuronName, setNeuronName] = useState("Proto-Node");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);

  // --- STATE: SOMA CONFIG ---
  const [somaLum, setSomaLum] = useState(80); // Bioluminescence (60-120 range effectively)
  const [rhythm, setRhythm] = useState<'ALPHA' | 'GAMMA'>('ALPHA'); // Pulse speed

  // --- STATE: DENDRITES ---
  const [armLength, setArmLength] = useState(30); // 0-50 (Hard cap for Level 1)
  const [armColor, setArmColor] = useState<string>('#FFFFFF'); // Will set to default on mount

  // --- STATE: VIEWPORT ---
  const [rotation, setRotation] = useState(0);
  
  // --- THEME ENGINE ---
  const getTheme = () => {
      const base = {
          SCIENTIST: { color: '#00FFFF', label: 'CLASS: THE SCIENTIST', id: 'SCI' },
          MYSTIC: { color: '#A855F7', label: 'CLASS: THE MYSTIC', id: 'MYS' },
          ACTIVE_NODE: { color: '#FF4500', label: 'CLASS: ACTIVE NODE', id: 'ACT' },
          ARCHITECT: { color: '#F43F5E', label: 'CLASS: THE ARCHITECT', id: 'ARC' }, // Rose
          SEEKER: { color: '#F97316', label: 'CLASS: THE SEEKER', id: 'SEE' },
          ALCHEMIST: { color: '#10B981', label: 'CLASS: THE ALCHEMIST', id: 'ALC' }
      };
      return base[archetype as keyof typeof base] || base.ACTIVE_NODE;
  };
  const theme = getTheme();

  // Set initial arm color to white (default) on mount
  useEffect(() => {
      setArmColor(COLORS[0].hex);
  }, []);

  // --- LOGIC HANDLERS ---
  const handleRandomName = () => {
      playCosmicClick();
      const random = DNA_NAMES[Math.floor(Math.random() * DNA_NAMES.length)];
      const suffix = Math.floor(Math.random() * 999);
      setNeuronName(`${random}-${suffix}`);
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>, setter: (v: number) => void) => {
      const val = parseInt(e.target.value);
      // Visual constraint logic is handled in the UI rendering (max=50)
      playMenuSelect();
      setter(val);
  };

  const handleColorSelect = (c: typeof COLORS[0]) => {
      if (c.locked) {
          playError();
          // Haptic
          if (navigator.vibrate) navigator.vibrate(100);
          return;
      }
      playCosmicClick();
      setArmColor(c.hex);
  };

  const handleRhythmSelect = (type: 'ALPHA' | 'GAMMA') => {
      if (type === 'GAMMA') {
          playError();
          return;
      }
      playCosmicClick();
      setRhythm(type);
  };

  const handleFinish = () => {
      playNeuralLink();
      setIsGenerating(true);
      
      // Update Name in Global State
      if (onUpdateProfile) {
          onUpdateProfile({ name: neuronName });
      }

      // Simulate Genetic Weaving
      let p = 0;
      const interval = setInterval(() => {
          p += 4; // Faster generation
          setGenerationProgress(p);
          if (p >= 100) {
              clearInterval(interval);
              if (canvasRef.current) {
                  // Capture the organism
                  const dataUrl = canvasRef.current.toDataURL();
                  onComplete(dataUrl);
              }
          }
      }, 50);
  };

  // --- RENDER LOOP (2.5D PROTO-NEURON ENGINE) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Responsive Canvas Resizing for Rotation
    const resizeCanvas = () => {
        // Set canvas resolution to match display size for sharpness
        const parent = canvas.parentElement;
        if(parent) {
            canvas.width = parent.clientWidth;
            canvas.height = parent.clientHeight;
        }
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    let frameId: number;
    let time = 0;

    const render = () => {
        time += rhythm === 'GAMMA' ? 0.15 : 0.05;
        
        // 1. Setup Canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        
        // 2. Pulse Math (Microtubule Resonance)
        const pulseBase = Math.sin(time); 
        const pulse = pulseBase * 0.05 + 1; // Scale factor 0.95 to 1.05
        const glowIntensity = (somaLum / 100) * 30 + (pulseBase * 10);

        // 3. Geometry Setup
        ctx.save();
        ctx.translate(cx, cy);
        
        // Scale Factor - Adjust slightly based on screen size so it fits
        const scaleFactor = Math.min(canvas.width, canvas.height) / 400; 
        ctx.scale(pulse * scaleFactor, pulse * scaleFactor);
        
        // --- DRAW DENDRITES (The Arms) ---
        // Quad-polar structure (X shape)
        const armCount = 4;
        const baseLength = 60; 
        const extension = armLength * 1.5; // Scale slider to pixels
        const totalLength = baseLength + extension;

        for (let i = 0; i < armCount; i++) {
            // Calculate Angle with Rotation
            // 45, 135, 225, 315 degrees + user rotation
            const baseAngle = (Math.PI / 2) * i + (Math.PI / 4); 
            const angle = baseAngle + (rotation * Math.PI / 180);

            const ex = Math.cos(angle) * totalLength;
            const ey = Math.sin(angle) * totalLength;

            // Gradient: Soma Color (Center) -> Membrane Potential (Tip)
            const grad = ctx.createLinearGradient(0, 0, ex, ey);
            grad.addColorStop(0, theme.color); 
            grad.addColorStop(0.4, theme.color); 
            grad.addColorStop(1, armColor);

            // Draw Arm
            ctx.beginPath();
            ctx.moveTo(0, 0);
            
            // Organic Curve (Wiggle)
            // Control points wiggle slightly with time to simulate fluid suspension
            const cp1x = (ex * 0.5) + Math.sin(time + i) * 5;
            const cp1y = (ey * 0.5) + Math.cos(time + i) * 5;
            
            ctx.quadraticCurveTo(cp1x, cp1y, ex, ey);
            
            ctx.strokeStyle = grad;
            ctx.lineWidth = 6 + (armLength * 0.05); // Thicker base
            ctx.lineCap = 'round';
            ctx.stroke();

            // Terminal Bouton (The Glowing Tip)
            ctx.beginPath();
            ctx.arc(ex, ey, 5, 0, Math.PI * 2);
            ctx.fillStyle = armColor;
            ctx.shadowColor = armColor;
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset
        }

        // --- DRAW SOMA (The Core) ---
        // Outer Membrane Glow
        const somaGrad = ctx.createRadialGradient(0, 0, 10, 0, 0, 35);
        somaGrad.addColorStop(0, '#FFFFFF'); // Hot white center
        somaGrad.addColorStop(0.3, theme.color); // Archetype color body
        somaGrad.addColorStop(1, 'transparent'); // Fade out

        ctx.beginPath();
        ctx.arc(0, 0, 35, 0, Math.PI * 2);
        ctx.fillStyle = somaGrad;
        
        // Bioluminescence Effect
        ctx.shadowColor = theme.color;
        ctx.shadowBlur = glowIntensity;
        ctx.fill();
        ctx.shadowBlur = 0;

        // Nucleus (The "Eye")
        ctx.beginPath();
        ctx.arc(0, 0, 10, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();

        ctx.restore();

        frameId = requestAnimationFrame(render);
    };

    render();
    return () => {
        window.removeEventListener('resize', resizeCanvas);
        cancelAnimationFrame(frameId);
    };
  }, [somaLum, rhythm, armLength, armColor, rotation, archetype]);

  return (
    <div className="absolute inset-0 w-full h-full bg-[#050505] flex flex-col landscape:flex-row text-[#e0f2fe] font-mono overflow-hidden">
      
      {/* ================= VISUAL LAB (TOP / LEFT) ================= */}
      {/* 
          PORTRAIT: h-[45%] top
          LANDSCAPE: w-[50%] left, h-full 
      */}
      <div className="h-[45%] landscape:h-full landscape:w-1/2 relative flex flex-col items-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-[#050505] to-black border-b landscape:border-b-0 landscape:border-r border-white/10 p-4">
          
          {/* Header */}
          <div className="w-full flex items-center justify-between z-20">
              <button onClick={onBack} className="p-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors group">
                  <ArrowLeft className="w-4 h-4 text-gray-400 group-hover:text-white" />
              </button>
              <div className="text-[10px] font-bold tracking-[0.2em] animate-pulse" style={{ color: theme.color }}>
                  {theme.label}
              </div>
              <div className="w-8"></div> {/* Spacer */}
          </div>

          {/* Name Input & Randomizer */}
          <div className="mt-4 flex items-center gap-2 z-20 w-full max-w-xs relative">
              <div className="relative flex-1 group">
                  <input 
                    type="text" 
                    value={neuronName}
                    onChange={(e) => setNeuronName(e.target.value)}
                    className="w-full bg-black/60 border border-white/20 rounded-xl py-3 px-4 text-center font-tech uppercase tracking-wider focus:border-white/50 focus:outline-none transition-all shadow-[0_0_15px_rgba(0,0,0,0.5)]"
                    style={{ color: theme.color, textShadow: `0 0 10px ${theme.color}40` }}
                  />
                  {/* High-tech corners */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30 rounded-tl"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30 rounded-br"></div>
              </div>
              <button 
                onClick={handleRandomName}
                className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/30 transition-all group active:scale-95"
                title="Mutate Designation"
              >
                  <Dna className="w-4 h-4 text-gray-400 group-hover:text-white group-hover:rotate-180 transition-transform duration-500" />
              </button>
          </div>

          {/* 3D Viewport Area */}
          <div className="absolute inset-0 top-20 flex items-center justify-center z-10 overflow-hidden">
              <canvas ref={canvasRef} className="w-full h-full object-contain" />
              
              {/* Interaction Overlay */}
              <div 
                className="absolute inset-0 cursor-ew-resize"
                onMouseMove={(e) => { 
                    if(e.buttons === 1) {
                        setRotation(prev => prev + e.movementX * 0.5);
                    }
                }}
                onTouchMove={(e) => {
                    const touch = e.touches[0];
                    const rect = (e.target as HTMLElement).getBoundingClientRect();
                    const x = touch.clientX - rect.left;
                    // Simple rotation mapping
                    setRotation(x * 0.5);
                }}
              ></div>

              {/* Rotation Helper Icon */}
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20 pointer-events-none flex gap-2 items-center">
                  <RotateCw className="w-4 h-4" />
                  <span className="text-[8px] uppercase tracking-widest">Rotate Axis</span>
              </div>
          </div>

          {/* HUD Overlay */}
          <div className="absolute bottom-4 right-4 z-20 flex flex-col items-end">
              <div className="flex items-center gap-2 text-[9px] text-[#00FFFF] font-bold tracking-widest bg-black/80 px-3 py-1.5 rounded border border-[#00FFFF]/30 backdrop-blur-md shadow-[0_0_10px_rgba(0,255,255,0.1)]">
                  <Activity className="w-3 h-3 animate-pulse" />
                  COHERENCE: 50%
              </div>
              <div className="text-[7px] text-gray-500 mt-1 uppercase tracking-widest flex items-center gap-1">
                  <Gauge className="w-2 h-2" />
                  Zero Point Field Locked
              </div>
          </div>
      </div>

      {/* ================= CONTROLS (BOTTOM / RIGHT) ================= */}
      {/* 
          PORTRAIT: flex-1, overflow-y
          LANDSCAPE: w-[50%] right, h-full, overflow-y
      */}
      <div className="flex-1 landscape:w-1/2 overflow-y-auto custom-scrollbar bg-black/40 backdrop-blur-md relative border-t landscape:border-t-0 border-white/5">
          
          <div className="p-6 space-y-8 pb-32 max-w-2xl mx-auto">
              
              {/* SECTION 1: SOMA CONFIGURATION */}
              <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-widest">
                          <Sun className="w-3 h-3 text-white" /> Soma Configuration
                      </div>
                      <div className="text-[9px] text-gray-600 font-mono">ID: CORE_LOGIC</div>
                  </div>
                  
                  {/* Spectral Signature (Fixed) */}
                  <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 opacity-70">
                      <span className="text-[10px] uppercase text-gray-400 font-bold">Spectral Signature (Fixed)</span>
                      <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full shadow-[0_0_5px_currentColor]" style={{ backgroundColor: theme.color }}></div>
                          <Lock className="w-3 h-3 text-gray-600" />
                      </div>
                  </div>

                  {/* Luminosity Slider */}
                  <div className="bg-black/40 border border-white/10 rounded-xl p-4">
                      <div className="flex justify-between text-[10px] text-gray-400 mb-3 uppercase font-bold">
                          <span>Bioluminescence</span>
                          <span className="text-white">{somaLum}%</span>
                      </div>
                      <input 
                        type="range" min="60" max="100" value={somaLum} 
                        onChange={(e) => handleSliderChange(e, setSomaLum)}
                        className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                        style={{ accentColor: theme.color }}
                      />
                  </div>

                  {/* Rhythm Selector */}
                  <div>
                      <div className="text-[10px] text-gray-500 uppercase font-bold mb-2 ml-1">Microtubule Resonance (Orch-OR)</div>
                      <div className="flex gap-2">
                          <button 
                            onClick={() => handleRhythmSelect('ALPHA')}
                            className={`flex-1 py-3 rounded-xl border text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${rhythm === 'ALPHA' ? `bg-${theme.color}/20 border-${theme.color} text-white` : 'bg-black border-white/10 text-gray-500'}`}
                            style={rhythm === 'ALPHA' ? { borderColor: theme.color, backgroundColor: `${theme.color}20` } : {}}
                          >
                              <CircleDashed className={`w-3 h-3 ${rhythm === 'ALPHA' ? 'animate-spin-slow' : ''}`} /> Alpha (Slow)
                          </button>
                          
                          {/* LOCKED GAMMA OPTION */}
                          <button 
                            onClick={() => handleRhythmSelect('GAMMA')}
                            className={`flex-1 py-3 rounded-xl border text-[9px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all relative overflow-hidden bg-black/40 border-white/5 text-gray-600 cursor-not-allowed`}
                          >
                              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-10"></div>
                              <Lock className="w-3 h-3" /> Gamma (Fast)
                          </button>
                      </div>
                      <div className="mt-2 text-[8px] text-gray-500 text-center italic">
                          Gamma State Awareness unlocks via Neural Achievements
                      </div>
                  </div>
              </div>

              {/* SECTION 2: DENDRITIC ARBORIZATION */}
              <div className="space-y-4 pt-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-widest">
                          <Network className="w-3 h-3 text-white" /> Synaptic Reach
                      </div>
                      <div className="text-[9px] text-gray-600 font-mono">ID: REACH_LOGIC</div>
                  </div>

                  {/* Length Slider (Capped) */}
                  <div className="bg-black/40 border border-white/10 rounded-xl p-4 relative overflow-hidden">
                      <div className="flex justify-between text-[10px] text-gray-400 mb-3 uppercase font-bold relative z-10">
                          <span>Growth Cone Extension</span>
                          <span className={armLength >= 50 ? "text-red-500 animate-pulse font-mono" : "text-white font-mono"}>
                              {armLength}% {armLength >= 50 && "[MAX LIMIT]"}
                          </span>
                      </div>
                      
                      <div className="relative z-10">
                          <input 
                            type="range" min="10" max="50" value={armLength} 
                            onChange={(e) => handleSliderChange(e, setArmLength)}
                            className="w-full h-1 bg-gray-800 rounded-lg appearance-none cursor-pointer"
                            style={{ accentColor: theme.color }}
                          />
                          
                          {/* Visual representation of the locked remaining 50% */}
                          <div className="absolute top-[6px] right-0 w-1/2 h-1 bg-red-900/30 pointer-events-none"></div>
                      </div>

                      {armLength >= 50 && (
                          <div className="mt-3 p-2 bg-red-900/20 border border-red-900/50 rounded flex items-center gap-2">
                              <Lock className="w-3 h-3 text-red-500" />
                              <span className="text-[9px] text-red-400 uppercase tracking-wide">
                                  Requires Cognitive Mass 5.0 (Level 5) to extend
                              </span>
                          </div>
                      )}
                  </div>

                  {/* Membrane Potential (Color) */}
                  <div>
                      <div className="text-[10px] text-gray-500 uppercase font-bold mb-3 ml-1">Membrane Potential</div>
                      <div className="grid grid-cols-4 gap-3">
                          {COLORS.map((c, i) => (
                              <button 
                                key={i}
                                onClick={() => handleColorSelect(c)}
                                className={`h-12 rounded-xl border relative group transition-all transform hover:scale-105 active:scale-95 ${armColor === c.hex ? 'border-white ring-2 ring-white/20' : 'border-transparent'}`}
                                style={{ backgroundColor: c.hex }}
                                title={c.name}
                              >
                                  {c.locked && (
                                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-xl backdrop-blur-[1px]">
                                          <Lock className="w-3 h-3 text-white mb-1" />
                                          <span className="text-[6px] text-white uppercase tracking-wider font-bold">ARCHITECT</span>
                                      </div>
                                  )}
                              </button>
                          ))}
                      </div>
                  </div>
              </div>

              {/* SECTION 3: EPIGENETIC POTENTIAL (LOCKED) */}
              <div className="space-y-4 pt-4 pb-8 opacity-70 grayscale hover:grayscale-0 transition-all duration-700">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-gray-300 uppercase tracking-widest">
                          <Dna className="w-3 h-3 text-white" /> Epigenetic Potential
                      </div>
                      <div className="text-[9px] text-gray-600 font-mono">STATUS: DORMANT</div>
                  </div>
                  
                  {[
                      { name: 'Myelin Sheath', desc: 'Increases signal velocity (Armor)', lvl: 10 },
                      { name: 'Axon Hillock', desc: 'Signal Booster (Amplifier)', lvl: 20 },
                      { name: 'Multipolar Expansion', desc: 'Grow 4 additional arms (Geometry)', lvl: 30 }
                  ].map((item, i) => (
                      <div key={i} className="relative p-4 bg-gradient-to-r from-gray-900 to-[#0a0a0a] border border-white/10 rounded-xl overflow-hidden group cursor-not-allowed">
                          <div className="flex justify-between items-center relative z-10">
                              <div>
                                  <div className="text-[10px] font-bold uppercase text-gray-400">{item.name}</div>
                                  <div className="text-[9px] text-gray-600">{item.desc}</div>
                              </div>
                              <div className="flex items-center gap-2 px-2 py-1 bg-black/50 rounded border border-white/10">
                                  <Lock className="w-3 h-3 text-gray-500" />
                                  <span className="text-[8px] text-gray-500 font-mono">LVL {item.lvl}</span>
                              </div>
                          </div>
                          
                          {/* Cryo Effect Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 to-transparent pointer-events-none"></div>
                          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diagonal-stripes.png')] opacity-5"></div>
                      </div>
                  ))}
              </div>

          </div>
      </div>

      {/* ================= FOOTER ACTION ================= */}
      <div className="absolute bottom-0 right-0 w-full landscape:w-1/2 p-6 bg-gradient-to-t from-black via-black to-transparent z-50">
          {!isGenerating ? (
              <button 
                onClick={handleFinish}
                className="w-full py-5 rounded-2xl font-tech text-lg uppercase tracking-[0.2em] text-white shadow-[0_0_40px_rgba(0,0,0,0.5)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 relative overflow-hidden group border border-white/10"
                style={{ backgroundColor: theme.color }}
              >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                  
                  <span className="relative z-10 flex items-center gap-3 font-bold text-shadow-glow">
                      <Zap className="w-5 h-5 fill-current" />
                      Finish Differentiation
                  </span>
              </button>
          ) : (
              <div className="w-full bg-gray-900 h-16 rounded-2xl border border-white/10 relative overflow-hidden flex flex-col items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                  <div 
                    className="absolute left-0 top-0 h-full transition-all duration-75 ease-out opacity-40"
                    style={{ width: `${generationProgress}%`, backgroundColor: theme.color }}
                  ></div>
                  
                  <span className="relative z-10 font-mono text-xs animate-pulse tracking-widest text-white mb-1">
                      WEAVING CELLULAR MATRIX... {generationProgress}%
                  </span>
                  
                  <div className="relative z-10 flex gap-1 h-1">
                      <div className="w-1 h-1 bg-white animate-bounce"></div>
                      <div className="w-1 h-1 bg-white animate-bounce delay-75"></div>
                      <div className="w-1 h-1 bg-white animate-bounce delay-150"></div>
                  </div>
              </div>
          )}
      </div>

    </div>
  );
};
