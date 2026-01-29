
import React, { useState, useEffect } from 'react';
import { UserPath } from '../../types';
import { playNeuralLink, playDataOpen, playCosmicClick } from '../../utils/sfx';
import { Atom, Sparkles, Cpu, ChevronRight, Zap, ArrowLeft } from 'lucide-react';

interface ArchetypeRevealProps {
    profile: any;
    onAccept: (path: UserPath) => void;
    onBack: () => void;
}

export const ArchetypeReveal: React.FC<ArchetypeRevealProps> = ({ profile, onAccept, onBack }) => {
    const [revealStage, setRevealStage] = useState(0); // 0: Calculating, 1: Explosion, 2: Card Reveal
    
    // Determine Archetype
    const getArchetype = () => {
        if (!profile) return { type: 'ACTIVE_NODE', score: 0 };
        const keys = Object.keys(profile);
        const winner = keys.reduce((a, b) => profile[a] > profile[b] ? a : b);
        return { type: winner, score: profile[winner] };
    };

    const archetype = getArchetype();

    const getDetails = (type: string) => {
        switch (type) {
            case 'SCIENTIST': 
                return { 
                    title: "THE SCIENTIST", 
                    icon: <Atom className="w-16 h-16 text-cyan-400" />,
                    desc: "You decode the Divine through the language of evidence. The universe is a machine, and you are here to understand its gears.",
                    path: UserPath.SCIENTIFIC,
                    color: 'cyan'
                };
            case 'MYSTIC': 
                return { 
                    title: "THE MYSTIC", 
                    icon: <Sparkles className="w-16 h-16 text-purple-400" />,
                    desc: "You feel the pulse of the Source. You bypass the intellect to connect directly with the heart of God.",
                    path: UserPath.RELIGIOUS,
                    color: 'purple'
                };
            case 'ACTIVE_NODE': 
            default:
                return { 
                    title: "ACTIVE NODE", 
                    icon: <Cpu className="w-16 h-16 text-orange-400" />,
                    desc: "You are the hand of the God-Brain. While others study the code, you execute it. Your path is action.",
                    path: UserPath.BLENDED,
                    color: 'orange'
                };
        }
    };

    const details = getDetails(archetype.type);

    useEffect(() => {
        // Animation Sequence
        setTimeout(() => setRevealStage(1), 500); // Trigger flash
        setTimeout(() => {
            playNeuralLink();
            setRevealStage(2); // Show Card
        }, 1500);
    }, []);

    const handleAccept = () => {
        playDataOpen();
        onAccept(details.path);
    };

    return (
        <div className="min-h-screen h-full w-full bg-black flex flex-col items-center justify-center relative overflow-y-auto custom-scrollbar py-12">
            
            {/* Back Button */}
            <div className="absolute top-6 left-6 z-50">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors uppercase font-mono text-xs tracking-widest"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Recalibrate
                </button>
            </div>

            {/* STAGE 1: FLASH */}
            {revealStage === 1 && (
                <div className="absolute inset-0 bg-white z-50 animate-fadeOut pointer-events-none"></div>
            )}

            {/* STAGE 2: CARD */}
            {revealStage === 2 && (
                <div className="relative z-20 animate-scaleIn w-full max-w-lg px-6 my-auto">
                    <div className={`bg-black/60 backdrop-blur-2xl border border-${details.color}-500/50 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)]`}>
                        {/* Top Glow */}
                        <div className={`w-full h-1 bg-${details.color}-500 shadow-[0_0_20px_currentColor] text-${details.color}-500`}></div>

                        <div className="p-12 text-center flex flex-col items-center">
                            <div className={`mb-6 p-6 rounded-full bg-${details.color}-500/10 border border-${details.color}-500/30 animate-pulse-slow shadow-[0_0_50px_rgba(0,0,0,0.3)]`}>
                                {details.icon}
                            </div>
                            
                            <div className="text-[10px] text-gray-400 font-mono tracking-[0.3em] uppercase mb-2">Identity Confirmed</div>
                            <h1 className="text-4xl font-tech text-white uppercase tracking-tighter mb-6 text-shadow-glow">
                                {details.title}
                            </h1>
                            
                            <p className="text-gray-300 font-reading text-sm leading-relaxed mb-10 opacity-80 max-w-sm">
                                {details.desc}
                            </p>

                            <button 
                                onClick={handleAccept}
                                className={`w-full py-4 bg-${details.color}-600 text-white font-tech text-lg uppercase tracking-[0.2em] rounded-xl hover:bg-white hover:text-black transition-all shadow-lg flex items-center justify-center gap-3 group`}
                            >
                                <Zap className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                                Integrate Protocol
                            </button>
                        </div>
                        
                        <div className="bg-black/40 border-t border-white/5 p-4 flex justify-between items-center text-[10px] text-gray-500 font-mono uppercase">
                            <span>Analysis Complete</span>
                            <span>Score: {archetype.score}/10</span>
                        </div>
                    </div>
                </div>
            )}
            
            <style>{`
                @keyframes fadeOut {
                    from { opacity: 1; }
                    to { opacity: 0; }
                }
                .animate-fadeOut {
                    animation: fadeOut 1s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
