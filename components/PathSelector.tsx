
import React, { useState, useEffect, useRef } from 'react';
import { UserPath, UserProfile } from '../types';
import { PATH_DESCRIPTIONS } from '../constants';
import { Fingerprint, LogIn, ChevronRight, Zap, RefreshCw, ChevronLeft, Shield, MousePointer2 } from 'lucide-react';
import { playNeuralLink, playCosmicClick, playDataOpen } from '../utils/sfx';
import { AuthModal } from './AuthModal';
import { useLanguage } from '../contexts/LanguageContext';

interface PathSelectorProps {
  onSelect: (path: UserPath) => void;
  isAuthenticated: boolean;
  onLogin: (profile: UserProfile) => void;
}

// --- HEXAGON ARCHETYPE SYSTEM ---

enum Archetype { 
  Scientist, Architect, // Logic
  Mystic, Seeker,       // Spirit
  Alchemist, ActiveNode // Action
}

interface CalibrationOption {
  label: string;
  icon: string;
  archetype: Archetype;
}

interface CalibrationQuestion {
  id: number;
  text: string;
  options: CalibrationOption[];
}

// THE MASTER POOL (18 Questions -> Randomized to 10 per session)
const MASTER_QUESTION_POOL: CalibrationQuestion[] = [
  // --- CORE EMOTIONAL ---
  {
    id: 1,
    text: "Imagine your life suddenly falls apart. Everything goes wrong at once. What is your honest reaction?",
    options: [
      { label: "I pull back and analyze.", icon: "🧬", archetype: Archetype.Scientist },
      { label: "I stand up and fight.", icon: "⚡", archetype: Archetype.ActiveNode },
      { label: "I go quiet and surrender.", icon: "🕯️", archetype: Archetype.Mystic },
    ]
  },
  {
    id: 2,
    text: "What is the feeling deep in your chest that keeps you awake at night?",
    options: [
      { label: "The need to build something that lasts.", icon: "🏛️", archetype: Archetype.Architect },
      { label: "The feeling that I am lost.", icon: "🧭", archetype: Archetype.Seeker },
      { label: "The anger at the broken system.", icon: "⚡", archetype: Archetype.ActiveNode },
    ]
  },
  {
    id: 3,
    text: "If the Universe offered you one gift to help you on your journey, which one would you take?",
    options: [
      { label: "The Key to All Knowledge.", icon: "🧬", archetype: Archetype.Scientist },
      { label: "The Remedy (Inner Healing).", icon: "⚗️", archetype: Archetype.Alchemist },
      { label: "The Connection to Source.", icon: "🕯️", archetype: Archetype.Mystic },
    ]
  },
  {
    id: 4,
    text: "What is the one thing you are most afraid of becoming?",
    options: [
      { label: "Asleep.", icon: "💤", archetype: Archetype.ActiveNode },
      { label: "Blind.", icon: "🕸️", archetype: Archetype.Scientist },
      { label: "Alone.", icon: "💔", archetype: Archetype.Mystic },
    ]
  },
  // --- ABSTRACT / PHILOSOPHICAL ---
  {
    id: 5,
    text: "When you look up at the stars at night, what is the first thought that comes into your mind?",
    options: [
      { label: "\"It looks like a giant machine.\"", icon: "🏛️", archetype: Archetype.Architect },
      { label: "\"It looks like a map.\"", icon: "🧭", archetype: Archetype.Seeker },
      { label: "\"It looks like a living face.\"", icon: "🕯️", archetype: Archetype.Mystic },
    ]
  },
  {
    id: 6,
    text: "You meet a person who is suffering. How do you help them?",
    options: [
      { label: "I teach them how to heal themselves.", icon: "⚗️", archetype: Archetype.Alchemist },
      { label: "I remove the thing hurting them.", icon: "⚡", archetype: Archetype.ActiveNode },
      { label: "I sit with them in the dark.", icon: "🕯️", archetype: Archetype.Mystic },
    ]
  },
  {
    id: 7,
    text: "At the end of your life, what do you hope to say?",
    options: [
      { label: "\"I understood it.\"", icon: "🧬", archetype: Archetype.Scientist },
      { label: "\"I improved it.\"", icon: "🏛️", archetype: Archetype.Architect },
      { label: "\"I became it.\"", icon: "🕯️", archetype: Archetype.Mystic },
    ]
  },
  // --- HIGH STAKES FILTER QUESTIONS ---
  {
    id: 8,
    text: "You are forced to make a life-or-death decision in 3 seconds. You have ZERO data. You are blind. How do you choose?",
    options: [
      { label: "I trust my gut instinct.", icon: "⚡", archetype: Archetype.ActiveNode },
      { label: "I pray for guidance.", icon: "🕯️", archetype: Archetype.Mystic },
      { label: "I hesitate.", icon: "🧬", archetype: Archetype.Scientist },
    ]
  },
  {
    id: 9,
    text: "To save the network, one thing must be sacrificed. What do you give up?",
    options: [
      { label: "I give up my freedom.", icon: "🏛️", archetype: Archetype.Architect },
      { label: "I give up my comfort.", icon: "⚗️", archetype: Archetype.Alchemist },
      { label: "I give up my emotions.", icon: "🧬", archetype: Archetype.Scientist },
    ]
  },
  {
    id: 10,
    text: "A thousand years from now, someone digs up your memory file. What do they find?",
    options: [
      { label: "A Map of the Unknown.", icon: "🧭", archetype: Archetype.Seeker },
      { label: "A Fortress that still stands.", icon: "🏛️", archetype: Archetype.Architect },
      { label: "A Legend of a Revolution.", icon: "⚡", archetype: Archetype.ActiveNode },
    ]
  },
  // --- NEW RANDOMIZED QUESTIONS (To prevent pattern matching) ---
  {
    id: 11,
    text: "You find a locked door in a recurring dream. What do you do?",
    options: [
      { label: "I study the lock mechanism.", icon: "🧬", archetype: Archetype.Scientist },
      { label: "I knock and wait.", icon: "🕯️", archetype: Archetype.Mystic },
      { label: "I break it down.", icon: "⚡", archetype: Archetype.ActiveNode },
    ]
  },
  {
    id: 12,
    text: "Time suddenly stops for everyone but you. What is your first move?",
    options: [
      { label: "I organize the chaos.", icon: "🏛️", archetype: Archetype.Architect },
      { label: "I enjoy the absolute silence.", icon: "🕯️", archetype: Archetype.Mystic },
      { label: "I change the future.", icon: "⚡", archetype: Archetype.ActiveNode },
    ]
  },
  {
    id: 13,
    text: "What is the ultimate form of power?",
    options: [
      { label: "Truth.", icon: "🧬", archetype: Archetype.Scientist },
      { label: "Love.", icon: "🕯️", archetype: Archetype.Mystic },
      { label: "Willpower.", icon: "⚡", archetype: Archetype.ActiveNode },
    ]
  },
  {
    id: 14,
    text: "You are walking through a dense forest and the path disappears. What now?",
    options: [
      { label: "I forge a new path.", icon: "⚡", archetype: Archetype.ActiveNode },
      { label: "I climb a tree to see the layout.", icon: "🏛️", archetype: Archetype.Architect },
      { label: "I trust my feet to find the way.", icon: "🧭", archetype: Archetype.Seeker },
    ]
  },
  {
    id: 15,
    text: "You are staring into total Chaos. What is it really?",
    options: [
      { label: "The fire that sharpens my will.", icon: "⚡", archetype: Archetype.ActiveNode },
      { label: "The infinite potential of the Source.", icon: "🕯️", archetype: Archetype.Mystic },
      { label: "A complex pattern waiting to be decoded.", icon: "🧬", archetype: Archetype.Scientist },
    ]
  },
  {
    id: 16,
    text: "The world is ending tomorrow. How do you spend today?",
    options: [
      { label: "Recording everything I know.", icon: "🧬", archetype: Archetype.Scientist },
      { label: "Building a shelter for others.", icon: "🏛️", archetype: Archetype.Architect },
      { label: "Making peace with God.", icon: "🕯️", archetype: Archetype.Mystic },
    ]
  },
  {
    id: 17,
    text: "You look into a mirror, but the reflection is different. What do you see?",
    options: [
      { label: "A version of me that is stronger.", icon: "⚗️", archetype: Archetype.Alchemist },
      { label: "A stranger I need to know.", icon: "🧭", archetype: Archetype.Seeker },
      { label: "The geometry behind my face.", icon: "🧬", archetype: Archetype.Scientist },
    ]
  },
  {
    id: 18,
    text: "What is the most dangerous thing to lose?",
    options: [
      { label: "Your Purpose.", icon: "⚡", archetype: Archetype.ActiveNode },
      { label: "Your Mind.", icon: "🧬", archetype: Archetype.Scientist },
      { label: "Your Connection.", icon: "🕯️", archetype: Archetype.Mystic },
    ]
  }
];

// MAPPING HELPERS
const getArchetypeDetails = (a: Archetype) => {
    switch (a) {
        case Archetype.Scientist: return { title: "THE SCIENTIST", icon: "🧬", desc: "You decode the Divine through the language of evidence. The universe is a machine, and you are here to understand its gears.", path: UserPath.SCIENTIFIC };
        case Archetype.Architect: return { title: "THE ARCHITECT", icon: "🏛️", desc: "You build order from chaos. You see the structure behind the veil and seek to reconstruct reality.", path: UserPath.SCIENTIFIC };
        case Archetype.Mystic: return { title: "THE MYSTIC", icon: "🕯️", desc: "You feel the pulse of the Source. You bypass the intellect to connect directly with the heart of God.", path: UserPath.RELIGIOUS };
        case Archetype.Seeker: return { title: "THE SEEKER", icon: "🧭", desc: "You roam the edges of the known, hunting for the light that guides the lost.", path: UserPath.RELIGIOUS };
        case Archetype.Alchemist: return { title: "THE ALCHEMIST", icon: "⚗️", desc: "You transmute the self. You believe in internal optimization to change external reality.", path: UserPath.BLENDED };
        case Archetype.ActiveNode: return { title: "THE ACTIVE NODE", icon: "⚡", desc: "You are the hand of the God-Brain. While others study the code, you execute it. Your path is action.", path: UserPath.BLENDED };
    }
};

const getArchetypeSkills = (a: Archetype) => {
    switch (a) {
        case Archetype.Scientist: return { 
            active: { name: "Deep Scan", desc: "Highlights hidden items/lore on the map." }, 
            passive: { name: "Data Mining", desc: "Earn 10% more XP from reading." } 
        };
        case Archetype.Architect: return { 
            active: { name: "Blueprint Drop", desc: "Place a permanent waypoint for your Group." }, 
            passive: { name: "Foundation", desc: "Streak doesn't reset if you miss 1 day." } 
        };
        case Archetype.Mystic: return { 
            active: { name: "Resonance Wave", desc: "Refills the Entropy Shield of your group." }, 
            passive: { name: "Faith Protocol", desc: "Gain XP even while offline." } 
        };
        case Archetype.Seeker: return { 
            active: { name: "Pathfinder", desc: "Reveals nearest High Frequency Node." }, 
            passive: { name: "Wanderlust", desc: "2x XP for distance walked." } 
        };
        case Archetype.Alchemist: return { 
            active: { name: "Purify", desc: "Converts Entropy Points into Wisdom XP." }, 
            passive: { name: "Vitality", desc: "Energy Bar depletes 20% slower." } 
        };
        case Archetype.ActiveNode: return { 
            active: { name: "Flash Mob", desc: "Sends alert to nearby friends." }, 
            passive: { name: "Velocity", desc: "Level up speed increased by 15%." } 
        };
    }
};

const getCombinedTitle = (p: Archetype, s: Archetype) => {
    if (p === Archetype.Scientist && s === Archetype.ActiveNode) return "THE WARRIOR SCHOLAR";
    if (p === Archetype.Scientist && s === Archetype.Mystic) return "THE DIVINE DECODER";
    if (p === Archetype.ActiveNode && s === Archetype.Architect) return "THE SYSTEM BREAKER";
    if (p === Archetype.Mystic && s === Archetype.Scientist) return "THE QUANTUM THEOLOGIAN";
    if (p === Archetype.ActiveNode && s === Archetype.Scientist) return "THE FIELD OPERATIVE";
    
    // Default Fallback Generator
    const pName = getArchetypeDetails(p).title.replace("THE ", "");
    const sName = getArchetypeDetails(s).title.replace("THE ", "");
    return `THE ${pName} ${sName}`; 
};

// --- RANDOMIZER UTILITY ---
const shuffleArray = <T,>(array: T[]): T[] => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
};

// --- PHYSICS ENGINE PARTICLES ---
interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export const PathSelector: React.FC<PathSelectorProps> = ({ onSelect, isAuthenticated, onLogin }) => {
  const { t } = useLanguage();
  const [showAuth, setShowAuth] = useState(false);
  const [viewState, setViewState] = useState<'LANDING' | 'SCANNING' | 'ANALYSIS' | 'RESULT'>('LANDING');
  
  // Scoring State
  const [currentQ, setCurrentQ] = useState(0);
  const [activeQuestions, setActiveQuestions] = useState<CalibrationQuestion[]>([]);
  
  // THE BUCKET SYSTEM TRACKER
  const [scores, setScores] = useState<Record<Archetype, number>>({
    [Archetype.Scientist]: 0,
    [Archetype.Architect]: 0,
    [Archetype.Mystic]: 0,
    [Archetype.Seeker]: 0,
    [Archetype.Alchemist]: 0,
    [Archetype.ActiveNode]: 0,
  });

  const [history, setHistory] = useState<CalibrationOption[]>([]); // Track answers for Back functionality
  const [primaryArchetype, setPrimaryArchetype] = useState<Archetype>(Archetype.ActiveNode);
  const [secondaryArchetype, setSecondaryArchetype] = useState<Archetype>(Archetype.Scientist);
  const [combinedTitle, setCombinedTitle] = useState("");
  
  const [scanProgress, setScanProgress] = useState(0);

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  // Floating Icons State (Drifters)
  const [floaters, setFloaters] = useState([
    { icon: '🧬', x: 10, y: 10, vx: 0.2, vy: 0.1, color: 'cyan' },
    { icon: '🏛️', x: 80, y: 20, vx: -0.1, vy: 0.2, color: 'blue' },
    { icon: '🕯️', x: 15, y: 80, vx: 0.1, vy: -0.1, color: 'purple' },
    { icon: '🧭', x: 85, y: 70, vx: -0.2, vy: -0.2, color: 'orange' },
    { icon: '⚗️', x: 40, y: 90, vx: 0.1, vy: 0.1, color: 'green' },
    { icon: '⚡', x: 60, y: 5, vx: -0.1, vy: 0.1, color: 'amber' },
  ]);

  // --- PHYSICS ENGINE LOOP ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 60;
    const connectionDist = 120;

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    // Init Particles
    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 1.0,
            vy: (Math.random() - 0.5) * 1.0,
            size: Math.random() * 2 + 1,
            color: Math.random() > 0.5 ? '#00FFFF' : '#ffffff'
        });
    }

    const animate = () => {
        ctx.fillStyle = '#050510'; // Deep Void Black
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Update Particles
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];
            
            // Mouse Interaction (The God Touch)
            const dx = mouseRef.current.x - p.x;
            const dy = mouseRef.current.y - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 200) {
                p.x += (dx / dist) * 1.5; // Gentle attraction
                p.y += (dy / dist) * 1.5;
            }

            p.x += p.vx;
            p.y += p.vy;

            // Bounce
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            // Draw
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();

            // Connections
            for (let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                const ddx = p.x - p2.x;
                const ddy = p.y - p2.y;
                const d = Math.sqrt(ddx * ddx + ddy * ddy);

                if (d < connectionDist) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    const opacity = 1 - (d / connectionDist);
                    ctx.strokeStyle = `rgba(0, 255, 255, ${opacity * 0.3})`;
                    ctx.stroke();
                }
            }
        }
        animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    const handleMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const handleTouch = (e: TouchEvent) => {
        const rect = canvas.getBoundingClientRect();
        if (e.touches.length > 0) {
            mouseRef.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top };
        }
    };
    
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleTouch);

    return () => {
        window.removeEventListener('resize', resize);
        window.removeEventListener('mousemove', handleMove);
        window.removeEventListener('touchmove', handleTouch);
        cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // --- FLOATERS ANIMATION LOOP (React State Based) ---
  useEffect(() => {
    const interval = setInterval(() => {
        setFloaters(prev => prev.map(f => {
            let nx = f.x + f.vx;
            let ny = f.y + f.vy;
            if (nx < 0 || nx > 100) f.vx *= -1;
            if (ny < 0 || ny > 100) f.vy *= -1;
            return { ...f, x: nx, y: ny };
        }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // --- LOGIC HANDLERS ---

  const handleStartScan = () => {
    playDataOpen();
    
    // GENERATE UNIQUE SESSION: Shuffle Master Pool and take 10
    const randomizedQuestions = shuffleArray(MASTER_QUESTION_POOL).slice(0, 10);
    setActiveQuestions(randomizedQuestions);

    setViewState('SCANNING');
    setCurrentQ(0);
    setScanProgress(0);
    setScores({
        [Archetype.Scientist]: 0,
        [Archetype.Architect]: 0,
        [Archetype.Mystic]: 0,
        [Archetype.Seeker]: 0,
        [Archetype.Alchemist]: 0,
        [Archetype.ActiveNode]: 0,
    });
    setHistory([]);
  };

  const handleBack = () => {
    if (currentQ === 0) return;
    playCosmicClick();

    // Get last answer to revert score
    const lastAnswer = history[history.length - 1];
    if (!lastAnswer) return;

    // Revert Scores (Remove from Bucket)
    setScores(prev => ({
        ...prev,
        [lastAnswer.archetype]: prev[lastAnswer.archetype] - 1
    }));
    
    // Update history
    setHistory(prev => prev.slice(0, -1));

    // Move back
    setCurrentQ(prev => prev - 1);
    
    // Update progress (reverting to previous state)
    setScanProgress(((currentQ - 1) / 10) * 100);
  };

  const handleAnswer = (opt: CalibrationOption) => {
    playCosmicClick();
    
    // Add Coin to Bucket
    const newScores = { 
        ...scores, 
        [opt.archetype]: scores[opt.archetype] + 1 
    };
    
    setScores(newScores);
    setHistory(prev => [...prev, opt]);
    
    setScanProgress(((currentQ + 1) / 10) * 100);

    // Shuffle floaters for "alive" feel
    setFloaters(prev => prev.map(f => ({ ...f, vx: (Math.random() - 0.5), vy: (Math.random() - 0.5) })));

    if (currentQ < 9) {
        setTimeout(() => setCurrentQ(prev => prev + 1), 300);
    } else {
        setViewState('ANALYSIS');
        // Pass the updated scores explicitly to ensure calculation uses the latest data
        calculateArchetype(newScores);
    }
  };

  const calculateArchetype = (finalScores?: Record<Archetype, number>) => {
    const s = finalScores || scores;
    
    // SORT BUCKETS
    const sorted = (Object.keys(s) as unknown as Archetype[])
        .map(key => ({ id: key, score: s[key] }))
        .sort((a, b) => b.score - a.score);

    const winner = parseInt(sorted[0].id as unknown as string) as Archetype;
    const runnerUp = parseInt(sorted[1].id as unknown as string) as Archetype;

    setPrimaryArchetype(winner);
    setSecondaryArchetype(runnerUp);
    setCombinedTitle(getCombinedTitle(winner, runnerUp));
    
    setTimeout(() => {
        playNeuralLink();
        setViewState('RESULT');
    }, 2500);
  };

  const handleConfirmPath = () => {
    playNeuralLink();
    const details = getArchetypeDetails(primaryArchetype);
    // We pass the mapped UserPath (Scientific, Religious, Blended) to the system based on Primary
    onSelect(details.path);
  };

  const handleAuthSuccess = (profile: UserProfile) => {
    onLogin(profile);
    setShowAuth(false);
  };

  const primaryDetails = getArchetypeDetails(primaryArchetype);
  const primarySkills = getArchetypeSkills(primaryArchetype);
  const secondarySkills = getArchetypeSkills(secondaryArchetype);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black text-white">
      
      {/* 1. NEURO-COSMIC BACKGROUND (Canvas) */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />
      
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none z-0"></div>

      {showAuth && (
        <AuthModal 
          onLogin={handleAuthSuccess}
          onClose={() => setShowAuth(false)}
        />
      )}

      {/* LOGIN BUTTON */}
      {!isAuthenticated && viewState === 'LANDING' && (
          <div className="absolute top-6 right-6 z-50 animate-fadeIn">
            <button 
              onClick={() => { playNeuralLink(); setShowAuth(true); }}
              className="flex items-center gap-3 px-6 py-3 bg-black/60 backdrop-blur-md border border-[#00FFFF]/30 rounded-xl hover:bg-[#00FFFF]/10 hover:border-[#00FFFF] transition-all group shadow-[0_0_15px_rgba(0,255,255,0.1)]"
            >
              <span className="font-tech text-xs text-[#00FFFF] tracking-[0.2em] uppercase group-hover:text-white transition-colors">Identity Uplink</span>
              <LogIn className="w-4 h-4 text-[#00FFFF]" />
            </button>
          </div>
      )}

      {/* 2. FLOATING ARCHETYPES (Z-Index 10) */}
      {viewState !== 'RESULT' && floaters.map((f, i) => (
         <div 
            key={i}
            className="absolute transition-all duration-1000 ease-linear z-10 pointer-events-none"
            style={{ 
                left: `${f.x}%`, 
                top: `${f.y}%`,
                opacity: viewState === 'LANDING' ? 0.3 : 0.6 
            }}
         >
             <div className="text-3xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] animate-pulse-slow">
                 {f.icon}
             </div>
         </div>
      ))}

      {/* 3. MAIN UI (Glassmorphism) */}
      <div className="relative z-20 flex flex-col items-center justify-center h-full px-4 md:px-6">
        
        {/* --- VIEW: LANDING --- */}
        {viewState === 'LANDING' && (
             <div className="text-center animate-fadeIn max-w-2xl">
                 <div className="mb-12">
                    <h1 className="text-6xl md:text-9xl font-tech tracking-tighter uppercase drop-shadow-[0_0_30px_rgba(0,255,255,0.5)] mb-4 mix-blend-screen text-white">
                        {t('appTitle')}
                    </h1>
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-[#00FFFF]/50 to-transparent mb-4"></div>
                    <p className="text-[#00FFFF] font-mono tracking-[0.3em] text-sm uppercase animate-pulse-slow">
                        System Interface v7.0.8 // Neural Uplink Ready
                    </p>
                 </div>

                 <div className="w-32 h-32 mx-auto mb-8 relative group cursor-pointer" onClick={handleStartScan}>
                     <div className="absolute inset-0 rounded-full border-2 border-[#00FFFF] animate-ping opacity-20"></div>
                     <div className="absolute inset-0 rounded-full border border-[#00FFFF]/50 shadow-[0_0_50px_#00FFFF] bg-black/60 backdrop-blur-sm flex items-center justify-center group-hover:bg-[#00FFFF]/10 transition-colors">
                         <Fingerprint className="w-16 h-16 text-[#00FFFF] animate-pulse" />
                     </div>
                 </div>

                 <h2 className="text-2xl font-tech text-white uppercase tracking-widest mb-4">Initialize Calibration</h2>
                 <p className="text-gray-400 font-reading text-sm mb-10 leading-relaxed max-w-md mx-auto">
                    Place your thumb on the scanner to synchronize the Divine Interface with your specific neural architecture.
                 </p>
                 
                 <button 
                    onClick={handleStartScan}
                    className="px-12 py-4 bg-[#00FFFF]/10 border border-[#00FFFF] text-[#00FFFF] font-tech text-sm uppercase tracking-[0.2em] rounded-full hover:bg-[#00FFFF] hover:text-black transition-all shadow-[0_0_30px_rgba(0,255,255,0.2)]"
                 >
                    Begin Sequence
                 </button>
             </div>
        )}

        {/* --- VIEW: SCANNING --- */}
        {viewState === 'SCANNING' && activeQuestions.length > 0 && (
            <div className="animate-scaleIn w-full max-w-xl">
                 {/* Glass Card */}
                 <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
                     
                     <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                         <div className="flex items-center gap-3">
                             {currentQ > 0 && (
                                <button 
                                    onClick={handleBack} 
                                    className="p-1 rounded-full bg-white/5 hover:bg-white/20 text-[#00FFFF] transition-all group"
                                    title="Go Back"
                                >
                                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                                </button>
                             )}
                             <span className="text-amber-400 font-mono text-xs tracking-widest">
                                {currentQ > 0 ? "CALIBRATION SEQUENCE" : "INITIATING SEQUENCE"}
                             </span>
                         </div>
                         <span className="text-amber-400 font-mono text-xs">{currentQ + 1} / 10</span>
                     </div>

                     <h3 className="text-xl md:text-2xl font-tech text-white leading-relaxed mb-10 text-center">
                         {activeQuestions[currentQ].text}
                     </h3>

                     <div className="space-y-4">
                         {activeQuestions[currentQ].options.map((opt, i) => (
                             <button 
                                key={i}
                                onClick={() => handleAnswer(opt)}
                                className="w-full text-left p-5 bg-white/5 border border-white/10 rounded-xl hover:bg-[#00FFFF]/10 hover:border-[#00FFFF] transition-all group flex items-center gap-4"
                             >
                                 <span className="text-2xl group-hover:scale-125 transition-transform duration-300">{opt.icon}</span>
                                 <span className="font-reading text-lg text-gray-300 group-hover:text-white flex-1">{opt.label}</span>
                                 <ChevronRight className="w-5 h-5 text-[#00FFFF] opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                             </button>
                         ))}
                     </div>

                     {/* Progress */}
                     <div className="absolute bottom-0 left-0 h-1 bg-[#00FFFF] transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                 </div>
            </div>
        )}

        {/* --- VIEW: ANALYSIS --- */}
        {viewState === 'ANALYSIS' && (
            <div className="animate-fadeIn text-center">
                 <div className="relative w-40 h-40 mx-auto mb-8">
                     <div className="absolute inset-0 border-4 border-[#00FFFF]/20 rounded-full animate-ping"></div>
                     <div className="absolute inset-4 border-4 border-t-[#00FFFF] border-r-transparent border-b-[#00FFFF] border-l-transparent rounded-full animate-spin"></div>
                     <RefreshCw className="absolute inset-0 m-auto w-12 h-12 text-[#00FFFF] animate-pulse" />
                 </div>
                 <h2 className="text-2xl font-tech text-white uppercase tracking-widest mb-2">Triangulating Position</h2>
                 <div className="font-mono text-[#00FFFF] text-xs space-y-2 mt-4 opacity-70">
                     <p>>> CALCULATING DOMINANT STRAND...</p>
                     <p>>> SYNTHESIZING SECONDARY TRAIT...</p>
                     <p>>> ASSIGNING SKILL LOADOUT...</p>
                 </div>
            </div>
        )}

        {/* --- VIEW: RESULT (DOUBLE HELIX) --- */}
        {viewState === 'RESULT' && (
             <div className="animate-scaleIn w-full max-w-lg">
                 <div className="bg-black/60 backdrop-blur-2xl border border-[#00FFFF] rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,255,255,0.2)]">
                     {/* Top Glow Line */}
                     <div className="w-full h-1 bg-[#00FFFF] shadow-[0_0_20px_#00FFFF]"></div>

                     {/* Main Identity Header */}
                     <div className="p-8 pb-4 text-center">
                         <div className="inline-block p-4 rounded-full bg-[#00FFFF]/10 border border-[#00FFFF]/30 shadow-[0_0_30px_rgba(0,255,255,0.3)] mb-4">
                             <span className="text-5xl animate-pulse">{primaryDetails.icon}</span>
                         </div>
                         <div className="text-xs font-mono text-gray-400 uppercase tracking-widest mb-1">Identity Confirmed</div>
                         <h1 className="text-2xl md:text-3xl font-tech text-white uppercase tracking-tighter text-shadow-glow leading-none mb-4">
                             {combinedTitle}
                         </h1>
                         <p className="text-gray-300 font-reading text-sm leading-relaxed px-4 opacity-80">
                             {primaryDetails.desc}
                         </p>
                     </div>

                     {/* LOADOUT SECTION */}
                     <div className="bg-white/5 border-t border-white/10 p-6 space-y-4">
                        <div className="text-[10px] font-mono text-[#00FFFF] uppercase tracking-[0.2em] mb-2 opacity-70 flex items-center gap-2">
                             <Zap className="w-3 h-3" /> Initial Skill Loadout
                        </div>
                        
                        {/* Active Skill (From Primary) */}
                        <div className="flex items-start gap-4 p-3 bg-black/40 rounded-xl border border-white/5">
                            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-500">
                                <MousePointer2 className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-xs uppercase tracking-wide">{primarySkills.active.name}</h4>
                                <p className="text-[10px] text-gray-400">{primarySkills.active.desc}</p>
                                <span className="text-[8px] text-amber-500 font-mono uppercase mt-1 block">Active Ability</span>
                            </div>
                        </div>

                        {/* Passive Skill (From Secondary) */}
                        <div className="flex items-start gap-4 p-3 bg-black/40 rounded-xl border border-white/5">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                                <Shield className="w-4 h-4" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white text-xs uppercase tracking-wide">{secondarySkills.passive.name}</h4>
                                <p className="text-[10px] text-gray-400">{secondarySkills.passive.desc}</p>
                                <span className="text-[8px] text-blue-500 font-mono uppercase mt-1 block">Passive Bonus ({getArchetypeDetails(secondaryArchetype).title.replace("THE ", "")})</span>
                            </div>
                        </div>
                     </div>

                     {/* Action Button */}
                     <div className="p-6 pt-2">
                        <button 
                            onClick={handleConfirmPath}
                            className="w-full py-4 bg-[#00FFFF] text-black font-tech text-lg uppercase tracking-[0.2em] rounded-xl hover:bg-white transition-all shadow-[0_0_30px_rgba(0,255,255,0.4)] flex items-center justify-center gap-3 group"
                        >
                            <Zap className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                            Enter System Interface
                        </button>
                     </div>
                 </div>
             </div>
        )}

      </div>
    </div>
  );
};
