/**
 * IntelliOS Web Audio API Synthesis Engine
 * Synthesizes procedural sci-fi sound effects and focus frequencies dynamically in the browser.
 */

class SynthAudioEngine {
  private ctx: AudioContext | null = null;
  
  // Oscillators for persistent focus hums
  private oscPrimary: OscillatorNode | null = null;
  private oscSecondary: OscillatorNode | null = null;
  private lfo: OscillatorNode | null = null;
  private volumeNode: GainNode | null = null;

  // Track state
  public isHumActive: boolean = false;
  private humType: 'cabin' | 'schumann' | 'omega' | 'none' = 'none';
  private currentVolumeVal: number = 0.25;

  private initContext() {
    if (!this.ctx) {
      // Create cross-browser AudioContext
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    // Resume context if suspended (browser security blocks auto-start)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  /**
   * Synthesize interactive UI micro-sound effects
   */
  public playTonalSFX(type: 'click' | 'compile' | 'success' | 'alert' | 'flush') {
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const mainGain = this.ctx.createGain();
      mainGain.connect(this.ctx.destination);

      switch (type) {
        case 'click': {
          // Sharp, short, high-frequency sci-fi click
          const osc = this.ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(2400, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);

          mainGain.gain.setValueAtTime(0.04 * this.currentVolumeVal, now);
          mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

          osc.connect(mainGain);
          osc.start(now);
          osc.stop(now + 0.06);
          break;
        }
        case 'compile': {
          // Accelerating sweep up representing code compilation progress
          const osc = this.ctx.createOscillator();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.linearRampToValueAtTime(680, now + 0.35);

          // Add a minor high harmony oscillator
          const harmony = this.ctx.createOscillator();
          harmony.type = 'sine';
          harmony.frequency.setValueAtTime(360, now);
          harmony.frequency.linearRampToValueAtTime(1360, now + 0.35);

          mainGain.gain.setValueAtTime(0.0, now);
          mainGain.gain.linearRampToValueAtTime(0.06 * this.currentVolumeVal, now + 0.08);
          mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          osc.connect(mainGain);
          harmony.connect(mainGain);

          osc.start(now);
          harmony.start(now);

          osc.stop(now + 0.36);
          harmony.stop(now + 0.36);
          break;
        }
        case 'success': {
          // Golden double chord sweep (arpeggio) representing compilation complete/save success
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          osc1.type = 'sine';
          osc2.type = 'sine';

          osc1.frequency.setValueAtTime(523.25, now); // C5
          osc1.frequency.setValueAtTime(659.25, now + 0.08); // E5
          osc1.frequency.setValueAtTime(783.99, now + 0.16); // G5
          osc1.frequency.setValueAtTime(1046.50, now + 0.24); // C6

          osc2.frequency.setValueAtTime(261.63, now); // C4
          osc2.frequency.exponentialRampToValueAtTime(523.25, now + 0.3);

          mainGain.gain.setValueAtTime(0.0, now);
          mainGain.gain.linearRampToValueAtTime(0.08 * this.currentVolumeVal, now + 0.1);
          mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

          osc1.connect(mainGain);
          osc2.connect(mainGain);

          osc1.start(now);
          osc2.start(now);

          osc1.stop(now + 0.5);
          osc2.stop(now + 0.5);
          break;
        }
        case 'alert': {
          // Rapid warning chime
          const osc = this.ctx.createOscillator();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(880, now);
          
          // Frequency wobble
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.setValueAtTime(660, now + 0.12);
          osc.frequency.setValueAtTime(880, now + 0.24);

          // Deep lowpass filter to make it sound premium and cockpit-like instead of cheap
          const filter = this.ctx.createBiquadFilter();
          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1100, now);

          mainGain.gain.setValueAtTime(0.05 * this.currentVolumeVal, now);
          mainGain.gain.setValueAtTime(0.02 * this.currentVolumeVal, now + 0.12);
          mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          osc.connect(filter);
          filter.connect(mainGain);

          osc.start(now);
          osc.stop(now + 0.36);
          break;
        }
        case 'flush': {
          // Noise-like static bubble sweep representing flushing database buffers
          const bufferSize = this.ctx.sampleRate * 0.35;
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          
          // Generate white noise data
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }

          const noiseNode = this.ctx.createBufferSource();
          noiseNode.buffer = buffer;

          // Standard bandpass sweep to isolate the sound
          const bandpass = this.ctx.createBiquadFilter();
          bandpass.type = 'bandpass';
          bandpass.Q.setValueAtTime(8.0, now);
          bandpass.frequency.setValueAtTime(350, now);
          bandpass.frequency.exponentialRampToValueAtTime(1800, now + 0.3);

          mainGain.gain.setValueAtTime(0.0, now);
          mainGain.gain.linearRampToValueAtTime(0.08 * this.currentVolumeVal, now + 0.05);
          mainGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

          noiseNode.connect(bandpass);
          bandpass.connect(mainGain);

          noiseNode.start(now);
          noiseNode.stop(now + 0.35);
          break;
        }
      }
    } catch (e) {
      console.warn("Synth Audio Engine sound compilation error:", e);
    }
  }

  /**
   * Set Synth Focus Hum Volume
   */
  public setHumVolume(gain: number) {
    this.currentVolumeVal = gain;
    if (this.volumeNode && this.ctx) {
      const now = this.ctx.currentTime;
      this.volumeNode.gain.linearRampToValueAtTime(gain * 0.15, now + 0.1);
    }
  }

  /**
   * Toggle persistent focus loops (Deep cabin loop, Schumann wave, Solfeggio logic)
   */
  public startAmbientHum(type: 'cabin' | 'schumann' | 'omega' | 'none') {
    try {
      this.initContext();
      if (!this.ctx) return;
      
      this.stopAmbientHum();
      this.humType = type;

      if (type === 'none') {
        this.isHumActive = false;
        return;
      }

      this.isHumActive = true;
      const now = this.ctx.currentTime;

      // Create Volume limiter specifically
      this.volumeNode = this.ctx.createGain();
      this.volumeNode.gain.setValueAtTime(0, now);
      this.volumeNode.connect(this.ctx.destination);

      // Create main oscillators
      this.oscPrimary = this.ctx.createOscillator();
      this.oscSecondary = this.ctx.createOscillator();

      // Create Low Pass Filter to make hum relaxing and premium
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = 'lowpass';
      lowpass.frequency.setValueAtTime(450, now);

      // Connect paths
      this.oscPrimary.connect(lowpass);
      this.oscSecondary.connect(lowpass);
      lowpass.connect(this.volumeNode);

      // Configure frequencies
      if (type === 'schumann') {
        // Deep cosmic state: 432 Hz Solfeggio paired with a subtle detuned lower node (144Hz)
        this.oscPrimary.type = 'sine';
        this.oscPrimary.frequency.setValueAtTime(432, now);

        this.oscSecondary.type = 'sine';
        this.oscSecondary.frequency.setValueAtTime(144, now);

        // Add a pulsing low frequency scheduler
        this.lfo = this.ctx.createOscillator();
        this.lfo.type = 'sine';
        this.lfo.frequency.setValueAtTime(0.12, now); // 0.12 Hz pulsing cycle

        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(2.5, now);

        this.lfo.connect(lfoGain);
        lfoGain.connect(this.oscPrimary.frequency); // Wobbles 432Hz focus point

        this.lfo.start(now);
      } else if (type === 'cabin') {
        // Space Cockpit Engine: Dual detuned low sawtooth oscillators with resonant filtering
        this.oscPrimary.type = 'triangle';
        this.oscPrimary.frequency.setValueAtTime(80, now);

        this.oscSecondary.type = 'sawtooth';
        this.oscSecondary.frequency.setValueAtTime(81.5, now);

        lowpass.Q.setValueAtTime(4.0, now);
        lowpass.frequency.setValueAtTime(150, now);
      } else if (type === 'omega') {
        // High-level concentration frequency wave: Solfeggio logic at 528 Hz
        this.oscPrimary.type = 'sine';
        this.oscPrimary.frequency.setValueAtTime(528, now);

        this.oscSecondary.type = 'sine';
        this.oscSecondary.frequency.setValueAtTime(264, now);

        this.lfo = this.ctx.createOscillator();
        this.lfo.type = 'sine';
        this.lfo.frequency.setValueAtTime(0.2, now); // Pulse weight

        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(1.5, now);

        this.lfo.connect(lfoGain);
        lfoGain.connect(this.oscPrimary.frequency);
        
        this.lfo.start(now);
      }

      // Start frequencies with a smooth fade in to protect users from audio surprises!
      this.oscPrimary.start(now);
      this.oscSecondary.start(now);

      this.volumeNode.gain.linearRampToValueAtTime(this.currentVolumeVal * 0.15, now + 1.2);
    } catch(e) {
      console.warn("Ambient hum initialization warning:", e);
    }
  }

  /**
   * Disables any standing oscillators or focus noise
   */
  public stopAmbientHum() {
    try {
      const stopTargetNodes = () => {
        if (this.oscPrimary) {
          try { this.oscPrimary.stop(); } catch(e){}
          this.oscPrimary.disconnect();
          this.oscPrimary = null;
        }
        if (this.oscSecondary) {
          try { this.oscSecondary.stop(); } catch(e){}
          this.oscSecondary.disconnect();
          this.oscSecondary = null;
        }
        if (this.lfo) {
          try { this.lfo.stop(); } catch(e){}
          this.lfo.disconnect();
          this.lfo = null;
        }
        if (this.volumeNode) {
          this.volumeNode.disconnect();
          this.volumeNode = null;
        }
      };

      if (this.ctx && this.volumeNode) {
        const now = this.ctx.currentTime;
        // Smoothly fade-out sound, then dismantle nodes in index
        this.volumeNode.gain.setValueAtTime(this.volumeNode.gain.value, now);
        this.volumeNode.gain.linearRampToValueAtTime(0, now + 0.3);
        
        setTimeout(() => {
          stopTargetNodes();
        }, 310);
      } else {
        stopTargetNodes();
      }

      this.isHumActive = false;
      this.humType = 'none';
    } catch(e) {
      console.warn("Dismantling sound oscillators error:", e);
    }
  }

  public getHumType() {
    return this.humType;
  }
}

export const SynthEngine = new SynthAudioEngine();
