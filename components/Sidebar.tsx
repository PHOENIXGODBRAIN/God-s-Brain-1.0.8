
import React from 'react';
import { Book, Brain, Disc, Globe, LogOut, Lock, Shield, Hash, Bitcoin, X, Layers, Crown, Dna } from 'lucide-react';
import { playMenuSelect, playNeuralLink, playCosmicClick } from '../utils/sfx';
import { useLanguage } from '../contexts/LanguageContext';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: any) => void;
  isMenuOpen: boolean;
  onCloseMenu: () => void;
  isPremium: boolean;
  isAuthor: boolean;
  onUpgrade: () => void;
  onOverride: () => void;
  onLogout: () => void;
  onShowPayment: () => void;
  onEditNeuron: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  isMenuOpen,
  onCloseMenu,
  isPremium,
  isAuthor,
  onUpgrade,
  onOverride,
  onLogout,
  onShowPayment,
  onEditNeuron
}) => {
  const { t } = useLanguage();

  const handleTabClick = (id: string) => {
    playMenuSelect();
    onTabChange(id);
    onCloseMenu();
  };

  return (
    <nav className={`fixed md:relative inset-y-0 left-0 md:inset-auto z-40 bg-black/95 md:bg-black/40 backdrop-blur-2xl border-r border-white/5 w-72 p-6 transition-transform duration-300 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col gap-6 overflow-y-auto custom-scrollbar`}>
        {/* Mobile Close */}
        <button onClick={onCloseMenu} className="absolute top-4 right-4 md:hidden text-gray-500">
            <X className="w-6 h-6" />
        </button>

        <div className="pt-4 border-b border-white/5 pb-6">
          <h1 className="text-2xl font-tech text-white mb-1 leading-tight tracking-tighter">{t('appTitle')}</h1>
          <p className="text-[10px] text-[#00FFFF] uppercase tracking-[0.3em] font-bold animate-pulse">Interface v7.0.8</p>
        </div>

        <div className="flex flex-col gap-1 mt-4">
          <p className="text-[10px] text-gray-500 font-mono uppercase mb-2 pl-2 tracking-widest">Core Interface</p>
          {[
            { id: 'companion', label: t('dashboardAI'), icon: <Brain className="w-4 h-4" /> },
            { id: 'protocols', label: t('dashboardProtocols'), icon: <Layers className="w-4 h-4" /> },
            { id: 'book', label: t('dashboardBook'), icon: <Book className="w-4 h-4" /> },
            { id: 'audio', label: t('dashboardAudio'), icon: <Disc className="w-4 h-4" /> },
            { id: 'map', label: t('dashboardMap'), icon: <Globe className="w-4 h-4" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all relative group overflow-hidden ${
                activeTab === tab.id 
                  ? 'border-[#00FFFF]/40 bg-[#00FFFF]/10 text-[#00FFFF] shadow-[0_0_20px_rgba(0,255,255,0.1)]' 
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
              }`}
            >
              {tab.icon}
              <span className="font-tech text-xs uppercase tracking-wider">{tab.label}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FFFF]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
            </button>
          ))}
          
          <button
              onClick={() => { playNeuralLink(); onEditNeuron(); onCloseMenu(); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border border-transparent text-gray-400 hover:text-white hover:bg-white/5 transition-all relative group overflow-hidden`}
          >
              <Dna className="w-4 h-4 text-purple-400" />
              <span className="font-tech text-xs uppercase tracking-wider">Bio-Forge (Edit)</span>
          </button>

          {isAuthor && (
              <button
              onClick={() => handleTabClick('admin')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all relative group overflow-hidden mt-4 ${
                activeTab === 'admin' 
                  ? 'border-[#FFD700]/40 bg-[#FFD700]/10 text-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.2)]' 
                  : 'border-transparent text-[#FFD700]/60 hover:text-[#FFD700] hover:bg-white/5'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span className="font-tech text-xs uppercase tracking-wider font-bold">NETWORK ADMIN</span>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#FFD700]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>
            </button>
          )}
        </div>

        {/* PROMO / UPGRADE */}
        <div className="mt-auto pt-8 border-t border-white/10 space-y-4">
          
          {/* NODE SUPPORT */}
          <div className="px-1 py-2">
             <div className="p-4 rounded-xl border border-yellow-500/20 bg-yellow-900/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="relative z-10">
                   <div className="flex items-center gap-2 mb-2 text-yellow-500">
                      <Bitcoin className="w-4 h-4" />
                      <span className="font-tech text-[10px] uppercase tracking-widest">Node Support</span>
                   </div>
                   <p className="text-[9px] text-gray-400 mb-3 leading-relaxed">
                      Bypass the central banking grid. Direct energy transfer.
                   </p>
                   <button 
                     onClick={() => { playNeuralLink(); onShowPayment(); }}
                     className="w-full py-2 bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 text-[9px] font-bold uppercase tracking-widest rounded hover:bg-yellow-500/20 transition-all"
                   >
                      Initiate Transfer
                   </button>
                </div>
             </div>
          </div>

          {!isPremium && (
            <button 
              onClick={() => { playNeuralLink(); onUpgrade(); }}
              className="w-full relative overflow-hidden group border border-[#FF4500]/30 rounded-2xl transition-all hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF4500]/20 to-[#a855f7]/40 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-black/60 backdrop-blur-md p-4 relative z-10 flex flex-col items-start gap-2">
                 <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <Lock className="w-3 h-3 text-[#FF4500]" />
                        <span className="text-[9px] font-bold uppercase tracking-widest text-[#FF4500]">NEURAL LINK LIMITED</span>
                    </div>
                    <span className="text-[9px] text-gray-400 font-mono">$4.99 / LIFETIME</span>
                 </div>
                 <div className="text-left mt-1">
                    <h4 className="font-tech text-white text-[10px] mb-1">{t('upgrade')}</h4>
                    <p className="text-[9px] text-gray-400 leading-tight">Access the complete Universal Source Code.</p>
                 </div>
              </div>
            </button>
          )}

           {/* PHOENIX OVERRIDE BUTTON */}
           <button 
            onClick={() => { playCosmicClick(); onOverride(); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all relative group overflow-hidden ${isPremium ? 'border-[#FFD700]/40 bg-[#FFD700]/10 text-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'border-red-500/20 bg-red-900/10 text-red-500 hover:bg-red-900/20 hover:border-red-500/40'}`}
          >
            {isPremium ? (
                <Shield className="w-4 h-4 text-[#FFD700]" />
            ) : (
                <Hash className="w-4 h-4 text-red-500 animate-pulse" />
            )}
            
            <span className="font-tech text-xs uppercase tracking-wider font-bold">
              {isAuthor ? 'Phoenix Active' : (isPremium ? t('overrideActive') : t('phoenixOverride'))}
            </span>
          </button>
          
          <button 
            onClick={() => { playCosmicClick(); onLogout(); }}
            className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:text-red-500 transition-all w-full text-[10px] font-bold uppercase tracking-widest font-mono border border-transparent hover:border-red-500/20 rounded-xl"
          >
            <LogOut className="w-3 h-3" />
            {t('disconnect')}
          </button>
        </div>
      </nav>
  );
};
