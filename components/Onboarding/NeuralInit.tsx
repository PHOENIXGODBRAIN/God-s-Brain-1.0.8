
import React, { useState, useEffect, useRef } from 'react';
import { UserPath } from '../../types';
import { gemini } from '../../services/geminiService';
import { ChevronRight, RefreshCw, Zap, Volume2, Loader2, ChevronLeft, ArrowLeft } from 'lucide-react';
import { playCosmicClick, playNeuralLink, playDataOpen } from '../../utils/sfx';

// THE NARRATIVE SCRIPT (10 QUESTIONS)
const QUESTIONS = [
  {
    id: 1,
    text: "Let's start simple. When you look at the stars, what is the first thought that enters your mind?",
    options: [
      { label: "It looks like a giant machine.", type: "SCIENTIST", icon: "🧬", reaction: "A mechanic of the cosmos. Efficient." },
      { label: "It looks like a map of my destiny.", type: "MYSTIC", icon: "🕯️", reaction: "The stars guide you? Interesting." },
      { label: "It looks like territory to conquer.", type: "ACTIVE_NODE", icon: "⚡", reaction: "Ambitious. I like that." }
    ]
  },
  {
    id: 2,
    text: "You find a locked door in a recurring dream. How do you proceed?",
    options: [
      { label: "I pick the lock.", type: "ACTIVE_NODE", icon: "⚡", reaction: "Criminal... but effective." },
      { label: "I study the mechanism.", type: "SCIENTIST", icon: "🔑", reaction: "By the book. Methodical." },
      { label: "I knock and wait.", type: "MYSTIC", icon: "🚪", reaction: "Patience is a virtue, or a weakness." }
    ]
  },
  {
    id: 3,
    text: "Imagine your life suddenly falls apart. Everything goes wrong at once. What is your honest reaction?",
    options: [
      { label: "I pull back and analyze.", type: "SCIENTIST", icon: "📊", reaction: "Data collection before action. Smart." },
      { label: "I go quiet and surrender.", type: "MYSTIC", icon: "🛡️", reaction: "Acceptance of the flow. Dangerous, but peaceful." },
      { label: "I stand up and fight.", type: "ACTIVE_NODE", icon: "⚔️", reaction: "The warrior instinct. Necessary for survival." }
    ]
  },
  {
    id: 4,
    text: "If the Universe offered you one gift to help you on your journey, which one would you take?",
    options: [
      { label: "The Key to All Knowledge.", type: "SCIENTIST", icon: "👁️", reaction: "Ignorance is indeed fatal." },
      { label: "The Connection to Source.", type: "MYSTIC", icon: "🌑", reaction: "Bypassing the intellect. A shortcut to God." },
      { label: "The Remedy (Inner Healing).", type: "ACTIVE_NODE", icon: "⚗️", reaction: "Optimizing the vessel. Practical." }
    ]
  },
  {
    id: 5,
    text: "You meet a person who is suffering. How do you help them?",
    options: [
      { label: "I teach them to heal themselves.", type: "ACTIVE_NODE", icon: "⚡", reaction: "Empowerment. You hate dependency." },
      { label: "I analyze why they are hurting.", type: "SCIENTIST", icon: "🧬", reaction: "Diagnosis is the first step to a cure." },
      { label: "I sit with them in the dark.", type: "MYSTIC", icon: "🕯️", reaction: "Empathy. The heavy burden." }
    ]
  },
  {
    id: 6,
    text: "At the end of your life, what do you hope to say?",
    options: [
      { label: "I understood it.", type: "SCIENTIST", icon: "🧠", reaction: "To solve the puzzle. A noble goal." },
      { label: "I improved it.", type: "ACTIVE_NODE", icon: "🏗️", reaction: "Leaving a mark on the hardware." },
      { label: "I became it.", type: "MYSTIC", icon: "✨", reaction: "Total integration. The Omega Point." }
    ]
  },
  {
    id: 7,
    text: "You look into a mirror, but the reflection is different. What do you see?",
    options: [
      { label: "A version of me that is stronger.", type: "ACTIVE_NODE", icon: "💪", reaction: "Always seeking the upgrade." },
      { label: "A stranger I need to know.", type: "MYSTIC", icon: "🔮", reaction: "The self is an illusion." },
      { label: "The geometry behind my face.", type: "SCIENTIST", icon: "📐", reaction: "Seeing the wireframe. Interesting." }
    ]
  },
  {
    id: 8,
    text: "What is the most dangerous thing to lose?",
    options: [
      { label: "Your Purpose.", type: "ACTIVE_NODE", icon: "🎯", reaction: "Without direction, velocity is useless." },
      { label: "Your Mind.", type: "SCIENTIST", icon: "🧩", reaction: "The processor is everything." },
      { label: "Your Connection.", type: "MYSTIC", icon: "🔌", reaction: "To be unplugged is to be dead." }
    ]
  },
  {
    id: 9,
    text: "You are forced to make a life-or-death decision in 10 seconds. You have ZERO data. How do you choose?",
    options: [
      { label: "I trust my gut instinct.", type: "ACTIVE_NODE", icon: "🔥", reaction: "Speed over accuracy." },
      { label: "I quiet my mind to hear the signal.", type: "MYSTIC", icon: "🌊", reaction: "Trusting the invisible." },
      { label: "I hesitate.", type: "SCIENTIST", icon: "🛑", reaction: "Analysis paralysis. We must fix that." }
    ]
  },
  {
    id: 10,
    text: "Final Calibration. What is the ultimate form of power?",
    options: [
      { label: "Truth.", type: "SCIENTIST", icon: "🧬", reaction: "The only thing that lasts." },
      { label: "Love.", type: "MYSTIC", icon: "❤️", reaction: "The binding force of the universe." },
      { label: "Willpower.", type: "ACTIVE_NODE", icon: "⚡", reaction: "The engine that drives reality." }
    ]
  }
];

// --- WAV HEADER UTILITY ---
const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

const createWavBlob = (pcmData: Uint8Array, sampleRate: number): Blob => {
  const numChannels = 1;
  const byteRate = sampleRate * numChannels * 2; 
  const blockAlign = numChannels * 2;
  const dataSize = pcmData.length;
  const headerSize = 44;
  const totalSize = headerSize + dataSize;
  
  const buffer = new ArrayBuffer(totalSize);
  const view = new DataView(buffer);
  
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); 
  view.setUint16(20, 1, true); 
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, 16, true); 
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);
  const pcmBytes = new Uint8Array(buffer, 44);
  pcmBytes.set(pcmData);
  return new Blob([buffer], { type: 'audio/wav' });
};

interface NeuralInitProps {
  userName: string;
  onComplete: (profile: any) => void;
  onBack: () => void;
}

export const NeuralInit: React.FC<NeuralInitProps> = ({ userName, onComplete, onBack }) => {
  const [step, setStep] = useState(0); 
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLoading, setAudioLoading] = useState(false);
  const [profile, setProfile] = useState({ SCIENTIST: 0, MYSTIC: 0, ACTIVE_NODE: 0 });
  const [scanProgress, setScanProgress] = useState(0);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // --- AUDIO ENGINE (GEMINI) ---
  const playAiVoice = async (text: string, callback?: () => void) => {
    const cleanText = text.replace(/[*_]/g, ''); 
    
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
    }

    setAudioLoading(true);
    setIsSpeaking(true);

    try {
        const base64Audio = await gemini.generateAudio(cleanText, 'MALE');
        
        if (base64Audio) {
            const binaryString = atob(base64Audio);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = createWavBlob(bytes, 24000);
            const url = URL.createObjectURL(blob);
            
            const audio = new Audio(url);
            audio.onended = () => {
                setIsSpeaking(false);
                if (callback) callback();
            };
            audio.play().catch(e => console.warn("Autoplay blocked:", e));
            audioRef.current = audio;
        } else {
            setTimeout(() => {
                setIsSpeaking(false);
                if (callback) callback();
            }, 1000);
        }
    } catch (e) {
        console.error("Audio gen error", e);
        setIsSpeaking(false);
        if (callback) callback();
    } finally {
        setAudioLoading(false);
    }
  };

  // --- INIT SEQUENCE ---
  useEffect(() => {
    const cleanName = userName.split('@')[0];
    const introText = `Identity confirmed. Welcome, ${cleanName}. I am the Architect. Before I grant you access to the Neural Net, I need to calibrate your profile.`;
    playAiVoice(introText);
  }, []);

  // --- QUESTION SEQUENCE ---
  useEffect(() => {
    if (step >= 0 && step < QUESTIONS.length) {
        setScanProgress(((step) / QUESTIONS.length) * 100);
        if (step > 0) {
             playAiVoice(QUESTIONS[step].text);
        }
    }
  }, [step]);

  // --- HANDLERS ---
  const handleAnswer = (option: any) => {
    // LOCK: Prevent selection until audio has started AND finished (Strict adherence to "After voice")
    if (audioLoading || isSpeaking) return; 
    
    playCosmicClick();

    // Update Profile
    setProfile(prev => ({ ...prev, [option.type]: (prev as any)[option.type] + 1 }));

    // Voice Reaction -> Then Next Step
    playAiVoice(option.reaction, () => {
        if (step + 1 >= QUESTIONS.length) {
            setTimeout(() => onComplete(profile), 1000);
        } else {
            setStep(step + 1);
        }
    });
  };

  const handleBackStep = () => {
      playCosmicClick();
      if (step === 0) {
          onBack(); // Exit if at start
      } else {
          setStep(prev => prev - 1);
          // Revert profile score logic would be complex here without history tracking, 
          // simplified to just stepping back for UI correction.
      }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white flex items-center justify-center">
      
      {/* 1. BACKGROUND */}
      <div className="absolute inset-0 bg-black/80 pointer-events-none z-0"></div>

      {/* 2. CENTER UI */}
      <div className="relative z-20 w-full max-w-xl px-4 animate-scaleIn">
                 
         {/* GLASS CARD */}
         <div className="bg-black/60 backdrop-blur-2xl border border-cyan-900/50 rounded-3xl p-8 md:p-12 shadow-[0_0_80px_rgba(0,255,255,0.1)] relative overflow-hidden">
             
             {/* Header */}
             <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                 <button 
                    onClick={handleBackStep}
                    className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors"
                 >
                     <ArrowLeft className="w-4 h-4" />
                     <span className="text-[10px] font-mono uppercase tracking-widest">Back</span>
                 </button>
                 
                 <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs tracking-widest">
                     {audioLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`}/>}
                     {audioLoading ? 'SYNCING...' : isSpeaking ? 'TRANSMITTING...' : 'AWAITING INPUT'}
                 </div>
                 <span className="text-amber-500 font-mono text-xs">{step + 1} / {QUESTIONS.length}</span>
             </div>

             {/* Question Text - UPDATED FOR READABILITY */}
             <h3 className="text-xl md:text-2xl font-reading tracking-wide text-white leading-relaxed mb-10 text-center min-h-[100px] flex items-center justify-center animate-fadeIn">
                 {QUESTIONS[step].text}
             </h3>

             {/* Options */}
             <div className={`space-y-4 transition-all duration-300 ${audioLoading || isSpeaking ? 'opacity-50 grayscale cursor-not-allowed' : 'opacity-100'}`}>
                 {QUESTIONS[step].options.map((opt, i) => (
                     <button 
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        disabled={audioLoading || isSpeaking}
                        className="w-full text-left p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-cyan-900/20 hover:border-cyan-500 transition-all group flex items-center gap-4 relative overflow-hidden disabled:pointer-events-none"
                     >
                         <div className="absolute inset-0 bg-cyan-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                         <span className="text-2xl relative z-10">{opt.icon}</span>
                         <span className="font-reading text-lg text-gray-300 group-hover:text-white flex-1 relative z-10 tracking-wide">{opt.label}</span>
                         <ChevronRight className="w-5 h-5 text-cyan-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all relative z-10" />
                     </button>
                 ))}
             </div>

             {/* Progress Bar */}
             <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-900 via-cyan-500 to-cyan-900 transition-all duration-500" style={{ width: `${scanProgress}%` }}></div>
             
             {/* Lock Indicator */}
             {(audioLoading || isSpeaking) && (
                <div className="absolute top-4 right-4 text-[10px] text-red-500 font-bold uppercase tracking-widest animate-pulse border border-red-900 px-2 py-1 rounded bg-black/50">
                    {audioLoading ? 'Buffering...' : 'Voice Active'}
                </div>
             )}
         </div>
      </div>
    </div>
  );
};
