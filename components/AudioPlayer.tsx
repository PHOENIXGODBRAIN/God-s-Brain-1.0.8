
import React from 'react';
import { Play, SkipForward, SkipBack, Lock, Headset } from 'lucide-react';
import { playNeuralLink } from '../utils/sfx';

interface AudioPlayerProps {
  isPremium: boolean;
  onUpgrade: () => void;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ isPremium, onUpgrade }) => {
  
  const handleUpgrade = () => {
    playNeuralLink();
    onUpgrade();
  };

  return (
    <div className="relative group">
      {!isPremium && (
        <div className="absolute inset-0 z-10 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-8 rounded-3xl border border-purple-500/20">
          <Lock className="w-12 h-12 mb-4 text-purple-500 animate-pulse" />
          <h3 className="text-xl font-bold mb-2 font-tech uppercase tracking-wider">Neural Sync Required</h3>
          <p className="text-sm text-gray-400 mb-6">Initiate Omega Protocol to receive the full 8-hour auditory transmission.</p>
          <button 
            onClick={handleUpgrade}
            className="px-8 py-3 bg-purple-600 hover:bg-purple-500 rounded-full font-bold transition-all shadow-lg shadow-purple-500/30 font-tech text-xs uppercase tracking-widest"
          >
            Initiate Protocol
          </button>
        </div>
      )}

      <div className={`p-8 rounded-3xl bg-white/5 border border-white/10 transition-all ${!isPremium ? 'blur-sm grayscale' : ''}`}>
        <div className="flex flex-col items-center text-center">
          <div className="w-48 h-48 bg-gradient-to-br from-purple-600 to-blue-900 rounded-2xl mb-6 shadow-2xl flex items-center justify-center overflow-hidden">
            <Headset className="w-20 h-20 text-white/20" />
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30"></div>
          </div>
          
          <h2 className="text-2xl font-serif text-white mb-1">The God's Brain Manuscript</h2>
          <p className="text-purple-400 text-sm font-bold mb-8 tracking-widest uppercase">Version 7.0 Master Edition</p>

          <div className="w-full bg-white/10 h-1.5 rounded-full mb-8 relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 bg-purple-500 w-1/3 rounded-full"></div>
          </div>

          <div className="flex items-center gap-8 mb-4">
            <SkipBack className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white transition-all" />
            <div className="w-16 h-16 bg-white text-black rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all shadow-xl">
              <Play className="w-8 h-8 fill-current translate-x-1" />
            </div>
            <SkipForward className="w-6 h-6 text-gray-400 cursor-pointer hover:text-white transition-all" />
          </div>
          
          <p className="text-xs text-gray-500 mt-4 italic">Audio transmission currently offline. Upgrade to initiate download.</p>
        </div>
      </div>
    </div>
  );
};
