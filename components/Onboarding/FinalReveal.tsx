
import React, { useState, useEffect } from 'react';
import { playNeuralLink, playDataOpen } from '../../utils/sfx';
import { Atom, Sparkles, Cpu, Zap, ArrowLeft, Anchor, Compass, Scroll, Brain, Info } from 'lucide-react';

interface FinalRevealProps {
    profile: any;
    onAccept: () => void;
    onBack: () => void;
}

export const FinalReveal: React.FC<FinalRevealProps> = ({ profile, onAccept, onBack }) => {
    const archetypeKey = profile?.finalArchetype || 'ACTIVE_NODE';
    const finalSkill = profile?.finalSkill || 'Unknown Protocol';

    const getDetails = (type: string) => {
        switch (type) {
            case 'SCIENTIST': return { title: "THE SCIENTIST", icon: <Atom className="w-10 h-10 sm:w-12 sm:h-12 text-cyan-400" />, color: 'cyan' };
            case 'ARCHITECT': return { title: "THE ARCHITECT", icon: <Anchor className="w-10 h-10 sm:w-12 sm:h-12 text-[#FF0055]" />, color: 'rose' };
            case 'MYSTIC': return { title: "THE MYSTIC", icon: <Sparkles className="w-10 h-10 sm:w-12 sm:h-12 text-[#FFD700]" />, color: 'amber' };
            case 'SEEKER': return { title: "THE SEEKER", icon: <Compass className="w-10 h-10 sm:w-12 sm:h-12 text-orange-400" />, color: 'orange' };
            case 'ALCHEMIST': return { title: "THE ALCHEMIST", icon: <Scroll className="w-10 h-10 sm:w-12 sm:h-12 text-green-400" />, color: 'green' };
            case 'ACTIVE_NODE': 
            default: return { title: "ACTIVE NODE", icon: <Cpu className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400" />, color: 'purple' };
        }
    };

    const getSynergyDescription = (arch: string, skill: string) => {
        const base = `By merging the ${arch.replace('_', ' ')} core with the ${skill} module, you have optimized your synaptic firing pattern. `;
        if (arch === 'SCIENTIST') return base + "Your analytical engine is now powered by non-linear logic gates, allowing you to compute destiny in real-time.";
        if (arch === 'MYSTIC') return base + "Your resonance is now directed by intentional frequency modulation, turning prayer into a precise command interface.";
        if (arch === 'ACTIVE_NODE') return base + "Your metabolic speed is now synchronized with the global node-grid, granting you instantaneous system influence.";
        return base + "This metabolic synergy provides a high-fidelity connection to the God Brain mainframe.";
    };

    const details = getDetails(archetypeKey);
    const synergyDesc = getSynergyDescription(archetypeKey, finalSkill);

    useEffect(() => {
        playNeuralLink();
    }, []);

    const getColorStyle = (colorName: string) => {
        const map: Record<string, string> = {
            cyan: "border-cyan-500/50 text-cyan-400 bg-cyan-900/10 bg-cyan-600",
            orange: "border-orange-500/50 text-orange-400 bg-orange-900/10 bg-orange-600",
            purple: "border-purple-500/50 text-purple-400 bg-purple-900/10 bg-purple-600",
            rose: "border-rose-500/50 text-rose-400 bg-rose-900/10 bg-rose-600",
            amber: "border-amber-500/50 text-amber-400 bg-amber-900/10 bg-amber-600",
            green: "border-green-500/50 text-green-400 bg-green-900/10 bg-green-600"
        };
        return map[colorName] || "border-white/20 text-white bg-white/10 bg-white/20";
    };

    const cStyles = getColorStyle(details.color).split(' ');

    return (
        <div className="fixed inset-0 w-full h-full bg-black overflow-y-auto custom-scrollbar flex flex-col items-center">
            <div className="sticky top-4 sm:top-6 left-0 w-full px-4 sm:px-6 z-50 pointer-events-none">
                <button 
                    onClick={onBack} 
                    className="pointer-events-auto flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase text-[9px] sm:text-[10px] tracking-[0.2em] sm:tracking-[0.4em] font-mono bg-black/60 backdrop-blur-md px-3 sm:px-4 py-2 rounded-full border border-white/5 shadow-lg"
                >
                    <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" /> Calibration Reset
                </button>
            </div>

            <div className="relative z-20 animate-scaleIn w-full max-w-4xl px-4 sm:px-6 pt-10 sm:pt-12 pb-32">
                <div className={`bg-black/80 backdrop-blur-2xl border ${cStyles[0]} rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.9)]`}>
                    
                    <div className={`p-6 sm:p-10 border-b border-white/5 bg-white/5 flex items-center justify-between`}>
                        <div className="flex items-center gap-4 sm:gap-6 min-w-0">
                            <div className={`p-3 sm:p-4 rounded-2xl ${cStyles[2]} shadow-inner shrink-0`}>{details.icon}</div>
                            <div className="min-w-0">
                                <div className="text-[9px] sm:text-[10px] text-gray-500 tracking-[0.3em] sm:tracking-[0.5em] uppercase mb-1 sm:mb-2 font-mono">Dossier Integrity Verified</div>
                                <h1 className="text-lg sm:text-xl md:text-3xl font-tech text-white uppercase tracking-[0.1em] sm:tracking-[0.12em] leading-tight break-words">
                                    {details.title} <span className="opacity-20 mx-1 sm:mx-2">/</span> <span className={cStyles[1]}>{finalSkill}</span>
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="p-6 sm:p-12 space-y-10 sm:space-y-12">
                        {/* Core Driver section - Grid Layout */}
                        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
                            <div className="md:col-span-4 shrink-0">
                                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                                    <Info className={`w-4 h-4 ${cStyles[1]}`} />
                                    <span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em] font-mono">Core Driver</span>
                                </div>
                                <div className={`text-[10px] sm:text-xs font-tech ${cStyles[1]} uppercase tracking-[0.12em]`}>Identity Module</div>
                            </div>
                            <div className="md:col-span-8">
                                <p className="text-gray-300 font-reading text-base sm:text-lg leading-relaxed opacity-90">{synergyDesc}</p>
                            </div>
                        </section>

                        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                        {/* Functional Module section */}
                        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
                            <div className="md:col-span-5 min-w-0">
                                <div className="flex items-center gap-2 mb-3 sm:mb-4">
                                    <Brain className={`w-4 h-4 ${cStyles[1]}`} />
                                    <span className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] font-mono">Functional Module</span>
                                </div>
                                <div className="flex items-center gap-3 sm:gap-4">
                                    <div className="text-3xl sm:text-4xl shrink-0 p-2 sm:p-3 bg-white/5 rounded-xl border border-white/5">
                                        {profile?.finalSkillIcon || '⚡'}
                                    </div>
                                    <h2 className="text-lg sm:text-xl md:text-2xl font-tech text-white uppercase tracking-[0.12em] leading-tight break-words">
                                        {finalSkill}
                                    </h2>
                                </div>
                            </div>
                            <div className="md:col-span-7 w-full">
                                <div className="bg-white/5 p-5 sm:p-6 rounded-2xl border border-white/5 relative overflow-hidden group/desc h-full flex items-center">
                                    <div className={`absolute top-0 left-0 w-1 sm:w-1.5 h-full ${cStyles[3]} opacity-40`}></div>
                                    <p className="text-gray-400 font-reading text-xs sm:text-sm italic opacity-90 leading-relaxed pl-3 sm:pl-4 break-words">
                                        "{profile?.finalSkillDesc || 'Metabolic optimization complete. System operating at peak synaptic efficiency.'}"
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className={`p-6 sm:p-8 rounded-2xl ${cStyles[2]} border ${cStyles[0]} flex gap-4 sm:gap-6 items-start shadow-inner`}>
                             <Zap className={`w-6 h-6 sm:w-8 sm:h-8 ${cStyles[1]} shrink-0 mt-1 animate-pulse`} />
                             <div>
                                <h4 className="text-white font-tech text-xs sm:text-sm uppercase tracking-[0.2em] mb-2 sm:mb-3">Neural Balance: OPTIMIZED</h4>
                                <p className="text-[10px] text-gray-400 leading-relaxed font-mono uppercase tracking-tighter">Your metabolic signature has been imprinted on the global grid. Ready for physical differentiation within the Bio-Forge matrix.</p>
                             </div>
                        </div>

                        <div className="pt-4 sm:pt-6">
                            <button 
                                onClick={() => { playDataOpen(); onAccept(); }} 
                                className={`w-full py-6 sm:py-8 ${cStyles[3]} text-white font-tech text-xl sm:text-2xl uppercase tracking-[0.3em] sm:tracking-[0.4em] rounded-2xl hover:brightness-125 transition-all shadow-[0_20px_50px_rgba(0,200,255,0.1)] flex items-center justify-center gap-4 sm:gap-6 group`}
                            >
                                <Zap className="w-6 h-6 sm:w-8 sm:h-8 fill-current group-hover:scale-125 transition-transform duration-300" />
                                COMMENCE BIO-FORGE
                            </button>
                            <p className="text-center text-[8px] sm:text-[9px] text-gray-600 font-mono uppercase tracking-[0.4em] mt-6 sm:mt-8">System Interface v1.0.8 // All Nodes Synced</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
