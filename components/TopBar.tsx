
import React, { useRef, useState } from 'react';
import { Activity, Globe, Edit2, Flame, Atom, Sparkles, Cpu, User, Menu, X, Zap, Anchor, Compass, Scroll, ChevronRight } from 'lucide-react';
import { UserProfile, UserPath, LanguageCode } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { useProgression } from '../contexts/ProgressionContext';
import { LANGUAGES } from '../translations';
import { playCosmicClick, playDataOpen } from '../utils/sfx';

interface TopBarProps {
  activeTab: string;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  user?: UserProfile;
  path: UserPath;
  isAuthor: boolean;
  onUpdateProfile?: (updates: Partial<UserProfile>) => void;
}

export const TopBar: React.FC<TopBarProps> = ({ 
  activeTab, isMenuOpen, onToggleMenu, user, path, isAuthor, onUpdateProfile 
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { level, xp, xpToNextLevel, balance } = useProgression();
  
  const xpPercent = Math.min(100, (xp / xpToNextLevel) * 100);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');

  const getIdentity = () => {
    if (isAuthor) return { label: 'The Phoenix', color: 'text-[#FFD700]', icon: <Flame className="w-4 h-4 text-[#FFD700]" /> };
    
    const archetype = user?.archetype || 'GUEST';
    switch (archetype) {
        case 'SCIENTIST':
            return { label: t('scientist'), color: 'text-[#00FFFF]', icon: <Atom className="w-4 h-4 text-[#00FFFF]" /> };
        case 'ARCHITECT':
            return { label: 'Architect', color: 'text-[#F43F5E]', icon: <Anchor className="w-4 h-4 text-[#F43F5E]" /> };
        case 'MYSTIC':
            return { label: 'Mystic', color: 'text-[#FFD700]', icon: <Sparkles className="w-4 h-4 text-[#FFD700]" /> };
        case 'SEEKER':
            return { label: t('seeker'), color: 'text-[#F97316]', icon: <Compass className="w-4 h-4 text-[#F97316]" /> };
        case 'ALCHEMIST':
            return { label: 'Alchemist', color: 'text-[#10B981]', icon: <Scroll className="w-4 h-4 text-[#10B981]" /> };
        case 'ACTIVE_NODE':
            return { label: t('activeNode'), color: 'text-[#a855f7]', icon: <Cpu className="w-4 h-4 text-[#a855f7]" /> };
        default:
            return { label: 'Guest Node', color: 'text-gray-400', icon: <User className="w-4 h-4" /> };
    }
  };

  const identity = getIdentity();

  const handleAvatarClick = () => {
      playCosmicClick();
      fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file && onUpdateProfile) {
          const reader = new FileReader();
          reader.onloadend = () => {
              playDataOpen();
              onUpdateProfile({ avatar: reader.result as string });
          };
          reader.readAsDataURL(file);
      }
  };

  const startNameEdit = () => {
      if (!user) return;
      playCosmicClick();
      setEditName(user.name);
      setIsEditingName(true);
  };

  const saveNameEdit = () => {
      if (onUpdateProfile && editName.trim()) {
          playDataOpen();
          onUpdateProfile({ name: editName });
      }
      setIsEditingName(false);
  };

  const getTitle = () => {
      if (activeTab === 'companion') return t('dashboardAI');
      if (activeTab === 'book') return "Brain Manuscript";
      if (activeTab === 'audio') return t('dashboardAudio');
      if (activeTab === 'map') return t('dashboardMap');
      if (activeTab === 'protocols') return t('dashboardProtocols');
      return 'DASHBOARD';
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-4 md:pb-6 mb-4 md:mb-8 bg-black/40 backdrop-blur-3xl p-4 md:p-6 rounded-2xl md:rounded-[2.5rem] sticky top-0 md:top-2 z-30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] gap-4 md:gap-6 mx-2">
        
        <div className="w-full flex justify-between items-center md:hidden">
            <h1 className="font-tech text-sm text-[#00FFFF] tracking-tighter uppercase">{t('appTitle')}</h1>
            <div className="flex items-center gap-4">
                <div className="text-[9px] font-mono text-[#00FFFF] font-bold">LVL {level}</div>
                <button onClick={onToggleMenu} className="text-[#00FFFF]">
                    {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>
        </div>

        {/* LEFT: NODE STATS (Hidden on mobile as it's in the menu/identity badge) */}
        <div className="hidden md:flex flex-col gap-1 min-w-[180px]">
            <h2 className="font-tech text-base text-white uppercase tracking-widest leading-none mb-1">{getTitle()}</h2>
            <div className="flex items-center gap-3 group/xp">
                <div className="text-[10px] font-mono text-[#00FFFF] font-bold">LVL {level}</div>
                <div className="h-1.5 w-24 bg-gray-900 rounded-full overflow-hidden border border-white/5 relative">
                    <div 
                        className="h-full shadow-[0_0_10px_var(--path-color)] transition-all duration-1000" 
                        style={{ width: `${xpPercent}%`, backgroundColor: 'var(--path-color)' }}
                    ></div>
                </div>
            </div>
        </div>

        {/* CENTER: HIGH-FIDELITY BALANCE METER */}
        <div className="flex-1 max-w-lg w-full px-2 md:px-8 flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-1 text-[9px] md:text-[11px] font-tech uppercase tracking-[0.15em] md:tracking-[0.2em]">
                <div className="flex items-center gap-1 md:gap-2 text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.5)]">
                    <span className="text-xs md:text-lg">🌪️</span> ENTROPY
                </div>
                <div className="hidden sm:block text-white/40 font-mono text-[8px] tracking-[0.3em]">NEURAL ALIGNMENT</div>
                <div className="flex items-center gap-1 md:gap-2 text-cyan-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
                    SYNTROPY <span className="text-xs md:text-lg">🕊️</span>
                </div>
            </div>
            
            <div className="relative w-full h-2.5 md:h-4 bg-black/60 border border-white/10 rounded-full overflow-hidden shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]">
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/40 via-transparent to-cyan-900/40 opacity-50"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/10 z-10 -translate-x-1/2"></div>
                {balance < 50 && (
                    <div 
                        className="absolute right-1/2 top-0 bottom-0 bg-gradient-to-l from-red-600/40 to-red-900/80 shadow-[0_0_20px_rgba(220,38,38,0.3)] transition-all duration-1000 ease-out"
                        style={{ width: `${50 - balance}%` }}
                    ></div>
                )}
                {balance > 50 && (
                    <div 
                        className="absolute left-1/2 top-0 bottom-0 bg-gradient-to-r from-cyan-600/40 to-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all duration-1000 ease-out"
                        style={{ width: `${balance - 50}%` }}
                    ></div>
                )}
                <div 
                    className="absolute top-0 bottom-0 w-2 md:w-3 bg-white shadow-[0_0_15px_white] z-20 transition-all duration-1000 ease-out border-x border-black/50"
                    style={{ left: `calc(${balance}% - ${window.innerWidth < 768 ? '4px' : '6px'})` }}
                ></div>
            </div>
            
            <div className="w-full flex justify-between mt-1 text-[7px] md:text-[9px] font-mono text-gray-500 uppercase tracking-tighter">
                <span>{50 - Math.min(50, balance)}% DECAY</span>
                <span className={`font-bold ${balance < 45 ? 'text-red-500' : balance > 55 ? 'text-cyan-400' : 'text-white/40'}`}>
                    {balance < 45 ? 'CHAOTIC' : balance > 55 ? 'LUMINOUS' : 'NEUTRAL'}
                </span>
                <span>{Math.max(0, balance - 50)}% GROWTH</span>
            </div>
        </div>
             
        {/* RIGHT: PROFILE CHIP (Hidden on mobile to save vertical space) */}
        <div className="hidden md:flex items-center gap-4 bg-white/5 p-2 pr-6 rounded-full border border-white/10 relative hover:border-white/20 transition-all">
            <div className="relative group">
                <div className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                    <Globe className="w-4 h-4" />
                </div>
                <select 
                    value={language}
                    onChange={(e) => { playCosmicClick(); setLanguage(e.target.value as LanguageCode); }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                >
                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
            </div>

            <div className="h-8 w-[1px] bg-white/10"></div>

            <div className="relative cursor-pointer group/avatar" onClick={handleAvatarClick}>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                {user?.avatar ? (
                    <img src={user.avatar} alt="User" className="w-10 h-10 rounded-full border-2 border-white/20 object-cover shadow-[0_0_15px_var(--path-glow)] group-hover/avatar:scale-105 transition-transform" />
                ) : (
                    <div className={`w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center bg-black/60 ${identity.color} shadow-[0_0_15px_var(--path-glow)]`}>
                        {identity.icon}
                    </div>
                )}
            </div>

            <div className="flex flex-col items-start min-w-[100px]">
                {isEditingName ? (
                    <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-black border border-white/20 text-[11px] text-white px-2 py-1 rounded w-28 focus:border-[#00FFFF] outline-none font-tech uppercase"
                        autoFocus
                        onBlur={saveNameEdit}
                        onKeyDown={(e) => e.key === 'Enter' && saveNameEdit()}
                    />
                ) : (
                    <div className={`text-[11px] font-bold font-tech uppercase flex items-center gap-2 ${identity.color} cursor-pointer hover:brightness-125 transition-all`} onClick={startNameEdit}>
                        {user?.name || 'Unknown Node'}
                        <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                )}
                <div className="text-[9px] font-mono text-gray-500 tracking-wider">
                    {user?.email || 'OFFLINE'}
                </div>
            </div>
        </div>
    </div>
  );
};
