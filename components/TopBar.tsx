
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
    if (isAuthor) return { label: 'The Phoenix', color: 'text-[#FFD700]', icon: <Flame className="w-5 h-5 text-[#FFD700]" /> };
    
    const archetype = user?.archetype || 'GUEST';
    switch (archetype) {
        case 'SCIENTIST':
            return { label: t('scientist'), color: 'text-[#00FFFF]', icon: <Atom className="w-5 h-5 text-[#00FFFF]" /> };
        case 'ARCHITECT':
            return { label: 'Architect', color: 'text-[#F43F5E]', icon: <Anchor className="w-5 h-5 text-[#F43F5E]" /> };
        case 'MYSTIC':
            return { label: 'Mystic', color: 'text-[#FFD700]', icon: <Sparkles className="w-5 h-5 text-[#FFD700]" /> };
        case 'SEEKER':
            return { label: t('seeker'), color: 'text-[#F97316]', icon: <Compass className="w-5 h-5 text-[#F97316]" /> };
        case 'ALCHEMIST':
            return { label: 'Alchemist', color: 'text-[#10B981]', icon: <Scroll className="w-5 h-5 text-[#10B981]" /> };
        case 'ACTIVE_NODE':
            return { label: t('activeNode'), color: 'text-[#a855f7]', icon: <Cpu className="w-5 h-5 text-[#a855f7]" /> };
        default:
            return { label: 'Guest Node', color: 'text-gray-400', icon: <User className="w-5 h-5" /> };
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
      if (activeTab === 'book') return "The Manuscript";
      if (activeTab === 'audio') return t('dashboardAudio');
      if (activeTab === 'map') return t('dashboardMap');
      if (activeTab === 'protocols') return t('dashboardProtocols');
      if (activeTab === 'admin') return "Network Admin";
      return 'DASHBOARD';
  };

  // Calculate Coherence based on balance (0-100)
  // 0-40: Entropy, 40-60: Neutral, 60-100: Syntropy
  const coherenceLevel = balance;
  const coherenceColor = coherenceLevel < 40 ? 'text-red-500' : coherenceLevel > 60 ? 'text-cyan-400' : 'text-white';
  const coherenceLabel = coherenceLevel < 40 ? 'ENTROPY DETECTED' : coherenceLevel > 60 ? 'SYNTROPY ACTIVE' : 'STABLE STATE';

  return (
    <div className="flex flex-col md:flex-row justify-between items-center border-b border-white/10 pb-6 mb-6 bg-black/60 backdrop-blur-xl p-6 rounded-3xl sticky top-2 z-30 shadow-2xl gap-6 mx-2 border-t border-white/5">
        
        {/* MOBILE HEADER */}
        <div className="w-full flex justify-between items-center md:hidden">
            <div>
                <h1 className="font-tech text-lg text-[#00FFFF] tracking-wider uppercase">{t('appTitle')}</h1>
                <div className="text-xs font-mono text-gray-400">{getTitle()}</div>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <div className="text-xs font-mono text-[#00FFFF] font-bold">LVL {level}</div>
                    <div className="text-[10px] text-gray-500">{identity.label}</div>
                </div>
                <button onClick={onToggleMenu} className="text-[#00FFFF] p-2 border border-[#00FFFF]/30 rounded-lg bg-[#00FFFF]/10">
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>
        </div>

        {/* DESKTOP LEFT: CONTEXT */}
        <div className="hidden md:flex flex-col gap-2 min-w-[200px]">
            <h2 className="font-tech text-xl text-white uppercase tracking-widest leading-none drop-shadow-md">{getTitle()}</h2>
            <div className="flex items-center gap-3 group/xp cursor-help" title="Experience Points">
                <div className="text-sm font-mono text-[#00FFFF] font-bold bg-[#00FFFF]/10 px-2 py-0.5 rounded border border-[#00FFFF]/30">LVL {level}</div>
                <div className="h-3 w-32 bg-gray-900 rounded-full overflow-hidden border border-white/10 relative shadow-inner">
                    <div 
                        className="h-full shadow-[0_0_10px_var(--path-color)] transition-all duration-1000 bg-[#00FFFF]" 
                        style={{ width: `${xpPercent}%` }}
                    ></div>
                </div>
            </div>
        </div>

        {/* CENTER: COHERENCE METER (THE BIG GAUGE) */}
        <div className="flex-1 max-w-2xl w-full px-4 flex flex-col items-center">
            <div className="w-full flex justify-between items-end mb-2">
                <div className="flex flex-col">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">System Entropy</span>
                    <span className="text-sm font-bold text-red-500 drop-shadow-sm">{100 - balance}% CHAOS</span>
                </div>
                
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-[0.3em] mb-1">Coherence Meter</span>
                    <div className={`text-lg font-tech tracking-widest ${coherenceColor} font-bold drop-shadow-[0_0_8px_currentColor] animate-pulse`}>
                        {coherenceLabel}
                    </div>
                </div>

                <div className="flex flex-col items-end">
                    <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">System Syntropy</span>
                    <span className="text-sm font-bold text-cyan-400 drop-shadow-sm">{balance}% ORDER</span>
                </div>
            </div>
            
            {/* The Bar */}
            <div className="relative w-full h-4 bg-black border border-white/20 rounded-full overflow-hidden shadow-[inset_0_2px_15px_rgba(0,0,0,1)]">
                {/* Background Gradients */}
                <div className="absolute inset-0 bg-gradient-to-r from-red-900/60 via-transparent to-cyan-900/60"></div>
                
                {/* Center Marker */}
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-white/30 z-10 -translate-x-1/2"></div>
                
                {/* Dynamic Fill */}
                <div 
                    className={`absolute top-0 bottom-0 transition-all duration-1000 ease-out ${balance < 50 ? 'right-1/2 bg-gradient-to-l from-red-600 to-red-900' : 'left-1/2 bg-gradient-to-r from-cyan-600 to-cyan-400'}`}
                    style={{ width: `${Math.abs(balance - 50)}%` }}
                ></div>

                {/* The Needle/Indicator */}
                <div 
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_15px_white] z-20 transition-all duration-1000 ease-out border-x border-black"
                    style={{ left: `${balance}%` }}
                ></div>
            </div>
        </div>
             
        {/* RIGHT: IDENTITY CARD (Desktop) */}
        <div className="hidden md:flex items-center gap-4 bg-white/5 p-3 pr-6 rounded-2xl border border-white/10 relative hover:border-[#00FFFF]/30 transition-all group/card">
            <div className="relative group/avatar cursor-pointer" onClick={handleAvatarClick}>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                {user?.avatar ? (
                    <img src={user.avatar} alt="User" className="w-12 h-12 rounded-xl border-2 border-white/20 object-cover shadow-[0_0_15px_var(--path-glow)] group-hover/avatar:scale-105 transition-transform" />
                ) : (
                    <div className={`w-12 h-12 rounded-xl border-2 border-white/20 flex items-center justify-center bg-black/60 ${identity.color} shadow-[0_0_15px_var(--path-glow)] text-2xl`}>
                        {identity.icon}
                    </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-black border border-white/20 rounded-full p-1">
                    <Edit2 className="w-3 h-3 text-white" />
                </div>
            </div>

            <div className="flex flex-col items-start min-w-[140px]">
                {isEditingName ? (
                    <input 
                        type="text" 
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-black border border-white/20 text-sm text-white px-2 py-1 rounded w-full focus:border-[#00FFFF] outline-none font-tech uppercase"
                        autoFocus
                        onBlur={saveNameEdit}
                        onKeyDown={(e) => e.key === 'Enter' && saveNameEdit()}
                    />
                ) : (
                    <div 
                        className={`text-sm font-bold font-tech uppercase flex items-center gap-2 ${identity.color} cursor-pointer hover:text-white transition-all`} 
                        onClick={startNameEdit}
                        title="Click to Edit Name"
                    >
                        {user?.name || 'Unknown Node'}
                    </div>
                )}
                
                <div className="flex items-center gap-2 text-xs font-mono text-gray-400 mt-0.5">
                    <span>{identity.label}</span>
                    <span className="text-white/20">|</span>
                    <span className="text-white/60">{user?.startingSkill || 'Initiate'}</span>
                </div>
            </div>
            
            {/* Language Toggle */}
            <div className="h-8 w-px bg-white/10 mx-2"></div>
            <div className="relative group/lang">
                <Globe className="w-5 h-5 text-gray-400 group-hover/lang:text-white transition-colors cursor-pointer" />
                <select 
                    value={language}
                    onChange={(e) => { playCosmicClick(); setLanguage(e.target.value as LanguageCode); }}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                >
                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                </select>
            </div>
        </div>
    </div>
  );
};
