
import React, { useState } from 'react';
import { Lock, Search, Music, ChevronLeft, ChevronRight, Play, Pause, ShieldAlert, X, ArrowLeft, Zap } from 'lucide-react';
import { Chapter } from '../types';
import { FULL_MANUSCRIPT, SUMMARIES } from '../data/manuscript';
import { playMenuSelect, playDataOpen, playCosmicClick, playError, playNeuralLink } from '../utils/sfx';

interface ChapterReaderProps {
  chapters: Chapter[];
  isPremium: boolean;
  onUpgrade: () => void;
}

export const ChapterReader: React.FC<ChapterReaderProps> = ({ chapters, isPremium, onUpgrade }) => {
  const [selectedChapterId, setSelectedChapterId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isReadingMusicPlaying, setReadingMusic] = useState(false);
  const [securityWarning, setSecurityWarning] = useState(false);

  // Map ID to Manuscript Content or Summary
  const getContent = (id: number) => {
    const keys = Object.keys(FULL_MANUSCRIPT);
    const contentArray = Object.values(FULL_MANUSCRIPT);
    const summaryArray = Object.values(SUMMARIES);
    
    if (isPremium) {
        return contentArray[id - 1] || "Data currently being retrieved from the Akashic Cloud...";
    } else {
        // Show summary + teaser (first few words)
        const full = contentArray[id - 1] || "";
        const teaser = full.split('\n').filter(l => l.length > 20)[0]?.substring(0, 150) || "";
        return `[SUMMARY]: ${summaryArray[id - 1]}\n\n[PREVIEW]: ${teaser}... [SYNC REQUIRED FOR FULL ACCESS]`;
    }
  };

  const handleSecurityBreach = (e: React.SyntheticEvent) => {
    e.preventDefault();
    playError();
    setSecurityWarning(true);
    setTimeout(() => setSecurityWarning(false), 2000);
  };

  const filteredChapters = chapters.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full text-white animate-fadeIn">
      
      {/* 1. READER TOOLBAR */}
      <div className="flex items-center gap-4 mb-8 bg-black/40 p-4 rounded-2xl border border-white/10 backdrop-blur-xl">
        <div className="flex-1 flex items-center bg-gray-900/80 px-4 py-2.5 rounded-xl border border-gray-700 focus-within:border-cyan-500 transition-all">
          <Search size={16} className="text-gray-500 mr-3" />
          <input 
            type="text" 
            placeholder="Search Database..." 
            className="bg-transparent border-none focus:outline-none text-xs w-full text-white placeholder-gray-600 font-mono"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <button 
          onClick={() => { playCosmicClick(); setReadingMusic(!isReadingMusicPlaying); }}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-tech tracking-widest transition-all ${
            isReadingMusicPlaying ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500' : 'bg-gray-800 text-gray-400 border border-gray-700'
          }`}
        >
          {isReadingMusicPlaying ? <Pause size={14} className="animate-pulse" /> : <Play size={14} />}
          <span className="hidden sm:inline">NEURAL FLOW</span>
        </button>
      </div>

      {/* 2. CHAPTER LIST */}
      {selectedChapterId === null ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto custom-scrollbar pr-2">
          {filteredChapters.map((chapter) => {
            // Standard users can see the selection, but might be met with summaries
            const actuallyLocked = chapter.isLocked && !isPremium;
            return (
              <div 
                key={chapter.id}
                onClick={() => {
                   playDataOpen();
                   setSelectedChapterId(chapter.id);
                }}
                className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group min-h-[160px] flex flex-col justify-between bg-gradient-to-br from-gray-900 to-black border-white/10 hover:border-cyan-500/50 hover:scale-[1.02] shadow-xl`}
              >
                <div className="flex justify-between items-start relative z-10">
                  <span className={`font-mono text-[9px] uppercase tracking-[0.3em] ${actuallyLocked ? 'text-amber-500' : 'text-cyan-500'}`}>
                    {actuallyLocked ? 'RESTRICTED_NODE' : `LINK_NODE_${chapter.id.toString().padStart(3, '0')}`}
                  </span>
                  {!isPremium && <Lock size={12} className="text-gray-600 group-hover:text-amber-500 transition-colors" />}
                </div>

                <div className="relative z-10 mt-4">
                  <h3 className="text-sm font-tech uppercase tracking-wider mb-1.5 text-white">
                    {chapter.title}
                  </h3>
                  <p className="text-[10px] text-gray-500 font-sacred uppercase italic tracking-widest">{chapter.subtitle}</p>
                </div>

                <div className="mt-4 text-[8px] font-mono text-cyan-400/40 uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-opacity">
                  {isPremium ? "Accessing Core..." : "Extracting Summary..."}
                </div>
                
                <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-cyan-500/5 blur-3xl rounded-full group-hover:bg-cyan-500/10 transition-all"></div>
              </div>
            );
          })}
        </div>
      ) : (
        // 3. READING MODE
        <div className="flex-1 flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-10 pb-20">
          {securityWarning && (
                <div className="fixed inset-0 z-[200] bg-red-900/90 flex flex-col items-center justify-center text-center p-8 animate-pulse backdrop-blur-md">
                    <ShieldAlert className="w-20 h-20 text-white mb-6" />
                    <h2 className="text-3xl font-tech text-white uppercase tracking-[0.3em] mb-4">Security Protocol Engaged</h2>
                    <p className="text-white font-mono text-sm max-w-md leading-relaxed">Direct duplication of the Universal Source Code is prohibited by the Phoenix Firewall.</p>
                </div>
          )}

          <div className="flex items-center justify-between mb-6">
            <button 
                onClick={() => { playCosmicClick(); setSelectedChapterId(null); }}
                className="flex items-center gap-2 text-[10px] font-tech text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em] group"
            >
                <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> BACK TO ARCHIVE
            </button>
            <div className="flex gap-2">
                <button 
                    onClick={() => setSelectedChapterId(prev => Math.max(1, (prev || 1) - 1))}
                    disabled={selectedChapterId === 1}
                    className="p-2 bg-white/5 border border-white/10 rounded-full text-gray-500 hover:text-white disabled:opacity-20"
                >
                    <ChevronLeft size={16} />
                </button>
                <button 
                    onClick={() => {
                        const nextId = (selectedChapterId || 1) + 1;
                        if (nextId <= chapters.length) {
                            playDataOpen();
                            setSelectedChapterId(nextId);
                        }
                    }}
                    disabled={selectedChapterId === chapters.length}
                    className="p-2 bg-white/5 border border-white/10 rounded-full text-gray-500 hover:text-white disabled:opacity-20"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
          </div>
          
          <div 
            className="flex-1 bg-gray-900/40 border border-white/5 rounded-[2.5rem] p-8 md:p-16 overflow-y-auto custom-scrollbar relative protected-content shadow-2xl"
            onContextMenu={handleSecurityBreach}
            onCopy={handleSecurityBreach}
            onCut={handleSecurityBreach}
          >
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                  <span className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-[0.5em] mb-4 block">
                    {isPremium ? "Uplink Stable // Unabridged Data" : "Restricted Link // Abstract Preview"}
                  </span>
                  <h2 className="text-3xl md:text-5xl font-tech text-white mb-4 tracking-tighter leading-none uppercase text-shadow-glow">
                    {chapters.find(c => c.id === selectedChapterId)?.title}
                  </h2>
                  <h3 className="text-sm md:text-lg font-sacred text-amber-500 italic uppercase tracking-[0.2em]">
                    {chapters.find(c => c.id === selectedChapterId)?.subtitle}
                  </h3>
                  <div className="w-32 h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mx-auto mt-8"></div>
              </div>
              
              <div className="prose prose-invert prose-lg font-reading leading-relaxed text-gray-300 whitespace-pre-wrap selection:bg-cyan-500/30">
                {getContent(selectedChapterId || 1)}
              </div>

              {!isPremium && (
                  <div className="mt-20 pt-10 border-t border-white/10 flex flex-col items-center">
                     <Lock className="w-12 h-12 text-amber-500 mb-6 animate-pulse" />
                     <h4 className="text-xl font-tech text-white uppercase tracking-widest mb-2">Protocol Sync Required</h4>
                     <p className="text-gray-400 text-sm text-center mb-8 max-w-sm">The full manuscript is currently encrypted. Complete game objectives or initialize root access to decrypt this node.</p>
                     <button 
                       onClick={() => { playNeuralLink(); onUpgrade(); }}
                       className="px-12 py-4 bg-amber-500 text-black hover:bg-white hover:scale-105 transition-all rounded-full font-tech text-xs tracking-[0.3em] uppercase shadow-2xl flex items-center gap-3"
                     >
                       Unlock Full Archive ($9.99) <Zap size={14} className="fill-current" />
                     </button>
                  </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
