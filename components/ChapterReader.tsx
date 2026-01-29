
import React, { useState } from 'react';
import { Chapter } from '../types';
import { Lock, Zap, ChevronRight, X, ArrowLeft, Maximize2, ShieldAlert } from 'lucide-react';
import { playCosmicClick, playNeuralLink, playDataOpen, playError } from '../utils/sfx';

interface ChapterReaderProps {
  chapters: Chapter[];
  isPremium: boolean;
  onUpgrade: () => void;
}

export const ChapterReader: React.FC<ChapterReaderProps> = ({ chapters, isPremium, onUpgrade }) => {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [securityWarning, setSecurityWarning] = useState(false);

  const handleChapterClick = (chapter: Chapter) => {
    if (chapter.isLocked && !isPremium) {
      playNeuralLink();
      onUpgrade();
      return;
    }
    playDataOpen(); // Digital chirp for accessing data
    setSelectedChapter(chapter);
  };

  const handleClose = () => {
    playCosmicClick();
    setSelectedChapter(null);
  };

  const handleSecurityBreach = (e: React.SyntheticEvent) => {
    e.preventDefault();
    playError();
    setSecurityWarning(true);
    setTimeout(() => setSecurityWarning(false), 2000);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className="font-tech text-3xl text-white mb-2 uppercase tracking-widest">Neural Archive</h2>
        <div className="w-24 h-[1px] bg-[#00FFFF] mx-auto opacity-30"></div>
      </div>

      {/* CHAPTER GRID */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {chapters.map((chapter) => {
          const locked = chapter.isLocked && !isPremium;

          return (
            <div 
              key={chapter.id} 
              onClick={() => handleChapterClick(chapter)}
              className={`relative border border-white/10 rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer ${
                locked ? 'opacity-60' : 'bg-black/40 hover:border-[#00FFFF] hover:scale-[1.02] shadow-xl'
              }`}
            >
              <div className={`p-6 flex flex-col justify-between min-h-[200px] ${locked ? 'bg-gray-900/40' : 'bg-gradient-to-br from-[#00FFFF]/5 to-transparent'}`}>
                <div className="flex justify-between items-start mb-4">
                  <span className={`font-mono text-[9px] uppercase tracking-widest ${locked ? 'text-gray-600' : 'text-[#00FFFF]'}`}>
                    NODE_{chapter.id.toString().padStart(3, '0')}
                  </span>
                  {locked && <Lock className="text-[#FF4500] w-3 h-3" />}
                </div>

                <div>
                  <h3 className={`font-tech text-sm uppercase leading-tight mb-1 ${locked ? 'text-gray-500' : 'text-white'}`}>
                    {chapter.title}
                  </h3>
                  <p className="font-sacred text-[9px] text-white/30 italic uppercase">{chapter.subtitle}</p>
                </div>

                <div className="mt-6 text-[8px] font-tech text-[#00FFFF] opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">
                    {locked ? 'ENCRYPTED' : 'Download Data >>'}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL READER */}
      {selectedChapter && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl" onClick={handleClose}></div>
          
          <div className="relative w-full max-w-3xl max-h-[85vh] bg-black border border-[#00FFFF]/30 shadow-[0_0_50px_rgba(0,255,255,0.1)] rounded-3xl flex flex-col overflow-hidden">
            
            {/* Security Warning Overlay */}
            {securityWarning && (
                <div className="absolute inset-0 z-50 bg-red-900/90 flex flex-col items-center justify-center text-center p-8 animate-pulse">
                    <ShieldAlert className="w-16 h-16 text-white mb-4" />
                    <h2 className="text-2xl font-tech text-white uppercase tracking-widest mb-2">Security Protocol Engaged</h2>
                    <p className="text-white font-mono text-xs">Copying of Neural Archive data is strictly prohibited.</p>
                </div>
            )}

            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={handleClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-[#00FFFF]">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="font-tech text-xs text-white uppercase tracking-widest">Archive Link: Node_{selectedChapter.id}</div>
              </div>
              <button onClick={handleClose} className="text-gray-500 hover:text-white"><X /></button>
            </div>

            <div 
                className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar protected-content"
                onContextMenu={handleSecurityBreach}
                onCopy={handleSecurityBreach}
                onCut={handleSecurityBreach}
            >
              <div className="max-w-2xl mx-auto space-y-8">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl md:text-5xl font-tech text-white uppercase tracking-tighter">{selectedChapter.title}</h1>
                    <h2 className="text-lg font-reading text-[#FF4500] italic font-medium">{selectedChapter.subtitle}</h2>
                </div>

                {/* Protected Text Content */}
                <div className="font-reading text-lg md:text-xl text-gray-300 leading-loose space-y-6 first-letter:text-4xl first-letter:text-[#00FFFF] first-letter:mr-1 first-letter:font-bold">
                    {selectedChapter.content.split('\n').map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-white/5 bg-black text-[8px] font-mono text-gray-600 flex justify-between px-6">
                <span>GOD_BRAIN_V7.0</span>
                <span className="text-[#00FFFF]/30 uppercase tracking-[0.2em] flex items-center gap-2">
                    <ShieldAlert className="w-3 h-3" />
                    DRM-SECURE
                </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
