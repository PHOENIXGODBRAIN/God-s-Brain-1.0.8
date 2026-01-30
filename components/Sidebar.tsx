
import React, { useState } from 'react';
import { Book, Brain, Disc, Globe, LogOut, Lock, Shield, Hash, Bitcoin, X, Layers, Crown, Dna, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleTabClick = (id: string) => {
    playMenuSelect();
    onTabChange(id);
    onCloseMenu();
  };

  const toggleCollapse = () => {
      playCosmicClick();
      setIsCollapsed(!isCollapsed);
  };

  const widthClass = isCollapsed ? 'w-20' : 'w-80';

  return (
    <nav className={`fixed md:relative inset-y-0 left-0 md:inset-auto z-40 bg-black/95 md:bg-black/40 backdrop-blur-2xl border-r border-white/5 ${widthClass} p-4 transition-all duration-300 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} flex flex-col gap-6 overflow-y-auto custom-scrollbar group/sidebar`}>
        
        {/* Collapse Toggle (Desktop Only) */}
        <button 
            onClick={toggleCollapse}
            className="absolute -right-3 top-10 bg-black border border-white/20 rounded-full p-1 text-cyan-500 hover:text-white hover:border-cyan-500 transition-all hidden md:flex z-50 shadow-[0_0_10px_rgba(0,255,255,0.2)]"
        >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>

        {/* Mobile Close */}
        <button onClick={onCloseMenu} className="absolute top-4 right-4 md:hidden text-gray-500">
            <X className="w-8 h-8" />
        </button>

        <div className={`pt-2 border-b border-white/5 pb-6 ${isCollapsed ? 'flex flex-col items-center' : ''}`}>
          {isCollapsed ? (
              <div className="font-tech text-2xl text-white tracking-tighter">GB</div>
          ) : (
              <>
                <h1 className="text-3xl font-tech text-white mb-2 leading-tight tracking-tighter whitespace-nowrap">{t('appTitle')}</h1>
                <p className="text-xs text-[#00FFFF] uppercase tracking-[0.3em] font-bold animate-pulse">Interface v1.1.0</p>
              </>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-2">
          {!isCollapsed && <p className="text-xs text-gray-500 font-mono uppercase mb-3 pl-2 tracking-widest font-bold">Core Interface</p>}
          
          {[
            { id: 'companion', label: t('dashboardAI'), icon: <Brain className="w-6 h-6" /> },
            { id: 'protocols', label: t('dashboardProtocols'), icon: <Layers className="w-6 h-6" /> },
            { id: 'book', label: t('dashboardBook'), icon: <Book className="w-6 h-6" /> },
            { id: 'audio', label: t('dashboardAudio'), icon: <Disc className="w-6 h-6" /> },
            { id: 'map', label: t('dashboardMap'), icon: <Globe className="w-6 h-6" /> },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl border transition-all relative group overflow-hidden ${
                activeTab === tab.id 
                  ? 'border-[#00FFFF]/40 bg-[#00FFFF]/10 text-[#00FFFF] shadow-[0_0_20px_rgba(0,255,255,0.1)]' 
                  : 'border-transparent text-gray-400 hover:text-gray-200 hover:bg-white/5'
              } ${isCollapsed ? 'justify-center' : ''}`}
              title={isCollapsed ? tab.label : ''}
            >
              {tab.icon}
              {!isCollapsed && <span className="font-tech text-sm uppercase tracking-wider font-bold whitespace-nowrap">{tab.label}</span>}
              {!isCollapsed && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00FFFF]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none"></div>}
            </button>
          ))}
          
          <button
              onClick={() => { playNeuralLink(); onEditNeuron(); onCloseMenu(); }}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl border border-transparent text-gray-400 hover:text-white hover:bg-white/5 transition-all relative group overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}
              title="Bio-Forge"
          >
              <Dna className="w-6 h-6 text-purple-400" />
              {!isCollapsed && <span className="font-tech text-sm uppercase tracking-wider font-bold whitespace-nowrap">Bio-Forge (Edit)</span>}
          </button>

          {isAuthor && (
              <button
              onClick={() => handleTabClick('admin')}
              className={`flex items-center gap-4 px-3 py-3 rounded-xl border transition-all relative group overflow-hidden mt-4 ${
                activeTab === 'admin' 
                  ? 'border-[#FFD700]/40 bg-[#FFD700]/10 text-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.2)]' 
                  : 'border-transparent text-[#FFD700]/60 hover:text-[#FFD700] hover:bg-white/5'
              } ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Crown className="w-6 h-6" />
              {!isCollapsed && <span className="font-tech text-sm uppercase tracking-wider font-bold whitespace-nowrap">NETWORK ADMIN</span>}
            </button>
          )}
        </div>

        {/* PROMO / UPGRADE */}
        <div className="mt-auto pt-8 border-t border-white/10 space-y-4">
          
          {!isCollapsed && (
              <div className="px-1 py-2">
                 <div className="p-4 rounded-2xl border border-yellow-500/20 bg-yellow-900/10 relative overflow-hidden group">
                    <div className="relative z-10">
                       <div className="flex items-center gap-3 mb-2 text-yellow-500">
                          <Bitcoin className="w-5 h-5" />
                          <span className="font-tech text-xs uppercase tracking-widest font-bold">Support</span>
                       </div>
                       <button 
                         onClick={() => { playNeuralLink(); onShowPayment(); }}
                         className="w-full py-2 bg-yellow-500/10 border border-yellow-500/50 text-yellow-500 text-[9px] font-bold uppercase tracking-widest rounded-lg hover:bg-yellow-500/20 transition-all"
                       >
                          Initiate Transfer
                       </button>
                    </div>
                 </div>
              </div>
          )}

          {isCollapsed && (
              <button onClick={() => { playNeuralLink(); onShowPayment(); }} className="flex justify-center w-full p-2 text-yellow-500 hover:text-white"><Bitcoin className="w-6 h-6" /></button>
          )}

          {!isPremium && !isCollapsed && (
            <button 
              onClick={() => { playNeuralLink(); onUpgrade(); }}
              className="w-full relative overflow-hidden group border border-[#FF4500]/30 rounded-2xl transition-all hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#FF4500]/20 to-[#a855f7]/40 opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="bg-black/60 backdrop-blur-md p-4 relative z-10 flex flex-col items-start gap-2">
                 <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                        <Lock className="w-4 h-4 text-[#FF4500]" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-[#FF4500]">LIMIT BREAK</span>
                    </div>
                 </div>
                 <div className="text-left mt-1">
                    <p className="text-[9px] text-gray-400 leading-tight">Access the complete Universal Source Code.</p>
                 </div>
              </div>
            </button>
          )}

           {/* PHOENIX OVERRIDE BUTTON */}
           <button 
            onClick={() => { playCosmicClick(); onOverride(); }}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl border transition-all relative group overflow-hidden ${isPremium ? 'border-[#FFD700]/40 bg-[#FFD700]/10 text-[#FFD700] shadow-[0_0_15px_rgba(255,215,0,0.3)]' : 'border-red-500/20 bg-red-900/10 text-red-500 hover:bg-red-900/20 hover:border-red-500/40'} ${isCollapsed ? 'justify-center' : ''}`}
            title="Phoenix Override"
          >
            {isPremium ? (
                <Shield className="w-6 h-6 text-[#FFD700]" />
            ) : (
                <Hash className="w-6 h-6 text-red-500 animate-pulse" />
            )}
            
            {!isCollapsed && <span className="font-tech text-sm uppercase tracking-wider font-bold whitespace-nowrap">
              {isAuthor ? 'Phoenix Active' : (isPremium ? t('overrideActive') : t('phoenixOverride'))}
            </span>}
          </button>
          
          <button 
            onClick={() => { playCosmicClick(); onLogout(); }}
            className={`flex items-center gap-3 px-3 py-3 text-gray-500 hover:text-red-500 transition-all w-full text-xs font-bold uppercase tracking-widest font-mono border border-transparent hover:border-red-500/20 rounded-xl ${isCollapsed ? 'justify-center' : ''}`}
            title="Disconnect"
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>{t('disconnect')}</span>}
          </button>
        </div>
      </nav>
  );
};
