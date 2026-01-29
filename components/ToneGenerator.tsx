import React, { useState, useRef } from 'react';
import { Square, Activity, Radio } from 'lucide-react';
import { FREQUENCIES } from '../constants';
import { playCosmicClick, playMenuSelect } from '../utils/sfx';

export const ToneGenerator: React.FC = () => {
  const [activeFreq, setActiveFreq] = useState<number | null>(null);
  
  // Refs for Audio Context (Oscillator)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);

  // Note: Ambient audio is now handled by GlobalBackgroundAudio.tsx

  const playTone = (hz: number) => {
    playMenuSelect(); // Tuning sound
    
    if (activeFreq === hz) {
      stopTone();
      return;
    }

    // Stop current if any
    stopTone();

    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const ctx = audioCtxRef.current;
    
    // Create new oscillator
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(hz, ctx.currentTime);
    
    // Soft attack to avoid popping
    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    oscillatorRef.current = osc;
    gainRef.current = gain;
    setActiveFreq(hz);
  };

  const stopTone = () => {
    if (oscillatorRef.current && gainRef.current && audioCtxRef.current) {
      const ctx = audioCtxRef.current;
      const gain = gainRef.current;
      const osc = oscillatorRef.current;

      // Soft release
      gain.gain.cancelScheduledValues(ctx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);

      setTimeout(() => {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      }, 150);
      
      oscillatorRef.current = null;
      gainRef.current = null;
    }
    setActiveFreq(null);
  };

  return (
    <div className="p-1 border border-[#00FFFF]/30 rounded-2xl bg-black/80 relative overflow-hidden group h-full flex flex-col">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent opacity-50"></div>
      
      <div className="p-6 flex flex-col h-full">
        <div className="flex items-center justify-between mb-6">
            <div>
                <h3 className="text-lg font-tech text-[#00FFFF] uppercase tracking-widest">Resonance Tuner</h3>
                <p className="text-[9px] text-gray-500 font-mono">Neural Entrainment Engine</p>
            </div>
            <div className={`w-8 h-8 rounded-full border border-[#00FFFF]/50 flex items-center justify-center ${activeFreq ? 'animate-pulse shadow-[0_0_10px_#00FFFF]' : ''}`}>
                <Activity className="w-4 h-4 text-[#00FFFF]" />
            </div>
        </div>

        {/* Viz */}
        <div className="h-12 bg-black/50 border border-white/5 rounded-lg mb-6 flex items-center justify-center relative overflow-hidden shrink-0">
            <div className="flex gap-1 items-end h-8">
                {[...Array(20)].map((_, i) => (
                    <div 
                        key={i} 
                        className={`w-1 transition-all duration-75 rounded-t-sm ${
                            activeFreq 
                            ? 'bg-[#00FFFF] animate-pulse' 
                            : 'bg-gray-800 h-1'
                        }`}
                        style={{ 
                            height: activeFreq 
                                ? `${Math.random() * 100}%` 
                                : '10%' 
                        }}
                    ></div>
                ))}
            </div>
        </div>

        {/* Frequency Grid */}
        <div className="grid grid-cols-2 gap-3 overflow-y-auto custom-scrollbar pr-1 flex-1">
            {FREQUENCIES.map((freq) => (
                <button
                    key={freq.hz}
                    onClick={() => playTone(freq.hz)}
                    className={`p-3 rounded-lg border text-left transition-all relative overflow-hidden group/btn ${
                        activeFreq === freq.hz
                        ? 'bg-[#00FFFF]/20 border-[#00FFFF] text-[#00FFFF]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:border-[#00FFFF]/50 hover:bg-[#00FFFF]/5'
                    }`}
                >
                    <div className="flex justify-between items-start mb-1">
                        <span className="font-tech text-lg leading-none">{freq.hz}<span className="text-[10px] ml-1 opacity-70">Hz</span></span>
                        {activeFreq === freq.hz && <Radio className="w-3 h-3 animate-pulse" />}
                    </div>
                    <div className="font-bold text-[9px] uppercase tracking-wider mb-0.5">{freq.label}</div>
                    <div className="text-[8px] font-mono opacity-60 truncate">{freq.desc}</div>
                    
                    {activeFreq === freq.hz && (
                        <div className="absolute bottom-0 left-0 h-0.5 bg-[#00FFFF] w-full animate-pulse"></div>
                    )}
                </button>
            ))}
        </div>
        
        {activeFreq && (
             <div className="mt-4 text-center">
                <button onClick={() => { playCosmicClick(); stopTone(); }} className="text-[10px] text-red-500 hover:text-red-400 uppercase tracking-widest font-bold flex items-center justify-center gap-2 w-full py-2 border border-red-900/30 rounded bg-red-900/10">
                    <Square className="w-3 h-3" /> Stop Frequency
                </button>
             </div>
        )}

      </div>
    </div>
  );
};