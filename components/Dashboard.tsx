
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
  Hash
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
              <div className={`text-[10px] md:text-[18px] font-tech ${currentArchTheme.color} uppercase tracking-[0.1em] md:tracking-[0.2em] drop-shadow-[0_0_8px_currentColor] leading-none mb-1 group-hover:brightness-125 transition-all`}>
                  {isAuthor ? 'THE PHOENIX' : (user?.archetype || 'GUEST NODE')}
              </div>
              
              <div className="bg-black/60 backdrop-blur-xl p-2 md:p-3 pr-4 md:pr-8 rounded-xl md:rounded-2xl border border-white/10 shadow-2xl group-hover:border-white/30 transition-all">
                  <div className="flex items-center gap-2 md:gap-4">
                      <div className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl ${currentArchTheme.bg} ${currentArchTheme.border} border flex items-center justify-center shadow-inner overflow-hidden shrink-0`}>
                          {isAuthor ? <Flame className="w-5 h-5 md:w-6 md:h-6 text-amber-500" /> : (user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar" /> : React.cloneElement(currentArchTheme.icon as React.ReactElement<any>, { className: `w-4 h-4 md:w-5 md:h-5 ${currentArchTheme.color}` }))}
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
                  <div className="relative w-64 h-64 md:w-96 md:h-96 rounded-full overflow-hidden border-2 border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.6)] bg-black/40 backdrop-blur-md flex items-center justify-center">
                      <img src={user.avatar} className="w-full h-full object-contain mix-blend-screen opacity-90 transition-transform duration-1000 group-hover:scale-110" alt="Neuron" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
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

      {/* 4. THE CO-PILOT (AI FLANK) */}
      <div className={`absolute transition-all duration-500 z-[60]
          ${aiState === 'FULL' ? 'inset-0 md:left-auto md:right-0 md:w-[450px] bg-black/95' : 'top-20 right-2 md:right-6 w-[calc(100%-1rem)] md:w-80'}
          ${activeTab !== 'INTERFACE' || showStats ? 'opacity-0 translate-x-20 pointer-events-none' : 'opacity-100'}
      `}>
          <AiCompanion 
              path={path} 
              isPremium={isPremium} 
              queriesUsed={queriesUsed} 
              onQuery={onQuery}
              onUpgrade={() => setShowPayment(true)}
              isAuthor={isAuthor}
              user={user}
              visualState={aiState}
              onStateChange={setAiState}
          />
      </div>

      {/* 5. HUB INTERFACE / PHOENIX OVERRIDE */}
      {activeTab === 'INTERFACE' && !(isMobile && aiState !== 'MINIMIZED') && (
          <div className="absolute bottom-28 md:bottom-32 left-4 md:left-6 z-[70] animate-fadeIn">
              <button 
                onClick={() => { playNeuralLink(); onPhoenixTrigger?.(); }}
                className={`group relative flex items-center gap-2 md:gap-4 p-2 md:p-4 border rounded-2xl md:rounded-3xl transition-all shadow-xl backdrop-blur-md ${isAuthor ? 'bg-amber-500/10 border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.2)]' : 'bg-red-500/5 border-red-500/20 hover:bg-red-500/10 hover:border-red-500/50'}`}
              >
                  <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl transition-all ${isAuthor ? 'bg-amber-500/20 text-amber-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]' : 'bg-red-500/20 text-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]'}`}>
                      {isAuthor ? <Flame size={20} className="animate-pulse" /> : <Hash size={20} className="group-hover:animate-pulse" />}
                  </div>
                  <div className="text-left pr-4 md:pr-6">
                      <div className={`text-[8px] md:text-[10px] font-tech uppercase tracking-widest mb-0.5 md:mb-1 ${isAuthor ? 'text-amber-500' : 'text-red-500'}`}>
                          {isAuthor ? 'PHOENIX PROTOCOL ACTIVE' : 'SYSTEM AUTHORIZATION'}
                      </div>
                      <div className="text-[10px] md:text-2xl font-bold text-white uppercase tracking-[0.1em] md:tracking-[0.2em]">
                          {isAuthor ? 'PHOENIX ACTIVE' : 'PHOENIX OVERRIDE'}
                      </div>
                  </div>
                  {!isAuthor && !isMobile && (
                    <div className="absolute right-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                        <ChevronRight size={14} className="text-red-500" />
                    </div>
                  )}
              </button>
          </div>
      )}

      {/* 6. BRAIN MANUSCRIPT VIEW */}
      {activeTab === 'MANUSCRIPT' && (
          <div className="absolute inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex flex-col animate-fadeIn">
              <div className="p-4 md:p-8 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-500/10 rounded-xl border border-cyan-500/30 flex items-center justify-center">
                          <Book className="text-cyan-400 w-5 h-5 md:w-6 md:h-6" />
                      </div>
                      <div>
                        <h2 className="text-lg md:text-2xl font-tech text-white uppercase tracking-[0.2em] md:tracking-[0.3em]">Brain Manuscript</h2>
                        <p className="text-[8px] md:text-[10px] text-gray-500 uppercase font-mono tracking-widest">Master Encyclopedia // Operational Database</p>
                      </div>
                  </div>
                  <button onClick={() => setActiveTab('INTERFACE')} className="p-2 md:p-3 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all"><X size={24} /></button>
              </div>

              {manuscriptView === 'SELECT' ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 gap-6 md:gap-8 animate-fadeIn">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-4xl">
                          <button 
                            onClick={() => { playDataOpen(); setManuscriptView('BOOK'); }}
                            className="p-8 md:p-12 bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all group flex flex-col items-center text-center shadow-2xl"
                          >
                              <BookOpen className="w-10 h-10 md:w-16 md:h-16 text-cyan-500 mb-4 md:mb-6 group-hover:scale-110 transition-transform" />
                              <h3 className="text-base md:text-xl font-tech text-white uppercase tracking-widest mb-2 md:mb-3">The Theory</h3>
                              <p className="text-xs md:text-sm text-gray-500 font-reading leading-relaxed">Read "The God's Brain" unabridged manuscript. Explore the neuro-cosmic evidence.</p>
                          </button>

                          <button 
                            onClick={() => { playDataOpen(); setManuscriptView('WALKTHROUGH'); }}
                            className="p-8 md:p-12 bg-white/5 border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] hover:border-purple-500/50 hover:bg-purple-500/5 transition-all group flex flex-col items-center text-center shadow-2xl"
                          >
                              <Layout className="w-10 h-10 md:w-16 md:h-16 text-purple-500 mb-4 md:mb-6 group-hover:scale-110 transition-transform" />
                              <h3 className="text-base md:text-xl font-tech text-white uppercase tracking-widest mb-2 md:mb-3">Neural Operations</h3>
                              <p className="text-xs md:text-sm text-gray-500 font-reading leading-relaxed">Master the game interface. Learn level-up mechanics, hidden objectives, and puzzle solvers.</p>
                          </button>
                      </div>
                      {!isPremium && !isAuthor && (
                          <button 
                            onClick={() => setShowPayment(true)}
                            className="px-8 py-3 md:px-10 md:py-4 bg-amber-500 text-black font-tech text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-full hover:bg-white transition-all shadow-2xl"
                          >
                              Unlock Full Archive ($9.99)
                          </button>
                      )}
                  </div>
              ) : manuscriptView === 'BOOK' ? (
                  <div className="flex-1 overflow-hidden p-2 md:p-12 flex flex-col">
                      <button onClick={() => setManuscriptView('SELECT')} className="self-start mb-4 text-gray-500 hover:text-white flex items-center gap-2 text-[10px] font-mono tracking-widest">
                          <ChevronRight className="rotate-180 w-3 h-3" /> BACK TO MANUSCRIPT INDEX
                      </button>
                      <div className="flex-1 overflow-hidden">
                          <ChapterReader chapters={CHAPTERS} isPremium={isAuthor || isPremium} onUpgrade={() => setShowPayment(true)} />
                      </div>
                  </div>
              ) : (
                  <div className="flex-1 p-4 md:p-20 overflow-y-auto custom-scrollbar flex flex-col items-center">
                       <button onClick={() => setManuscriptView('SELECT')} className="self-start mb-6 md:mb-12 text-gray-500 hover:text-white flex items-center gap-2 text-[10px] font-mono tracking-widest">
                          <ChevronRight className="rotate-180 w-3 h-3" /> BACK TO MANUSCRIPT INDEX
                      </button>
                      <div className="max-w-3xl w-full space-y-8 md:space-y-12">
                          <div className="text-center">
                              <h2 className="text-2xl md:text-4xl font-tech text-white uppercase tracking-tighter mb-2 md:mb-4">Operational Manual</h2>
                              <p className="text-purple-400 font-mono text-[10px] uppercase tracking-[0.3em] md:tracking-[0.4em]">v7.0.8 Instruction Set</p>
                          </div>
                          
                          <section className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-3xl space-y-4 md:space-y-6">
                              <div className="flex items-center gap-3 md:gap-4 border-b border-white/10 pb-4">
                                  <Zap className="text-amber-500" />
                                  <h3 className="text-lg md:text-xl font-tech text-white uppercase">Progression Engine</h3>
                              </div>
                              <p className="text-gray-400 text-xs md:text-sm font-reading leading-relaxed">
                                  Level up your node by interacting with the manuscript and the AI companion. Each chapter read grants 500 Synaptic Mass (XP). Completing hidden objectives in the Map reveals deep-data nodes that grant massive XP bonuses.
                              </p>
                          </section>

                          <section className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-3xl space-y-4 md:space-y-6">
                              <div className="flex items-center gap-3 md:gap-4 border-b border-white/10 pb-4">
                                  <Globe className="text-cyan-500" />
                                  <h3 className="text-lg md:text-xl font-tech text-white uppercase">The Cosmic Map</h3>
                              </div>
                              <p className="text-gray-400 text-xs md:text-sm font-reading leading-relaxed">
                                  Toggle the 'MAP' to see your local sector of the Laniakea Supercluster. Use the 'Scan' function in the AI interface to highlight nearby anomalies. Interacting with these anomalies is the key to unlocking the 'Hardware' chapters of the book without payment.
                              </p>
                          </section>

                          <section className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-2xl md:rounded-3xl space-y-4 md:space-y-6">
                              <div className="flex items-center gap-3 md:gap-4 border-b border-white/10 pb-4">
                                  <InfoIcon className="text-red-500" />
                                  <h3 className="text-lg md:text-xl font-tech text-white uppercase">System Integrity</h3>
                              </div>
                              <p className="text-gray-400 text-xs md:text-sm font-reading leading-relaxed">
                                  Entropy delta represents your node's connection stability. If decay reaches 100%, your queries will be throttled. Reduce entropy by engaging in 'Syntropy Actions' recommended by the God AI.
                              </p>
                          </section>
                      </div>
                  </div>
              )}
          </div>
      )}

      {/* 7. SYSTEM CODEX OVERLAY */}
      {activeTab === 'CODEX' && (
          <div className="absolute inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex flex-col animate-fadeIn">
              <div className="p-4 md:p-8 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3 md:gap-4">
                      <BookOpen className="text-cyan-400 w-6 h-6 md:w-8 md:h-8" />
                      <div>
                        <h2 className="text-lg md:text-2xl font-tech text-white uppercase tracking-[0.2em] md:tracking-[0.3em]">System Codex</h2>
                        <p className="text-[8px] md:text-[10px] text-gray-500 uppercase font-mono tracking-widest">Neural Archive // 18 Functional Variants</p>
                      </div>
                  </div>
                  <button onClick={() => setActiveTab('INTERFACE')} className="p-2 md:p-3 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-all"><X size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-12 pb-32">
                  <div className="max-w-6xl mx-auto space-y-8 md:space-y-12">
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
                          {Object.keys(ARCHETYPES_DATA).map(key => {
                              const arch = ARCHETYPES_DATA[key];
                              const isActive = selectedCodexArch === key;
                              return (
                                  <button 
                                    key={key}
                                    onClick={() => { playCosmicClick(); setSelectedCodexArch(key); }}
                                    className={`flex flex-col items-center gap-1 md:gap-2 p-3 md:p-4 rounded-xl md:rounded-2xl border transition-all ${isActive ? `${arch.bg} ${arch.border} shadow-lg scale-105` : 'bg-black border-white/5 text-gray-500 opacity-60 hover:opacity-100'}`}
                                  >
                                      {React.cloneElement(arch.icon as React.ReactElement<any>, { className: `w-5 h-5 md:w-6 md:h-6 ${isActive ? arch.color : 'text-gray-600'}` })}
                                      <span className="text-[7px] md:text-[9px] font-bold uppercase tracking-tighter text-center">{arch.title.replace('THE ', '')}</span>
                                  </button>
                              );
                          })}
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 animate-fadeIn">
                          <div className="lg:col-span-4 space-y-6">
                              <div className={`p-6 md:p-8 rounded-[2rem] md:rounded-[2.5rem] border ${ARCHETYPES_DATA[selectedCodexArch].border} ${ARCHETYPES_DATA[selectedCodexArch].bg} shadow-2xl relative overflow-hidden`}>
                                  <div className="relative z-10">
                                      <div className="flex items-center gap-3 md:gap-4 mb-3 md:mb-4">
                                          {/* Fix: use conditional size prop instead of unsupported md:size */}
                                          <Hexagon className={ARCHETYPES_DATA[selectedCodexArch].color} size={isMobile ? 32 : 40} />
                                          <h1 className={`text-xl md:text-3xl font-tech ${ARCHETYPES_DATA[selectedCodexArch].color} uppercase tracking-tighter leading-none`}>{ARCHETYPES_DATA[selectedCodexArch].title}</h1>
                                      </div>
                                      <p className="text-xs md:text-sm text-gray-300 font-reading leading-relaxed mb-4 md:mb-6 italic">"{ARCHETYPES_DATA[selectedCodexArch].desc}"</p>
                                      <div className="h-1 w-16 md:w-20 bg-white/20 rounded-full mb-4 md:mb-6"></div>
                                      <div className="flex items-center gap-2 text-[8px] md:text-[10px] text-gray-500 uppercase font-bold tracking-widest">
                                          <Info size={10} /> Functional Dossier V.2
                                      </div>
                                  </div>
                                  <div className="absolute top-0 right-0 w-24 h-24 md:w-32 md:h-32 bg-white/5 rounded-full blur-3xl -translate-y-8 md:-translate-y-12 translate-x-8 md:translate-x-12"></div>
                              </div>
                          </div>

                          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                              {ARCHETYPES_DATA[selectedCodexArch].skills.map((skill, idx) => (
                                  <div key={idx} className="bg-white/5 border border-white/10 p-4 md:p-6 rounded-2xl md:rounded-3xl hover:border-white/20 transition-all group relative overflow-hidden flex flex-col h-full">
                                      <div className="flex justify-between items-start mb-4 md:mb-6">
                                          <div className="text-2xl md:text-3xl grayscale group-hover:grayscale-0 transition-all">{skill.icon}</div>
                                          <span className={`text-[7px] md:text-[8px] px-1.5 md:px-2 py-0.5 rounded-full bg-white/10 text-white font-mono uppercase tracking-widest`}>{skill.type}</span>
                                      </div>
                                      <h3 className="text-base md:text-lg font-tech text-white mb-1 md:mb-2 uppercase tracking-wide group-hover:text-cyan-400 transition-colors">{skill.name}</h3>
                                      <p className="text-[10px] md:text-xs text-gray-500 font-reading leading-relaxed flex-1">{skill.desc}</p>
                                      <div className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-white/5 flex items-center gap-2 text-[7px] md:text-[8px] font-mono text-gray-600 uppercase tracking-widest">
                                          <Activity size={8} /> Active Protocol
                                      </div>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* 8. STATS OVERLAY (BIO-FORGE) */}
      {showStats && (
          <div className="absolute inset-0 z-[110] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-6 animate-fadeIn">
              <div className="w-full max-w-2xl bg-[#050505] border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]">
                  <div className="p-6 md:p-10 border-b border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-4 md:gap-6">
                          <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${currentArchTheme.bg} border ${currentArchTheme.border}`}>
                              {/* Fix: use conditional size prop instead of unsupported md:size */}
                              <Activity className={currentArchTheme.color} size={isMobile ? 24 : 32} />
                          </div>
                          <div>
                              <h2 className="text-lg md:text-2xl font-tech text-white uppercase tracking-widest">Node Integrity</h2>
                              <p className="text-[8px] md:text-[10px] text-gray-500 uppercase font-mono tracking-widest">Biometric Data Log // Sync Stable</p>
                          </div>
                      </div>
                      <button onClick={() => setShowStats(false)} className="p-2 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-all"><X size={20}/></button>
                  </div>
                  <div className="p-6 md:p-10 grid grid-cols-2 gap-4 md:gap-8">
                      <div className="space-y-4 md:space-y-6">
                          <StatRow label="Current Level" value={`LVL ${user?.level || 1}`} icon={<Layers size={12}/>}/>
                          <StatRow label="Synaptic Mass (XP)" value={`${user?.xp || 0}`} icon={<Database size={12}/>}/>
                          <StatRow label="Metabolic Energy" value={`${user?.atp || 85}%`} icon={<Zap size={12}/>}/>
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

      {/* 9. BOTTOM NAVIGATION DOCK */}
      <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-[80] w-full max-w-lg px-4 md:px-6 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] md:rounded-[2.5rem] p-2 md:p-3 flex items-center justify-between shadow-[0_30px_100px_rgba(0,0,0,0.8)] pointer-events-auto relative">
              <div className="flex gap-1 md:gap-2">
                  <NavBtn icon={<Database />} label="HUB" active={activeTab === 'INTERFACE'} onClick={() => handleNav('INTERFACE')} />
                  <NavBtn icon={<Book />} label="BRAIN MS" active={activeTab === 'MANUSCRIPT'} onClick={() => handleNav('MANUSCRIPT')} />
              </div>
              
              <div className="absolute left-1/2 -translate-x-1/2 -top-6 md:-top-8">
                  <button 
                    onClick={() => { playNeuralLink(); setShowStats(true); }}
                    className={`w-14 h-14 md:w-20 md:h-20 rounded-full border-2 md:border-4 border-black bg-gradient-to-tr from-cyan-600 to-blue-500 flex items-center justify-center shadow-[0_0_30px_rgba(6,182,212,0.6)] hover:scale-110 active:scale-95 transition-all group`}
                  >
                      {/* Fix: use conditional size prop instead of unsupported md:size */}
                      <Brain size={isMobile ? 24 : 32} className="text-white group-hover:animate-pulse" />
                  </button>
              </div>

              <div className="flex gap-1 md:gap-2">
                  <NavBtn icon={<Globe />} label="MAP" active={activeTab === 'MAP'} onClick={() => handleNav('MAP')} />
                  <NavBtn icon={<Users />} label="CLAN" active={activeTab === 'CLAN'} onClick={() => handleNav('CLAN')} />
              </div>
          </div>
      </div>

      <style>{`
          .animate-pulse-slow { animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
          @keyframes pulse { 0%, 100% { opacity: 0.2; } 50% { opacity: 0.4; } }
          .mask-fade-top { mask-image: linear-gradient(to bottom, transparent, black 20%); }
      `}</style>
    </div>
  );
};

const NavBtn = ({ icon, label, active, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-xl md:rounded-2xl transition-all ${active ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
  >
    {/* Fix: Cast icon to any for cloneElement to correctly apply size prop to Lucide icons */}
    {React.cloneElement(icon as any, { size: window.innerWidth < 768 ? 18 : 22 })}
    <span className="text-[6px] md:text-[8px] font-bold mt-1 tracking-widest uppercase">{label}</span>
  </button>
);

const ResourceGauge = ({ label, value, max, color, icon }: any) => (
  <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm p-2 rounded-xl border border-white/5">
      <div className={`p-1.5 rounded-lg bg-black/60 ${color.replace('bg-', 'text-')} border border-white/10`}>{icon}</div>
      <div className="flex flex-col gap-1 pr-2">
          <div className="flex justify-between text-[7px] font-bold text-gray-500 uppercase tracking-widest">
              <span>{label}</span>
              <span>{value}/{max}</span>
          </div>
          <div className="w-24 h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <div className={`h-full ${color} shadow-[0_0_10px_currentColor] transition-all duration-1000`} style={{ width: `${(value/max)*100}%` }}></div>
          </div>
      </div>
  </div>
);

const StatRow = ({ label, value, icon, color = 'text-white' }: any) => (
    <div className="flex items-center justify-between p-3 md:p-4 bg-white/5 rounded-xl md:rounded-2xl border border-white/5">
        <div className="flex items-center gap-2 md:gap-3 text-gray-500">
            {React.cloneElement(icon as React.ReactElement, { size: 12 })}
            <span className="text-[8px] md:text-[10px] uppercase font-bold tracking-widest">{label}</span>
        </div>
        <span className={`text-xs md:text-sm font-tech ${color} tracking-wider`}>{value}</span>
    </div>
);
