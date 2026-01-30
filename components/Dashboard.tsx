
import React, { useState } from 'react';
import { UserPath, UserProfile } from '../types';
import { CHAPTERS } from '../constants';
import { AiCompanion } from './AiCompanion';
import { ChapterReader } from './ChapterReader';
import { PaymentGateway } from './PaymentGateway';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { CosmicMap } from './CosmicMap';
import { ProtocolExplorer } from './ProtocolExplorer';
import { AdminPanel } from './Admin/AdminPanel';
import { 
  X, Zap, Database, Activity, Cpu, 
  Atom, Anchor, Compass, Scroll, Sparkles, Layers, Shield, Star, Target, Flame, Dna
} from 'lucide-react';
import { playNeuralLink, playDataOpen } from '../utils/sfx';
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

const ARCHETYPES_DATA: Record<string, { title: string, color: string, bg: string, border: string, icon: React.ReactElement, desc: string }> = {
    'SCIENTIST': { 
        title: 'THE SCIENTIST', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', icon: <Atom />,
        desc: "Empirical decoding of the cosmic machine."
    },
    'ARCHITECT': { 
        title: 'THE ARCHITECT', color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/30', icon: <Anchor />,
        desc: "Building order from the chaos of entropy."
    },
    'MYSTIC': { 
        title: 'THE MYSTIC', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', icon: <Sparkles />,
        desc: "Direct connection to the infinite Source."
    },
    'SEEKER': { 
        title: 'THE SEEKER', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', icon: <Compass />,
        desc: "Hunting for truth at the edge of the known."
    },
    'ALCHEMIST': { 
        title: 'THE ALCHEMIST', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/30', icon: <Scroll />,
        desc: "Transmutation of self and reality."
    },
    'ACTIVE_NODE': { 
        title: 'ACTIVE NODE', color: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', icon: <Cpu />,
        desc: "The hand of the God-Brain. Pure action."
    },
};

export const Dashboard: React.FC<DashboardProps> = ({ 
    path, isPremium, onPremiumToggle, onLogout, isAuthor, onAuthorLogin,
    user, onUpdateProfile, queriesUsed, onQuery, onEditNeuron, onPhoenixTrigger
}) => {
  const { credits } = useProgression();
  const [activeTab, setActiveTab] = useState<'INTERFACE' | 'companion' | 'book' | 'map' | 'protocols' | 'audio' | 'admin'>('INTERFACE');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [aiState, setAiState] = useState<'FULL' | 'HUD' | 'MINIMIZED'>('HUD');
  const [showPayment, setShowPayment] = useState(false);
  const [showStats, setShowStats] = useState(false);
  
  const currentArchTheme = ARCHETYPES_DATA[user?.archetype || 'ACTIVE_NODE'] || ARCHETYPES_DATA.ACTIVE_NODE;
  const isMobile = window.innerWidth < 768;

  return (
    <div className="h-screen w-screen relative overflow-hidden bg-transparent font-mono selection:bg-cyan-500/30 flex">
      
      {/* 1. PAYMENT GATEWAY OVERLAY */}
      {showPayment && (
        <PaymentGateway 
            onClose={() => setShowPayment(false)} 
            onSuccess={() => { onPremiumToggle(true); setShowPayment(false); }}
            price="$9.99"
        />
      )}

      {/* 2. SIDEBAR NAVIGATION */}
      <Sidebar 
        activeTab={activeTab}
        onTabChange={(tab) => { setActiveTab(tab); setIsMenuOpen(false); }}
        isMenuOpen={isMenuOpen}
        onCloseMenu={() => setIsMenuOpen(false)}
        isPremium={isPremium}
        isAuthor={isAuthor}
        onUpgrade={() => setShowPayment(true)}
        onOverride={onPhoenixTrigger || (() => {})}
        onLogout={onLogout}
        onShowPayment={() => setShowPayment(true)}
        onEditNeuron={onEditNeuron}
      />

      {/* 3. MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-full relative z-10 transition-all duration-300 bg-transparent overflow-hidden">
        
        {/* TOP BAR */}
        <div className="shrink-0 p-4 pb-0">
            <TopBar 
                activeTab={activeTab}
                isMenuOpen={isMenuOpen}
                onToggleMenu={() => setIsMenuOpen(!isMenuOpen)}
                user={user}
                path={path}
                isAuthor={isAuthor}
                onUpdateProfile={onUpdateProfile}
            />
        </div>

        {/* DYNAMIC CONTENT CONTAINER */}
        <div className="flex-1 overflow-hidden relative px-4 pb-4">
            
            {/* TAB: INTERFACE (BIO-FORGE & HOME) */}
            {activeTab === 'INTERFACE' && (
                <div className="h-full w-full relative">
                    {/* IDENTITY HUD (Top Left) */}
                    <div className="absolute top-2 left-2 z-[50] animate-fadeIn pointer-events-auto hidden md:block">
                        <div 
                            onClick={() => { playDataOpen(); setShowStats(true); }}
                            className="flex flex-col gap-1 md:gap-2 cursor-pointer group"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <div className={`text-sm md:text-xl font-tech ${currentArchTheme.color} uppercase tracking-[0.1em] md:tracking-[0.2em] drop-shadow-[0_0_8px_currentColor] leading-none group-hover:brightness-125 transition-all`}>
                                    {isAuthor ? 'THE PHOENIX' : (user?.archetype || 'GUEST NODE')}
                                </div>
                                {isPremium && (
                                    <div className="px-2 py-0.5 bg-amber-500 rounded text-[9px] md:text-[10px] font-bold text-black flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.5)] animate-pulse">
                                        <Star size={10} fill="currentColor" /> AWAKENED
                                    </div>
                                )}
                            </div>
                            
                            <div className="bg-black/60 backdrop-blur-xl p-3 md:p-4 pr-6 md:pr-10 rounded-2xl border border-white/10 shadow-2xl group-hover:border-white/30 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl ${currentArchTheme.bg} ${currentArchTheme.border} border flex items-center justify-center shadow-inner overflow-hidden shrink-0 relative`}>
                                        {isAuthor ? <Flame className="w-6 h-6 md:w-7 md:h-7 text-amber-500" /> : (user?.avatar ? <img src={user.avatar} className="w-full h-full object-cover" alt="Avatar" /> : React.cloneElement(currentArchTheme.icon as React.ReactElement<any>, { className: `w-6 h-6 ${currentArchTheme.color}` }))}
                                        {isPremium && <div className="absolute inset-0 border border-amber-500/50 rounded-xl animate-pulse"></div>}
                                    </div>
                                    <div className="min-w-0">
                                        <h1 className="text-sm md:text-lg font-tech text-white uppercase tracking-tight leading-none mb-1">{user?.name || 'NODE_001'}</h1>
                                        <div className="flex items-center gap-2">
                                            <Target size={12} className={currentArchTheme.color} />
                                            <span className="text-[10px] md:text-xs text-gray-400 uppercase font-bold tracking-widest truncate max-w-[140px]">{user?.startingSkill || 'INITIALIZING...'}</span>
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse ml-2"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RESOURCE HUD (Top Right) */}
                    <div className="absolute top-2 right-2 z-30 hidden lg:flex flex-col gap-3 pointer-events-none">
                        <ResourceGauge label="ATP Energy" value={user?.atp || 85} max={100} color="bg-green-500" icon={<Zap size={14} />} />
                        <ResourceGauge label="Neural Credits" value={credits} max={9999} color="bg-amber-500" icon={<Star size={14} />} />
                        <ResourceGauge label="Proteins" value={user?.proteins || 420} max={1000} color="bg-purple-500" icon={<Dna size={14} />} />
                    </div>

                    {/* CENTRAL NEURON AVATAR */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-700 ${showStats ? 'scale-75 opacity-20 blur-lg pointer-events-none' : 'scale-100 opacity-100'}`}>
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
                                        <span className="text-xs font-tech text-white uppercase tracking-[0.4em]">Node Stats</span>
                                        <Zap className="text-white w-5 h-5 animate-bounce" />
                                    </div>
                                </div>
                            ) : (
                                <div className="w-80 h-80 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-pulse"><Activity className="w-20 h-20 text-gray-700" /></div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* TAB: AI COMPANION */}
            {activeTab === 'companion' && (
                <div className="h-full max-w-4xl mx-auto animate-scaleIn">
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
            )}

            {/* TAB: MANUSCRIPT (BOOK) */}
            {activeTab === 'book' && (
                <div className="h-full max-w-5xl mx-auto animate-scaleIn">
                    <ChapterReader 
                        chapters={CHAPTERS}
                        isPremium={isPremium}
                        onUpgrade={() => setShowPayment(true)}
                    />
                </div>
            )}

            {/* TAB: PROTOCOLS (Protocol Explorer with Tone Generator) */}
            {activeTab === 'protocols' && (
               <div className="h-full max-w-6xl mx-auto animate-scaleIn flex flex-col justify-center">
                   <ProtocolExplorer /> 
               </div>
            )}

            {/* TAB: AUDIO (Explicit for clarity based on user request) */}
            {activeTab === 'audio' && (
               <div className="h-full max-w-4xl mx-auto animate-scaleIn flex items-center justify-center">
                   <div className="text-center">
                       <h2 className="text-2xl font-tech text-white mb-4">AUDIO UPLINK ACTIVE</h2>
                       <p className="text-gray-400 font-mono">Use the Global Player (Bottom Right) to control frequencies.</p>
                   </div>
               </div>
            )}

            {/* TAB: COSMIC MAP */}
            {activeTab === 'map' && (
                <div className="h-full max-w-6xl mx-auto animate-scaleIn flex flex-col justify-center">
                    <CosmicMap />
                </div>
            )}
            
            {/* TAB: ADMIN PANEL */}
            {activeTab === 'admin' && isAuthor && (
                <div className="h-full max-w-6xl mx-auto animate-scaleIn">
                    <AdminPanel />
                </div>
            )}

        </div>
      </div>
      
      {/* STATS OVERLAY (BIO-FORGE) */}
      {showStats && (
          <div className="absolute inset-0 z-[110] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4 md:p-6 animate-fadeIn">
              <div className="w-full max-w-2xl bg-[#050505] border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,1)]">
                  <div className="p-6 md:p-10 border-b border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-4 md:gap-6">
                          <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${currentArchTheme.bg} border ${currentArchTheme.border}`}>
                              <Activity className={currentArchTheme.color} size={isMobile ? 32 : 40} />
                          </div>
                          <div>
                              <div className="flex items-center gap-3">
                                <h2 className="text-xl md:text-3xl font-tech text-white uppercase tracking-widest">Node Integrity</h2>
                                {isPremium && <span className="px-3 py-1 bg-amber-500 rounded text-[10px] font-bold text-black uppercase tracking-tighter shadow-[0_0_15px_rgba(245,158,11,0.4)]">Premium</span>}
                              </div>
                              <p className="text-[10px] md:text-xs text-gray-500 uppercase font-mono tracking-widest mt-1">Biometric Data Log // Sync Stable</p>
                          </div>
                      </div>
                      <button onClick={() => setShowStats(false)} className="p-3 hover:bg-white/10 rounded-full text-gray-500 hover:text-white transition-all"><X size={24}/></button>
                  </div>
                  <div className="p-6 md:p-10 grid grid-cols-2 gap-4 md:gap-8">
                      <div className="space-y-4 md:space-y-6">
                          <StatRow label="Current Level" value={`LVL ${user?.level || 1}`} icon={<Layers size={16}/>}/>
                          <StatRow label="Neural Credits" value={`${credits}`} icon={<Star size={16}/>} color="text-amber-400"/>
                          <StatRow label="Synaptic Mass (XP)" value={`${user?.xp || 0}`} icon={<Database size={16}/>}/>
                      </div>
                      <div className="space-y-4 md:space-y-6">
                          <StatRow label="Structural Material" value={`${user?.proteins || 420} Units`} icon={<Dna size={16}/>}/>
                          <StatRow label="System Voltage" value={`${user?.voltage || 15}V`} icon={<Cpu size={16}/>}/>
                          <StatRow label="Uplink Priority" value={isPremium || isAuthor ? 'ROOT' : 'STD'} icon={<Shield size={16}/>} color={isPremium || isAuthor ? 'text-amber-500' : 'text-cyan-500'}/>
                      </div>
                  </div>
                  <div className="p-6 md:p-8 bg-white/5 border-t border-white/5 flex flex-col sm:flex-row justify-center gap-3 md:gap-4">
                       <button 
                        onClick={() => { playNeuralLink(); setShowStats(false); onEditNeuron(); }}
                        className="px-8 py-3 md:px-12 md:py-5 bg-white text-black font-tech text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-full hover:bg-cyan-400 transition-all shadow-xl font-bold"
                       >
                           Modify Biomass
                       </button>
                       <button onClick={() => setShowStats(false)} className="px-8 py-3 md:px-12 md:py-5 bg-transparent border border-white/10 text-gray-500 text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] rounded-full hover:bg-white/5 hover:text-white transition-all font-bold">Close</button>
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
    <div className="flex items-center gap-3 bg-black/60 backdrop-blur-xl p-3 rounded-xl border border-white/10 w-48 shadow-lg">
        <div className="text-gray-400">{icon}</div>
        <div className="flex-1">
            <div className="flex justify-between text-[10px] font-mono text-gray-400 mb-1 font-bold uppercase tracking-wider">
                <span>{label}</span>
                <span>{value}</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden border border-white/5">
                <div 
                    className={`h-full ${color} transition-all duration-500 shadow-[0_0_10px_currentColor]`} 
                    style={{ width: `${Math.min(100, (value / max) * 100)}%` }}
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
    <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors group">
        <div className="flex items-center gap-4">
            <div className="text-gray-500 group-hover:text-white transition-colors">{icon}</div>
            <span className="text-xs text-gray-400 uppercase font-mono tracking-widest font-bold">{label}</span>
        </div>
        <span className={`text-base font-bold uppercase font-tech tracking-wider ${color}`}>{value}</span>
    </div>
);
