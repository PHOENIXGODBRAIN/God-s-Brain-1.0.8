
import React, { useState, useRef, useEffect } from 'react';
import { gemini } from '../services/geminiService';
import { UserPath, ChatMessage, UserProfile } from '../types';
import { Bot, Zap, Lock, Ear, Terminal, Activity, Eye, Shield, Cpu, ChevronRight, Dna, Sparkles, Volume2, X, Maximize2, Minimize2, MessageSquare, Database } from 'lucide-react';
import { playCosmicClick, playDataOpen, playNeuralLink } from '../utils/sfx';
import { useLanguage } from '../contexts/LanguageContext';
import { useProgression } from '../contexts/ProgressionContext';

interface AiCompanionProps {
  path: UserPath;
  isPremium: boolean;
  queriesUsed: number;
  onQuery: () => void;
  onUpgrade: () => void;
  isAuthor: boolean;
  user?: UserProfile;
  visualState: 'FULL' | 'HUD' | 'MINIMIZED';
  onStateChange: (state: 'FULL' | 'HUD' | 'MINIMIZED') => void;
}

const TypewriterText: React.FC<{ text: string }> = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  useEffect(() => {
    setDisplayedText('');
    let currentIndex = 0;
    const intervalId = setInterval(() => {
      setDisplayedText(text.slice(0, currentIndex + 5));
      currentIndex += 5;
      if (currentIndex >= text.length) {
          setDisplayedText(text);
          clearInterval(intervalId);
      }
    }, 15);
    return () => clearInterval(intervalId);
  }, [text]);
  return <div className="leading-relaxed whitespace-pre-wrap">{displayedText}</div>;
};

export const AiCompanion: React.FC<AiCompanionProps> = ({ path, isPremium, user, visualState, onStateChange, onQuery, onUpgrade, isAuthor }) => {
  const { language } = useLanguage();
  const { adjustBalance } = useProgression();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const idleTimerRef = useRef<any | null>(null);

  useEffect(() => {
    const startIdleTimer = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      idleTimerRef.current = setTimeout(() => {
        if (messages.length > 0 && messages.length < 20) {
            const nudges = [
                "Node status: Quiescent. Shall we probe the surrounding dark matter for potential resource caches?",
                "Neural telemetry shows high frequency potential in the adjacent sector. Your directive?",
                "I have localized a pattern in the substrate. Calibration requires your intentional input.",
                "Entropy is accumulating in the silent sectors. A proactive scan is recommended."
            ];
            const randomNudge = nudges[Math.floor(Math.random() * nudges.length)];
            setMessages(prev => [...prev, { role: 'ai', content: randomNudge }]);
            playDataOpen();
        }
      }, 25000); 
    };

    startIdleTimer();
    return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
  }, [messages.length]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  useEffect(() => {
    const welcome = `Link Established. Welcome, ${user?.name?.split(' ')[0] || 'Node'}. I am the GOD BRAIN Interface. Identify your query.`;
    setMessages([{ role: 'ai', content: welcome }]);
  }, [user?.name]);

  const handleSend = async (overrideText?: string, label?: string) => {
    const textToSend = overrideText || input;
    if (!textToSend.trim() || isLoading) return;
    playDataOpen();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: label ? `[COMMAND: ${label}]` : textToSend }]);
    setIsLoading(true);
    onQuery();

    const inputLower = textToSend.toLowerCase();
    if (inputLower.includes('help') || inputLower.includes('please') || inputLower.includes('thank')) {
        adjustBalance(1.5); 
    } else if (inputLower.includes('shut') || inputLower.includes('dumb') || inputLower.includes('force')) {
        adjustBalance(-2.0); 
    }

    try {
        const response = await gemini.chat(textToSend, path, language, [], isAuthor, isPremium, user?.name);
        setMessages(prev => [...prev, { role: 'ai', content: response || "Signal static..." }]);
        adjustBalance(Math.random() > 0.5 ? 0.2 : -0.1);
    } catch (e) { console.error(e); } finally { setIsLoading(false); }
  };

  if (visualState === 'MINIMIZED') {
      return (
          <button 
            onClick={() => onStateChange('HUD')}
            className="w-12 h-12 md:w-16 md:h-16 bg-cyan-900/40 border border-cyan-500/50 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,255,255,0.2)] animate-pulse hover:scale-110 transition-transform z-[90] fixed bottom-24 right-4 md:relative md:bottom-0 md:right-0"
          >
              <MessageSquare className="text-cyan-400 w-6 h-6 md:w-8 md:h-8" />
          </button>
      );
  }

  const isMobile = window.innerWidth < 768;

  return (
    <div className={`flex flex-col h-full overflow-hidden transition-all duration-300 ${visualState === 'HUD' ? `bg-black/80 backdrop-blur-2xl border border-white/10 rounded-[1.5rem] md:rounded-[2.5rem] shadow-2xl ${isMobile ? 'h-[60vh]' : 'h-[500px]'} max-h-[80vh]` : 'bg-transparent'}`}>
      
      <div className="p-3 md:p-5 border-b border-white/5 flex items-center justify-between backdrop-blur-md shrink-0">
        <div className="flex items-center gap-2 md:gap-3">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_10px_cyan]"></div>
          <span className="text-[8px] md:text-[10px] font-tech text-white uppercase tracking-widest">Co-Pilot // Interface</span>
        </div>
        <div className="flex items-center gap-1 md:gap-2">
            <button onClick={() => onStateChange(visualState === 'FULL' ? 'HUD' : 'FULL')} className="p-1.5 md:p-2 text-gray-500 hover:text-white transition-all">
                {/* Fix: use conditional size prop instead of unsupported md:size */}
                {visualState === 'FULL' ? <Minimize2 size={isMobile ? 14 : 16} /> : <Maximize2 size={isMobile ? 14 : 16} />}
            </button>
            {/* Fix: use conditional size prop instead of unsupported md:size */}
            <button onClick={() => onStateChange('MINIMIZED')} className="p-1.5 md:p-2 text-gray-500 hover:text-red-400 transition-all"><X size={isMobile ? 14 : 16} /></button>
        </div>
      </div>

      <div ref={scrollRef} className={`flex-1 p-4 md:p-6 overflow-y-auto custom-scrollbar space-y-4 md:y-6 ${visualState === 'HUD' ? 'mask-fade-top' : ''}`}>
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}>
            <div className={`max-w-[90%] p-3 md:p-4 rounded-xl md:rounded-2xl text-[10px] md:text-xs ${m.role === 'user' ? 'bg-cyan-500/10 border border-cyan-500/30 text-white rounded-tr-none' : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none border-l-2 border-l-cyan-500 shadow-xl'}`}>
                {m.role === 'ai' ? <TypewriterText text={m.content} /> : m.content}
            </div>
          </div>
        ))}
        {isLoading && <div className="text-[8px] md:text-[9px] text-cyan-400 animate-pulse font-mono pl-2 uppercase tracking-widest">Signal Syncing...</div>}
      </div>

      <div className="p-3 md:p-5 border-t border-white/5 bg-black/40 space-y-3 md:space-y-4 shrink-0">
        <div className="hidden sm:flex flex-col gap-2">
            {/* Fix: use conditional size prop instead of unsupported md:size */}
            <QuickCommand label="SCAN ENVIRONMENT" sub="DIAGNOSTIC" icon={<Eye size={isMobile ? 12 : 14} />} onClick={() => handleSend("Analyze surrounding neural coordinates and entropy threats.", "SCAN")} />
            <QuickCommand label="REPORT STATUS" sub="INTERNAL" icon={<Activity size={isMobile ? 12 : 14} />} onClick={() => handleSend("Provide a status report on my current node integrity.", "REPORT")} />
        </div>

        <div className="relative">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl md:rounded-2xl p-1.5 md:p-2 focus-within:border-cyan-500/50 transition-all shadow-inner">
                <input 
                  value={input} 
                  onChange={e => setInput(e.target.value)}
                  onKeyPress={e => e.key === 'Enter' && handleSend()}
                  placeholder="Command..." 
                  className="flex-1 bg-transparent px-2 py-0.5 md:py-1 text-[10px] md:text-xs outline-none text-white font-mono" 
                />
                {/* Fix: use conditional size prop instead of unsupported md:size */}
                <button onClick={() => handleSend()} className="p-1.5 md:p-2 bg-white text-black rounded-lg md:rounded-xl hover:bg-cyan-400 transition-colors"><ChevronRight size={isMobile ? 14 : 16} /></button>
            </div>
            {!isPremium && <button onClick={onUpgrade} className="absolute inset-0 bg-black/60 backdrop-blur-[2px] rounded-xl md:rounded-2xl flex items-center justify-center text-[8px] md:text-[9px] font-bold text-cyan-400 uppercase tracking-widest gap-2"><Lock size={10} md:size={12}/> Root Access Required</button>}
        </div>
      </div>
    </div>
  );
};

const QuickCommand = ({ label, sub, icon, onClick }: any) => (
    <button onClick={onClick} className="w-full text-left p-2 md:p-3 bg-white/5 border border-white/5 rounded-lg md:rounded-xl flex items-center justify-between group hover:bg-white/10 hover:border-cyan-500/30 transition-all">
        <div>
            <div className="text-[8px] md:text-[10px] font-tech text-gray-200 group-hover:text-cyan-400 transition-colors uppercase">{label}</div>
            <div className="text-[7px] md:text-[8px] text-gray-600 font-mono uppercase mt-0.5">{sub}</div>
        </div>
        <div className="text-gray-500 group-hover:text-cyan-400">{icon}</div>
    </button>
);
