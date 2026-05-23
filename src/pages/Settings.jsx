import { useState } from "react";
import { motion } from "motion/react";
import {
  User,
  Cpu,
  Layers,
  Save,
  Check,
  ShieldCheck,
  Volume2,
  VolumeX,
  Music,
  Palette,
  Terminal
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getThemeColors, THEME_PRESETS } from "../lib/theme";
export const Settings = () => {
  const {
    userProfile,
    setUserProfile,
    addActivity,
    engineTheme,
    setEngineTheme,
    synthHum,
    setSynthHum,
    audioFeedback,
    setAudioFeedback,
    synthVol,
    setSynthVol,
    playSfx
  } = useApp();
  const themeColors = getThemeColors(engineTheme);
  const [profileName, setProfileName] = useState(userProfile.name);
  const [profileEmail, setProfileEmail] = useState(userProfile.email);
  const [profileRole, setProfileRole] = useState(userProfile.role);
  const [profileAvatar, setProfileAvatar] = useState(userProfile.avatar);
  const [profileModel, setProfileModel] = useState(userProfile.geminiModel);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(userProfile.autoSave);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const availableAvatars = ["\u{1F680}", "\u{1F9E0}", "\u{1F47E}", "\u26A1", "\u{1F310}", "\u{1F4BB}", "\u{1F52E}"];
  const handleSave = (e) => {
    e.preventDefault();
    setUserProfile({
      name: profileName,
      email: profileEmail,
      role: profileRole,
      avatar: profileAvatar,
      geminiModel: profileModel,
      openaiKeyPreset: userProfile.openaiKeyPreset,
      theme: userProfile.theme,
      autoSave: autoSaveEnabled
    });
    playSfx("success");
    addActivity("system", "System controls updated", `Modified profile configurations recursively`);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2e3);
  };
  const handleThemeChange = (selectedTheme) => {
    setEngineTheme(selectedTheme);
    const preset = THEME_PRESETS[selectedTheme];
    if (audioFeedback) {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          const tCtx = new AudioContextClass();
          const osc = tCtx.createOscillator();
          const gain = tCtx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(600, tCtx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(1200, tCtx.currentTime + 0.1);
          gain.gain.setValueAtTime(0.04, tCtx.currentTime);
          gain.gain.linearRampToValueAtTime(1e-3, tCtx.currentTime + 0.1);
          osc.connect(gain);
          gain.connect(tCtx.destination);
          osc.start();
          osc.stop(tCtx.currentTime + 0.1);
        }
      } catch (e) {
      }
    }
    addActivity("system", "System theme updated", `Active cockpit engine swaped to [${preset.name}]`);
  };
  const handleHumChange = (type) => {
    playSfx("click");
    setSynthHum(type);
    addActivity("system", "Cognitive soundwave changed", `Ambient oscillator set to [${type.toUpperCase()}]`);
  };
  const handleFeedbackToggle = () => {
    const nextVal = !audioFeedback;
    setAudioFeedback(nextVal);
    if (nextVal) {
      try {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
          const tCtx = new AudioContextClass();
          const osc = tCtx.createOscillator();
          const gain = tCtx.createGain();
          osc.frequency.setValueAtTime(1800, tCtx.currentTime);
          gain.gain.setValueAtTime(0.05, tCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(1e-3, tCtx.currentTime + 0.04);
          osc.connect(gain);
          gain.connect(tCtx.destination);
          osc.start();
          osc.stop(tCtx.currentTime + 0.05);
        }
      } catch (e) {
      }
    }
    addActivity("system", "UI sound preferences modified", `Click alarms turned ${nextVal ? "ON" : "OFF"}`);
  };
  const ambientHumOptions = [
    { id: "none", label: "SILENT RUN", desc: "Dismantle Web Audio oscillators" },
    { id: "schumann", label: "SCHUMANN WAVE", desc: "432 Hz Solfeggio mental focus pulse" },
    { id: "cabin", label: "COSMIC CABIN", desc: "Detuned lower-frequency cockpit engine" },
    { id: "omega", label: "CONCENTRATION OMEGA", desc: "528 Hz theta mind wave synchronization" }
  ];
  return <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-6 text-left select-none max-w-4xl mx-auto"
  >
      
      {
    /* 2026 TOP BANNER PREVIEW ACCENTS */
  }
      <div className="p-6 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-900 rounded-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[60px] pointer-events-none`} style={{ backgroundColor: `rgba(${themeColors.rawRGB}, 0.04)` }} />
        
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold text-zinc-500 uppercase tracking-widest bg-zinc-900/60 p-1 px-2 rounded-md border border-zinc-800 self-start w-fit">
            <Terminal className="w-3 h-3 text-zinc-400" /> SYSTEM COCKPIT CALIBRATION
          </div>
          <h2 className="font-display font-semibold text-lg text-zinc-100 mt-2">
            Configure IntelliOS core nodes rules
          </h2>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-xl">
            Tweak graphical color matrices, establish acoustic binaural soundscapes to block cognitive distractions, and configure user identity. All states persist securely to local caches.
          </p>
        </div>
      </div>

      {
    /* THREE INTERACTIVE COLUMN SECTIONS */
  }
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {
    /* SECTION A: GRAPHICS & COSMETICS COLORWAY MATRIX */
  }
        <div className="p-6 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-900/60">
            <div className="flex items-center gap-2.5">
              <Palette className={`w-4.5 h-4.5 ${themeColors.textAccent}`} />
              <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-sans">Visual Cockpit Theme</h3>
            </div>
            <span className="text-[10px] font-mono text-zinc-650 font-bold uppercase">RENDER CORES</span>
          </div>

          <p className="text-xs text-zinc-400 font-sans leading-normal">
            Select a custom neon resonance colorway. The entire interface, navigation indicators, loading grids, and holographic maps morph instantly to match.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {Object.keys(THEME_PRESETS).map((themeKey) => {
    const preset = THEME_PRESETS[themeKey];
    const isActive = engineTheme === themeKey;
    return <button
      key={themeKey}
      type="button"
      onClick={() => handleThemeChange(themeKey)}
      className={`p-3.5 rounded-xl border text-left transition-all duration-200 select-none cursor-pointer flex flex-col justify-between h-24 ${isActive ? "bg-zinc-900 text-white shadow-md" : "bg-zinc-950/40 hover:bg-zinc-900/40 border-zinc-950 hover:border-zinc-800 text-zinc-400 hover:text-zinc-200"}`}
      style={{
        borderColor: isActive ? `rgba(${preset.rawRGB}, 0.4)` : void 0,
        boxShadow: isActive ? `0 0 10px rgba(${preset.rawRGB}, 0.08)` : void 0
      }}
    >
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[10px] font-mono font-bold tracking-brand text-zinc-500">
                      [{preset.badge}]
                    </span>
                    {isActive && <span className="w-2 h-2 rounded-full" style={{ backgroundColor: `rgb(${preset.rawRGB})` }} />}
                  </div>

                  <div className="mt-auto">
                    <span className={`text-[12px] font-display font-medium block leading-none ${isActive ? preset.textAccent : ""}`}>
                      {preset.name}
                    </span>
                  </div>
                </button>;
  })}
          </div>
        </div>

        {
    /* SECTION B: COGNITIVE SOUND SYNTHESIZER CONSOLE */
  }
        <div className="p-6 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-4 shadow-xl relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-zinc-900/60">
              <div className="flex items-center gap-2.5">
                <Music className={`w-4.5 h-4.5 ${themeColors.textAccent}`} />
                <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-sans">Procedural Acoustic Synth</h3>
              </div>
              <span className="text-[10px] font-mono text-zinc-650 font-bold uppercase">WEB AUDIO</span>
            </div>

            <p className="text-xs text-zinc-400 font-sans leading-relaxed mt-2">
              Synthesizes real-time low frequency binaural audio oscillations to create a distraction-free work environment.
            </p>

            {
    /* Ambient Loops buttons */
  }
            <div className="space-y-2.5 mt-4">
              <span className="text-[9px] font-mono text-zinc-500 tracking-wider block uppercase">ACTIVE BINAURAL FREQUENCY WAVE</span>
              <div className="grid grid-cols-2 gap-2">
                {ambientHumOptions.map((opt) => {
    const isActive = synthHum === opt.id;
    return <button
      key={opt.id}
      type="button"
      onClick={() => handleHumChange(opt.id)}
      className={`p-2 px-3 text-[11px] font-sans rounded-xl border text-left cursor-pointer transition-all duration-150 flex flex-col justify-between min-h-[58px] ${isActive ? "bg-zinc-900 text-white" : "bg-zinc-950/45 hover:bg-zinc-900/35 border-transparent hover:border-zinc-850 text-zinc-400 hover:text-zinc-200"}`}
      style={{
        borderColor: isActive ? `rgba(${themeColors.rawRGB}, 0.25)` : void 0,
        boxShadow: isActive ? `0 0 10px rgba(${themeColors.rawRGB}, 0.05)` : void 0
      }}
    >
                      <span className={`font-mono text-[9px] leading-tight font-extrabold ${isActive ? themeColors.textAccent : "text-zinc-500"}`}>
                        {opt.label}
                      </span>
                      <p className="text-[8.5px] text-zinc-500 leading-tight mt-1 truncate">
                        {opt.desc}
                      </p>
                    </button>;
  })}
              </div>
            </div>
          </div>

          {
    /* Volume and Haptic Cues sliders */
  }
          <div className="space-y-4 pt-4 border-t border-zinc-900/50 mt-4 font-sans">
            
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-zinc-300">Tonal Interaction click sounds</span>
                <span className="text-[10px] text-zinc-500 mt-0.5">Procedural synthesized chime on buttons.</span>
              </div>
              <button
    type="button"
    onClick={handleFeedbackToggle}
    className={`w-11 h-6 rounded-full transition-all relative ${audioFeedback ? "bg-cyan-500" : "bg-zinc-800"}`}
    style={{
      backgroundColor: audioFeedback ? `rgb(${themeColors.rawRGB})` : void 0
    }}
  >
                <div className={`w-4.5 h-4.5 bg-neutral-950 rounded-full absolute top-0.75 transition-all ${audioFeedback ? "left-5.5" : "left-0.75"}`} />
              </button>
            </div>

            <div className="space-y-1 pb-1">
              <div className="flex justify-between text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  {synthVol === 0 ? <VolumeX className="w-3.5 h-3.5 text-zinc-500" /> : <Volume2 className={`w-3.5 h-3.5 ${themeColors.textAccent}`} />}
                  Synth volume index
                </span>
                <span className={themeColors.textAccent}>{Math.round(synthVol * 100)}%</span>
              </div>
              <input
    type="range"
    min="0"
    max="1.0"
    step="0.05"
    value={synthVol}
    onChange={(e) => setSynthVol(Number(e.target.value))}
    className="w-full h-1 bg-zinc-850 rounded accent-zinc-200 cursor-pointer text-zinc-400"
  />
            </div>

          </div>
        </div>

      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {
    /* 1. Profile Section Grid card */
  }
        <div className="p-6 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-4 relative overflow-hidden shadow-xl">
          <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-900/60">
            <User className={`w-4.5 h-4.5 ${themeColors.textAccent}`} />
            <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-sans">Identity & Core Role</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
            
            {
    /* Avatar block selectors */
  }
            <div className="flex flex-col gap-2.5">
              <label className="text-[9px] font-mono text-zinc-500 tracking-wider">ACTIVE SYMBOL AVATAR</label>
              
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-zinc-900 text-3xl flex items-center justify-center shrink-0 border border-zinc-800">
                  {profileAvatar}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {availableAvatars.map((av) => <button
    key={av}
    type="button"
    onClick={() => setProfileAvatar(av)}
    className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center text-sm transition-all cursor-pointer ${profileAvatar === av ? "bg-zinc-800 text-white border border-zinc-700 font-bold scale-105" : "bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-900/60 text-zinc-400 hover:text-zinc-200"}`}
  >
                      {av}
                    </button>)}
                </div>
              </div>
            </div>

            {
    /* Account input fields */
  }
            <div className="space-y-3 md:col-span-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-zinc-500 tracking-wider">WORKSPACE NAME</label>
                  <input
    type="text"
    required
    value={profileName}
    onChange={(e) => setProfileName(e.target.value)}
    className="w-full h-9 px-3 bg-zinc-900/40 focus:bg-zinc-900 border border-zinc-950 focus:border-zinc-800 focus:outline-none rounded-lg text-xs"
  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-zinc-500 tracking-wider">ARCHITECTURE MISSION ROLE</label>
                  <input
    type="text"
    required
    value={profileRole}
    onChange={(e) => setProfileRole(e.target.value)}
    className="w-full h-9 px-3 bg-zinc-900/40 focus:bg-zinc-900 border border-zinc-950 focus:border-zinc-800 focus:outline-none rounded-lg text-xs"
  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-mono text-zinc-500 tracking-wider">SYSTEM CORRESPONDENT EMAIL</label>
                <input
    type="email"
    required
    value={profileEmail}
    onChange={(e) => setProfileEmail(e.target.value)}
    className="w-full h-9 px-3 bg-zinc-900/40 focus:bg-zinc-900 border border-zinc-950 focus:border-zinc-800 focus:outline-none rounded-lg text-xs"
  />
              </div>
            </div>

          </div>
        </div>

        {
    /* 2. Workspace Core Config Panel */
  }
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {
    /* AI Copilot override specs */
  }
          <div className="p-6 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-900/60">
              <Cpu className={`w-4.5 h-4.5 ${themeColors.textAccent}`} />
              <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-sans">AI Workspace Preferences</h3>
            </div>

            <div className="space-y-4 pt-1">
              <div className="space-y-1">
                <label className="text-[9px] font-mono text-zinc-500 tracking-wider">INFERENCE COPILOT MODEL</label>
                <select
    value={profileModel}
    onChange={(e) => setProfileModel(e.target.value)}
    className="w-full h-9 px-3 bg-zinc-900 border border-zinc-950 focus:border-zinc-800 focus:outline-none text-xs text-zinc-400 rounded-lg"
  >
                  <option value="gemini-2.5-pro">gemini-2.5-pro (Recommended compiler assistant)</option>
                  <option value="gemini-2.5-flash">gemini-2.5-flash (Inference optimizations)</option>
                  <option value="gemini-1.5-pro">gemini-1.5-pro (Classic complex mapping)</option>
                </select>
              </div>

              {
    /* Secure API indicators */
  }
              <div
    className="p-3 rounded-xl bg-zinc-900 border border-zinc-905 flex gap-3 text-xs leading-normal"
    style={{
      backgroundColor: `rgba(${themeColors.rawRGB}, 0.02)`,
      borderColor: `rgba(${themeColors.rawRGB}, 0.08)`
    }}
  >
                <ShieldCheck className={`w-5 h-5 ${themeColors.textAccent} shrink-0 mt-0.5`} />
                <div className="space-y-0.5">
                  <span className="font-semibold text-zinc-300">Workspace Secrets Guard Active</span>
                  <p className="text-[10px] text-zinc-500">Your AI calls are processed securely. Your keys remain encrypted inside environment configs.</p>
                </div>
              </div>
            </div>
          </div>

          {
    /* System Mechanics Preferences selection */
  }
          <div className="p-6 bg-zinc-950/60 border border-zinc-900 rounded-2xl space-y-4 shadow-xl relative overflow-hidden">
            <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-900/60">
              <Layers className={`w-4.5 h-4.5 ${themeColors.textAccent}`} />
              <h3 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider font-sans">Workspace Behaviours</h3>
            </div>

            <div className="pt-2 space-y-4.5">
              
              {
    /* Toggle 1: Auto save */
  }
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-zinc-300">Continuous Auto-Save</span>
                  <span className="text-[10px] text-zinc-500 font-sans mt-0.5">Automate blueprint updates to local state index.</span>
                </div>
                <button
    type="button"
    onClick={() => setAutoSaveEnabled(!autoSaveEnabled)}
    className={`w-11 h-6 rounded-full transition-all relative ${autoSaveEnabled ? "bg-cyan-500" : "bg-zinc-800"}`}
    style={{
      backgroundColor: autoSaveEnabled ? `rgb(${themeColors.rawRGB})` : void 0
    }}
  >
                  <div className={`w-4.5 h-4.5 bg-neutral-950 rounded-full absolute top-0.75 transition-all ${autoSaveEnabled ? "left-5.5" : "left-0.75"}`} />
                </button>
              </div>

              {
    /* Toggle 2: Developer overlays (Mock setup) */
  }
              <div className="flex items-center justify-between border-t border-zinc-900/60 pt-4">
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-zinc-300">Ambient UI Particles</span>
                  <span className="text-[10px] text-zinc-500 font-sans mt-0.5">Activate complex orbital mesh vectors.</span>
                </div>
                <button
    type="button"
    disabled
    className="w-11 h-6 rounded-full opacity-40 relative cursor-not-allowed"
    style={{
      backgroundColor: `rgb(${themeColors.rawRGB})`
    }}
  >
                  <div className="w-4.5 h-4.5 bg-neutral-950 rounded-full absolute top-0.75 left-5.5" />
                </button>
              </div>

            </div>
          </div>

        </div>

        {
    /* 3. Action row bar */
  }
        <div className="flex items-center justify-between p-4.5 bg-zinc-950/40 border border-zinc-900 rounded-2xl shadow-md">
          <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Telemetry Indexes Online</span>
          </div>

          <button
    type="submit"
    className="h-10 px-6 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-950 rounded-xl shadow-lg cursor-pointer active:scale-97 transition-all leading-none focus:outline-none"
    style={{
      backgroundImage: `linear-gradient(to right, rgb(${themeColors.rawRGB}), rgba(${themeColors.rawRGB}, 0.8))`
    }}
  >
            {saveSuccess ? <>
                <Check className="w-4.5 h-4.5" />
                <span>Modifications Saved</span>
              </> : <>
                <Save className="w-4.5 h-4.5" />
                <span>Save Configurations</span>
              </>}
          </button>
        </div>

      </form>

    </motion.div>;
};
