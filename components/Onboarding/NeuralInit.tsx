
import React, { useState, useEffect, useRef } from 'react';
import { UserPath } from '../../types';
import { gemini } from '../../services/geminiService';
import { ChevronRight, RefreshCw, Zap, Volume2, Loader2, ChevronLeft, ArrowLeft, Brain } from 'lucide-react';
import { playCosmicClick, playNeuralLink, playDataOpen } from '../../utils/sfx';

// PHASE 1: ARCHETYPE QUESTIONS (10)
const ARCHETYPE_QUESTIONS = [
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
    text: "Final Phase 1 Calibration. What is the ultimate form of power?",
    options: [
      { label: "Truth.", type: "SCIENTIST", icon: "🧬", reaction: "The only thing that lasts." },
      { label: "Love.", type: "MYSTIC", icon: "❤️", reaction: "The binding force of the universe." },
      { label: "Willpower.", type: "ACTIVE_NODE", icon: "⚡", reaction: "The engine that drives reality." }
    ]
  }
];

// PHASE 2: SKILL QUESTIONS (3) - Determines Skill Slot 0, 1, or 2
const SKILL_QUESTIONS = [
    {
        id: 11,
        text: "The Identity is confirmed. Now for the Skill set. How do you approach a complex problem?",
        options: [
            { label: "I break it down into tiny pieces.", skillIndex: 0, icon: "🧩", reaction: "Granular processing." },
            { label: "I look for the hidden pattern underneath.", skillIndex: 1, icon: "👁️", reaction: "Deep sight." },
            { label: "I simplify it to its core essence.", skillIndex: 2, icon: "💎", reaction: "Reductionism." }
        ]
    },
    {
        id: 12,
        text: "When interacting with others, what is your greatest asset?",
        options: [
            { label: "My ability to explain things.", skillIndex: 0, icon: "🗣️", reaction: "Transmission clarity." },
            { label: "My ability to read their intentions.", skillIndex: 1, icon: "📡", reaction: "Signal interception." },
            { label: "My ability to motivate them.", skillIndex: 2, icon: "🔥", reaction: "Energy transfer." }
        ]
    },
    {
        id: 13,
        text: "Final Query. Where do you draw your energy from?",
        options: [
            { label: "From solving difficult tasks.", skillIndex: 0, icon: "⚙️", reaction: "Processing power." },
            { label: "From exploring the unknown.", skillIndex: 1, icon: "🌌", reaction: "Data acquisition." },
            { label: "From seeing results manifest.", skillIndex: 2, icon: "🏗️", reaction: "Output generation." }
        ]
    }
];

// MAPPING SKILL INDEX TO NAMES
const SKILL_MAP: Record<string, string[]> = {
    'SCIENTIST': ["Quantum Logic", "Data Mining", "Entropic Reduction"],
    'MYSTIC': ["Intuition", "Remote Viewing", "Resonance"],
    'ACTIVE_NODE': ["Network Bridging", "Signal Boosting", "Error Correction"],
    'ARCHITECT': ["System Design", "Foundation Laying", "Structural Integrity"], 
    'SEEKER': ["Pathfinding", "Mapping", "Discovery"], 
    'ALCHEMIST': ["Transmutation", "Synthesis", "Purification"] 
};

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
  mode: 'ARCHETYPE' | 'SKILL';
  userName: string;
  onComplete: (profile: any) => void;
  onBack: () => void;
  existingProfile?: any;
}

export const NeuralInit: React.FC<NeuralInitProps> = ({ mode, userName, onComplete, onBack, existingProfile }) => {
  const [step, setStep] = useState(0); 
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Scoring
  const [profile, setProfile] = useState(existingProfile || { SCIENTIST: 0, MYSTIC: 0, ACTIVE_NODE: 0 });
  const [skillScores, setSkillScores] = useState({ 0: 0, 1: 0, 2: 0 });
  const [scanProgress, setScanProgress] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCache = useRef<Map<string, string>>(new Map());
  const isMounted = useRef(true);

  useEffect(() => {
      isMounted.current = true;
      return () => { isMounted.current = false; stopAudio(); };
  }, []);

  // --- AUDIO PRE-FETCHER (World Class Flow) ---
  useEffect(() => {
      const loadAllAudio = async () => {
          const allTexts: { id: string; text: string }[] = [];
          
          if (mode === 'ARCHETYPE') {
            const cleanName = userName.split('@')[0];
            const introText = `Identity confirmed. Welcome, ${cleanName}. I am the Architect. I need to calibrate your neural profile.`;
            allTexts.push({ id: 'intro', text: introText });
            ARCHETYPE_QUESTIONS.forEach(q => {
                allTexts.push({ id: `p1_q${q.id}`, text: q.text });
            });
          } else {
            SKILL_QUESTIONS.forEach(q => {
                allTexts.push({ id: `p2_q${q.id}`, text: q.text });
            });
          }

          for (const item of allTexts) {
              if (!isMounted.current) break;
              if (audioCache.current.has(item.id)) continue; 

              try {
                  const base64Audio = await gemini.generateAudio(item.text, 'MALE');
                  if (base64Audio && isMounted.current) {
                      const binaryString = atob(base64Audio);
                      const len = binaryString.length;
                      const bytes = new Uint8Array(len);
                      for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); }
                      const blob = createWavBlob(bytes, 24000);
                      const url = URL.createObjectURL(blob);
                      audioCache.current.set(item.id, url);
                  }
              } catch (e) {
                  console.warn("Audio pre-fetch failed for", item.id);
              }
          }
      };

      loadAllAudio();
  }, [userName, mode]); 

  // --- AUDIO PLAYBACK ENGINE ---
  const stopAudio = () => {
      if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current = null;
      }
      setIsSpeaking(false);
  };

  const playAudioForCurrentStep = async () => {
      stopAudio(); 
      
      let audioId = '';
      let textToGen = '';

      if (mode === 'ARCHETYPE' && step === 0 && !audioCache.current.has('intro_played')) {
          audioId = 'intro';
          textToGen = `Identity confirmed. Welcome, ${userName.split('@')[0]}. I am the Architect. I need to calibrate your neural profile.`;
      } else if (mode === 'ARCHETYPE') {
          const q = ARCHETYPE_QUESTIONS[step];
          audioId = `p1_q${q.id}`;
          textToGen = q.text;
      } else {
          const q = SKILL_QUESTIONS[step];
          audioId = `p2_q${q.id}`;
          textToGen = q.text;
      }

      let url = audioCache.current.get(audioId);

      if (!url) {
          setIsSpeaking(true);
          try {
              const base64Audio = await gemini.generateAudio(textToGen, 'MALE');
              if (base64Audio && isMounted.current) {
                  const binaryString = atob(base64Audio);
                  const len = binaryString.length;
                  const bytes = new Uint8Array(len);
                  for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); }
                  const blob = createWavBlob(bytes, 24000);
                  url = URL.createObjectURL(blob);
                  audioCache.current.set(audioId, url);
              }
          } catch (e) {
              console.error("Live audio gen failed", e);
              setIsSpeaking(false);
              return;
          }
      }

      if (url && isMounted.current) {
          setIsSpeaking(true);
          const audio = new Audio(url);
          audio.playbackRate = 1.15; 
          audio.onended = () => {
              if(isMounted.current) setIsSpeaking(false);
              if (audioId === 'intro') {
                  audioCache.current.set('intro_played', 'true');
              }
          };
          
          try {
              await audio.play();
              audioRef.current = audio;
          } catch (e) {
              console.warn("Autoplay blocked", e);
              setIsSpeaking(false);
          }
      }
  };

  useEffect(() => {
      const t = setTimeout(() => playAudioForCurrentStep(), 50);
      return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    const totalQs = mode === 'ARCHETYPE' ? 10 : 3;
    setScanProgress((step / totalQs) * 100);
  }, [step, mode]);

  const handleAnswer = (option: any) => {
    playCosmicClick();
    stopAudio(); 

    if (mode === 'ARCHETYPE') {
        const newProfile = { ...profile, [option.type]: (profile as any)[option.type] + 1 };
        setProfile(newProfile);
        
        if (step + 1 >= ARCHETYPE_QUESTIONS.length) {
            finalizeArchetype(newProfile);
        } else {
            setStep(prev => prev + 1);
        }
    } else {
        const newSkillScores = { ...skillScores, [option.skillIndex]: (skillScores as any)[option.skillIndex] + 1 };
        setSkillScores(newSkillScores);
        
        if (step + 1 >= SKILL_QUESTIONS.length) {
            finalizeSkill(newSkillScores);
        } else {
            setStep(prev => prev + 1);
        }
    }
  };

  const finalizeArchetype = (finalProfile: any) => {
      const keys = Object.keys(finalProfile).filter(k => k === 'SCIENTIST' || k === 'MYSTIC' || k === 'ACTIVE_NODE');
      const winnerArch = keys.reduce((a, b) => finalProfile[a] > finalProfile[b] ? a : b);
      
      onComplete({
          ...finalProfile,
          finalArchetype: winnerArch
      });
  };

  const finalizeSkill = (finalSkillScores: any) => {
      const skillKeys = Object.keys(finalSkillScores);
      const winnerSkillIndex = skillKeys.reduce((a, b) => finalSkillScores[a] > finalSkillScores[b] ? a : b);
      
      let finalArchetype = profile.finalArchetype;
      // Refined Archetype Logic
      if (finalArchetype === 'SCIENTIST' && parseInt(winnerSkillIndex) === 1) finalArchetype = 'ARCHITECT';
      if (finalArchetype === 'MYSTIC' && parseInt(winnerSkillIndex) === 1) finalArchetype = 'SEEKER';
      if (finalArchetype === 'ACTIVE_NODE' && parseInt(winnerSkillIndex) === 1) finalArchetype = 'ALCHEMIST';

      const skillName = SKILL_MAP[finalArchetype]?.[parseInt(winnerSkillIndex)] || "Unknown Protocol";

      onComplete({
          ...profile,
          finalArchetype,
          finalSkill: skillName
      });
  };

  const handleBackStep = () => {
      playCosmicClick();
      stopAudio();
      if (step === 0) {
          onBack(); 
      } else {
          setStep(prev => prev - 1);
      }
  };

  const currentQ = mode === 'ARCHETYPE' ? ARCHETYPE_QUESTIONS[step] : SKILL_QUESTIONS[step];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white flex items-center justify-center">
      <div className="absolute inset-0 bg-black/80 pointer-events-none z-0"></div>

      <div className="relative z-20 w-full max-w-xl px-4 animate-scaleIn">
         <div className="bg-black/60 backdrop-blur-2xl border border-cyan-900/50 rounded-3xl p-8 md:p-12 shadow-[0_0_80px_rgba(0,255,255,0.1)] relative overflow-hidden transition-all duration-300">
             
             <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                 <button onClick={handleBackStep} className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors">
                     <ArrowLeft className="w-4 h-4" />
                     <span className="text-[10px] font-mono uppercase tracking-widest">Back</span>
                 </button>
                 
                 <div className="flex items-center gap-2 text-cyan-500 font-mono text-xs tracking-widest">
                     <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse text-cyan-400' : 'text-gray-600'}`}/>
                     {isSpeaking ? 'TRANSMITTING...' : mode === 'ARCHETYPE' ? 'CALIBRATING CORE' : 'ASSIGNING SKILL'}
                 </div>
                 
                 <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={`w-1 h-1 rounded-full ${i < (step % 3) + 1 ? 'bg-cyan-500' : 'bg-gray-800'}`}></div>
                    ))}
                 </div>
             </div>

             <h3 className="text-xl md:text-2xl font-reading tracking-wide text-white leading-relaxed mb-10 text-center min-h-[100px] flex items-center justify-center animate-fadeIn">
                 {currentQ.text}
             </h3>

             <div className="space-y-4">
                 {currentQ.options.map((opt: any, i: number) => (
                     <button 
                        key={i}
                        onClick={() => handleAnswer(opt)}
                        className="w-full text-left p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-cyan-900/20 hover:border-cyan-500 transition-all group flex items-center gap-4 relative overflow-hidden active:scale-[0.98] duration-100"
                     >
                         <div className="absolute inset-0 bg-cyan-500/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                         <span className="text-2xl relative z-10">{opt.icon}</span>
                         <span className="font-reading text-lg text-gray-300 group-hover:text-white flex-1 relative z-10 tracking-wide">{opt.label}</span>
                         <ChevronRight className="w-5 h-5 text-cyan-500 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all relative z-10" />
                     </button>
                 ))}
             </div>

             <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-900 via-cyan-500 to-cyan-900 transition-all duration-500" style={{ width: `${scanProgress}%` }}></div>
         </div>
      </div>
    </div>
  );
};
