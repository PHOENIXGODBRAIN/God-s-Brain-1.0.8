
import React, { useEffect, useState } from 'react';
import { Fingerprint, Lock, ShieldCheck } from 'lucide-react';
import { playDataOpen } from '../utils/sfx';

interface TransitionScreenProps {
    onComplete: () => void;
    title?: string;
    steps?: string[];
}

export const TransitionScreen: React.FC<TransitionScreenProps> = ({ 
    onComplete, 
    title = "IDENTITY VERIFICATION", 
    steps = [
        "Establishing secure neural uplink...",
        "INITIALIZING SECURE GATEWAY...",
        "Protocol: TLS 1.3 / AES-256 / 4096-bit RSA",
        "Handshake Complete."
    ]
}) => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        // Play sound on mount
        playDataOpen();

        const totalDuration = 2500; // 2.5 seconds total transition
        const stepDuration = totalDuration / steps.length;

        const interval = setInterval(() => {
            setCurrentStep(prev => {
                if (prev < steps.length - 1) {
                    playDataOpen(); // Chirp on step change
                    return prev + 1;
                }
                return prev;
            });
        }, stepDuration);

        const timeout = setTimeout(() => {
            onComplete();
        }, totalDuration);

        return () => {
            clearInterval(interval);
            clearTimeout(timeout);
        };
    }, []);

    return (
        <div className="fixed inset-0 z-[100] bg-black flex items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-black border border-[#00FFFF]/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,255,255,0.15)] animate-scaleIn">
                
                {/* Top Glow Bar */}
                <div className="h-1 w-full bg-gradient-to-r from-transparent via-[#00FFFF] to-transparent shadow-[0_0_20px_#00FFFF]"></div>

                <div className="p-12 text-center relative z-10 flex flex-col items-center min-h-[500px] justify-center">
                    
                    {/* Fingerprint Scanner Animation */}
                    <div className="relative mb-10">
                        <div className="w-24 h-24 rounded-full border border-[#00FFFF]/30 flex items-center justify-center relative">
                            <div className="absolute inset-0 rounded-full border border-[#00FFFF]/50 animate-ping opacity-20"></div>
                            <div className="absolute inset-0 rounded-full border-t-2 border-[#00FFFF] animate-spin"></div>
                            <Fingerprint className="w-12 h-12 text-[#00FFFF] animate-pulse" />
                        </div>
                        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#00FFFF]/20 blur-md"></div>
                    </div>

                    {/* Text Content */}
                    <h2 className="font-tech text-2xl text-white uppercase tracking-widest mb-2">
                        {title}
                    </h2>
                    
                    <div className="space-y-4 w-full mt-6">
                        <p className="text-gray-400 text-xs font-mono animate-pulse">
                            {steps[currentStep]}
                        </p>
                        
                        {/* Progress Bar Container */}
                        <div className="w-full bg-[#111] h-1 rounded-full overflow-hidden relative">
                            <div 
                                className="absolute top-0 left-0 h-full bg-[#00FFFF] shadow-[0_0_10px_#00FFFF] transition-all duration-300 ease-out"
                                style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                            ></div>
                        </div>

                        {/* Loading Grid */}
                        <div className="grid grid-cols-4 gap-2 mt-4 opacity-50">
                             {[0,1,2,3].map(i => (
                                <div 
                                    key={i} 
                                    className={`h-1 rounded-full transition-colors duration-300 ${i <= currentStep ? 'bg-[#00FFFF]' : 'bg-gray-800'}`}
                                ></div>
                             ))}
                        </div>
                    </div>

                    {/* Footer Lock */}
                    <div className="mt-16 flex items-center gap-2 text-[10px] text-gray-500 font-mono">
                        <Lock className="w-3 h-3" />
                        <span>Secure SSL Connection Established</span>
                    </div>
                </div>

                {/* Scanline Background */}
                <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-0 bg-[length:100%_2px,3px_100%] opacity-20"></div>
            </div>
        </div>
    );
};
