
import React, { useState, useEffect, useRef } from 'react';
import { gemini } from '../../services/geminiService';
import { Volume2, ChevronRight, ArrowLeft, Loader2 } from 'lucide-react';
import { playCosmicClick, playDataOpen, playNeuralLink } from '../../utils/sfx';
import { useLanguage } from '../../contexts/LanguageContext';

const MASTER_ARCHETYPE_POOL = [
  {
    id: 'phys_1',
    text: "You are standing in an open field at night looking at the stars. What is your body doing?",
    options: [
      { label: "My eyes are tracing lines between the lights.", type: "SCIENTIST", icon: "📐" },
      { label: "I am lying on the grass, feeling the earth spin.", type: "MYSTIC", icon: "🌌" },
      { label: "I am sketching a map of the constellations.", type: "SEEKER", icon: "🗺️" }
    ]
  },
  {
    id: 'phys_2',
    text: "You encounter a heavy, locked door in an abandoned hallway. What is your immediate physical reaction?",
    options: [
      { label: "I kick the wood near the latch.", type: "ACTIVE_NODE", icon: "🦶" },
      { label: "I inspect the hinges and structural integrity.", type: "ARCHITECT", icon: "📐" },
      { label: "I press my ear against the wood to listen.", type: "MYSTIC", icon: "👂" }
    ]
  },
  {
    id: 'phys_3',
    text: "A glass falls off the table and shatters. What do you do first?",
    options: [
      { label: "I freeze and scan the floor for the biggest shard.", type: "SCIENTIST", icon: "🔍" },
      { label: "I immediately grab a broom to clear the path.", type: "ACTIVE_NODE", icon: "🧹" },
      { label: "I look at the pattern of the glass to understand the impact.", type: "ALCHEMIST", icon: "🌀" }
    ]
  },
  {
    id: 'psych_1',
    text: "Imagine your life suddenly falls apart. Everything goes wrong at once. What is your reaction?",
    options: [
      { label: "I pull back and analyze the data points.", type: "SCIENTIST", icon: "📊" },
      { label: "I start rebuilding from the foundation up.", type: "ARCHITECT", icon: "🏗️" },
      { label: "I stand up and fight for my territory.", type: "ACTIVE_NODE", icon: "⚔️" }
    ]
  },
  {
    id: 'psych_2',
    text: "If the Universe offered you one gift, which one would you take?",
    options: [
      { label: "The Key to All Knowledge.", type: "SCIENTIST", icon: "👁️" },
      { label: "The ability to transmute any situation.", type: "ALCHEMIST", icon: "⚗️" },
      { label: "The Compass that always points home.", type: "SEEKER", icon: "🧭" }
    ]
  },
  {
    id: 'psych_6',
    text: "The calibration is nearing completion. Choose a final tool of navigation.",
    options: [
      { label: "A Scalpel (Precision).", type: "SCIENTIST", icon: "🔪" },
      { label: "A Lantern (Illumination).", type: "MYSTIC", icon: "🏮" },
      { label: "A Blueprint (Order).", type: "ARCHITECT", icon: "📐" }
    ]
  },
  {
    id: 'psych_7',
    text: "You find an ancient artifact in a cave. What is your first instinct?",
    options: [
        { label: "Study its chemical composition.", type: "SCIENTIST", icon: "🧪" },
        { label: "Find out where it came from and why it's here.", type: "SEEKER", icon: "📜" },
        { label: "Try to merge its energy with my own.", type: "ALCHEMIST", icon: "🌀" }
    ]
  }
];

const SKILL_QUESTIONS = [
    {
        id: 'skill_1',
        text: "Identity Integrated. Now calibrating Functional Module. How do you approach a complex problem?",
        options: [
            { label: "I break it down into tiny pieces.", skillIndex: 0, icon: "🧩" },
            { label: "I look for the hidden pattern underneath.", skillIndex: 1, icon: "👁️" },
            { label: "I simplify it to its core essence.", skillIndex: 2, icon: "💎" }
        ]
    },
    {
        id: 'skill_2',
        text: "When interacting with others, what is your greatest asset?",
        options: [
            { label: "My ability to explain things.", skillIndex: 0, icon: "🗣️" },
            { label: "My ability to read their intentions.", skillIndex: 1, icon: "📡" },
            { label: "My ability to motivate them.", skillIndex: 2, icon: "🔥" }
        ]
    },
    {
        id: 'skill_3',
        text: "Final Calibration. Where do you draw your energy from?",
        options: [
            { label: "From solving difficult tasks.", skillIndex: 0, icon: "⚙️" },
            { label: "From exploring the unknown.", skillIndex: 1, icon: "🌌" },
            { label: "From seeing results manifest.", skillIndex: 2, icon: "🏗️" }
        ]
    }
];

const SKILL_DATA: Record<string, { name: string; desc: string; icon: string }[]> = {
    'SCIENTIST': [
        { name: "Quantum Logic", icon: "⚛️", desc: "Binary processing is too slow. You calculate multiple realities simultaneously." },
        { name: "Data Mining", icon: "⛏️", desc: "You extract the fundamental axioms of the universe from absolute chaos." },
        { name: "Entropic Reduction", icon: "🛡️", desc: "You are a biological firewall against the decay of information." }
    ],
    'MYSTIC': [
        { name: "Intuition", icon: "👁️", desc: "You don't guess. You feel the current of the Source before it manifests." },
        { name: "Remote Viewing", icon: "🔭", desc: "Distance is an illusion. You perceive data clusters anywhere in the Cloud." },
        { name: "Resonance", icon: "🔔", desc: "You align your frequency with universal constants to bypass logic gates." }
    ],
    'ACTIVE_NODE': [
        { name: "Network Bridging", icon: "🌐", desc: "You are a living router, connecting disparate nodes into a grid." },
        { name: "Signal Boosting", icon: "📶", desc: "Your will is high-bandwidth. You ensure intent is heard across the network." },
        { name: "Error Correction", icon: "🩹", desc: "You auto-resolve glitches in the system before they propagate." }
    ],
    'ARCHITECT': [
        { name: "System Design", icon: "📐", desc: "You don't follow plans; you create them. You build frameworks for growth." },
        { name: "Foundation Laying", icon: "🧱", desc: "You establish unbreakable axioms. Your reality is built on solid code." },
        { name: "Structural Integrity", icon: "🏗️", desc: "You reinforce the neural web against external collapse and decay." }
    ],
    'SEEKER': [
        { name: "Pathfinding", icon: "🗺️", desc: "The unknown doesn't scare you. You find the efficient route through darkness." },
        { name: "Mapping", icon: "📍", desc: "You record unexplored territories, turning chaos into usable data." },
        { name: "Discovery", icon: "💎", desc: "You have a natural high-probability detection for anomalies and artifacts." }
    ],
    'ALCHEMIST': [
        { name: "Transmutation", icon: "⚗️", desc: "You convert raw, heavy data (lead) into high-value wisdom assets (gold)." },
        { name: "Synthesis", icon: "🌀", desc: "You merge opposing concepts into unified, superior Alloys of Truth." },
        { name: "Purification", icon: "💧", desc: "You filter out biological noise and bias to reach the pure signal." }
    ]
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
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);
  
  const [profile, setProfile] = useState(existingProfile || { SCIENTIST: 0, MYSTIC: 0, ACTIVE_NODE: 0, ARCHITECT: 0, SEEKER: 0, ALCHEMIST: 0 });
  const [skillScores, setSkillScores] = useState({ 0: 0, 1: 0, 2: 0 });
  const [scanProgress, setScanProgress] = useState(0);
  
  useEffect(() => {
      if (mode === 'ARCHETYPE') {
          const shuffled = [...MASTER_ARCHETYPE_POOL].sort(() => 0.5 - Math.random());
          setActiveQuestions(shuffled.slice(0, 10)); 
      } else {
          setActiveQuestions(SKILL_QUESTIONS);
      }
  }, [mode]);

  useEffect(() => {
    const totalQs = mode === 'ARCHETYPE' ? activeQuestions.length : 3;
    setScanProgress(((step + 1) / totalQs) * 100);
  }, [step, mode, activeQuestions.length]);

  const handleAnswer = (option: any) => {
    playCosmicClick();
    if (mode === 'ARCHETYPE') {
        const newProfile = { ...profile, [option.type]: (profile as any)[option.type] + 1 };
        setProfile(newProfile);
        if (step + 1 >= activeQuestions.length) finalizeArchetype(newProfile);
        else setStep(prev => prev + 1);
    } else {
        const newSkillScores = { ...skillScores, [option.skillIndex]: (skillScores as any)[option.skillIndex] + 1 };
        setSkillScores(newSkillScores);
        if (step + 1 >= activeQuestions.length) finalizeSkill(newSkillScores);
        else setStep(prev => prev + 1);
    }
  };

  const finalizeArchetype = (finalProfile: any) => {
      const keys = ['SCIENTIST', 'MYSTIC', 'ACTIVE_NODE', 'ARCHITECT', 'SEEKER', 'ALCHEMIST'];
      const winnerArch = keys.reduce((a, b) => finalProfile[a] > finalProfile[b] ? a : b);
      onComplete({ ...finalProfile, finalArchetype: winnerArch });
  };

  const finalizeSkill = (finalSkillScores: any) => {
      const skillKeys = Object.keys(finalSkillScores);
      const winnerSkillIndex = parseInt(skillKeys.reduce((a, b) => finalSkillScores[a] > finalSkillScores[b] ? a : b));
      
      // CRITICAL UNITY: The established archetype from phase 1 is locked.
      const lockedArchetype = existingProfile.finalArchetype;
      const skillData = SKILL_DATA[lockedArchetype]?.[winnerSkillIndex] || SKILL_DATA[lockedArchetype]?.[0];
      
      onComplete({ 
          ...existingProfile, 
          finalArchetype: lockedArchetype, 
          finalSkill: skillData.name, 
          finalSkillDesc: skillData.desc,
          finalSkillIcon: skillData.icon 
      });
  };

  const handleBackStep = () => {
      playCosmicClick();
      if (step === 0) onBack(); 
      else setStep(prev => prev - 1);
  };

  if (activeQuestions.length === 0) return <div className="h-screen w-full bg-black flex items-center justify-center text-cyan-500 animate-pulse font-mono tracking-widest uppercase">Initializing Protocol...</div>;

  const currentQ = activeQuestions[step];

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black text-white flex items-center justify-center font-mono">
      <div className="relative z-20 w-full max-w-xl px-4 animate-scaleIn">
         <div className="bg-black/60 backdrop-blur-2xl border border-cyan-900/50 rounded-3xl p-8 md:p-12 shadow-[0_0_80px_rgba(0,255,255,0.1)] relative overflow-hidden">
             <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                 <button onClick={handleBackStep} className="flex items-center gap-2 text-gray-500 hover:text-cyan-400 transition-colors uppercase text-[10px] tracking-widest"><ArrowLeft className="w-4 h-4" /> Back</button>
                 <div className="text-cyan-500 text-xs tracking-widest font-bold uppercase">Uplink Calibration</div>
                 <div className="text-amber-400 text-[10px]">{step + 1} / {activeQuestions.length}</div>
             </div>
             <h3 className="text-xl md:text-2xl font-reading tracking-wide text-white leading-relaxed mb-10 text-center min-h-[100px] flex items-center justify-center animate-fadeIn">{currentQ.text}</h3>
             <div className="space-y-4">
                 {currentQ.options.map((opt: any, i: number) => (
                     <button key={i} onClick={() => handleAnswer(opt)} className="w-full text-left p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-[#00FFFF]/10 hover:border-[#00FFFF] transition-all group flex items-center gap-4 relative overflow-hidden active:scale-[0.98] duration-100">
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
