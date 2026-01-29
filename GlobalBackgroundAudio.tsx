import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Disc, Volume2, ChevronUp, ChevronDown, Radio } from 'lucide-react';
import { AMBIENT_TRACKS } from '../constants';

export const GlobalBackgroundAudio: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = AMBIENT_TRACKS[currentTrackIndex];

  useEffect(() => {
    // Initialize Audio
    const audio = new Audio(currentTrack.url);
    // Removed crossOrigin="anonymous" to avoid CORS errors with opaque redirects from Google Drive
    audio.loop = true;
    audio.volume = volume;
    audioRef.current = audio;

    // Try Auto-play
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.warn("Auto-play prevented:", error);
          setIsPlaying(false);
        });
    }

    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, []); // Only runs once on mount to establish the player

  // Handle Track Change
  useEffect(() => {
    if (audioRef.current) {
        const wasPlaying = isPlaying;
        audioRef.current.pause();
        audioRef.current.src = currentTrack.url;
        audioRef.current.load();
        if (wasPlaying) {
            audioRef.current.play().catch(e => console.error(e));
        }
    }
  }, [currentTrackIndex]);

  // Handle Volume Change
  useEffect(() => {
    if (audioRef.current) {
        audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle Play/Pause Toggle
  const togglePlay = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
    } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error(e));
    }
  };

  return (
    <div className={`fixed bottom-6 right-6 z-[60] transition-all duration-500 ease-out flex flex-col items-end gap-2`}>
      
      {/* EXPANDED CONTROL PANEL */}
      <div className={`bg-black/90 border border-[#00FFFF]/30 backdrop-blur-xl rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(0,255,255,0.15)] transition-all duration-500 origin-bottom-right ${isExpanded ? 'w-64 opacity-100 mb-2 scale-100' : 'w-0 opacity-0 h-0 scale-90'}`}>
        <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="font-tech text-xs text-[#00FFFF] uppercase tracking-widest">Audio Uplink</span>
                <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    <span className="text-[9px] font-mono text-gray-400">LIVE</span>
                </div>
            </div>

            {/* Track Info */}
            <div>
                <div className="text-[10px] text-gray-500 uppercase tracking-wider mb-1">Current Frequency</div>
                <div className="font-bold text-white text-sm truncate">{currentTrack.label}</div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
                <button 
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-[#00FFFF]/10 border border-[#00FFFF] flex items-center justify-center text-[#00FFFF] hover:bg-[#00FFFF]/20 transition-all"
                >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                </button>
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <Volume2 className="w-3 h-3 text-gray-400" />
                        <span className="text-[9px] font-mono text-gray-400">{Math.round(volume * 100)}%</span>
                    </div>
                    <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        value={volume}
                        onChange={(e) => setVolume(parseFloat(e.target.value))}
                        className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-[#00FFFF]"
                    />
                </div>
            </div>

            {/* Track List */}
            <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar border-t border-white/10 pt-2">
                {AMBIENT_TRACKS.map((track, idx) => (
                    <button
                        key={track.id}
                        onClick={() => setCurrentTrackIndex(idx)}
                        className={`w-full text-left px-2 py-2 rounded text-[10px] uppercase tracking-wider transition-all flex items-center justify-between ${
                            currentTrackIndex === idx 
                            ? 'bg-[#00FFFF]/10 text-[#00FFFF] border border-[#00FFFF]/20' 
                            : 'text-gray-500 hover:text-white hover:bg-white/5'
                        }`}
                    >
                        <span className="truncate pr-2">{track.label}</span>
                        {currentTrackIndex === idx && <Radio className="w-3 h-3 animate-pulse" />}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* FLOATING TOGGLE BUTTON */}
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className={`w-14 h-14 rounded-full border flex items-center justify-center shadow-2xl transition-all relative group ${
            isPlaying 
            ? 'bg-black/80 border-[#00FFFF] text-[#00FFFF] shadow-[0_0_20px_rgba(0,255,255,0.4)]' 
            : 'bg-black/60 border-gray-600 text-gray-400 hover:border-white hover:text-white'
        }`}
      >
         {/* Spinner Ring */}
         <div className={`absolute inset-0 rounded-full border-2 border-transparent border-t-[#00FFFF]/50 border-r-[#00FFFF]/30 transition-transform duration-[3s] linear ${isPlaying ? 'animate-spin' : ''}`}></div>
         
         <Disc className={`w-6 h-6 ${isPlaying ? 'animate-pulse-slow' : ''}`} />
         
         {!isPlaying && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border border-black">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
            </div>
         )}
      </button>

    </div>
  );
};