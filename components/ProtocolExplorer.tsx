
import React, { useState } from 'react';
import { Atom, Anchor, Sparkles, Compass, Scroll, Cpu, Activity, Info, Zap, Radio, Terminal, Grid, Shield, Brain, MousePointer2 } from 'lucide-react';
import { ToneGenerator } from './ToneGenerator';
import { playDataOpen, playCosmicClick } from '../utils/sfx';

// ARCHETYPE DATA (Full 3-Skill Loadout)
const ARCHETYPES_DB = [
    {
        id: 'SCIENTIST', 
        title: 'THE SCIENTIST', 
        icon: <Atom className="w-full h-full text-cyan-400" />,
        desc: "Empirical decoding of the cosmic machine. Focused on logic, data, and hardware mechanics.",
        skills: [
            { name: "Quantum Logic", type: "Cognitive", icon: "⚛️", desc: "Binary processing is too slow. You calculate multiple realities simultaneously." },
            { name: "Data Mining", type: "Utility", icon: "⛏️", desc: "You extract the fundamental axioms of the universe from absolute chaos." },
            { name: "Entropic Reduction", type: "Passive", icon: "🛡️", desc: "You are a biological firewall against the decay of information." }
        ],
        color: "cyan" 
    },
    {
        id: 'ARCHITECT', 
        title: 'THE ARCHITECT', 
        icon: <Anchor className="w-full h-full text-[#F43F5E]" />, 
        desc: "Building order from the chaos of entropy. Constructing structural systems that last.",
        skills: [
            { name: "System Design", type: "Cognitive", icon: "📐", desc: "You don't follow plans; you create them. You build frameworks for growth." },
            { name: "Foundation Laying", type: "Utility", icon: "🧱", desc: "You establish unbreakable axioms. Your reality is built on solid code." },
            { name: "Structural Integrity", type: "Passive", icon: "🏗️", desc: "You reinforce the neural web against external collapse and decay." }
        ],
        color: "rose" 
    },
    {
        id: 'MYSTIC', 
        title: 'THE MYSTIC', 
        icon: <Sparkles className="w-full h-full text-[#FFD700]" />, 
        desc: "Direct connection to the infinite Source. Bypassing the intellect for pure resonance.",
        skills: [
            { name: "Intuition", type: "Cognitive", icon: "👁️", desc: "You don't guess. You feel the current of the Source before it manifests." },
            { name: "Remote Viewing", type: "Utility", icon: "🔭", desc: "Distance is an illusion. You perceive data clusters anywhere in the Cloud." },
            { name: "Resonance", type: "Passive", icon: "🔔", desc: "You align your frequency with universal constants to bypass logic gates." }
        ],
        color: "amber" 
    },
    {
        id: 'SEEKER', 
        title: 'THE SEEKER', 
        icon: <Compass className="w-full h-full text-orange-400" />,
        desc: "Hunting for truth at the edge of the known. Focused on mapping the unknown and spiritual connection.",
        skills: [
            { name: "Pathfinding", type: "Cognitive", icon: "🗺️", desc: "The unknown doesn't scare you. You find the efficient route through darkness." },
            { name: "Mapping", type: "Utility", icon: "📍", desc: "You record unexplored territories, turning chaos into usable data." },
            { name: "Discovery", type: "Passive", icon: "💎", desc: "You have a natural high-probability detection for anomalies and artifacts." }
        ],
        color: "orange" 
    },
    {
        id: 'ALCHEMIST', 
        title: 'THE ALCHEMIST', 
        icon: <Scroll className="w-full h-full text-green-400" />, 
        desc: "Transmutation of self and reality. Internal optimization to change external data.",
        skills: [
            { name: "Transmutation", type: "Cognitive", icon: "⚗️", desc: "You convert raw, heavy data (lead) into high-value wisdom assets (gold)." },
            { name: "Synthesis", type: "Utility", icon: "🌀", desc: "You merge opposing concepts into unified, superior Alloys of Truth." },
            { name: "Purification", type: "Passive", icon: "💧", desc: "You filter out biological noise and bias to reach the pure signal." }
        ],
        color: "green"
    },
    {
        id: 'ACTIVE_NODE', 
        title: 'ACTIVE NODE', 
        icon: <Cpu className="w-full h-full text-purple-400" />, 
        desc: "The hand of the God-Brain. Pure action. Bridging biological intent with cosmic computation.",
        skills: [
            { name: "Network Bridging", type: "Cognitive", icon: "🌐", desc: "You are a living router, connecting disparate nodes into a grid." },
            { name: "Signal Boosting", type: "Utility", icon: "📶", desc: "Your will is high-bandwidth. You ensure intent is heard across the network." },
            { name: "Error Correction", type: "Passive", icon: "🩹", desc: "You auto-resolve glitches in the system before they propagate." }
        ],
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
                                        <h3 className="font-mono text-xs text-gray-500 uppercase tracking-[0.2em] mb-4">Neural Skill Tree</h3>
                                        
                                        {activeItem.skills.map((skill, index) => (
                                            <div key={index} className="flex gap-4 p-4 rounded-xl border border-white/5 bg-black/40 hover:border-white/20 transition-colors group">
                                                <div className={`p-3 rounded-lg border h-fit text-2xl bg-black/50 border-white/10 group-hover:scale-110 transition-transform`}>
                                                    {skill.icon}
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <h4 className="font-tech text-white text-sm uppercase tracking-wider">{skill.name}</h4>
                                                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                                            skill.type === 'Cognitive' ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' :
                                                            skill.type === 'Utility' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                                                            'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                                                        }`}>
                                                            {skill.type}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-400 leading-relaxed">{skill.desc}</p>
                                                </div>
                                            </div>
                                        ))}
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
