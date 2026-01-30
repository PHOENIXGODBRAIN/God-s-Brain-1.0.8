
import React, { useState, useMemo } from 'react';
import { Lock, Search, Music, ChevronLeft, ChevronRight, Play, Pause, ShieldAlert, X, ArrowLeft, Zap, FileText, Type } from 'lucide-react';
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
  const [textSize, setTextSize] = useState<number>(18); // Default font size

  // Map ID to Manuscript Content or Summary
  const getContent = (id: number) => {
    if (isPremium) {
        return FULL_MANUSCRIPT[id] || "Data currently being retrieved from the Akashic Cloud...";
    } else {
        const full = FULL_MANUSCRIPT[id] || "";
        const summary = (SUMMARIES as any)[`CH_${id}`] || (SUMMARIES as any).PREFACE;
        // Provide a meaningful teaser for free nodes
        const teaser = full.split('\n').filter(l => l.trim().length > 40)[0]?.substring(0, 180) || "";
        return `[SUMMARY]: ${summary}\n\n[PREVIEW]: ${teaser}... \n\n[SYNC REQUIRED FOR FULL ACCESS]`;
    }
  };

  const handleSecurityBreach = (e: React.SyntheticEvent) => {
    e.preventDefault();
    playError();
    setSecurityWarning(true);
    setTimeout(() => setSecurityWarning(false), 2000);
  };

  const adjustTextSize = (delta: number) => {
      playCosmicClick();
      setTextSize(prev => Math.min(32, Math.max(14, prev + delta)));
  };

  // ADVANCED SEARCH ENGINE: Indexing titles + subtitle + full content
  const searchResults = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return chapters;

    return chapters.filter(c => {
      const inTitle = c.title.toLowerCase().includes(q);
      const inSub = c.subtitle.toLowerCase().includes(q);
      const content = FULL_MANUSCRIPT[c.id] || "";
      const inContent = content.toLowerCase().includes(q);
      return inTitle || inSub || inContent;
    });
  }, [chapters, searchQuery]);

  // KINDLE-LIKE PARAGRAPH FORMATTER WITH HIGHLIGHTING
  const renderContent = (text: string) => {
    // Split by double newlines to form paragraphs
    const paragraphs = text.split('\n');
    
    return paragraphs.map((para, i) => {
        if (!para.trim()) return <br key={i} />;
        
        // Highlight search term
        let content: React.ReactNode = para;
        if (searchQuery.trim().length > 2) {
            const parts = para.split(new RegExp(`(${searchQuery})`, 'gi'));
            content = parts.map((part, j) => 
                part.toLowerCase() === searchQuery.toLowerCase() ? (
                    <span key={j} className="bg-yellow-500/30 text-yellow-200 rounded px-0.5 font-bold">{part}</span>
                ) : part
            );
        }

        return (
            <p 
                key={i} 
                className="mb-6 leading-loose text-gray-300 font-reading"
                style={{ fontSize: `${textSize}px`, lineHeight: `${textSize * 1.6}px` }}
            >
                {content}
            </p>
        );
    });
  };

  return (
    <div className="flex flex-col h-full text-white animate-fadeIn">
      
      {/* 1. READER TOOLBAR */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 mb-8 bg-black/40 p-4 rounded-2xl border border-white/10 backdrop-blur-xl">
        <div className="flex-1 flex items-center bg-gray-900/80 px-4 py-2.5 rounded-xl border border-gray-700 focus-within:border-cyan-500 transition-all">
          <Search size={16} className="text-gray-500 mr-3" />
          <input 
            type="text" 
            placeholder="Search Akashic Records (Title, Content, or Numbers)..." 
            className="bg-transparent border-none focus:outline-none text-xs w-full text-white placeholder-gray-600 font-mono"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2">
            {/* Text Size Controls */}
            {selectedChapterId !== null && (
                <div className="flex items-center gap-1 bg-gray-800 rounded-xl p-1 border border-gray-700 mr-2">
                    <button onClick={() => adjustTextSize(-2)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"><Type size={12} /></button>
                    <button onClick={() => adjustTextSize(2)} className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"><Type size={16} /></button>
                </div>
            )}

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
      </div>

      {/* 2. CHAPTER LIST */}
      {selectedChapterId === null ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 overflow-y-auto custom-scrollbar pr-2 pb-10">
          {searchResults.length === 0 ? (
            <div className="col-span-full py-20 text-center flex flex-col items-center opacity-40">
                <ShieldAlert size={48} className="mb-4 text-gray-600" />
                <p className="font-tech text-sm uppercase tracking-widest">No matching nodes found in sector.</p>
            </div>
          ) : (
            searchResults.map((chapter) => {
              const actuallyLocked = chapter.isLocked && !isPremium;
              const contentPreview = FULL_MANUSCRIPT[chapter.id]?.substring(0, 150) + "...";
              
              return (
                <div 
                  key={chapter.id}
                  onClick={() => {
                     playDataOpen();
                     setSelectedChapterId(chapter.id);
                  }}
                  className={`p-6 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group min-h-[220px] flex flex-col justify-between bg-gradient-to-br from-gray-900 to-black border-white/10 hover:border-cyan-500/50 hover:scale-[1.02] shadow-xl`}
                >
                  <div className="flex justify-between items-start relative z-10">
                    <span className={`font-mono text-[9px] uppercase tracking-[0.3em] ${actuallyLocked ? 'text-amber-500' : 'text-cyan-500'}`}>
                      {actuallyLocked ? 'RESTRICTED_NODE' : `LINK_NODE_${chapter.id.toString().padStart(3, '0')}`}
                    </span>
                    {!isPremium && <Lock size={12} className="text-gray-600 group-hover:text-amber-500 transition-colors" />}
                  </div>

                  <div className="relative z-10 mt-4 flex-1">
                    <h3 className="text-sm font-tech uppercase tracking-wider mb-1.5 text-white">
                      {chapter.title}
                    </h3>
                    <p className="text-[10px] text-gray-500 font-sacred uppercase italic tracking-widest mb-3">{chapter.subtitle}</p>
                    
                    {/* Deep Search Snippet */}
                    <div className="text-[9px] text-gray-500 font-reading leading-relaxed line-clamp-3 group-hover:text-gray-300 transition-colors">
                        {contentPreview}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between relative z-10 border-t border-white/5 pt-3">
                    <div className="text-[8px] font-mono text-cyan-400/40 uppercase tracking-[0.3em]">
                        {isPremium ? "DECRYPTED" : "ENCRYPTED"}
                    </div>
                    <FileText size={12} className="text-gray-700 group-hover:text-cyan-500 transition-colors" />
                  </div>
                  
                  <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-cyan-500/5 blur-3xl rounded-full group-hover:bg-cyan-500/10 transition-all"></div>
                </div>
              );
            })
          )}
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
                    className="p-2 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white disabled:opacity-20 transition-colors"
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
                    className="p-2 bg-white/5 border border-white/10 rounded-full text-gray-400 hover:text-white disabled:opacity-20 transition-colors"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
          </div>
          
          <div 
            className="flex-1 bg-[#0a0a0a] border border-white/5 rounded-[1.5rem] p-6 md:p-12 lg:p-20 overflow-y-auto custom-scrollbar relative protected-content shadow-2xl"
            onContextMenu={handleSecurityBreach}
            onCopy={handleSecurityBreach}
            onCut={handleSecurityBreach}
          >
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-16">
                  <span className="text-[10px] font-mono text-cyan-500/60 uppercase tracking-[0.5em] mb-4 block">
                    {isPremium ? "Uplink Stable // Unabridged Transmission" : "Restricted Link // Abstract Preview"}
                  </span>
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-tech text-white mb-4 tracking-tighter leading-none uppercase text-shadow-glow">
                    {chapters.find(c => c.id === selectedChapterId)?.title}
                  </h2>
                  <h3 className="text-sm md:text-lg lg:text-xl font-sacred text-amber-500 italic uppercase tracking-[0.2em]">
                    {chapters.find(c => c.id === selectedChapterId)?.subtitle}
                  </h3>
                  <div className="w-32 h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent mx-auto mt-8"></div>
              </div>
              
              <div className="prose prose-invert prose-lg max-w-none">
                {renderContent(getContent(selectedChapterId || 1))}
              </div>

              {!isPremium && (
                  <div className="mt-24 pt-12 border-t border-white/10 flex flex-col items-center animate-fadeIn">
                     <Lock className="w-14 h-14 text-amber-500 mb-6 animate-pulse" />
                     <h4 className="text-2xl font-tech text-white uppercase tracking-widest mb-4">Uplink Encryption Active</h4>
                     <p className="text-gray-400 text-sm text-center mb-10 max-w-sm font-reading leading-relaxed">The God's Brain manuscript is protected by standard neural barriers. Initialize Root Access to synchronize the full data stream.</p>
                     <button 
                       onClick={() => { playNeuralLink(); onUpgrade(); }}
                       className="px-14 py-5 bg-amber-500 text-black hover:bg-white hover:scale-105 transition-all rounded-full font-tech text-xs tracking-[0.3em] uppercase shadow-[0_0_40px_rgba(245,158,11,0.3)] flex items-center gap-3 active:scale-95"
                     >
                       Decrypt Full Archive ($9.99) <Zap size={16} className="fill-current" />
                     </button>
                  </div>
              )}

              {/* End of Chapter Mark */}
              <div className="mt-32 flex flex-col items-center opacity-20">
                  <div className="w-px h-24 bg-gradient-to-b from-white to-transparent mb-6"></div>
                  <span className="font-tech text-[10px] tracking-[1em] uppercase">End Transmission</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
