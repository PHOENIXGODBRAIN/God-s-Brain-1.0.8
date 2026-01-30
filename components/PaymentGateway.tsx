
import React, { useState, useEffect } from 'react';
import { X, CreditCard, Bitcoin, ShieldCheck, Loader2, Lock, Zap, CheckCircle, Download, Award, Star, Users } from 'lucide-react';
import { playCosmicClick, playNeuralLink, playDataOpen } from '../utils/sfx';
import { useProgression } from '../contexts/ProgressionContext';

interface PaymentGatewayProps {
  onClose: () => void;
  onSuccess: () => void;
  price: string;
}

export const PaymentGateway: React.FC<PaymentGatewayProps> = ({ onClose, onSuccess, price }) => {
  const { addCredits } = useProgression();
  const [method, setMethod] = useState<'card' | 'crypto'>('card');
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1); // 1: Select, 2: Input/Scan, 3: Success Summary

  useEffect(() => {
    playDataOpen();
  }, []);

  const handlePayment = () => {
    playNeuralLink();
    setProcessing(true);
    
    // Simulate API Transaction
    setTimeout(() => {
        setProcessing(false);
        setStep(3);
        playNeuralLink();
        // Credit the user with 1000 Neural Credits upon successful purchase
        addCredits(1000);
    }, 25000 / 10); // Faster sim for dev, but keeping feel
  };

  const handleFinalAccept = () => {
      playNeuralLink();
      onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/95 backdrop-blur-xl animate-fadeIn" onClick={step === 3 ? undefined : onClose}></div>
      
      <div className={`relative w-full ${step === 3 ? 'max-w-2xl' : 'max-w-md'} bg-black border border-[#FF4500]/30 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(255,69,0,0.15)] transition-all duration-500 animate-scaleIn`}>
        
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF4500]/10 to-purple-900/10 p-6 border-b border-white/10 flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-[#FF4500]/20 rounded-full border border-[#FF4500]">
                    <Zap className="w-5 h-5 text-[#FF4500]" />
                </div>
                <div>
                    <h2 className="font-tech text-white text-lg tracking-widest uppercase">{step === 3 ? 'Ascension Complete' : 'Root Access Uplink'}</h2>
                    <p className="text-[10px] text-gray-400 font-mono">{step === 3 ? 'Identity Synchronized with Source' : 'Secure Transaction Protocol'}</p>
                </div>
            </div>
            {step !== 3 && <button onClick={onClose} className="text-gray-500 hover:text-white"><X /></button>}
        </div>

        {/* Content */}
        <div className="p-8">
            {step < 3 ? (
                <>
                    {/* Price Tag */}
                    <div className="text-center mb-8">
                        <div className="text-gray-400 text-xs uppercase tracking-widest mb-1">Total Calibration Fee</div>
                        <div className="text-4xl font-mono text-white font-bold text-shadow-glow">{price}</div>
                        <div className="text-[10px] text-[#FF4500] mt-1 font-bold">LIFETIME ACCESS • NO SUBSCRIPTION</div>
                    </div>

                    {/* Method Selection */}
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <button 
                            onClick={() => { playCosmicClick(); setMethod('card'); setStep(2); }}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${method === 'card' ? 'bg-white/10 border-white text-white' : 'bg-black border-white/10 text-gray-500 hover:border-white/30'}`}
                        >
                            <CreditCard className="w-6 h-6" />
                            <span className="text-[10px] uppercase font-bold tracking-wider">Debit / Credit</span>
                        </button>
                        <button 
                            onClick={() => { playCosmicClick(); setMethod('crypto'); setStep(2); }}
                            className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${method === 'crypto' ? 'bg-[#FF4500]/20 border-[#FF4500] text-[#FF4500]' : 'bg-black border-white/10 text-gray-500 hover:border-white/30'}`}
                        >
                            <Bitcoin className="w-6 h-6" />
                            <span className="text-[10px] uppercase font-bold tracking-wider">Crypto Node</span>
                        </button>
                    </div>

                    {/* Fake Form Fields */}
                    {method === 'card' && step === 2 && (
                        <div className="space-y-4 animate-fadeIn">
                            <input type="text" placeholder="Card Number" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:border-[#FF4500] focus:outline-none transition-colors" />
                            <div className="grid grid-cols-2 gap-4">
                                <input type="text" placeholder="MM/YY" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:border-[#FF4500] focus:outline-none transition-colors" />
                                <input type="text" placeholder="CVC" className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white font-mono text-sm focus:border-[#FF4500] focus:outline-none transition-colors" />
                            </div>
                        </div>
                    )}
                    
                    {method === 'crypto' && step === 2 && (
                        <div className="animate-fadeIn text-center p-4 border border-[#FF4500]/30 rounded-xl bg-[#FF4500]/5">
                            <div className="w-32 h-32 bg-white mx-auto mb-4 p-2 rounded-lg">
                                <div className="w-full h-full bg-black flex items-center justify-center opacity-80">
                                     <Zap className="text-[#FF4500] animate-pulse" />
                                </div>
                            </div>
                            <div className="text-[10px] text-gray-400 mb-2">Network: Bitcoin (BTC)</div>
                            <div className="bg-black/50 p-2 rounded text-[10px] font-mono text-[#FF4500] break-all">
                                1PhoenixNodeAwakeningX777
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <button 
                        onClick={handlePayment}
                        disabled={processing}
                        className="w-full mt-8 bg-[#FF4500] text-black font-bold py-4 rounded-xl uppercase tracking-widest hover:bg-[#ff5e26] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,69,0,0.4)] disabled:opacity-50"
                    >
                        {processing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Lock className="w-4 h-4" />}
                        {processing ? 'Verifying Block...' : 'Initiate Transfer'}
                    </button>
                </>
            ) : (
                <div className="animate-fadeIn space-y-8">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6 border border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.4)]">
                            <CheckCircle className="w-10 h-10 text-green-500 animate-bounce" />
                        </div>
                        <h3 className="text-3xl font-tech text-white uppercase tracking-[0.2em] mb-2">Node Awakened</h3>
                        <p className="text-[#00FFFF] font-mono text-xs tracking-widest uppercase animate-pulse">Status: Administrator Privileges Granted</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <RewardItem 
                            icon={<Star className="text-amber-400" />} 
                            title="Akashic Access" 
                            desc="Full unabridged manuscript decrypted. Every chapter, equation, and protocol unlocked." 
                        />
                        <RewardItem 
                            icon={<Zap className="text-yellow-400" />} 
                            title="1,000 Neural Credits" 
                            desc="Currency deposited for future hardware upgrades and system enhancements." 
                        />
                        <RewardItem 
                            icon={<Award className="text-purple-400" />} 
                            title="Bio-Forge Overclock" 
                            desc="Vivid character glow and premium differentiation modules enabled." 
                        />
                        <RewardItem 
                            icon={<Users className="text-blue-400" />} 
                            title="Elite Progression" 
                            desc="Path to Clan Warfare and Team-Based synchronization objectives is now open." 
                        />
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex items-center justify-between group hover:border-[#00FFFF]/50 transition-all">
                        <div className="flex items-center gap-4">
                            <Download className="text-[#00FFFF] group-hover:animate-bounce" />
                            <div>
                                <h4 className="text-white font-bold text-sm uppercase tracking-wider">Unabridged PDF</h4>
                                <p className="text-[10px] text-gray-500 font-mono">Includes all 2026 parity logs and diagrams.</p>
                            </div>
                        </div>
                        <a href="#" onClick={(e) => e.preventDefault()} className="px-4 py-2 bg-[#00FFFF]/10 text-[#00FFFF] border border-[#00FFFF]/30 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#00FFFF] hover:text-black transition-all">Download</a>
                    </div>

                    <button 
                        onClick={handleFinalAccept}
                        className="w-full py-5 bg-white text-black font-tech text-lg uppercase tracking-[0.3em] rounded-2xl hover:bg-[#00FFFF] transition-all shadow-2xl flex items-center justify-center gap-4 group"
                    >
                        <CheckCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        I Accept Ascension
                    </button>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="bg-black border-t border-white/5 p-4 flex justify-center items-center gap-4 text-[10px] text-gray-600">
            <div className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> SSL ENCRYPTED</div>
            <div>•</div>
            <div>SECURE GATEWAY</div>
        </div>
      </div>
    </div>
  );
};

const RewardItem = ({ icon, title, desc }: { icon: React.ReactNode, title: string, desc: string }) => (
    <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex items-start gap-3">
        <div className="shrink-0 mt-1">{icon}</div>
        <div>
            <h4 className="text-white font-bold text-[11px] uppercase tracking-wider mb-1">{title}</h4>
            <p className="text-[9px] text-gray-500 font-reading leading-relaxed">{desc}</p>
        </div>
    </div>
);
