import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Terminal as TerminalIcon,
  Cpu,
  Activity,
  Database,
  Layers,
  ShieldCheck,
  ChevronRight,
  Maximize2,
  Minimize2,
  Sliders,
  FolderOpen
} from "lucide-react";
import { useApp } from "../context/AppContext";
const SANDBOX_FILES = [
  {
    name: "kernel_rules.conf",
    size: "1.24 KB",
    type: "system",
    content: `[core_engine]
alloc_threads = 4
wasm_execution_mode = "accelerated_wasm"
attention_window = 32768
temperature_override = 0.12
neural_network_density = "high"
edge_caching = true
`
  },
  {
    name: "attention_matrix.json",
    size: "852 B",
    type: "config",
    content: `{
  "attention_nodes": [
    { "id": "layer_0_feedforward", "weight": 0.982 },
    { "id": "layer_1_cognitive", "weight": 0.854 },
    { "id": "layer_2_contextual", "weight": 0.991 }
  ],
  "latency_guard_threshold_ms": 150
}`
  },
  {
    name: "edge_cache_rules.wasm",
    size: "124.5 KB",
    type: "binary",
    content: `BINARY STREAM: MODULE [0x00 0x61 0x73 0x6d ... ]
- Optimization Mode: Size & Speed
- Linked Crate: wasm-bindgen v0.2.89
- Targets compiled: WebGL rendering engine, memory buffers indexing`
  }
];
export const FloatingConsole = () => {
  const { recentActivities, addActivity, userProfile } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState("diagnostics");
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [governorMode, setGovernorMode] = useState("balanced");
  const [attentionDepth, setAttentionDepth] = useState(85);
  const [inferenceTemperature, setInferenceTemperature] = useState(55);
  const [cpuUsage, setCpuUsage] = useState(1.24);
  const [ramUsage, setRamUsage] = useState(334);
  const [lagMs, setLagMs] = useState(120);
  const [inputCommand, setInputCommand] = useState("");
  const [consoleLogs, setConsoleLogs] = useState([
    { id: "1", timestamp: "06:37:57", source: "KERNEL", message: "IntelliOS Core Web Kernel Booted (Release v2.5.0)", type: "info" },
    { id: "2", timestamp: "06:37:58", source: "WASM", message: "Loaded edge_cache_rules.wasm mapping indices", type: "success" },
    { id: "3", timestamp: "06:37:59", source: "NEURAL", message: "Model weights successfully indexed via gemini core", type: "info" },
    { id: "4", timestamp: "06:38:00", source: "KERNEL", message: "System integrity audit: nominal. ShieldCheck Active.", type: "success" }
  ]);
  const logEndRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  useEffect(() => {
    const interval = setInterval(() => {
      let cpuBase = 1;
      let ramBase = 330;
      let lagBase = 110;
      switch (governorMode) {
        case "efficiency":
          cpuBase = 0.45;
          ramBase = 210;
          lagBase = 185;
          break;
        case "balanced":
          cpuBase = 1.25;
          ramBase = 334;
          lagBase = 120;
          break;
        case "overclock":
          cpuBase = 4.85;
          ramBase = 512;
          lagBase = 72;
          break;
        case "hyperdrive":
          cpuBase = 8.92;
          ramBase = 884;
          lagBase = 42;
          break;
      }
      setCpuUsage(Number((cpuBase + Math.random() * 0.4).toFixed(2)));
      setRamUsage(Math.round(ramBase + Math.random() * 8));
      setLagMs(Math.round(lagBase + Math.random() * 5));
    }, 2e3);
    return () => clearInterval(interval);
  }, [governorMode]);
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [consoleLogs]);
  const handleCommandSubmit = (e) => {
    e.preventDefault();
    const cmd = inputCommand.trim().toLowerCase();
    if (!cmd) return;
    const timeStr = (/* @__PURE__ */ new Date()).toTimeString().split(" ")[0];
    const userLog = {
      id: String(Date.now()),
      timestamp: timeStr,
      source: "USER",
      message: `$ ${inputCommand}`,
      type: "info"
    };
    let replyMessage = "";
    let replySource = "KERNEL";
    let replyType = "info";
    if (cmd === "clear") {
      setConsoleLogs([]);
      setInputCommand("");
      return;
    } else if (cmd === "help") {
      replyMessage = "Executable hooks: help, status, sync, overclock, hyperdrive, index, diagnostics, audit";
      replyType = "info";
    } else if (cmd === "status") {
      replyMessage = `CPU [${cpuUsage}%] RAM [${ramUsage}MB] LAG [${lagMs}ms] GOVERNOR [${governorMode.toUpperCase()}]`;
      replySource = "KERNEL";
      replyType = "success";
    } else if (cmd === "sync") {
      replyMessage = "Syncing local buffers to remote. WASM memory heaps successfully compressed.";
      replySource = "WASM";
      replyType = "success";
      addActivity("system", "Kernel Command Executed", "Executed wasm synchronization script.");
    } else if (cmd === "overclock" || cmd === "hyperdrive") {
      setGovernorMode(cmd);
      replyMessage = `Governor optimized for: ${cmd.toUpperCase()}. Attention bounds extended. Ready for telemetry overload!`;
      replySource = "NEURAL";
      replyType = "success";
    } else if (cmd === "index") {
      replyMessage = "System directory indexing triggered. Checked 3 notes & 4 database schema boundaries.";
      replySource = "WASM";
      replyType = "success";
    } else if (cmd === "diagnostics") {
      replyMessage = `Attention Depth: ${attentionDepth}%, Target Model: ${userProfile.geminiModel}, Stream Buffer Status: ONLINE`;
      replySource = "NEURAL";
      replyType = "info";
    } else if (cmd === "audit") {
      replyMessage = "Security Integrity CheckPassed. Cloud SSL, Local sandbox environment secured.";
      replySource = "KERNEL";
      replyType = "success";
    } else {
      replyMessage = `Command not recognized: "${cmd}". Type "help" to display integrated OS runtime commands.`;
      replyType = "error";
    }
    const replyLog = {
      id: String(Date.now() + 1),
      timestamp: timeStr,
      source: replySource,
      message: replyMessage,
      type: replyType
    };
    setConsoleLogs((prev) => [...prev, userLog, replyLog]);
    setInputCommand("");
  };
  return <>
      {
    /* 1. Toggle Button at top of screen or bottom corner */
  }
      <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
        <motion.div
    animate={{
      boxShadow: isOpen ? "0 0 20px rgba(6, 182, 212, 0.15)" : "0 0 10px rgba(6, 182, 212, 0.05)"
    }}
    className="rounded-full overflow-hidden"
  >
          <button
    id="toggle-sys-panel"
    onClick={() => {
      setIsOpen(!isOpen);
      if (isMinimized) setIsMinimized(false);
    }}
    className="flex items-center gap-2 px-4 py-2.5 bg-zinc-900 border border-cyan-500/30 hover:border-cyan-400 text-zinc-200 rounded-full text-xs font-mono font-bold hover:shadow-[0_0_15px_rgba(34,211,238,0.15)] transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95"
  >
            <Cpu className={`w-4 h-4 text-cyan-400 ${isOpen ? "animate-spin" : ""}`} style={{ animationDuration: "3s" }} />
            <span>SYS CONSOLE</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
          </button>
        </motion.div>
      </div>

      {
    /* 2. Floating Panel Core Container */
  }
      <AnimatePresence>
        {isOpen && <motion.div
    initial={{ opacity: 0, scale: 0.95, y: 15 }}
    animate={{
      opacity: 1,
      scale: 1,
      y: 0,
      height: isMinimized ? "44px" : "460px",
      width: "420px"
    }}
    exit={{ opacity: 0, scale: 0.95, y: 15 }}
    transition={{ type: "spring", stiffness: 350, damping: 28 }}
    className="fixed bottom-20 right-6 z-40 bg-zinc-950/95 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden backdrop-blur-2xl"
  >
            {
    /* Header / Drag Bar */
  }
            <div className="h-11 px-4 border-b border-zinc-900/80 bg-zinc-900/30 flex items-center justify-between select-none shrink-0">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-[10px] font-bold tracking-widest text-zinc-400">INTELLIOS KERNEL CONSOLE</span>
                {governorMode === "hyperdrive" && <span className="text-[8px] font-sans font-extrabold px-1.5 py-0.5 bg-rose-500/20 text-rose-400 border border-rose-500/40 rounded-full tracking-wider animate-pulse">
                    HYPERDRIVE ON
                  </span>}
              </div>
              
              <div className="flex items-center gap-1.5">
                <button
    onClick={() => setIsMinimized(!isMinimized)}
    className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900/50 transition-colors"
  >
                  {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
                </button>
                <button
    onClick={() => setIsOpen(false)}
    className="p-1 rounded text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
  >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {
    /* If NOT minimized, render Tab System & Workspace sections */
  }
            {!isMinimized && <>
                {
    /* Visualizer and telemetry strip */
  }
                <div className="px-4 py-2 border-b border-zinc-900 bg-zinc-950">
                  <div className="grid grid-cols-3 gap-2 py-1 text-center font-mono">
                    <div className="py-1 px-2 rounded bg-zinc-900/40 border border-zinc-900 text-left">
                      <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider leading-none">CPU NODE</div>
                      <div className="text-sm font-semibold text-cyan-400 leading-none mt-1">{cpuUsage}%</div>
                    </div>
                    <div className="py-1 px-2 rounded bg-zinc-900/40 border border-zinc-900 text-left">
                      <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider leading-none">MEM ALLOC</div>
                      <div className="text-sm font-semibold text-zinc-300 leading-none mt-1">{ramUsage} MB</div>
                    </div>
                    <div className="py-1 px-2 rounded bg-zinc-900/40 border border-zinc-900 text-left">
                      <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wider leading-none">LAG METRIC</div>
                      <div className="text-sm font-semibold text-amber-500 leading-none mt-1">{lagMs} ms</div>
                    </div>
                  </div>
                </div>

                {
    /* Nav tabs bar */
  }
                <div className="flex border-b border-zinc-900 bg-zinc-900/20 text-xs text-zinc-400 font-mono">
                  <button
    onClick={() => setActiveTab("diagnostics")}
    className={`flex-1 py-2 text-center border-b ${activeTab === "diagnostics" ? "text-cyan-400 border-cyan-400 bg-zinc-900/30" : "border-transparent hover:text-zinc-200"}`}
  >
                    DIAGNOSTICS
                  </button>
                  <button
    onClick={() => setActiveTab("neural")}
    className={`flex-1 py-2 text-center border-b ${activeTab === "neural" ? "text-cyan-400 border-cyan-400 bg-zinc-900/30" : "border-transparent hover:text-zinc-200"}`}
  >
                    COGNITIVE
                  </button>
                  <button
    onClick={() => setActiveTab("files")}
    className={`flex-1 py-2 text-center border-b ${activeTab === "files" ? "text-cyan-400 border-cyan-400 bg-zinc-900/30" : "border-transparent hover:text-zinc-200"}`}
  >
                    FILES
                  </button>
                  <button
    onClick={() => setActiveTab("shell")}
    className={`flex-1 py-2 text-center border-b ${activeTab === "shell" ? "text-cyan-400 border-cyan-400 bg-zinc-900/30" : "border-transparent hover:text-zinc-200"}`}
  >
                    SHELL
                  </button>
                </div>

                {
    /* Content Pane of Floating Workspace Panel */
  }
                <div className="flex-1 overflow-y-auto p-4 flex flex-col bg-zinc-950">
                  
                  {
    /* TAB 1: Diagnostics Visual Analyzer */
  }
                  {activeTab === "diagnostics" && <div className="space-y-4 flex-1 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-mono text-[10px] text-zinc-500 uppercase font-semibold">Intelligence Active Wave Loop</span>
                          <span className="text-cyan-400 tracking-wider font-mono text-[10px]">ANALYZING CONTEXT</span>
                        </div>
                        
                        {
    /* Interactive Visual Graphic pulse representation */
  }
                        <div className="h-20 bg-zinc-900/40 border border-zinc-900/60 rounded-xl flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/5 to-indigo-500/5 pointer-events-none" />
                          <div className="flex items-end justify-center gap-1.5 h-10 px-6">
                            {[24, 64, 48, 80, 52, 32, 70, 92, 44, 28, 60, 84, 98, 40, 56, 30].map((h, i) => <motion.div
    key={i}
    animate={{
      height: [`${h * 0.3}%`, `${h * 1}%`, `${h * 0.5}%`]
    }}
    transition={{
      repeat: Infinity,
      repeatType: "reverse",
      duration: 0.8 + Math.random() * 0.7,
      ease: "easeInOut"
    }}
    className={`w-1 rounded-full ${governorMode === "hyperdrive" ? "bg-gradient-to-t from-rose-500 to-rose-400" : "bg-gradient-to-t from-cyan-500 to-indigo-400"}`}
  />)}
                          </div>
                        </div>

                        {
    /* Telemetry settings indicators */
  }
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/30 border border-zinc-900/40">
                            <span className="text-zinc-400 flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-zinc-500" /> WebAssembly Bindings</span>
                            <span className="text-zinc-200 font-mono text-[11px]">ACTIVE (Optimized)</span>
                          </div>
                          
                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/30 border border-zinc-900/40">
                            <span className="text-zinc-400 flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-zinc-500" /> Workspace Isolation Guard</span>
                            <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              SECURE
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-[10px] font-mono text-zinc-650 flex items-center gap-1.5 border-t border-zinc-900/60 pt-3">
                        <Activity className="w-3 h-3 text-cyan-500 animate-pulse" />
                        <span>System uptime nominal (UTC 06:37Z)</span>
                      </div>
                    </div>}

                  {
    /* TAB 2: AI Settings / Cognitive Engine Weights */
  }
                  {activeTab === "neural" && <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-semibold tracking-wider text-zinc-500 uppercase">COGNITIVE TUNER</span>
                        <Sliders className="w-4 h-4 text-cyan-400" />
                      </div>

                      {
    /* GOVERNOR MODE SETTER */
  }
                      <div className="space-y-2">
                        <label className="text-[10px] font-mono font-bold tracking-brand text-zinc-500 uppercase">Model Core Governor</label>
                        <div className="grid grid-cols-4 gap-1 select-none">
                          {["efficiency", "balanced", "overclock", "hyperdrive"].map((mode) => <button
    key={mode}
    onClick={() => {
      setGovernorMode(mode);
      addActivity("system", "Governor Overruled", `Switched CPU Governor to: ${mode.toUpperCase()}`);
    }}
    className={`py-1.5 rounded text-[10px] font-mono uppercase font-bold transition-all border ${governorMode === mode ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-[0_0_8px_rgba(6,182,212,0.1)]" : "bg-zinc-900/55 hover:bg-zinc-900 text-zinc-500 border-zinc-900 hover:text-zinc-400"}`}
  >
                              {mode === "hyperdrive" ? "HYPER" : mode}
                            </button>)}
                        </div>
                      </div>

                      {
    /* SLIDER A: Attention Window Weights */
  }
                      <div className="space-y-2 mt-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-zinc-400 text-[11px]">Attention Window Weight</span>
                          <span className="text-cyan-400 font-bold">{attentionDepth * 384} Tokens</span>
                        </div>
                        <input
    type="range"
    min="10"
    max="100"
    value={attentionDepth}
    onChange={(e) => setAttentionDepth(Number(e.target.value))}
    className="w-full accent-cyan-400 cursor-pointer text-zinc-800"
  />
                        <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
                          Larger windows increase context search accuracy but amplify inference delay. Default focus: 32K attention bounds.
                        </p>
                      </div>

                      {
    /* SLIDER B: Inference Temperature Scale */
  }
                      <div className="space-y-2 mt-4">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-zinc-400 text-[11px]">Neural Temp Scale (Entropy)</span>
                          <span className="text-amber-400 font-bold">{(inferenceTemperature / 100).toFixed(2)}</span>
                        </div>
                        <input
    type="range"
    min="5"
    max="100"
    value={inferenceTemperature}
    onChange={(e) => setInferenceTemperature(Number(e.target.value))}
    className="w-full accent-amber-400 cursor-pointer text-zinc-800"
  />
                        <p className="text-[10px] text-zinc-500 font-sans leading-relaxed">
                          Low values isolate factual logic nodes. High scopes spawn creative code loops during chat query analysis.
                        </p>
                      </div>
                    </div>}

                  {
    /* TAB 3: File Explorer Sandbox */
  }
                  {activeTab === "files" && <div className="space-y-3 flex-1 flex flex-col">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Workspace Config Sandbox</span>
                        <FolderOpen className="w-4 h-4 text-cyan-400" />
                      </div>

                      {
    /* Directory tree list */
  }
                      <div className="grid grid-cols-1 gap-1.5">
                        {SANDBOX_FILES.map((file) => <button
    key={file.name}
    onClick={() => setSelectedFile(selectedFile?.name === file.name ? null : file)}
    className={`w-full p-2.5 rounded-lg border text-left flex items-center justify-between hover:border-zinc-700 transition-colors ${selectedFile?.name === file.name ? "bg-zinc-900 border-zinc-700" : "bg-zinc-900/30 border-zinc-900"}`}
  >
                            <div className="flex items-center gap-2">
                              <Database className="w-3.5 h-3.5 text-zinc-400" />
                              <div className="flex flex-col">
                                <span className="font-mono text-xs text-zinc-200">{file.name}</span>
                                <span className="text-[9px] font-sans text-zinc-500">{file.size}</span>
                              </div>
                            </div>
                            <ChevronRight className={`w-3.5 h-3.5 text-zinc-500 transform transition-transform ${selectedFile?.name === file.name ? "rotate-90 text-cyan-400" : ""}`} />
                          </button>)}
                      </div>

                      {
    /* Selected File Content diagnostics inspection box */
  }
                      <AnimatePresence>
                        {selectedFile && <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    className="bg-zinc-950 border border-zinc-900 rounded-lg p-3 overflow-hidden"
  >
                            <div className="flex items-center justify-between border-b border-zinc-900 pb-1.5 mb-2">
                              <span className="text-[9px] font-mono uppercase bg-zinc-900 text-cyan-400 px-1.5 py-0.5 rounded border border-zinc-850">
                                Parameters Preview
                              </span>
                              <span className="text-[9px] font-mono text-zinc-650">Read-Only View</span>
                            </div>
                            <pre className="font-mono text-[10px] text-zinc-400 leading-relaxed overflow-x-auto whitespace-pre">
                              {selectedFile.content}
                            </pre>
                          </motion.div>}
                      </AnimatePresence>
                    </div>}

                  {
    /* TAB 4: Interactive Micro-Shell Terminal */
  }
                  {activeTab === "shell" && <div className="flex-1 flex flex-col justify-between overflow-hidden">
                      {
    /* Logs scrolling area */
  }
                      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 font-mono text-[10px] max-h-[220px]">
                        {consoleLogs.map((log) => <div key={log.id} className="leading-relaxed">
                            <span className="text-zinc-600">[{log.timestamp}]</span>{" "}
                            <span className={`font-bold ${log.source === "KERNEL" ? "text-cyan-500" : log.source === "NEURAL" ? "text-indigo-400" : log.source === "WASM" ? "text-violet-400" : "text-zinc-400"}`}>
                              [{log.source}]
                            </span>{" "}
                            <span className={log.type === "success" ? "text-emerald-400 font-medium" : log.type === "warn" ? "text-amber-400" : log.type === "error" ? "text-rose-400 font-medium" : "text-zinc-300"}>
                              {log.message}
                            </span>
                          </div>)}
                        <div ref={logEndRef} />
                      </div>

                      {
    /* Commands Entry terminal form */
  }
                      <form onSubmit={handleCommandSubmit} className="mt-2.5 pt-2 border-t border-zinc-900/80 flex gap-2">
                        <TerminalIcon className="w-4.5 h-4.5 text-cyan-400 self-center shrink-0" />
                        <span className="font-mono text-[11px] text-zinc-500 self-center">$</span>
                        <input
    type="text"
    value={inputCommand}
    onChange={(e) => setInputCommand(e.target.value)}
    placeholder="Type 'help', 'status', 'sync', 'index' ..."
    className="flex-grow bg-transparent text-[11px] font-mono text-zinc-200 placeholder-zinc-600 focus:outline-none border-none py-1.5"
  />
                        <button
    type="submit"
    className="px-2.5 py-1 text-[10px] font-mono font-bold text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/5 border border-cyan-500/20 rounded cursor-pointer self-center"
  >
                          RUN
                        </button>
                      </form>
                    </div>}

                </div>
              </>}
          </motion.div>}
      </AnimatePresence>
    </>;
};
