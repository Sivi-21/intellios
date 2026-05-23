import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  Terminal,
  CheckCircle,
  FileText,
  Activity,
  ArrowUpRight,
  Cpu,
  Flame,
  Clock,
  Compass,
  RefreshCw,
  Play,
  Radio,
  Network
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { getThemeColors } from "../lib/theme";
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.04 }
  }
};
const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 28 } }
};
export const Dashboard = () => {
  const {
    userProfile,
    notes,
    tasks,
    recentActivities,
    setCommandBarOpen,
    addActivity,
    engineTheme,
    playSfx
  } = useApp();
  const navigate = useNavigate();
  const theme = getThemeColors(engineTheme);
  const [selectedNodeId, setSelectedNodeId] = useState("vector-01");
  const [isCompiling, setIsCompiling] = useState(false);
  const [compiledPercent, setCompiledPercent] = useState(0);
  const [syncCount, setSyncCount] = useState(0);
  const [cacheBuffers, setCacheBuffers] = useState(64);
  const [ambientFreq, setAmbientFreq] = useState(432);
  const [systemNodes, setSystemNodes] = useState([
    { id: "vector-01", name: "VECTOR MEMORY CORE", code: "0x1A4F", status: "nominal", role: "Context Vector Indexing", threads: 4, payload: "3 Notes mapped" },
    { id: "wasm-02", name: "WASM COMPILING ENGINES", code: "0x99F2", status: "standby", role: "Cryptographic Hashing / WASM", threads: 8, payload: "Release targets optimal" },
    { id: "guard-03", name: "INFERENCE ATTENTION GUARD", code: "0x05E4", status: "nominal", role: "Gemini Safety Filter Bounds", threads: 2, payload: "SSL Certified" },
    { id: "wave-04", name: "SYNTHETIC FREQUENCY SYNC", code: "0xC6B0", status: "active", role: "Binaural Audio Telemetry Output", threads: 1, payload: "Ambient Engine" }
  ]);
  const canvasRef = useRef(null);
  const [selectedGraphNode, setSelectedGraphNode] = useState(null);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "completed").length;
  const pendingTasksCount = totalTasks - completedTasks;
  const productivityRatio = totalTasks > 0 ? Math.round(completedTasks / totalTasks * 100) : 0;
  const favoriteNotesCount = notes.filter((n) => n.isFavorite).length;
  useEffect(() => {
    setSystemNodes((prev) => prev.map((node) => {
      if (node.id === "vector-01") {
        return { ...node, payload: `${notes.length} Blueprints Registered` };
      }
      return node;
    }));
  }, [notes.length]);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animId;
    let width = canvas.width = canvas.offsetWidth;
    let height = canvas.height = canvas.offsetHeight || 220;
    const graphNodes = [];
    graphNodes.push({
      id: "center-core",
      label: "INTELLIOS_ENGINE",
      type: "center",
      x: width / 2,
      y: height / 2,
      vx: 0,
      vy: 0,
      radius: 10
    });
    notes.slice(0, 4).forEach((note, i) => {
      const angle = i * Math.PI * 2 / Math.min(4, notes.length || 1);
      graphNodes.push({
        id: note.id,
        label: note.title.length > 20 ? note.title.slice(0, 18) + "..." : note.title,
        type: "note",
        x: width / 2 + Math.cos(angle) * 75,
        y: height / 2 + Math.sin(angle) * 70,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: 6
      });
    });
    tasks.slice(0, 5).forEach((task, i) => {
      const angle = (i + 0.5) * Math.PI * 2 / Math.min(5, tasks.length || 1);
      graphNodes.push({
        id: task.id,
        label: task.title.length > 20 ? task.title.slice(0, 18) + "..." : task.title,
        type: "task",
        x: width / 2 + Math.cos(angle) * 125,
        y: height / 2 + Math.sin(angle) * 115,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 4
      });
    });
    let mouseX = 0;
    let mouseY = 0;
    let isHovering = false;
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
      isHovering = true;
    };
    const handleMouseLeave = () => {
      isHovering = false;
    };
    const handleCanvasClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      let found = false;
      for (const node of graphNodes) {
        const dx = clickX - node.x;
        const dy = clickY - node.y;
        if (Math.sqrt(dx * dx + dy * dy) < node.radius + 15) {
          playSfx("click");
          setSelectedGraphNode({
            id: node.id,
            label: node.label,
            type: node.type
          });
          found = true;
          break;
        }
      }
      if (!found) setSelectedGraphNode(null);
    };
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("click", handleCanvasClick);
    let pulseAngle = 0;
    const runPhysics = () => {
      ctx.clearRect(0, 0, width, height);
      pulseAngle += 0.02;
      ctx.strokeStyle = "rgba(63, 63, 70, 0.1)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 75, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 125, 0, Math.PI * 2);
      ctx.stroke();
      const gradientRadio = Math.sin(pulseAngle) * 50 + 80;
      ctx.strokeStyle = `rgba(${theme.rawRGB}, 0.035)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, gradientRadio, 0, Math.PI * 2);
      ctx.stroke();
      const rgbAccent = theme.rawRGB;
      ctx.lineWidth = 1;
      for (let i = 0; i < graphNodes.length; i++) {
        const nodeA = graphNodes[i];
        for (let j = i + 1; j < graphNodes.length; j++) {
          const nodeB = graphNodes[j];
          let drawLine = false;
          let color = `rgba(${rgbAccent}, 0.082)`;
          if (nodeA.type === "center" || nodeB.type === "center") {
            drawLine = true;
            color = `rgba(${rgbAccent}, 0.14)`;
          } else if (nodeA.type === "note" && nodeB.type === "task") {
            drawLine = true;
            color = `rgba(${rgbAccent}, 0.06)`;
          }
          if (drawLine) {
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(nodeA.x, nodeA.y);
            ctx.lineTo(nodeB.x, nodeB.y);
            ctx.stroke();
          }
        }
      }
      graphNodes.forEach((node) => {
        if (node.type === "center") {
          node.x += (width / 2 - node.x) * 0.1;
          node.y += (height / 2 - node.y) * 0.1;
          return;
        }
        const dx = node.x - width / 2;
        const dy = node.y - height / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const idealOrbit = node.type === "note" ? 75 : 125;
        const pullCurrent = (idealOrbit - dist) * 5e-3;
        node.vx += dx / (dist || 1) * pullCurrent;
        node.vy += dy / (dist || 1) * pullCurrent;
        graphNodes.forEach((other) => {
          if (node.id === other.id) return;
          const odx = node.x - other.x;
          const ody = node.y - other.y;
          const odist = Math.sqrt(odx * odx + ody * ody);
          if (odist < 50) {
            const pushForce = (50 - odist) * 3e-4;
            node.vx += odx / (odist || 1) * pushForce;
            node.vy += ody / (odist || 1) * pushForce;
          }
        });
        if (isHovering) {
          const mdx = mouseX - node.x;
          const mdy = mouseY - node.y;
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mdist < 80) {
            const magnet = (80 - mdist) * 12e-4;
            node.vx += mdx / (mdist || 1) * magnet;
            node.vy += mdy / (mdist || 1) * magnet;
          }
        }
        node.vx *= 0.94;
        node.vy *= 0.94;
        node.x += node.vx;
        node.y += node.vy;
      });
      graphNodes.forEach((node, i) => {
        const shadowColor = `rgba(${rgbAccent}, 0.3)`;
        ctx.shadowBlur = 0;
        ctx.shadowColor = "transparent";
        let radius = node.radius;
        if (node.type === "center") {
          ctx.fillStyle = `rgba(${rgbAccent}, 1.0)`;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius + Math.sin(pulseAngle * 2.5) * 1.5, 0, Math.PI * 2);
          ctx.fill();
        } else if (node.type === "note") {
          ctx.fillStyle = "#f4f4f5";
          ctx.strokeStyle = `rgba(${rgbAccent}, 0.8)`;
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${rgbAccent}, 0.2)`;
          ctx.strokeStyle = `rgba(${rgbAccent}, 0.7)`;
          ctx.lineWidth = i === 0 ? 2 : 1;
          ctx.beginPath();
          ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        ctx.fillStyle = "rgba(212, 212, 216, 0.7)";
        ctx.font = '7.5px "JetBrains Mono", monospace';
        ctx.textAlign = "center";
        ctx.fillText(node.label, node.x, node.y - node.radius - 5);
      });
      animId = requestAnimationFrame(runPhysics);
    };
    runPhysics();
    const handleResize = () => {
      if (!canvasRef.current) return;
      width = canvasRef.current.width = canvasRef.current.offsetWidth;
      height = canvasRef.current.height = canvasRef.current.offsetHeight || 220;
    };
    window.addEventListener("resize", handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("click", handleCanvasClick);
    };
  }, [notes, tasks, engineTheme]);
  const handleCompileTrigger = () => {
    if (isCompiling) return;
    setIsCompiling(true);
    setCompiledPercent(0);
    playSfx("compile");
    addActivity("system", "Compiler Pipeline Triggered", "Compiling wasm instructions for local code integrity audits");
    const run = setInterval(() => {
      setCompiledPercent((prev) => {
        if (prev >= 100) {
          clearInterval(run);
          setIsCompiling(false);
          playSfx("success");
          addActivity("system", "WASM Build Complete", "IntelIOS context engine modules compiled successfully.", "0x99f2");
          setSystemNodes((nodes) => nodes.map((n) => n.id === "wasm-02" ? { ...n, status: "nominal", payload: "Optimized build (100% compiled)" } : n));
          return 100;
        }
        return prev + 10;
      });
    }, 250);
  };
  const handleBufferFlush = () => {
    setSyncCount((prev) => prev + 1);
    playSfx("flush");
    addActivity("system", "Buffer Nodes Flushed", `Re-indexed context vectors. Freed ${cacheBuffers} MB memory nodes.`);
    setSystemNodes((nodes) => nodes.map((n) => n.id === "vector-01" ? { ...n, status: "active", payload: "Buffers cleared (0 alloc)" } : n));
    setTimeout(() => {
      setSystemNodes((nodes) => nodes.map((n) => n.id === "vector-01" ? { ...n, status: "nominal", payload: "Notes context indexed" } : n));
    }, 1200);
  };
  return <motion.div
    variants={containerVariants}
    initial="hidden"
    animate="show"
    className="space-y-6 select-none relative pb-12"
  >
      
      {
    /* 1. Welcoming Hero Banner Block */
  }
      <motion.div
    variants={itemVariants}
    className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border border-zinc-900 shadow-xl relative overflow-hidden"
  >
        {
    /* Futuristic glowing particle core overlay */
  }
        <div className={`absolute top-0 right-0 w-64 h-64 rounded-full blur-[60px] pointer-events-none`} style={{ backgroundColor: `rgba(${theme.rawRGB}, 0.05)` }} />
        
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-xl bg-zinc-900/40 border border-zinc-800 text-xl shrink-0">
            {userProfile.avatar}
          </div>
          <div className="space-y-1">
            <h2 className="font-display font-bold text-xl sm:text-2xl text-zinc-100 tracking-tight flex items-center gap-2">
              Welcome back, <span className={`bg-gradient-to-r ${theme.textGradient}`}>{userProfile.name}</span>
            </h2>
            <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-lg">
              Workspace core initialized. Active telemetry reports all processes nominal. Codebase modules indexed and active with <span className={`font-mono font-medium ${theme.textAccent}`}>{userProfile.geminiModel}</span>.
            </p>
          </div>
        </div>

        {
    /* Quick Launchpad Buttons */
  }
        <div className="flex items-center gap-2.5 sm:self-center shrink-0">
          <button
    onClick={() => {
      playSfx("click");
      setCommandBarOpen(true);
    }}
    className="h-10 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-300 hover:text-zinc-100 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 rounded-xl transition-all cursor-pointer shadow-md"
  >
            <Compass className="w-4 h-4 text-zinc-400" />
            <span>Launch Spotlight</span>
          </button>
          
          <button
    onClick={() => {
      playSfx("click");
      navigate("/chat");
    }}
    className="h-10 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-950 rounded-xl shadow-lg cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
    style={{ backgroundImage: `linear-gradient(to right, rgb(${theme.rawRGB}), rgba(${theme.rawRGB}, 0.85))` }}
  >
            <Sparkles className="w-4 h-4" />
            <span>Query Copilot</span>
          </button>
        </div>
      </motion.div>

      {
    /* 2. OPERATOR COMMAND MATRIX - Interactive HUD System nodes */
  }
      <motion.div variants={itemVariants} className="p-6 bg-zinc-950/60 border border-zinc-900 rounded-2xl relative shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-zinc-500/[0.01] rounded-full blur-[90px] pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between pb-4 border-b border-zinc-900 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: `rgb(${theme.rawRGB})` }} />
              <span className={`font-mono text-[9px] font-bold tracking-widest uppercase ${theme.textAccent}`}>SYS_MATRIX_CORES</span>
            </div>
            <h3 className="font-display font-bold text-base text-zinc-200">INTELLIOS SECURE CORES STATUS</h3>
          </div>
          <p className="text-zinc-500 text-xs font-mono max-w-md lg:text-right">
            Manage compiled routines, flush indexing context loops, adjust synthesized concentration frequencies.
          </p>
        </div>

        {
    /* Split HUD Content Grid */
  }
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          
          {
    /* Node Grid Selector (Left 7 Columns) */
  }
          <div className="lg:col-span-7 space-y-3">
            <span className="text-[10px] font-mono text-zinc-650 uppercase font-semibold block">ACTIVE CORE CHANNELS</span>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {systemNodes.map((node) => {
    const isActive = selectedNodeId === node.id;
    return <button
      key={node.id}
      onClick={() => {
        playSfx("click");
        setSelectedNodeId(node.id);
      }}
      className={`p-4 rounded-xl text-left border relative transition-all duration-200 select-none group flex flex-col justify-between h-32 cursor-pointer ${isActive ? "bg-zinc-900/90 border-zinc-700 shadow-md" : "bg-zinc-950/40 hover:bg-zinc-900/40 border-zinc-900 hover:border-zinc-800"}`}
    >
                    {
      /* Glowing highlight indicator */
    }
                    {isActive && <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full animate-pulse animate-spin" style={{ backgroundColor: `rgb(${theme.rawRGB})` }} />}

                    <div className="flex items-center justify-between w-full">
                      <span className="font-mono text-[10px] font-bold text-zinc-500 group-hover:text-zinc-400 transition-colors">
                        {node.code}
                      </span>
                      <span className={`text-[9px] font-mono font-extrabold uppercase px-1.5 py-0.5 rounded border ${node.status === "nominal" ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : node.status === "active" ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20" : node.status === "standby" ? "bg-zinc-850 text-zinc-400 border-zinc-700" : "bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse"}`}>
                        {node.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 mt-auto">
                      <h4 className={`font-display font-bold text-[13px] text-zinc-200 truncate group-hover:text-white transition-colors ${isActive ? theme.textAccent : ""}`}>
                        {node.name}
                      </h4>
                      <p className="text-[11px] text-zinc-500 truncate leading-none font-mono">
                        {node.role}
                      </p>
                    </div>
                  </button>;
  })}
            </div>
          </div>

          {
    /* Interactive State Console Details (Right 5 Columns) */
  }
          <div className="lg:col-span-5 bg-zinc-900/30 border border-zinc-900/80 rounded-xl p-5 flex flex-col justify-between min-h-[290px]">
            
            <AnimatePresence mode="wait">
              {(() => {
    const node = systemNodes.find((n) => n.id === selectedNodeId);
    if (!node) return null;
    return <motion.div
      key={node.id}
      initial={{ opacity: 0, x: 8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -8 }}
      transition={{ duration: 0.12 }}
      className="space-y-4 flex-1 flex flex-col justify-between"
    >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-zinc-900 pb-2">
                        <span className={`text-[10px] font-mono font-bold tracking-wider uppercase ${theme.textAccent}`}>
                          DIAGNOSTIC DECK
                        </span>
                        <span className="font-mono text-[10px] text-zinc-650">
                          {node.code} STATUS
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <h4 className="font-display font-extrabold text-sm text-zinc-200 uppercase">
                          {node.name}
                        </h4>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          Core registers represent allocation on active sandbox thread. Assigned specifically to manage <b className="text-zinc-300 font-medium">{node.role}</b> boundaries.
                        </p>
                      </div>

                      {
      /* Thread & Payload values */
    }
                      <div className="grid grid-cols-2 gap-2 font-mono text-[10px] pt-1">
                        <div className="p-2 rounded bg-zinc-950/60 border border-zinc-900">
                          <span className="text-zinc-500 block leading-none">ALLOCATED THREADS</span>
                          <span className="text-zinc-200 font-bold block mt-1.5">{node.threads} CPU Workers</span>
                        </div>
                        <div className="p-2 rounded bg-zinc-950/60 border border-zinc-900">
                          <span className="text-zinc-500 block leading-none">METRIC PAYLOAD</span>
                          <span className={`font-bold block mt-1.5 truncate ${theme.textAccent}`}>{node.payload}</span>
                        </div>
                      </div>
                    </div>

                    {
      /* Interactive state controls based on actual selected node! */
    }
                    <div className="pt-4 border-t border-zinc-900/60 mt-auto">
                      
                      {node.id === "vector-01" && <div className="space-y-3">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                              <span>Cache Buffer Allocation Size</span>
                              <span className={theme.textAccent}>{cacheBuffers} MB</span>
                            </div>
                            <input
      type="range"
      min="16"
      max="128"
      value={cacheBuffers}
      onChange={(e) => {
        setCacheBuffers(Number(e.target.value));
      }}
      className="w-full h-1 bg-zinc-800 rounded accent-zinc-100 cursor-pointer text-zinc-400"
    />
                          </div>

                          <button
      onClick={handleBufferFlush}
      className="w-full h-9 flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white font-mono text-[11px] font-bold uppercase rounded-lg transition-all"
    >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Flush Vector Cache buffers</span>
                          </button>
                        </div>}

                      {node.id === "wasm-02" && <div className="space-y-3">
                          {isCompiling ? <div className="space-y-1.5">
                              <div className="flex justify-between text-[10px] font-mono">
                                <span className="text-zinc-400">Compiling WASM bytecodes...</span>
                                <span className={`font-semibold ${theme.textAccent}`}>{compiledPercent}%</span>
                              </div>
                              <div className="w-full h-1 bg-zinc-950 rounded-full overflow-hidden border border-zinc-900">
                                <div className="h-full transition-all duration-200" style={{ width: `${compiledPercent}%`, backgroundColor: `rgb(${theme.rawRGB})` }} />
                              </div>
                            </div> : <p className="text-[11px] text-zinc-500 font-sans leading-relaxed mb-2">
                              Trigger cryptographic build pipelines to bundle and compress project memory index algorithms.
                            </p>}

                          <button
      onClick={handleCompileTrigger}
      disabled={isCompiling}
      className={`w-full h-9 flex items-center justify-center gap-2 font-mono text-[11px] font-bold uppercase rounded-lg transition-all ${isCompiling ? "bg-zinc-900 text-zinc-500 border border-zinc-850 cursor-not-allowed" : "bg-zinc-100 hover:bg-white text-zinc-950"}`}
    >
                            <Play className="w-3.5 h-3.5 cursor-pointer" />
                            <span>{isCompiling ? "Compiling system modules" : "Trigger Wasm Compilation"}</span>
                          </button>
                        </div>}

                      {node.id === "guard-03" && <div className="space-y-2">
                          <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-950/80 border border-zinc-900 text-xs">
                            <span className="text-zinc-400 font-mono text-[10px]">INFERENCE THRESHOLD GUARD</span>
                            <span className="text-emerald-400 font-bold">100% SECURE</span>
                          </div>
                          <p className="text-[10px] text-zinc-500 font-sans leading-normal">
                            Strict safety policies encrypt workspace inputs inside client contexts. Decryption layer algorithms are fully operational.
                          </p>
                        </div>}

                      {node.id === "wave-04" && <div className="space-y-3">
                          <div className="space-y-1">
                            <div className="flex justify-between text-[11px] font-mono text-zinc-400">
                              <span>Solenoid Output Frequency</span>
                              <span className={`font-bold ${theme.textAccent}`}>{ambientFreq} Hz (Sine)</span>
                            </div>
                            <input
      type="range"
      min="200"
      max="800"
      value={ambientFreq}
      onChange={(e) => {
        setAmbientFreq(Number(e.target.value));
      }}
      className="w-full h-1 bg-zinc-800 rounded accent-zinc-100 cursor-pointer"
    />
                          </div>

                          <div className="flex items-center gap-2 text-xs text-zinc-400 justify-between bg-zinc-950 p-2.5 rounded-lg border border-zinc-900">
                            <span className="flex items-center gap-1.5 font-mono text-[10px]">
                              <Radio className={`w-3.5 h-3.5 animate-pulse ${theme.textAccent}`} /> SYSTEM FOCUS NOMINAL
                            </span>
                            <span className="text-[10px] font-mono text-zinc-600">Latency: 0.1ms</span>
                          </div>
                        </div>}

                    </div>
                  </motion.div>;
  })()}
            </AnimatePresence>

          </div>
        </div>
      </motion.div>

      {
    /* 3. NEW: NEURAL ATTENTION MAP & INTERACTIVE NODE NETWORK GRAPH */
  }
      <motion.div variants={itemVariants} className="p-6 bg-zinc-950/60 border border-zinc-900 rounded-2xl relative shadow-xl overflow-hidden grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {
    /* Visualization area */
  }
        <div className="lg:col-span-2 relative flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-zinc-900/60 pb-3 mb-4">
            <div className="flex items-center gap-2">
              <Network className={`w-4 h-4 ${theme.textAccent}`} />
              <span className="text-xs font-mono font-bold text-zinc-300">NEURAL KNOWLEDGE VECTOR MAP</span>
            </div>
            <span className="text-[10px] font-mono text-zinc-650">SECURE SHELL CONFLICT RESOLVER</span>
          </div>

          {
    /* Glowing canvas element */
  }
          <div className="bg-zinc-950/45 rounded-xl border border-zinc-900/80 relative overflow-hidden h-[240px]">
            <canvas ref={canvasRef} className="w-full h-full block" />
            <div className="absolute bottom-3 left-3 px-2 py-1 bg-zinc-950/80 border border-zinc-900 rounded-md pointer-events-none text-[8.5px] font-mono text-zinc-500">
              [DRAG MOUSE FOR MAGNETISM • CLICK FOR DETAILS]
            </div>
          </div>
        </div>

        {
    /* Selected nodes details readout card */
  }
        <div className="bg-zinc-900/25 border border-zinc-950 rounded-xl p-5 flex flex-col justify-between min-h-[220px]">
          <div className="space-y-4">
            <span className="font-mono text-[9px] font-extrabold tracking-wider text-zinc-500 uppercase block border-b border-zinc-900 pb-2">
              NODE INTERPRETER MESH
            </span>

            <AnimatePresence mode="wait">
              {selectedGraphNode ? <motion.div
    key={selectedGraphNode.id}
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -5 }}
    className="space-y-3"
  >
                  <div className="flex items-center gap-1.5 text-xs text-zinc-200">
                    <span className={`w-2 h-2 rounded-full`} style={{ backgroundColor: `rgb(${theme.rawRGB})` }} />
                    <span className="font-mono uppercase text-[10px] tracking-wide font-extrabold text-zinc-400">
                      [{selectedGraphNode.type}] Node Active
                    </span>
                  </div>

                  <h4 className="text-sm font-display font-medium text-zinc-100 leading-snug">
                    {selectedGraphNode.label}
                  </h4>

                  <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
                    This unit coordinates logical connections inside our vector memory banks. Clicking it executes telemetry hooks instantly.
                  </p>

                  <div className="pt-2">
                    <button
    onClick={() => {
      playSfx("click");
      const route = selectedGraphNode.type === "note" ? "/notes" : selectedGraphNode.type === "task" ? "/tasks" : "/";
      navigate(route);
    }}
    className={`text-[10px] font-mono font-bold tracking-brand ${theme.textAccent} hover:underline flex items-center gap-1`}
  >
                      <span>Jump to editor frame</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div> : <div className="py-6 text-center space-y-2">
                  <Activity className="w-8 h-8 text-zinc-650 mx-auto animate-pulse" />
                  <p className="text-xs text-zinc-500 font-sans leading-relaxed max-w-[200px] mx-auto">
                    No individual node selected. Click any floating orbital sphere above to interpret parameters.
                  </p>
                </div>}
            </AnimatePresence>
          </div>

          <div className="text-[9.5px] font-mono text-zinc-600 mt-4 leading-normal flex items-center gap-1 bg-zinc-950 p-2 rounded-lg border border-zinc-900">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span>Local context indexes synchronized. Ready.</span>
          </div>
        </div>

      </motion.div>

      {
    /* 4. Top-tier bento stats widgets summary row */
  }
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {
    /* Stat Box 1: Task Board Metric */
  }
        <motion.div
    variants={itemVariants}
    className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl flex flex-col justify-between group hover:border-zinc-850 transition-all shadow-md relative overflow-hidden"
  >
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/2 rounded-full blur-2xl font-mono" />
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-900/60">
            <span className="text-[11px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Target Tasks</span>
            <div className="p-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 text-zinc-400">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display font-bold text-2xl text-zinc-100">{completedTasks}</span>
            <span className="text-xs text-zinc-500 font-sans">/ {totalTasks} complete</span>
          </div>
          {
    /* Micro analytics progress bar */
  }
          <div className="mt-4.5 space-y-1.5">
            <div className="w-full h-1.5 rounded-full bg-zinc-900 overflow-hidden border border-zinc-900/40">
              <div
    className="h-full rounded-full"
    style={{ width: `${productivityRatio}%`, backgroundColor: `rgb(${theme.rawRGB})` }}
  />
            </div>
            <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span>Sprint Efficiency</span>
              <span className={`font-semibold ${theme.textAccent}`}>{productivityRatio}%</span>
            </div>
          </div>
        </motion.div>

        {
    /* Stat Box 2: System Documents Metric */
  }
        <motion.div
    variants={itemVariants}
    className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl flex flex-col justify-between group hover:border-zinc-850 transition-all shadow-md relative overflow-hidden"
  >
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/2 rounded-full blur-2xl" />
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-900/60">
            <span className="text-[11px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Document Indexes</span>
            <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display font-bold text-2xl text-zinc-100">{notes.length}</span>
            <span className="text-xs text-zinc-500 font-sans">blueprints indexed</span>
          </div>
          
          <div className="mt-4.5 flex items-center justify-between text-[10px] font-mono text-zinc-500 bg-zinc-900/40 p-2 border border-zinc-855 rounded-lg">
            <span>Starred Docs</span>
            <span className={`font-bold ${theme.textAccent}`}>{favoriteNotesCount} items</span>
          </div>
        </motion.div>

        {
    /* Stat Box 3: Local System Performance metric */
  }
        <motion.div
    variants={itemVariants}
    className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl flex flex-col justify-between group hover:border-zinc-850 transition-all shadow-md relative overflow-hidden"
  >
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/2 rounded-full blur-2xl" />
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-900/60">
            <span className="text-[11px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">AI CPU Node</span>
            <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-400">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display font-bold text-2xl text-zinc-100">1.24%</span>
            <span className="text-xs text-zinc-500 font-sans">workspace load</span>
          </div>
          
          <div className="mt-4.5 flex items-center justify-between text-[10px] font-mono text-zinc-500 bg-zinc-900/40 p-2 border border-zinc-855 rounded-lg">
            <span>Inference Lag</span>
            <span className={`font-bold ${theme.textAccent}`}>120ms</span>
          </div>
        </motion.div>

        {
    /* Stat Box 4: Current Developer Streak (The Flame) */
  }
        <motion.div
    variants={itemVariants}
    className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl flex flex-col justify-between group hover:border-zinc-850 transition-all shadow-md relative overflow-hidden"
  >
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/2 rounded-full blur-2xl" />
          <div className="flex items-center justify-between pb-3.5 border-b border-zinc-900/60">
            <span className="text-[11px] font-mono font-semibold text-zinc-500 uppercase tracking-wider">Focus Streak</span>
            <div className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-850 text-zinc-500">
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="font-display font-bold text-2xl text-zinc-100">8 Days</span>
            <span className="text-xs text-zinc-500 font-mono flex items-center gap-1 text-[10px]">
              <Flame className="w-3 h-3 inline text-rose-500" />
              HOT BUILD
            </span>
          </div>
          
          <div className="mt-4.5 flex items-center justify-between text-[10px] font-mono text-zinc-500 bg-zinc-900/45 p-2 border border-zinc-855 rounded-lg">
            <span>Streak Priority</span>
            <span className="text-rose-450 font-bold">Unbroken</span>
          </div>
        </motion.div>

      </div>

      {
    /* 5. Outer Bento Row: AI Copilot summary (wider) & Recent activity feed (medium) */
  }
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {
    /* Bento Column 1 & 2: Dedicated AI Copilot Card */
  }
        <motion.div
    variants={itemVariants}
    className="lg:col-span-2 p-6 bg-gradient-to-br from-zinc-950 to-zinc-900/45 border border-zinc-900 rounded-2xl flex flex-col justify-between relative shadow-xl overflow-hidden group hover:border-zinc-850 transition-all"
  >
          {
    /* Subtle decoration vector lines */
  }
          <div className="absolute top-[-30%] right-[-10%] w-72 h-72 bg-gradient-to-br from-cyan-500/10 to-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
          
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className={`p-1 px-2 text-[9px] font-mono font-semibold tracking-wider rounded border ${theme.badgeAccent}`}>
                ACTIVE AI INFERENCE ENGINE
              </div>
              <span className="text-zinc-600 font-mono text-[10px]">v2.5_PRO</span>
            </div>

            <div className="space-y-2">
              <h3 className="font-display font-bold text-lg text-zinc-100 group-hover:text-white transition-colors">
                Intelligently index and refactor workspace components.
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans max-w-lg">
                Your IntelliOS co-pilot runs contextual analysis on active Remembered Blueprints (like Cargo rules and WebAssembly setups) and connects targets inside your Target board automatically. Click below to initialize a chat loop instruction block.
              </p>
            </div>

            {
    /* Quick Prompts Suggestions pills */
  }
            <div className="pt-2">
              <div className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase mb-2">INTELLIGENT MACROS</div>
              <div className="flex flex-wrap gap-2">
                <button
    onClick={() => {
      playSfx("click");
      navigate("/chat");
    }}
    className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-left text-[11px] font-sans font-medium text-zinc-300 border border-zinc-850 transition-all cursor-pointer"
  >
                  "Explain Rust WASM compiler config"
                </button>
                <button
    onClick={() => {
      playSfx("click");
      navigate("/chat");
    }}
    className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-left text-[11px] font-sans font-medium text-zinc-300 border border-zinc-850 transition-all cursor-pointer"
  >
                  "Generate TS Container dimension React hook"
                </button>
                <button
    onClick={() => {
      playSfx("click");
      navigate("/chat");
    }}
    className="px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-left text-[11px] font-sans font-medium text-zinc-300 border border-zinc-850 transition-all cursor-pointer"
  >
                  "Scan memory leakage pipelines"
                </button>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-900/60 mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                <Terminal className="w-4.5 h-4.5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[11px] font-mono font-bold tracking-wider text-zinc-650 leading-none uppercase">CONVERSATION MEMORY</span>
                <span className="text-xs text-zinc-300 font-medium mt-1">Context Window Ready (Indexed docs + targets)</span>
              </div>
            </div>

            <button
    onClick={() => {
      playSfx("click");
      navigate("/chat");
    }}
    className={`px-3.5 h-9 flex items-center justify-center gap-1.5 text-xs font-semibold rounded-xl border relative group cursor-pointer transition-all shrink-0 ${theme.borderAccent} ${theme.textAccent}`}
  >
              <span>Initialize Node</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </motion.div>

        {
    /* Bento Column 3: Live Staggered Activity timeline */
  }
        <motion.div
    variants={itemVariants}
    className="p-5 bg-zinc-950/60 border border-zinc-900 rounded-2xl flex flex-col justify-between group hover:border-zinc-850 transition-all shadow-md relative overflow-hidden"
  >
          <div className="flex items-center justify-between pb-3 border-b border-zinc-900/60">
            <span className="text-xs font-semibold text-zinc-200">Session Diagnostics Stream</span>
            <span className="text-[10px] font-mono text-zinc-500 flex items-center gap-1">
              <Activity className={`w-3 h-3 animate-pulse ${theme.textAccent}`} />
              Realtime
            </span>
          </div>

          {
    /* Activity listing box */
  }
          <div className="flex-1 overflow-y-auto max-h-[294px] py-2 whitespace-nowrap divide-y divide-zinc-900/40">
            {recentActivities.map((act) => <div key={act.id} className="py-2.5 flex items-start gap-2.5">
                <div className="p-1 rounded-md bg-zinc-900 border border-zinc-850 text-zinc-400 shrink-0 mt-0.5">
                  <Clock className="w-3 h-3 text-zinc-500" />
                </div>
                <div className="flex-1 min-w-0 flex flex-col text-left">
                  <span className="text-[11px] font-semibold text-zinc-300 truncate tracking-tight">{act.title}</span>
                  <span className="text-[10px] text-zinc-500 truncate leading-normal">{act.description}</span>
                </div>
                <span className="text-[9px] font-mono text-zinc-600 self-center">{act.timestamp}</span>
              </div>)}
          </div>

          <div className="pt-3.5 border-t border-zinc-900/60 mt-3.5">
            <button
    onClick={() => {
      playSfx("click");
      setCommandBarOpen(true);
    }}
    className="w-full py-2 flex items-center justify-center gap-1 text-[10px] font-bold font-mono tracking-wider text-zinc-500 hover:text-zinc-300 rounded-lg hover:bg-zinc-900/50 transition-all uppercase border border-zinc-900 hover:border-zinc-800"
  >
              <span>Trigger Command Diagnostics Log</span>
            </button>
          </div>
        </motion.div>

      </div>

    </motion.div>;
};
