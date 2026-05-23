class SynthAudioEngine {
  ctx = null;
  // Oscillators for persistent focus hums
  oscPrimary = null;
  oscSecondary = null;
  lfo = null;
  volumeNode = null;
  // Track state
  isHumActive = false;
  humType = "none";
  currentVolumeVal = 0.25;
  initContext() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }
  /**
   * Synthesize interactive UI micro-sound effects
   */
  playTonalSFX(type) {
    try {
      this.initContext();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const mainGain = this.ctx.createGain();
      mainGain.connect(this.ctx.destination);
      switch (type) {
        case "click": {
          const osc = this.ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.setValueAtTime(2400, now);
          osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
          mainGain.gain.setValueAtTime(0.04 * this.currentVolumeVal, now);
          mainGain.gain.exponentialRampToValueAtTime(1e-3, now + 0.05);
          osc.connect(mainGain);
          osc.start(now);
          osc.stop(now + 0.06);
          break;
        }
        case "compile": {
          const osc = this.ctx.createOscillator();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.linearRampToValueAtTime(680, now + 0.35);
          const harmony = this.ctx.createOscillator();
          harmony.type = "sine";
          harmony.frequency.setValueAtTime(360, now);
          harmony.frequency.linearRampToValueAtTime(1360, now + 0.35);
          mainGain.gain.setValueAtTime(0, now);
          mainGain.gain.linearRampToValueAtTime(0.06 * this.currentVolumeVal, now + 0.08);
          mainGain.gain.exponentialRampToValueAtTime(1e-3, now + 0.35);
          osc.connect(mainGain);
          harmony.connect(mainGain);
          osc.start(now);
          harmony.start(now);
          osc.stop(now + 0.36);
          harmony.stop(now + 0.36);
          break;
        }
        case "success": {
          const osc1 = this.ctx.createOscillator();
          const osc2 = this.ctx.createOscillator();
          osc1.type = "sine";
          osc2.type = "sine";
          osc1.frequency.setValueAtTime(523.25, now);
          osc1.frequency.setValueAtTime(659.25, now + 0.08);
          osc1.frequency.setValueAtTime(783.99, now + 0.16);
          osc1.frequency.setValueAtTime(1046.5, now + 0.24);
          osc2.frequency.setValueAtTime(261.63, now);
          osc2.frequency.exponentialRampToValueAtTime(523.25, now + 0.3);
          mainGain.gain.setValueAtTime(0, now);
          mainGain.gain.linearRampToValueAtTime(0.08 * this.currentVolumeVal, now + 0.1);
          mainGain.gain.exponentialRampToValueAtTime(1e-3, now + 0.5);
          osc1.connect(mainGain);
          osc2.connect(mainGain);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.5);
          osc2.stop(now + 0.5);
          break;
        }
        case "alert": {
          const osc = this.ctx.createOscillator();
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.setValueAtTime(880, now);
          osc.frequency.setValueAtTime(660, now + 0.12);
          osc.frequency.setValueAtTime(880, now + 0.24);
          const filter = this.ctx.createBiquadFilter();
          filter.type = "lowpass";
          filter.frequency.setValueAtTime(1100, now);
          mainGain.gain.setValueAtTime(0.05 * this.currentVolumeVal, now);
          mainGain.gain.setValueAtTime(0.02 * this.currentVolumeVal, now + 0.12);
          mainGain.gain.exponentialRampToValueAtTime(1e-3, now + 0.35);
          osc.connect(filter);
          filter.connect(mainGain);
          osc.start(now);
          osc.stop(now + 0.36);
          break;
        }
        case "flush": {
          const bufferSize = this.ctx.sampleRate * 0.35;
          const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
          }
          const noiseNode = this.ctx.createBufferSource();
          noiseNode.buffer = buffer;
          const bandpass = this.ctx.createBiquadFilter();
          bandpass.type = "bandpass";
          bandpass.Q.setValueAtTime(8, now);
          bandpass.frequency.setValueAtTime(350, now);
          bandpass.frequency.exponentialRampToValueAtTime(1800, now + 0.3);
          mainGain.gain.setValueAtTime(0, now);
          mainGain.gain.linearRampToValueAtTime(0.08 * this.currentVolumeVal, now + 0.05);
          mainGain.gain.exponentialRampToValueAtTime(1e-3, now + 0.35);
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
  setHumVolume(gain) {
    this.currentVolumeVal = gain;
    if (this.volumeNode && this.ctx) {
      const now = this.ctx.currentTime;
      this.volumeNode.gain.linearRampToValueAtTime(gain * 0.15, now + 0.1);
    }
  }
  /**
   * Toggle persistent focus loops (Deep cabin loop, Schumann wave, Solfeggio logic)
   */
  startAmbientHum(type) {
    try {
      this.initContext();
      if (!this.ctx) return;
      this.stopAmbientHum();
      this.humType = type;
      if (type === "none") {
        this.isHumActive = false;
        return;
      }
      this.isHumActive = true;
      const now = this.ctx.currentTime;
      this.volumeNode = this.ctx.createGain();
      this.volumeNode.gain.setValueAtTime(0, now);
      this.volumeNode.connect(this.ctx.destination);
      this.oscPrimary = this.ctx.createOscillator();
      this.oscSecondary = this.ctx.createOscillator();
      const lowpass = this.ctx.createBiquadFilter();
      lowpass.type = "lowpass";
      lowpass.frequency.setValueAtTime(450, now);
      this.oscPrimary.connect(lowpass);
      this.oscSecondary.connect(lowpass);
      lowpass.connect(this.volumeNode);
      if (type === "schumann") {
        this.oscPrimary.type = "sine";
        this.oscPrimary.frequency.setValueAtTime(432, now);
        this.oscSecondary.type = "sine";
        this.oscSecondary.frequency.setValueAtTime(144, now);
        this.lfo = this.ctx.createOscillator();
        this.lfo.type = "sine";
        this.lfo.frequency.setValueAtTime(0.12, now);
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(2.5, now);
        this.lfo.connect(lfoGain);
        lfoGain.connect(this.oscPrimary.frequency);
        this.lfo.start(now);
      } else if (type === "cabin") {
        this.oscPrimary.type = "triangle";
        this.oscPrimary.frequency.setValueAtTime(80, now);
        this.oscSecondary.type = "sawtooth";
        this.oscSecondary.frequency.setValueAtTime(81.5, now);
        lowpass.Q.setValueAtTime(4, now);
        lowpass.frequency.setValueAtTime(150, now);
      } else if (type === "omega") {
        this.oscPrimary.type = "sine";
        this.oscPrimary.frequency.setValueAtTime(528, now);
        this.oscSecondary.type = "sine";
        this.oscSecondary.frequency.setValueAtTime(264, now);
        this.lfo = this.ctx.createOscillator();
        this.lfo.type = "sine";
        this.lfo.frequency.setValueAtTime(0.2, now);
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.setValueAtTime(1.5, now);
        this.lfo.connect(lfoGain);
        lfoGain.connect(this.oscPrimary.frequency);
        this.lfo.start(now);
      }
      this.oscPrimary.start(now);
      this.oscSecondary.start(now);
      this.volumeNode.gain.linearRampToValueAtTime(this.currentVolumeVal * 0.15, now + 1.2);
    } catch (e) {
      console.warn("Ambient hum initialization warning:", e);
    }
  }
  /**
   * Disables any standing oscillators or focus noise
   */
  stopAmbientHum() {
    try {
      const stopTargetNodes = () => {
        if (this.oscPrimary) {
          try {
            this.oscPrimary.stop();
          } catch (e) {
          }
          this.oscPrimary.disconnect();
          this.oscPrimary = null;
        }
        if (this.oscSecondary) {
          try {
            this.oscSecondary.stop();
          } catch (e) {
          }
          this.oscSecondary.disconnect();
          this.oscSecondary = null;
        }
        if (this.lfo) {
          try {
            this.lfo.stop();
          } catch (e) {
          }
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
        this.volumeNode.gain.setValueAtTime(this.volumeNode.gain.value, now);
        this.volumeNode.gain.linearRampToValueAtTime(0, now + 0.3);
        setTimeout(() => {
          stopTargetNodes();
        }, 310);
      } else {
        stopTargetNodes();
      }
      this.isHumActive = false;
      this.humType = "none";
    } catch (e) {
      console.warn("Dismantling sound oscillators error:", e);
    }
  }
  getHumType() {
    return this.humType;
  }
}
export const SynthEngine = new SynthAudioEngine();
