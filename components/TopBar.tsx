
import React, { useRef, useState } from 'react';
import { Activity, Globe, Camera, Edit2, Flame, Atom, Sparkles, Cpu, User, Menu, X } from 'lucide-react';
import { UserProfile, UserPath, LanguageCode } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editName, setEditName] = useState('');

  const getIdentity = () => {
    if (isAuthor) return { label: 'The Phoenix', color: 'text-[#FFD700]', icon: <Flame className="w-4 h-4 text-[#FFD700]" /> };
    switch (path) {
        case UserPath.SCIENTIFIC:
            return { label: t('scientist'), color: 'text-[#00FFFF]', icon: <Atom className="w-4 h-4 text-[#00FFFF]" /> };
        case UserPath.RELIGIOUS:
            return { label: t('seeker'), color: 'text-[#FF4500]', icon: <Sparkles className="w-4 h-4 text-[#FF4500]" /> };
        case UserPath.BLENDED:
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
      if (activeTab === 'book') return t('dashboardBook');
      if (activeTab === 'audio') return t('dashboardAudio');
      if (activeTab === 'map') return t('dashboardMap');
      return 'DASHBOARD';
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#00FFFF]/20 pb-6 mb-8 bg-black/40 backdrop-blur-xl p-6 rounded-3xl sticky top-0 z-30 border-white/5 shadow-2xl gap-4">
        
        {/* Mobile Menu Toggle */}
        <div className="md:hidden w-full flex justify-between items-center mb-4">
            <h1 className="font-tech text-[#00FFFF] tracking-tighter">{t('appTitle')}</h1>
            <button onClick={onToggleMenu} className="text-[#00FFFF]">
                {isMenuOpen ? <X /> : <Menu />}
            </button>
        </div>

        <div className="flex-1">
            <h2 className="font-tech text-xl text-white uppercase tracking-widest">{getTitle()}</h2>
            <div className="h-1 w-16 bg-gradient-to-r from-[#00FFFF] to-[#FF4500] mt-2"></div>
        </div>
             
        {/* COHERENCE METER (Syntropy vs Entropy) - UPDATED TO 50/50 */}
        <div className="hidden md:flex flex-col items-end mr-6">
            <div className="flex items-center gap-2 mb-1">
                <Activity className="w-3 h-3 text-[#FFD700]" />
                <span className="font-tech text-[10px] text-[#FFD700] uppercase tracking-widest">Coherence Status</span>
            </div>
            <div className="flex items-center gap-1 w-48 h-2 bg-gray-900 rounded-full overflow-hidden border border-white/10">
                <div className="h-full bg-[#FFD700] w-[50%] shadow-[0_0_10px_#FFD700]"></div>
                <div className="h-full bg-red-600 w-[50%] opacity-50"></div>
            </div>
            <div className="flex justify-between w-48 mt-1 text-[8px] font-mono text-gray-500 uppercase">
                <span>Syntropy: 50%</span>
                <span className="text-red-500">Entropy: 50%</span>
            </div>
        </div>
             
        {/* USER PROFILE SECTION */}
        <div className="w-full md:w-auto flex items-center gap-4 bg-black/40 p-2 pr-4 rounded-full border border-white/10 relative group/profile">
            {/* Language Globe */}
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

            <div className="h-6 w-[1px] bg-white/10"></div>

            {/* Avatar */}
            <div className="relative cursor-pointer group/avatar" onClick={handleAvatarClick} title="Upload Custom Node Avatar">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="image/*" 
                    onChange={handleFileChange}
                />
                {user?.avatar ? (
                    <img src={user.avatar} alt="User" className="w-8 h-8 rounded-full border border-white/20 object-cover" />
                ) : (
                    <div className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center bg-white/5 ${identity.color}`}>
                        {identity.icon}
                    </div>
                )}
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                    <Camera className="w-3 h-3 text-white" />
                </div>
            </div>

            {/* Identity Info */}
            <div className="flex flex-col items-start mr-2 min-w-[100px]">
                {isEditingName ? (
                    <div className="flex items-center gap-1">
                        <input 
                            type="text" 
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="bg-black border border-white/20 text-[10px] text-white px-1 py-0.5 rounded w-24 focus:border-[#00FFFF] outline-none font-tech uppercase"
                            autoFocus
                            onBlur={saveNameEdit}
                            onKeyDown={(e) => e.key === 'Enter' && saveNameEdit()}
                        />
                    </div>
                ) : (
                    <div className={`text-[10px] font-bold font-tech uppercase flex items-center gap-1.5 ${identity.color} group/name cursor-pointer`} onClick={startNameEdit} title="Edit Node Name">
                        {user?.name || 'Unknown Node'}
                        {identity.icon}
                        <Edit2 className="w-2 h-2 opacity-0 group-hover/name:opacity-100 text-gray-400" />
                    </div>
                )}
                <div className="text-[8px] font-mono text-gray-500 tracking-wider">
                    {user?.email || 'Signal Lost'}
                </div>
            </div>
        </div>
    </div>
  );
};
