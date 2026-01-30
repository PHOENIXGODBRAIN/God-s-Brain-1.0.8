
import React, { useState, useEffect } from 'react';
import { UserPath, UserProfile, UserRecord } from './types';
import { Dashboard } from './components/Dashboard';
import { GlobalBackgroundAudio } from './components/GlobalBackgroundAudio';
import { LanguageProvider } from './contexts/LanguageContext';
import { ProgressionProvider } from './contexts/ProgressionContext';
import { CosmicBackground } from './components/CosmicBackground';

// Onboarding Components
import { LoginPortal } from './components/Onboarding/LoginPortal';
import { ArchetypeShowcase } from './components/Onboarding/ArchetypeShowcase'; 
import { NeuralInit } from './components/Onboarding/NeuralInit';
import { ArchetypeReveal } from './components/Onboarding/ArchetypeReveal';
import { FinalReveal } from './components/Onboarding/FinalReveal';
import { NeuronBuilder } from './components/Onboarding/NeuronBuilder';
import { TransitionScreen } from './components/TransitionScreen';
import { WarpScreen } from './components/WarpScreen';
import { playError, playNeuralLink, playCosmicClick, playDataOpen } from './utils/sfx';
import { X, Flame, ShieldAlert, Key, Hash, ChevronRight, Eraser } from 'lucide-react';

type OnboardingStep = 'PORTAL' | 'SHOWCASE' | 'INIT' | 'REVEAL' | 'SKILL_INIT' | 'SYNTHESIS' | 'WARP' | 'BUILDER' | 'COMPLETE';

const ARCHETYPE_COLORS: Record<string, string> = {
    'SCIENTIST': '#00FFFF',
    'ARCHITECT': '#F43F5E',
    'MYSTIC': '#FFD700',
    'SEEKER': '#F97316',
    'ALCHEMIST': '#10B981',
    'ACTIVE_NODE': '#A855F7'
};

const AppContent: React.FC = () => {
  const [path, setPath] = useState<UserPath>(UserPath.NONE);
  const [isPremium, setIsPremium] = useState(false);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | undefined>(undefined);
  const [queriesUsed, setQueriesUsed] = useState(0);
  
  // Onboarding State
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>('PORTAL');
  const [warpTarget, setWarpTarget] = useState<OnboardingStep>('SHOWCASE');
  const [isTransitioning, setIsTransitioning] = useState(false); 
  const [nextStep, setNextStep] = useState<OnboardingStep | null>(null); 
  const [transitionTitle, setTransitionTitle] = useState("IDENTITY VERIFICATION");
  const [transitionSteps, setTransitionSteps] = useState<string[]>([]);

  const [calibrationProfile, setCalibrationProfile] = useState<any>(null);
  const [archetypeKey, setArchetypeKey] = useState<string>('ACTIVE_NODE'); 
  const [warpColor, setWarpColor] = useState<string>('cyan');

  // Admin Override Modal State
  const [showPhoenixModal, setShowPhoenixModal] = useState(false);
  const [punchCode, setPunchCode] = useState<string[]>([]);
  const CORRECT_CODE = "1742";

  // --- ROOT ACCESS OVERRIDE ---
  const effectiveIsPremium = isPremium || isAuthor;

  const getUserDB = (): Record<string, UserRecord> => {
    try {
      const db = localStorage.getItem('gb_user_database');
      return db ? JSON.parse(db) : {};
    } catch (e) {
      return {};
    }
  };

  const saveUserDB = (db: Record<string, UserRecord>) => {
    localStorage.setItem('gb_user_database', JSON.stringify(db));
  };

  useEffect(() => {
    if (userProfile?.archetype) {
        const color = ARCHETYPE_COLORS[userProfile.archetype] || '#00FFFF';
        const root = document.documentElement;
        root.style.setProperty('--path-color', color);
        root.style.setProperty('--path-glow', color + '4D');
    }
  }, [userProfile?.archetype]);

  useEffect(() => {
    const savedPath = localStorage.getItem('gb_path') as UserPath;
    const savedAuthToken = localStorage.getItem('gb_auth_token');
    
    if (savedAuthToken) {
      const db = getUserDB();
      const emailKey = Object.keys(db).find(key => savedAuthToken.includes(key));
      
      if (emailKey && db[emailKey] && db[emailKey].profile) {
         const record = db[emailKey];
         setUserProfile(record.profile);
         setIsAuthenticated(true);
         setQueriesUsed(record.queriesUsed);
         setIsPremium(record.isPremium);
         
         const isAdmin = record.profile.email === 'architect@source.code' || 
                         record.profile.email === 'admin@godsbrain.com' || 
                         record.profile.email === 'phoenix';

         if (isAdmin) {
             setIsAuthor(true);
             setOnboardingStep('COMPLETE'); 
         } else if (savedPath && Object.values(UserPath).includes(savedPath)) {
            setPath(savedPath);
            setOnboardingStep('COMPLETE'); 
         } else {
             setOnboardingStep('SHOWCASE');
         }
      } else {
        localStorage.removeItem('gb_auth_token');
        setOnboardingStep('PORTAL');
      }
    } else {
        setOnboardingStep('PORTAL');
    }

    setIsLoaded(true);
  }, []);

  const handleKeyClick = (num: number) => {
    playCosmicClick();
    if (punchCode.length < 4) {
      const newCode = [...punchCode, num.toString()];
      setPunchCode(newCode);
      if (newCode.length === 4) {
        if (newCode.join('') === CORRECT_CODE) {
          playNeuralLink();
          handleAuthorLogin();
          setShowPhoenixModal(false);
          setPunchCode([]);
        } else {
          playError();
          setTimeout(() => setPunchCode([]), 500);
        }
      }
    }
  };

  const handlePhoenixTrigger = () => {
    if (isAuthor) return;
    playDataOpen();
    setShowPhoenixModal(true);
    setPunchCode([]);
  };

  const triggerTransition = (targetStep: OnboardingStep, title?: string, steps?: string[]) => {
      setNextStep(targetStep);
      setTransitionTitle(title || "SYSTEM PROCESSING");
      setTransitionSteps(steps || ["Analyzing data...", "Synchronizing...", "Complete."]);
      setIsTransitioning(true);
  };

  const handleTransitionComplete = () => {
      if (nextStep) {
          setOnboardingStep(nextStep);
          setNextStep(null);
      }
      setIsTransitioning(false);
  };

  const handleGoBack = () => {
      if (onboardingStep === 'SHOWCASE') {
          handleLogout();
      } else if (onboardingStep === 'INIT') {
          setOnboardingStep('SHOWCASE');
      } else if (onboardingStep === 'REVEAL') {
          setOnboardingStep('INIT');
      } else if (onboardingStep === 'SKILL_INIT') {
          setOnboardingStep('REVEAL');
      } else if (onboardingStep === 'SYNTHESIS') {
          // If came from manual selection, go back to showcase
          if (calibrationProfile?.manual) {
              setOnboardingStep('SHOWCASE');
          } else {
              setOnboardingStep('SKILL_INIT');
          }
      } else if (onboardingStep === 'BUILDER') {
          if (path !== UserPath.NONE) {
              setOnboardingStep('COMPLETE');
          } else {
              setOnboardingStep('SYNTHESIS');
          }
      }
  };

  const handleLoginSuccess = (email: string) => {
    // FIX: Included neuralCredits in the UserProfile initialization.
    const profile: UserProfile = {
        name: email.split('@')[0],
        email: email,
        provider: 'email',
        avatar: undefined,
        level: 1,
        xp: 0,
        atp: 85,
        proteins: 420,
        voltage: 15,
        balance: 50,
        neuralCredits: 0
    };

    const db = getUserDB();
    const existingRecord = db[profile.email];

    if (existingRecord) {
        setQueriesUsed(existingRecord.queriesUsed);
        setIsPremium(existingRecord.isPremium);
        setUserProfile(existingRecord.profile);
        db[profile.email] = { ...existingRecord, lastLogin: Date.now() };
    } else {
        setQueriesUsed(0);
        setIsPremium(false);
        setUserProfile(profile);
        db[profile.email] = { profile: profile, queriesUsed: 0, isPremium: false, lastLogin: Date.now() };
    }
    
    saveUserDB(db);
    localStorage.setItem('gb_auth_token', `neural_token_${profile.email}_${Date.now()}`);
    setIsAuthenticated(true);

    if (email === 'architect@source.code' || email === 'admin@godsbrain.com' || email === 'phoenix') {
        handleAuthorLogin(); 
    } else {
        setWarpTarget('SHOWCASE');
        setWarpColor('cyan');
        setOnboardingStep('WARP');
    }
  };
  
  const handleShowcaseContinue = () => {
      triggerTransition('INIT', "INITIALIZING CALIBRATION", [
          "Loading core psychometric matrix...",
          "Phase 1: Identity Extraction...",
          "Sequence Ready."
      ]);
  };

  const handleManualArchetypeSelect = (id: string, skill: string) => {
      let selectedPath = UserPath.BLENDED;
      let colorName = 'purple';
      
      if (['SCIENTIST', 'ARCHITECT'].includes(id)) {
          selectedPath = UserPath.SCIENTIFIC;
          colorName = id === 'SCIENTIST' ? 'cyan' : 'rose';
      }
      if (['MYSTIC', 'SEEKER'].includes(id)) {
          selectedPath = UserPath.RELIGIOUS;
          colorName = id === 'MYSTIC' ? 'amber' : 'orange';
      }
      if (id === 'ALCHEMIST') {
          colorName = 'green';
      }
      
      setPath(selectedPath);
      setWarpColor(colorName);
      localStorage.setItem('gb_path', selectedPath);
      setArchetypeKey(id);

      // Prep Profile for Synthesis Screen
      setCalibrationProfile({
          finalArchetype: id,
          finalSkill: skill,
          manual: true // Flag to know we came from manual selection
      });

      handleUpdateProfile({ 
          archetype: id, 
          startingSkill: skill 
      });

      // FLOW FIX: Trigger WARP -> SYNTHESIS (Reveal) -> Then User clicks Accept to go to BUILDER
      setWarpTarget('SYNTHESIS');
      setOnboardingStep('WARP');
  };

  const handleUpdateProfile = (updates: Partial<UserProfile>) => {
      if (!userProfile) return;
      const updatedProfile = { ...userProfile, ...updates };
      setUserProfile(updatedProfile);
      
      const db = getUserDB();
      if (db[userProfile.email]) {
          db[userProfile.email].profile = updatedProfile;
          saveUserDB(db);
      }
  };

  const handleQueryIncrement = () => {
     if (!userProfile) return;
     const newCount = queriesUsed + 1;
     setQueriesUsed(newCount);
     const db = getUserDB();
     if (db[userProfile.email]) {
         db[userProfile.email].queriesUsed = newCount;
         saveUserDB(db);
     }
  };

  const handleArchetypeCalibrationComplete = (profile: any) => {
      setCalibrationProfile(profile);
      setArchetypeKey(profile.finalArchetype || 'ACTIVE_NODE');
      
      triggerTransition('REVEAL', "ANALYZING NEURAL ARCHITECTURE", [
          "Compiling core identity data...",
          "Archetype match detected.",
          "Generating profile..."
      ]);
  };

  const handleAcceptArchetype = (selectedPath: UserPath, color: string) => {
    setPath(selectedPath);
    setWarpColor(color);
    triggerTransition('SKILL_INIT', "IDENTITY INTEGRATED", [
        "Calibrating skill sub-processors...",
        "Phase 2: Functional Assessment...",
        "Ready."
    ]);
  };

  const handleSkillCalibrationComplete = (profileWithSkill: any) => {
      setCalibrationProfile(profileWithSkill);
      localStorage.setItem('gb_path', path);
      
      handleUpdateProfile({ 
          archetype: profileWithSkill.finalArchetype, 
          startingSkill: profileWithSkill.finalSkill 
      });

      triggerTransition('SYNTHESIS', "PROFILE SYNTHESIS", [
          "Merging identity and skill modules...",
          "Calculating metabolic synergy...",
          "Final Dossier Ready."
      ]);
  };

  const handleFinalAccept = () => {
      setWarpTarget('BUILDER');
      setOnboardingStep('WARP');
  };

  const handleWarpComplete = () => {
      setOnboardingStep(warpTarget);
  };

  const handleBuilderComplete = (avatarUrl: string) => {
      handleUpdateProfile({ avatar: avatarUrl });
      triggerTransition('COMPLETE', "SYSTEM UPLINK", [
          "Finalizing avatar integration...",
          "Connecting to God Brain Mainframe...",
          "Access Granted."
      ]);
  };

  const handlePremiumToggle = (status: boolean) => {
    setIsPremium(status);
    if (userProfile) {
        const db = getUserDB();
        if (db[userProfile.email]) {
            db[userProfile.email].isPremium = status;
            saveUserDB(db);
        }
    }
  };

  const handleAuthorLogin = () => {
    // FIX: Included neuralCredits in the author profile initialization.
    const authorProfile: UserProfile = {
        name: 'The Phoenix',
        email: 'architect@source.code',
        provider: 'email',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=Phoenix',
        level: 99,
        xp: 0,
        atp: 100,
        proteins: 1000,
        voltage: 24,
        archetype: 'ACTIVE_NODE',
        startingSkill: 'PHOENIX OVERRIDE',
        balance: 100,
        neuralCredits: 99999
    };
    
    setIsAuthor(true);
    setUserProfile(authorProfile);
    setIsAuthenticated(true);
    setIsPremium(true); 
    
    setPath(UserPath.BLENDED);
    localStorage.setItem('gb_path', UserPath.BLENDED);
    
    const db = getUserDB();
    db[authorProfile.email] = { profile: authorProfile, queriesUsed: 0, isPremium: true, lastLogin: Date.now() };
    saveUserDB(db);
    localStorage.setItem('gb_auth_token', `neural_token_${authorProfile.email}_${Date.now()}`);

    if (onboardingStep !== 'COMPLETE') {
        setWarpTarget('COMPLETE');
        setWarpColor('amber');
        setOnboardingStep('WARP');
    }
  };

  const handleLogout = () => {
    setPath(UserPath.NONE);
    setIsAuthenticated(false);
    setIsAuthor(false);
    setUserProfile(undefined);
    setQueriesUsed(0);
    setOnboardingStep('PORTAL');
    localStorage.removeItem('gb_path');
    localStorage.removeItem('gb_auth_token');
  };

  const handleEditNeuron = () => {
      if (userProfile) {
          setArchetypeKey(userProfile.archetype || 'ACTIVE_NODE');
          triggerTransition('BUILDER', "RE-INITIALIZING BIO-FORGE", [
              "Loading current configuration...",
              "Accessing genetic memory...",
              "Editor Ready."
          ]);
      }
  };

  if (!isLoaded) return null;

  return (
    <div className="h-screen w-screen text-[#e0f2fe] font-sans relative overflow-hidden bg-black">
      
      <CosmicBackground path={path} />
      <GlobalBackgroundAudio autoPlay={true} />
      
      <ProgressionProvider user={userProfile} onUpdate={handleUpdateProfile}>
          {isTransitioning && (
              <TransitionScreen 
                  onComplete={handleTransitionComplete} 
                  title={transitionTitle} 
                  steps={transitionSteps}
              />
          )}

          {onboardingStep === 'WARP' && (
              <WarpScreen color={warpColor} onComplete={handleWarpComplete} />
          )}

          {/* PHOENIX OVERRIDE "SQUARE MENU" PUNCH CODE */}
          {showPhoenixModal && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 animate-fadeIn">
                  <div className="absolute inset-0 bg-black/95 backdrop-blur-md" onClick={() => setShowPhoenixModal(false)}></div>
                  <div className="relative w-full max-w-sm bg-black border border-amber-500/50 rounded-[2rem] p-10 shadow-[0_0_80px_rgba(255,191,0,0.4)] overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-amber-500 shadow-[0_0_20px_#FFBF00]"></div>
                      <div className="text-center mb-8">
                          <div className="w-16 h-16 bg-amber-500/10 rounded-full border border-amber-500/30 flex items-center justify-center mx-auto mb-4">
                              <Flame className="text-amber-500 w-8 h-8" />
                          </div>
                          <h2 className="text-2xl font-tech text-white uppercase tracking-widest leading-none">Phoenix Override</h2>
                          <p className="text-[10px] text-amber-500/60 uppercase font-mono tracking-widest mt-2">Punch in Authorization Code</p>
                      </div>

                      {/* Display current punch code dots */}
                      <div className="flex justify-center gap-4 mb-8">
                          {[0, 1, 2, 3].map(i => (
                              <div key={i} className={`w-3 h-3 rounded-full border border-amber-500/30 transition-all ${punchCode.length > i ? 'bg-amber-500 shadow-[0_0_10px_#FFBF00]' : 'bg-transparent'}`}></div>
                          ))}
                      </div>

                      {/* Numeric Grid */}
                      <div className="grid grid-cols-3 gap-3">
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                              <button 
                                key={num}
                                onClick={() => handleKeyClick(num)}
                                className="h-16 bg-amber-500/5 border border-amber-500/20 rounded-xl font-tech text-xl text-white hover:bg-amber-500/20 hover:border-amber-500/50 transition-all active:scale-95 flex items-center justify-center shadow-inner"
                              >
                                  {num}
                              </button>
                          ))}
                          <button 
                            onClick={() => setPunchCode([])}
                            className="h-16 bg-red-900/10 border border-red-500/30 rounded-xl font-tech text-[10px] text-red-500 hover:bg-red-500/20 transition-all flex items-center justify-center"
                          >
                              CLR
                          </button>
                          <button 
                            onClick={() => handleKeyClick(0)}
                            className="h-16 bg-amber-500/5 border border-amber-500/20 rounded-xl font-tech text-xl text-white hover:bg-amber-500/20 hover:border-amber-500/50 transition-all active:scale-95 flex items-center justify-center shadow-inner"
                          >
                              0
                          </button>
                          <button 
                            onClick={() => setShowPhoenixModal(false)}
                            className="h-16 bg-gray-900/40 border border-white/10 rounded-xl font-tech text-[10px] text-gray-400 hover:bg-gray-800 transition-all flex items-center justify-center"
                          >
                              <X size={14} />
                          </button>
                      </div>

                      <div className="mt-8 text-center">
                          <p className="text-[8px] text-gray-600 font-mono uppercase tracking-[0.3em]">Administrator Session Required</p>
                      </div>
                  </div>
              </div>
          )}

          <div className="relative z-10 h-full w-full overflow-hidden">
            {onboardingStep === 'PORTAL' && (
                <LoginPortal onLoginSuccess={handleLoginSuccess} />
            )}
            
            {onboardingStep === 'SHOWCASE' && userProfile && (
                <ArchetypeShowcase 
                    onContinue={handleShowcaseContinue}
                    onManualSelect={handleManualArchetypeSelect}
                />
            )}
            
            {onboardingStep === 'INIT' && userProfile && (
                <NeuralInit 
                    mode="ARCHETYPE"
                    userName={userProfile.name} 
                    onComplete={handleArchetypeCalibrationComplete} 
                    onBack={handleGoBack}
                />
            )}

            {onboardingStep === 'REVEAL' && (
                <ArchetypeReveal 
                    profile={calibrationProfile} 
                    onAccept={handleAcceptArchetype} 
                    onBack={handleGoBack}
                />
            )}

            {onboardingStep === 'SKILL_INIT' && userProfile && (
                <NeuralInit 
                    mode="SKILL"
                    userName={userProfile.name} 
                    onComplete={handleSkillCalibrationComplete} 
                    onBack={handleGoBack}
                    existingProfile={calibrationProfile}
                />
            )}

            {onboardingStep === 'SYNTHESIS' && (
                <FinalReveal 
                    profile={calibrationProfile} 
                    onAccept={handleFinalAccept} 
                    onBack={handleGoBack}
                />
            )}

            {onboardingStep === 'BUILDER' && (
                <NeuronBuilder 
                    archetype={archetypeKey} 
                    onComplete={handleBuilderComplete} 
                    onUpdateProfile={handleUpdateProfile}
                    onBack={handleGoBack}
                    isUnlocked={effectiveIsPremium}
                    user={userProfile}
                />
            )}

            {onboardingStep === 'COMPLETE' && (
              <Dashboard 
                path={path} 
                isPremium={effectiveIsPremium} 
                onPremiumToggle={handlePremiumToggle}
                onLogout={handleLogout} 
                isAuthor={isAuthor}
                onAuthorLogin={handleAuthorLogin}
                user={userProfile}
                onUpdateProfile={handleUpdateProfile}
                queriesUsed={queriesUsed}
                onQuery={handleQueryIncrement}
                onEditNeuron={handleEditNeuron}
                onPhoenixTrigger={handlePhoenixTrigger}
              />
            )}
          </div>
      </ProgressionProvider>

      <style>{`
        @keyframes scaleIn {
          0% { transform: scale(0.95); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-scaleIn {
          animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .text-shadow-glow {
            text-shadow: 0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3);
        }
      `}</style>
      
    </div>
  );
};

const App: React.FC = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;
