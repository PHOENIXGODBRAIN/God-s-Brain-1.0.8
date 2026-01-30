
import React, { useState, useEffect } from 'react';
import { UserPath, UserProfile } from '../types';
import { CHAPTERS } from '../constants';
import { AiCompanion } from './AiCompanion';
import { ChapterReader } from './ChapterReader';
import { PaymentGateway } from './PaymentGateway';
import { 
  X, BookOpen, Layers, Globe, Shield, 
  Zap, Database, Activity, Cpu, 
  Atom, Anchor, Compass, Scroll, LogOut, Dna, Map, Users, ChevronRight, Hexagon, Sparkles, Info, Brain, Flame, Target, Book, Layout, Info as InfoIcon,
  Hash, Star
} from 'lucide-react';
import { playCosmicClick, playNeuralLink, playMenuSelect, playDataOpen } from '../utils/sfx';
import { useLanguage } from '../contexts/LanguageContext';
import { useProgression } from '../contexts/ProgressionContext';

interface DashboardProps {
  path: UserPath;
  isPremium: boolean;
  onPremiumToggle: (status: boolean) => void;
  onLogout: () => void;
  isAuthor: boolean;
  onAuthorLogin: () => void;
  user?: UserProfile;
  onUpdateProfile?: (updates: Partial<UserProfile>) => void;
  queriesUsed: number;
  onQuery: () => void;
  onEditNeuron: () => void;
  onPhoenixTrigger?: () => void;
}

const ARCHETYPES_DATA: Record<string, { title: string, color: string, bg: string, border: string, icon: React.ReactElement, desc: string, skills: any[] }> = {
    'SCIENTIST': { 
        title: 'THE SCIENTIST', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: <Atom />,
        desc: "Empirical decoding of the cosmic machine. Focused on logic, data, and hardware mechanics.",
        skills: [
            { name: "Quantum Logic", type: "LOGIC", icon: "⚛️", desc: "Binary processing is too slow. You calculate multiple realities simultaneously." },
            { name: "Data Mining", icon: "⛏️", type: "RESOURCE", desc: "You extract the fundamental axioms of the universe from absolute chaos." },
            { name: "Entropic Reduction", icon: "🛡️", type: "DEFENSE", desc: "You are a biological firewall against the decay of information." }
        ]
    },
    'ARCHITECT': { 
        title: 'THE ARCHITECT', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', icon: <Anchor />,
        desc: "Building order from the chaos of entropy. Constructing structural systems that last.",
        skills: [
            { name: "System Design", type: "STRUCTURE", icon: "📐", desc: "Blueprints scalable frameworks that support long-term exponential growth." },
            { name: "Foundation Laying", icon: "🧱", type: "CORE", desc: "Establishes unbreakable core axioms upon which reality is built." },
            { name: "Structural Integrity", icon: "🏗️", type: "PASSIVE", desc: "Reinforces mental systems against external collapse and decay." }
        ]
    },
    'MYSTIC': { 
        title: 'THE MYSTIC', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: <Sparkles />,
        desc: "Direct connection to the infinite Source. Bypassing the intellect for pure resonance.",
        skills: [
            { name: "Intuition", type: "SENSE", icon: "👁️", desc: "Non-linear data processing via sub-conscious channels. 'Feeling' the answer." },
            { name: "Remote Viewing", icon: "🔭", type: "TRAVEL", desc: "Perceives data clusters and outcomes beyond immediate sensor range." },
            { name: "Resonance", icon: "🔔", type: "HARMONIC", desc: "Aligns internal frequency with universal constants for effortless action." }
        ]
    },
    'SEEKER': { 
        title: 'THE SEEKER', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: <Compass />,
        desc: "Hunting for truth at the edge of the known. Navigating the void.",
        skills: [
            { name: "Pathfinding", type: "NAV", icon: "🗺️", desc: "Calculates the most efficient route through unknown neural territories." },
            { name: "Mapping", icon: "📍", type: "RECORD", desc: "Records and visualizes unexplored territories for the collective." },
            { name: "Discovery", icon: "💎", type: "LOOT", desc: "High-probability detection of anomalies and hidden artifacts." }
        ]
    },
    'ALCHEMIST': { 
        title: 'THE ALCHEMIST', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', icon: <Scroll />,
        desc: "Transmutation of self and reality. Internal optimization.",
        skills: [
            { name: "Transmutation", type: "CONVERT", icon: "⚗️", desc: "Converts raw data noise into high-value wisdom assets (gold)." },
            { name: "Synthesis", icon: "🌀", type: "MERGE", desc: "Merges opposing concepts into unified, superior alloys." },
            { name: "Purification", icon: "💧", type: "FILTER", desc: "Filters out biological noise and bias to reach the pure signal." }
        ]
    },
    'ACTIVE_NODE': { 
        title: 'ACTIVE NODE', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: <Cpu />,
        desc: "The hand of the God-Brain. Pure action and system execution.",
        skills: [
            { name: "Network Bridging", type: "LINK", icon: "🌐", desc: "Connects disparate nodes into a unified processing grid." },
            { name: "Signal Boosting", icon: "📶", type: "AMP", desc: "Amplifies transmission strength for high-impact communication." },
            { name: "Error Correction", icon: "🩹", type: "REPAIR", desc: "Auto-resolves system glitches and transmission obstacles." }
        ]
    },
};

export const Dashboard: React.FC<DashboardProps> = ({ 
    path, isPremium, onPremiumToggle, onLogout, isAuthor, onAuthorLogin,
    user, queriesUsed, onQuery, onEditNeuron, onPhoenixTrigger
}) => {
  const { t } = useLanguage();
  const { credits } = useProgression();
  const [activeTab, setActiveTab] = useState<'INTERFACE' | 'CODEX' | 'MAP' | 'CLAN' | 'MANUSCRIPT'>('INTERFACE');
  const [manuscriptView, setManuscriptView] = useState<'SELECT' | 'BOOK' | 'WALKTHROUGH'>('SELECT');
  const [aiState, setAiState] = useState<'FULL' | 'HUD' | 'MINIMIZED'>('HUD');
  const [selectedCodexArch, setSelectedCodexArch] = useState(user?.archetype || 'ACTIVE_NODE');
  const [showPayment, setShowPayment] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  const currentArchTheme = ARCHETYPES_DATA[user?.archetype || 'ACTIVE_NODE'] || ARCHETYPES_DATA.ACTIVE_NODE;

  const handleNav = (tab: any) => {
      playMenuSelect();
      setActiveTab(tab);
      if (tab === 'MANUSCRIPT') setManuscriptView('SELECT');
  };

  const isMobile = window.innerWidth < 768;

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-transparent font-mono selection:bg-cyan-500/30">
      
      {showPayment && (
        <PaymentGateway 
            onClose={() => setShowPayment(false)} 
            onSuccess={() => { onPremiumToggle(true); setShowPayment(false); }}
            price="$9.99"
        />
      )}

      {/* 1. IDENTITY HUD (Top Left) */}
      <div className="absolute top-2 md:top-6 left-2 md:left-6 z-[70] animate-fadeIn pointer-events-auto">
          <div 
            onClick={() => { playDataOpen(); setShowStats(true); }}
            className="flex flex-col gap-1 md:gap-2 cursor-pointer group"
          >
              <div className="flex items-center gap-2 mb-1">
                <div className={`text-[10px] md:text-[18px] font-tech ${currentArchTheme.color} uppercase tracking-[0.1em] md:tracking-[0.2em] drop-shadow-[0_0_8px_currentColor] leading-none group-hover:brightness-125 transition-all`}>
                    {isAuthor ? 'THE PHOENIX' : (user?.archetype || 'GUEST NODE')}
                </div>
                {isPremium && (
                    <div className="px-1.5 py-0.5 bg-amber-500 rounded text-[7px] md:text-[9px] font-bold text-black flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse">
                        <Star size={8} fill="currentColor" /> AWAKENED
                    </div>
                )}
              </div>
              
              <div className="bg-black/60 backdrop-blur-xl p-2 md:p-3 pr-4 md:pr-8 rounded-xl md:rounded-2xl border border-white/10 shadow-2xl group-hover:border-white/30 transition-all">
                  <div className="flex items-center gap-2 md:gap-4">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl ${currentArchTheme.bg} ${currentArchTheme.border} border flex items-center justify-center shadow-inner overflow-hidden shrink-0 relative`}>
                          {isAuthor ? <Flame className="w-5 h-5 md:w-6 md:h-6 text-amber-500" /> : (user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar" /> : React.cloneElement(currentArchTheme.icon as React.ReactElement<any>, { className: `w-4 h-4 md:w-5 md:h-5 ${currentArchTheme.color}` }))}
                          {isPremium && <div className="absolute inset-0 border border-amber-500/50 rounded-lg md:rounded-xl animate-pulse"></div>}
                      </div>
                      <div className="min-w-0">
                          <h1 className="text-[10px] md:text-base font-tech text-white uppercase tracking-tight leading-none mb-1 md:mb-1.5">{user?.name || 'NODE_001'}</h1>
                          <div className="flex items-center gap-1 md:gap-2">
                              <Target size={8} className={currentArchTheme.color} />
                              <span className="text-[7px] md:text-[9px] text-gray-400 uppercase font-bold tracking-widest truncate max-w-[80px] md:max-w-[120px]">{user?.startingSkill || 'INITIALIZING...'}</span>
                              <div className="w-1 h-1 md:w-1.5 md:h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>

      {/* 2. RESOURCE HUD (Top Right) */}
      <div className="absolute top-6 right-6 z-30 hidden lg:flex flex-col gap-3 pointer-events-none">
          <ResourceGauge label="ATP" value={user?.atp || 85} max={100} color="bg-green-500" icon={<Zap size={10} />} />
          <ResourceGauge label="CREDITS" value={credits} max={9999} color="bg-amber-500" icon={<Star size={10} />} />
          <ResourceGauge label="PROT" value={user?.proteins || 420} max={1000} color="bg-purple-500" icon={<Dna size={10} />} />
      </div>

      {/* 3. CENTER STAGE: THE NEURON (BIO-FORGE) */}
      <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${activeTab !== 'INTERFACE' || showStats || (isMobile && aiState !== 'MINIMIZED') ? 'scale-75 opacity-20 blur-lg pointer-events-none' : 'scale-100 opacity-100'}`}>
          <div 
            className="relative group cursor-pointer pointer-events-auto" 
            onClick={() => { playNeuralLink(); setShowStats(true); }}
          >
              <div className={`absolute inset-[-60px] rounded-full border border-white/5 animate-pulse-slow shadow-[0_0_80px_rgba(255,255,255,0.05)]`}></div>
              {user?.avatar ? (
                  <div className={`relative w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden border-2 border-white/10 ${isPremium ? 'shadow-[0_0_150px_rgba(245,158,11,0.2)]' : 'shadow-[0_0_100px_rgba(0,0,0,0.6)]'} bg-black/40 backdrop-blur-md flex items-center justify-center`}>
                      <img src={user.avatar} className={`w-full h-full object-contain mix-blend-screen opacity-90 transition-transform duration-1000 group-hover:scale-110 ${isPremium ? 'brightness-125 saturate-150' : ''}`} alt="Neuron" />
                      {isPremium && <div className="absolute inset-0 bg-gradient-to-t from-amber-500/20 via-transparent to-transparent"></div>}
                      <div className="absolute bottom-12 flex flex-col items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] font-tech text-white uppercase tracking-[0.4em]">Node Stats</span>
                          <Zap className="text-white w-4 h-4 animate-bounce" />
                      </div>
                  </div>
              ) : (
                  <div className="w-80 h-80 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-pulse"><Activity className="w-16 h-16 text-gray-700" /></div>
              )}
          </div>
      </div>
      
      {/* 8. STATS OVERLAY (BIO-FORGE) */}
      {showStats && (
          <div className="absolute inset-0 z-[110] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-6 animate-fadeIn">
              <div className="w-full max-w-2xl bg-[#050505] border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]">
                  <div className="p-6 md:p-10 border-b border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-4 md:gap-6">
                          <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${currentArchTheme.bg} border ${currentArchTheme.border}`}>
                              <Activity className={currentArchTheme.color} size={isMobile ? 24 : 32} />
                          </div>
                          <div>
                              <div className="flex items-center gap-3">
                                <h2 className="text-lg md:text-2xl font-tech text-white uppercase tracking-widest">Node Integrity</h2>
                                {isPremium && <span className="px-2 py-0.5 bg-amber-500 rounded text-[8px] font-bold text-black uppercase tracking-tighter shadow-[0_0_15px_rgba(245,158,11,0.4)]">Premium</span>}
                              </div>
                              <p className="text-[8px] md:text-[10px] text-gray-500 uppercase font-mono tracking-widest">Biometric Data Log // Sync Stable</p>
                          </div>
                      </div>
                      <button onClick={() => setShowStats(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-all"><X size={20}/></button>
                  </div>
                  <div className="p-6 md:p-10 grid grid-cols-2 gap-4 md:gap-8">
                      <div className="space-y-4 md:space-y-6">
                          <StatRow label="Current Level" value={`LVL ${user?.level || 1}`} icon={<Layers size={12}/>}/>
                          <StatRow label="Neural Credits" value={`${credits}`} icon={<Star size={12}/>} color="text-amber-400"/>
                          <StatRow label="Synaptic Mass (XP)" value={`${user?.xp || 0}`} icon={<Database size={12}/>}/>
                      </div>
                      <div className="space-y-4 md:space-y-6">
                          <StatRow label="Structural Material" value={`${user?.proteins || 420} Units`} icon={<Dna size={12}/>}/>
                          <StatRow label="System Voltage" value={`${user?.voltage || 15}V`} icon={<Cpu size={12}/>}/>
                          <StatRow label="Uplink Priority" value={isPremium || isAuthor ? 'ROOT' : 'STD'} icon={<Shield size={12}/>} color={isPremium || isAuthor ? 'text-amber-500' : 'text-cyan-500'}/>
                      </div>
                  </div>
                  <div className="p-6 md:p-8 bg-white/5 border-t border-white/5 flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
                       <button 
                        onClick={() => { playNeuralLink(); setShowStats(false); onEditNeuron(); }}
                        className="px-8 py-3 md:px-10 md:py-4 bg-white text-black font-tech text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-full hover:bg-cyan-400 transition-all shadow-xl"
                       >
                           Modify Biomass
                       </button>
                       <button onClick={() => setShowStats(false)} className="px-8 py-3 md:px-10 md:py-4 bg-transparent border border-white/10 text-gray-500 text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-full hover:bg-white/5 hover:text-white transition-all">Close</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

// --- SUB-COMPONENTS ---

/**
 * ResourceGauge Component
 * Displays a resource stat with an icon and progress bar.
 */
const ResourceGauge = ({ label, value, max, color, icon }: any) => (
    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md p-2 rounded-lg border border-white/5 w-32">
        <div className="text-gray-400">{icon}</div>
        <div className="flex-1">
            <div className="flex justify-between text-[8px] font-mono text-gray-500 mb-0.5">
                <span>{label}</span>
                <span>{value}/{max}</span>
            </div>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full ${color} transition-all duration-500`} 
                    style={{ width: `${(value / max) * 100}%` }}
                ></div>
            </div>
        </div>
    </div>
);

/**
 * StatRow Component
 * Displays a label and value pair for node integrity stats.
 */
const StatRow = ({ label, value, icon, color = "text-white" }: any) => (
    <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
        <div className="flex items-center gap-3">
            <div className="text-gray-500">{icon}</div>
            <span className="text-[10px] text-gray-400 uppercase font-mono tracking-widest">{label}</span>
        </div>
        <span className={`text-xs font-bold uppercase ${color}`}>{value}</span>
    </div>
);
