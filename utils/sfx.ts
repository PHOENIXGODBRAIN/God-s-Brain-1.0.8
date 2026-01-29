// --- GOD'S BRAIN SONIC ARCHITECTURE ---
// Real-time synthesized UI sounds for maximum responsiveness and "neurological" feel.

let audioCtx: AudioContext | null = null;

const getCtx = () => {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioCtx;
};

/**
 * Standard Interaction Sound (Click/Toggle)
 * A sharp, clean "vacuum seal" snap.
 * Use for: Simple buttons, toggles, closing modals.
 */
export const playCosmicClick = () => {
    try {
        const ctx = getCtx();
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        // Sine wave with a rapid frequency drop for "weight"
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.08);
        
        // Rapid attack and decay
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
    } catch (e) {
        // Silent fail for unsupported environments
    }
};

/**
 * Menu/Tab Selection Sound
 * A "liquid" crystal tone. Smooth, high-tech, non-intrusive.
 * Use for: Switching main tabs, selecting frequencies.
 */
export const playMenuSelect = () => {
    try {
        const ctx = getCtx();
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        // Smooth sine wave, slight pitch bend down
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.15);
        
        // Softer attack, longer tail than the click
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
        // Silent fail
    }
};

/**
 * Data Access Sound
 * A sharp "computing" chirp.
 * Use for: Opening chapters, Sending AI messages, Loading maps.
 */
export const playDataOpen = () => {
    try {
        const ctx = getCtx();
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        // Triangle wave for a more "digital" texture
        osc.type = 'triangle';
        // Rapid sweep up
        osc.frequency.setValueAtTime(1000, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(2500, ctx.currentTime + 0.1);
        
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.1);
    } catch (e) {
        // Silent fail
    }
};

/**
 * Error / Denial Sound
 * A low, discordant buzz.
 * Use for: Locked content, Wrong PIN.
 */
export const playError = () => {
    try {
        const ctx = getCtx();
        if (ctx.state === 'suspended') ctx.resume();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        // Sawtooth for "harshness"
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);
        
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
    } catch (e) {
        // Silent fail
    }
};

/**
 * Major Action Sound (Upgrade/Connect/Unlock)
 * A harmonic triad chord with a long reverb tail.
 * Frequencies chosen to resonate with the 'E Major' uplifting quality.
 */
export const playNeuralLink = () => {
    try {
        const ctx = getCtx();
        if (ctx.state === 'suspended') ctx.resume();

        // E Major Triad (E4, G#4, B4)
        const freqs = [329.63, 415.30, 493.88]; 
        
        freqs.forEach((f, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, ctx.currentTime);
            
            // Staggered entry for "arpeggio" feel
            const startTime = ctx.currentTime + (i * 0.02);
            
            gain.gain.setValueAtTime(0, startTime);
            gain.gain.linearRampToValueAtTime(0.05, startTime + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(startTime);
            osc.stop(startTime + 1.0);
        });
    } catch (e) {
        // Silent fail
    }
};