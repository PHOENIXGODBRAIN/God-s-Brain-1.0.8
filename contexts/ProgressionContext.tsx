
import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { playNeuralLink, playDataOpen } from '../utils/sfx';

interface ProgressionContextType {
  level: number;
  xp: number;
  xpToNextLevel: number;
  addXp: (amount: number, reason?: string) => void;
  entropy: number; 
  reduceEntropy: (amount: number) => void;
  balance: number; // 0 (Entropy) to 100 (Syntropy)
  adjustBalance: (amount: number) => void;
}

const ProgressionContext = createContext<ProgressionContextType | undefined>(undefined);

const calculateXpForLevel = (lvl: number) => Math.floor(lvl * 1000 * 1.5);

export const ProgressionProvider: React.FC<{ children: React.ReactNode, user?: UserProfile, onUpdate?: (u: Partial<UserProfile>) => void }> = ({ children, user, onUpdate }) => {
  const [level, setLevel] = useState(user?.level || 1);
  const [xp, setXp] = useState(user?.xp || 0);
  const [entropy, setEntropy] = useState(15);
  const [balance, setBalance] = useState(user?.balance ?? 50);

  useEffect(() => {
    if (user) {
        setLevel(user.level || 1);
        setXp(user.xp || 0);
        setBalance(user.balance ?? 50);
    }
  }, [user?.email, user?.balance]);

  const addXp = (amount: number, reason?: string) => {
      let newXp = xp + amount;
      let newLevel = level;
      const required = calculateXpForLevel(level);

      if (newXp >= required) {
          newXp -= required;
          newLevel += 1;
          playNeuralLink(); 
      }

      setXp(newXp);
      setLevel(newLevel);
      if (onUpdate) onUpdate({ level: newLevel, xp: newXp });
  };

  const adjustBalance = (amount: number) => {
      const newBalance = Math.min(100, Math.max(0, balance + amount));
      setBalance(newBalance);
      if (onUpdate) onUpdate({ balance: newBalance });
      // Only play subtle noise for significant shifts
      if (Math.abs(amount) > 2) playDataOpen();
  };

  const reduceEntropy = (amount: number) => {
      setEntropy(prev => Math.max(0, prev - amount));
  };

  const xpToNextLevel = calculateXpForLevel(level);

  return (
    <ProgressionContext.Provider value={{ level, xp, xpToNextLevel, addXp, entropy, reduceEntropy, balance, adjustBalance }}>
      {children}
    </ProgressionContext.Provider>
  );
};

export const useProgression = () => {
  const context = useContext(ProgressionContext);
  if (!context) throw new Error('useProgression must be used within ProgressionProvider');
  return context;
};
