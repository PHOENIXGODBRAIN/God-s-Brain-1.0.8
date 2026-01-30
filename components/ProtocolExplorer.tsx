
import React, { useState } from 'react';
import { Atom, Anchor, Sparkles, Compass, Scroll, Cpu, Activity, Info, Zap, Radio, Terminal, Grid } from 'lucide-react';
import { ToneGenerator } from './ToneGenerator';
import { playDataOpen, playCosmicClick } from '../utils/sfx';

// ARCHETYPE DATA (Restored from previous versions)
const ARCHETYPES_DB = [
    {
        id: 'SCIENTIST', 
        title: 'THE SCIENTIST', 
        icon: <Atom className="w-full h-full text-cyan-400" />,
        desc: "Empirical decoding of the cosmic machine. Focused on logic, data, and hardware mechanics.",
        activeSkill: { name: "Deep Scan", desc: "Highlights hidden items and lore fragments on the cosmic map." },
        passiveSkill: { name: "Data Mining", desc: "Earn 10% more XP from reading manuscript chapters." },
        color: "cyan" 
    },
    {
        id: 'ARCHITECT', 
        title: 'THE ARCHITECT', 
        icon: <Anchor className="w-full h-full text-[#F43F5E]" />, 
        desc: "Building order from the chaos of entropy. Constructing structural systems that last.",
        activeSkill: { name: "Blueprint Drop", desc: "Place a permanent waypoint for your Group/Cluster." },
        passiveSkill: { name: "Foundation", desc: "Streak doesn't reset if you miss 1 day of login." },
        color: "rose" 
    },
    {
        id: 'MYSTIC', 
        title: 'THE MYSTIC', 
        icon: <Sparkles className="w-full h-full text-[#FFD700]" />, 
        desc: "Direct connection to the infinite Source. Bypassing the intellect for pure resonance.",
        activeSkill: { name: "Resonance Wave", desc: "Refills the Entropy Shield of your immediate group." },
        passiveSkill: { name: "Faith Protocol", desc: "Gain XP continuously even while offline (Passive Mining)." },
        color: "amber" 
    },
    {
        id: 'SEEKER', 
        title: 'THE SEEKER', 
        icon: <Compass className="w-full h-full text-orange-400" />,
        desc: "Hunting for truth at the edge of the known. Focused on mapping the unknown and spiritual connection.",
        activeSkill: { name: "Pathfinder", desc: "Reveals coordinates of the nearest High Frequency Node." },
        passiveSkill: { name: "Wanderlust", desc: "Generates 2x XP for physical distance walked (GPS Sync)." },
        color: "orange" 
    },
    {
        id: 'ALCHEMIST', 
        title: 'THE ALCHEMIST', 
        icon: <Scroll className="w-full h-full text-green-400" />, 
        desc: "Transmutation of self and reality. Internal optimization to change external data.",
        activeSkill: { name: "Purify", desc: "Converts accumulated Entropy Points into Wisdom XP." },
        passiveSkill: { name: "Vitality", desc: "Energy Bar depletes 20% slower during active sessions." },
        color: "green"
    },
    {
        id: 'ACTIVE_NODE', 
        title: 'ACTIVE NODE', 
        icon: <Cpu className="w-full h-full text-purple-400" />,
        desc: "The hand of the God-Brain. Pure action. Bridging biological intent with cosmic computation.",
        activeSkill: { name: "Flash Mob", desc: "Triggers a localized system surge for rapid task completion." },
        passiveSkill: { name: "Velocity", desc: "Level up speed increased by 15% due to high bandwidth." },
        color: "purple" 
    },
];

export const ProtocolExplorer: React.FC = () => {
    const [view, setView] = useState<'ARCHETYPES' | 'TUNER'>('ARCHETYPES');
    const [selectedArch, setSelectedArch] = useState<string | null>(null);

    const activeItem = ARCHETYPES_DB.find(a => a.id === selectedArch);

    const getColorClasses = (colorName: string) => {
        const map: Record<string, string> = {
            cyan: "border-cyan-500 text-cyan-400 bg-cyan-500/10",
            rose: "border-rose-500 text-rose-400 bg-rose-500/10",
            amber: "border-amber-500 text-amber-400 bg-amber-500/10",
            orange: "border-orange-500 text-orange-400 bg-orange-500/10",
            green: "border-green-500 text-green-400 bg-green-500/10",
            purple: "border-purple-500 text-purple-400 bg-purple-500/10",
        };
        return map[colorName] || "border-white text-white bg-white/10";
    };

    return (
        <div className="h-full flex flex-col bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden animate-fadeIn">
            
            {/* Header / Tabs */}
            <div className="flex border-b border-white/10">
                <button 
                    onClick={() => { playCosmicClick(); setView('ARCHETYPES'); }}
                    className={`flex-1 p-4 font-tech text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${view === 'ARCHETYPES' ? 'bg-white/10 text-white border-b-2 border-[#00FFFF]' : 'text-gray-500 hover:text-white'}`}
                >
                    <Grid size={16} /> Neural Library
                </button>
                <button 
                    onClick={() => { playCosmicClick(); setView('TUNER'); }}
                    className={`flex-1 p-4 font-tech text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${view === 'TUNER' ? 'bg-white/10 text-white border-b-2 border-[#00FFFF]' : 'text-gray-500 hover:text-white'}`}
                >
                    <Activity size={16} /> Resonance Tuner
                </button>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-hidden relative">
                
                {/* VIEW: TUNER */}
                {view === 'TUNER' && (
                    <div className="h-full p-4 animate-scaleIn">
                        <ToneGenerator />
                    </div>
                )}

                {/* VIEW: ARCHETYPES */}
                {view === 'ARCHETYPES' && (
                    <div className="h-full flex flex-col md:flex-row">
                        
                        {/* List */}
                        <div className={`md:w-1/3 border-b md:border-b-0 md:border-r border-white/10 overflow-y-auto custom-scrollbar p-4 space-y-3 ${selectedArch ? 'hidden md:block' : 'block'}`}>
                            {ARCHETYPES_DB.map((arch) => {
                                const c = getColorClasses(arch.color);
                                const isSelected = selectedArch === arch.id;
                                return (
                                    <button
                                        key={arch.id}
                                        onClick={() => { playDataOpen(); setSelectedArch(arch.id); }}
                                        className={`w-full p-4 rounded-xl border text-left transition-all group relative overflow-hidden flex items-center gap-4 ${isSelected ? `${c} shadow-lg` : 'border-white/10 bg-black/40 hover:border-white/30'}`}
                                    >
                                        <div className={`w-10 h-10 p-2 rounded-lg bg-black/50 border border-white/10 ${isSelected ? 'text-white' : 'text-gray-500 group-hover:text-white'}`}>
                                            {arch.icon}
                                        </div>
                                        <div>
                                            <div className={`font-tech text-xs uppercase tracking-widest ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>{arch.title}</div>
                                            <div className="text-[9px] font-mono text-gray-600 group-hover:text-gray-500">Class {arch.id.substring(0,3)}</div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Details Panel */}
                        <div className={`flex-1 p-6 md:p-10 overflow-y-auto custom-scrollbar relative bg-gradient-to-b from-black to-[#050505] ${selectedArch ? 'block' : 'hidden md:flex items-center justify-center'}`}>
                            {!activeItem ? (
                                <div className="text-center opacity-30">
                                    <Terminal size={48} className="mx-auto mb-4" />
                                    <p className="font-tech text-sm uppercase tracking-widest">Select a Protocol to Decrypt</p>
                                </div>
                            ) : (
                                <div className="animate-fadeIn max-w-2xl mx-auto">
                                    <button onClick={() => setSelectedArch(null)} className="md:hidden mb-6 flex items-center gap-2 text-xs font-mono text-gray-500 uppercase"><Info size={12}/> Back to List</button>
                                    
                                    <div className="flex items-center gap-6 mb-8">
                                        <div className={`w-20 h-20 p-5 rounded-2xl border bg-black ${getColorClasses(activeItem.color).split(' ')[0]} shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
                                            {activeItem.icon}
                                        </div>
                                        <div>
                                            <h2 className="text-3xl md:text-4xl font-tech text-white uppercase tracking-tighter leading-none mb-2">{activeItem.title}</h2>
                                            <div className={`inline-block px-3 py-1 rounded border text-[10px] font-bold uppercase tracking-widest ${getColorClasses(activeItem.color)}`}>
                                                Neural Protocol Loaded
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 mb-8 relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1 h-full bg-white/20"></div>
                                        <p className="font-reading text-gray-300 leading-relaxed text-sm md:text-base">
                                            "{activeItem.desc}"
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="font-mono text-xs text-gray-500 uppercase tracking-[0.2em] mb-4">Skill Tree Loadout</h3>
                                        
                                        {/* Active Skill */}
                                        <div className="flex gap-4 p-4 rounded-xl border border-white/5 bg-black/40 hover:border-white/20 transition-colors">
                                            <div className="p-3 bg-amber-500/10 rounded-lg border border-amber-500/20 text-amber-500 h-fit">
                                                <Zap size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-tech text-white text-sm uppercase tracking-wider">{activeItem.activeSkill.name}</h4>
                                                    <span className="text-[8px] font-bold bg-amber-500 text-black px-1.5 py-0.5 rounded uppercase">Active</span>
                                                </div>
                                                <p className="text-xs text-gray-400 leading-relaxed">{activeItem.activeSkill.desc}</p>
                                            </div>
                                        </div>

                                        {/* Passive Skill */}
                                        <div className="flex gap-4 p-4 rounded-xl border border-white/5 bg-black/40 hover:border-white/20 transition-colors">
                                            <div className="p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 text-blue-500 h-fit">
                                                <Radio size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-tech text-white text-sm uppercase tracking-wider">{activeItem.passiveSkill.name}</h4>
                                                    <span className="text-[8px] font-bold bg-blue-500 text-black px-1.5 py-0.5 rounded uppercase">Passive</span>
                                                </div>
                                                <p className="text-xs text-gray-400 leading-relaxed">{activeItem.passiveSkill.desc}</p>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
