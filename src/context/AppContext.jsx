import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { SynthEngine } from "../lib/synthEngine";
import {
  checkBackendHealth,
  sendChatMessage as apiSendChat,
  getActivePageFromHash
} from "../lib/intelliosApi";
import { intelliosSocket } from "../lib/intelliosSocket";
const AppContext = createContext(void 0);
const SEED_NOTES = [
  {
    id: "note-1",
    title: "\u{1F310} Core Hybrid-Architecture Blueprint",
    content: `## Architecture Principles
1. **Edge Cache Syncing**: Use Service Workers to store core database schemas offline.
2. **Context-Aware LLM Embedding**: Capture active codebase paths and feed them into the attention window.
3. **WebGL Rendering Pipelines**: Render code flow diagrams dynamically with 60 FPS performance.

## Pipeline Optimization Tricks
- Batch multi-layer canvas redraws.
- Avoid garbage injection during high-frequency frame shifts.`,
    updatedAt: "10 min ago",
    category: "System Design",
    isFavorite: true
  },
  {
    id: "note-2",
    title: "\u26A1 Rust WebAssembly Bindings",
    content: `## Compilation Guidelines
To package the cryptographic hashing modules, compile Rust to WebAssembly with high optimization flags:

\`\`\`bash
wasm-pack build --target web --release
\`\`\`

Ensure memory is shared across context loops to avoid memory heap leak alerts during recursive telemetry steps.`,
    updatedAt: "2 hours ago",
    category: "Backend",
    isFavorite: false
  },
  {
    id: "note-3",
    title: "\u{1F9E0} AI Reinforcement Training Prompts",
    content: `## Prompt Engineering Rulebook
When prompting code repair loops:
- Focus first on type declarations inside \`src/types.ts\`.
- Never write boilerplate closures. Use flat modern maps.
- Prefix response modules with clear file coordinates.`,
    updatedAt: "Yesterday",
    category: "Prompt Engineering",
    isFavorite: true
  }
];
const SEED_TASKS = [
  {
    id: "task-1",
    title: "Optimize WebGL canvas backdrop rendering",
    description: "Resolve high CPU utilization during intense backdrop gradient rendering loops. Investigate requestAnimationFrame bottlenecks.",
    status: "in_progress",
    priority: "urgent",
    dueDate: "In 2 hours",
    category: "Frontend"
  },
  {
    id: "task-2",
    title: "Integrate workspace context indexes",
    description: "Map out the project directories and pre-calculate local keyword vector paths for faster command bar search speeds.",
    status: "todo",
    priority: "high",
    dueDate: "Tomorrow",
    category: "AI Pipeline"
  },
  {
    id: "task-3",
    title: "Write custom WebAssembly compiler scripts",
    description: "Complete the bash compilation process integrating Rust cargo pipelines into the standard Vite bundle step.",
    status: "backlog",
    priority: "medium",
    dueDate: "Next week",
    category: "Backend"
  },
  {
    id: "task-4",
    title: "Add responsive drawer transitions UI",
    description: "Make sure all drawer panel slides are highly dynamic and support swipe triggers on touchscreen notebooks.",
    status: "completed",
    priority: "low",
    dueDate: "Completed yesterday",
    category: "Design"
  }
];
const SEED_CHATS = [
  {
    id: "chat-1",
    sender: "assistant",
    text: "Greetings. I am **IntelliOS Assistant**, your workspace context agent. I have loaded your local development profile and indexed your directory trees. How can I assist you with your builds today?",
    timestamp: "10:15 AM"
  }
];
const SEED_ACTIVITIES = [
  {
    id: "act-1",
    type: "system",
    title: "Workspace Initialized",
    description: "Workspace indexer successfully compiled 4 modules and indexed 16 documents.",
    timestamp: "5m"
  },
  {
    id: "act-2",
    type: "note",
    title: "Note updated",
    description: 'Edited "\u{1F310} Core Hybrid-Architecture Blueprint"',
    timestamp: "10m",
    meta: "System Design"
  },
  {
    id: "act-3",
    type: "task",
    title: "Task progress modified",
    description: "Moved WebGL backdrop rendering check loop to [In Progress]",
    timestamp: "1h"
  }
];
const SEED_PROFILE = {
  name: "Dev Cadet",
  email: "cadet@intellios.net",
  role: "Lead Architect",
  avatar: "\u{1F680}",
  openaiKeyPreset: true,
  geminiModel: "gemini-2.5-pro",
  theme: "dark",
  autoSave: true
};
export const AppProvider = ({ children }) => {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("intellios_notes");
    return saved ? JSON.parse(saved) : SEED_NOTES;
  });
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("intellios_tasks");
    return saved ? JSON.parse(saved) : SEED_TASKS;
  });
  const [chatMessages, setChatMessages] = useState(() => {
    const saved = localStorage.getItem("intellios_chats");
    return saved ? JSON.parse(saved) : SEED_CHATS;
  });
  const [recentActivities, setRecentActivities] = useState(() => {
    const saved = localStorage.getItem("intellios_activities");
    return saved ? JSON.parse(saved) : SEED_ACTIVITIES;
  });
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem("intellios_profile");
    return saved ? JSON.parse(saved) : SEED_PROFILE;
  });
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [commandBarOpen, setCommandBarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [backendOnline, setBackendOnline] = useState(false);
  const [useStreaming, setUseStreaming] = useState(false);
  const streamMsgIdRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const [engineTheme, setEngineThemeState] = useState(() => {
    const saved = localStorage.getItem("intellios_engine_theme");
    return saved || "cyan";
  });
  const [synthHum, setSynthHumState] = useState("none");
  const [audioFeedback, setAudioFeedback] = useState(() => {
    const saved = localStorage.getItem("intellios_audio_feedback");
    return saved ? JSON.parse(saved) : true;
  });
  const [synthVol, setSynthVolState] = useState(() => {
    const saved = localStorage.getItem("intellios_synth_vol");
    return saved ? JSON.parse(saved) : 0.25;
  });
  const setEngineTheme = (theme) => {
    setEngineThemeState(theme);
    localStorage.setItem("intellios_engine_theme", theme);
  };
  const setSynthHum = (type) => {
    setSynthHumState(type);
    SynthEngine.startAmbientHum(type);
  };
  const setSynthVol = (vol) => {
    setSynthVolState(vol);
    localStorage.setItem("intellios_synth_vol", String(vol));
    SynthEngine.setHumVolume(vol);
  };
  useEffect(() => {
    localStorage.setItem("intellios_audio_feedback", JSON.stringify(audioFeedback));
  }, [audioFeedback]);
  const playSfx = (type) => {
    if (audioFeedback) {
      SynthEngine.playTonalSFX(type);
    }
  };
  useEffect(() => {
    SynthEngine.setHumVolume(synthVol);
  }, []);
  useEffect(() => {
    setIsAiTyping(false);
    streamMsgIdRef.current = null;
  }, []);
  const cancelAiRequest = useCallback(() => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    streamMsgIdRef.current = null;
    setIsAiTyping(false);
    setChatMessages(
      (prev) => prev.filter((m) => !(m.sender === "assistant" && !m.text.trim()))
    );
  }, []);
  const startTypingGuard = useCallback(() => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      cancelAiRequest();
      const errMsg = {
        id: `chat-err-${Date.now()}`,
        sender: "assistant",
        text: "**Request timed out.** The inference queue was cleared. Try again or use the trash icon to reset the thread.",
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setChatMessages((prev) => [...prev.filter((m) => m.text.trim()), errMsg]);
    }, 45e3);
  }, [cancelAiRequest]);
  const handleChatError = useCallback(
    (message) => {
      cancelAiRequest();
      setBackendOnline(false);
      const errMsg = {
        id: `chat-err-${Date.now()}`,
        sender: "assistant",
        text: `**Inference unavailable.** ${message}

Using offline responses for this session. Refresh the page if the queue indicator stays stuck.`,
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      };
      setChatMessages((prev) => [...prev, errMsg]);
    },
    [cancelAiRequest]
  );
  useEffect(() => {
    checkBackendHealth().then((ok) => {
      setBackendOnline(ok);
      if (ok) {
        intelliosSocket.connect({
          onToken: (token) => {
            const id = streamMsgIdRef.current;
            if (!id) return;
            setChatMessages(
              (prev) => prev.map(
                (m) => m.id === id ? { ...m, text: m.text + token } : m
              )
            );
          },
          onTyping: (active) => {
            setIsAiTyping(active);
            if (!active && typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
              typingTimeoutRef.current = null;
            }
          },
          onComplete: (result) => {
            if (typingTimeoutRef.current) {
              clearTimeout(typingTimeoutRef.current);
              typingTimeoutRef.current = null;
            }
            handleAiResponse(result);
            streamMsgIdRef.current = null;
          },
          onChatError: handleChatError,
          onError: handleChatError
        });
      }
    });
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      intelliosSocket.disconnect();
    };
  }, [handleChatError]);
  const buildWorkspaceSnapshot = useCallback(() => ({
    activePage: getActivePageFromHash(),
    activeProject: "intellios-workspace",
    openWorkspace: "default",
    notes,
    tasks,
    recentActivities,
    userProfile,
    model: userProfile.geminiModel
  }), [notes, tasks, recentActivities, userProfile]);
  const applyCommandMutations = (result) => {
    if (result.clearChat) {
      clearChat();
      return;
    }
    result.mutations?.notes?.forEach((n) => {
      addNote(n.title, n.content, n.category);
    });
    result.mutations?.tasks?.forEach((t) => {
      addTask(
        t.title,
        t.description,
        t.priority,
        t.status,
        t.category
      );
    });
  };
  const formatAssistantMessage = (content, codeSnippet) => ({
    id: `chat-${Date.now()}`,
    sender: "assistant",
    text: content,
    timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    codeSnippet
  });
  const handleAiResponse = (result) => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
    setIsAiTyping(false);
    applyCommandMutations(result);
    const content = result.message?.content;
    if (!content) {
      streamMsgIdRef.current = null;
      return;
    }
    if (streamMsgIdRef.current) {
      setChatMessages(
        (prev) => prev.map(
          (m) => m.id === streamMsgIdRef.current ? {
            ...m,
            text: content,
            codeSnippet: result.message?.codeSnippet ?? m.codeSnippet
          } : m
        )
      );
    } else {
      const assistantMsg = formatAssistantMessage(content, result.message?.codeSnippet);
      setChatMessages((prev) => [...prev, assistantMsg]);
    }
    addActivity("chat", "AI Core response", `Neural inference: ${result.mode || "chat"}`);
    streamMsgIdRef.current = null;
  };
  useEffect(() => {
    localStorage.setItem("intellios_notes", JSON.stringify(notes));
  }, [notes]);
  useEffect(() => {
    localStorage.setItem("intellios_tasks", JSON.stringify(tasks));
  }, [tasks]);
  useEffect(() => {
    localStorage.setItem("intellios_chats", JSON.stringify(chatMessages));
  }, [chatMessages]);
  useEffect(() => {
    localStorage.setItem("intellios_activities", JSON.stringify(recentActivities));
  }, [recentActivities]);
  useEffect(() => {
    localStorage.setItem("intellios_profile", JSON.stringify(userProfile));
  }, [userProfile]);
  const addActivity = (type, title, description, meta) => {
    const newAct = {
      id: `act-${Date.now()}`,
      type,
      title,
      description,
      timestamp: "Just now",
      meta
    };
    setRecentActivities((prev) => [newAct, ...prev.slice(0, 9)]);
  };
  const addNote = (title, content, category) => {
    const newNote = {
      id: `note-${Date.now()}`,
      title: title.trim() || "Untitled Document",
      content: content || "",
      updatedAt: "Just now",
      category: category.trim() || "General",
      isFavorite: false
    };
    setNotes((prev) => [newNote, ...prev]);
    addActivity("note", "Note created", `Created draft "${newNote.title}"`, newNote.category);
  };
  const updateNote = (id, updates) => {
    setNotes((prev) => prev.map((note) => {
      if (note.id === id) {
        const u = { ...note, ...updates, updatedAt: "Just now" };
        return u;
      }
      return note;
    }));
  };
  const deleteNote = (id) => {
    const found = notes.find((n) => n.id === id);
    setNotes((prev) => prev.filter((note) => note.id !== id));
    if (found) {
      addActivity("note", "Note deleted", `Successfully discarded "${found.title}"`);
    }
  };
  const addTask = (title, description, priority, status, category) => {
    const newTask = {
      id: `task-${Date.now()}`,
      title: title.trim() || "New System Objective",
      description,
      status,
      priority,
      dueDate: "Soon",
      category: category || "Default"
    };
    setTasks((prev) => [...prev, newTask]);
    addActivity("task", "Task created", `Added "${newTask.title}" to target workflow`, newTask.category);
  };
  const updateTask = (id, updates) => {
    setTasks((prev) => prev.map((task) => {
      if (task.id === id) {
        const t = { ...task, ...updates };
        return t;
      }
      return task;
    }));
  };
  const deleteTask = (id) => {
    const found = tasks.find((t) => t.id === id);
    setTasks((prev) => prev.filter((task) => task.id !== id));
    if (found) {
      addActivity("task", "Task deleted", `Removed objective "${found.title}"`);
    }
  };
  const generateSimulatedResponse = (userText) => {
    const txt = userText.toLowerCase().trim();
    setIsAiTyping(true);
    setTimeout(() => {
      let responseText = "";
      let codeObj = void 0;
      if (txt.includes("help") || txt.includes("command") || txt.includes("os")) {
        responseText = `IntelliOS commands are activated globally or in local context frames. Here are your available operational hooks:

1. **Ctrl + K**: Launch the Unified Search & Spotlight Command Bar
2. \`/note [title]\`: Quickly generate a blueprint schema
3. \`/task [title]\`: Register a compiler target objective
4. \`/clear\`: Reset our current conversational thread

Our agent context currently spans 3 detailed docs and 4 pending sprint directives. Ready to run optimizations.`;
      } else if (txt.includes("create note") || txt.includes("/note")) {
        const titlePart = userText.replace(/^\/note\s*/, "").trim() || "AI Generated Blueprint";
        addNote(titlePart, `Generated context notes concerning: ${titlePart}

- Primary focus nodes verified
- High availability latency index matched`, "AI Generation");
        responseText = `Created new Note blueprint titled: **"${titlePart}"**. You can view or refine it in the *Notes Tab*. Let me know if you need helper code inside it!`;
      } else if (txt.includes("create task") || txt.includes("/task")) {
        const titlePart = userText.replace(/^\/task\s*/, "").trim() || "AI Target Node";
        addTask(titlePart, "Synthesized via AI system commands.", "medium", "todo", "Workspace");
        responseText = `Synchronized Task node is online: **"${titlePart}"**. Registered as a high-priority work directive inside the *Target Board*.`;
      } else if (txt.includes("rust") || txt.includes("wasm") || txt.includes("rust-analyzer")) {
        responseText = `Analyzing Rust WebAssembly configuration parameters. I recommend establishing the optimal cargo manifest profiles to secure fast compile runtimes. Let's update your project structure with this reference rule block:`;
        codeObj = {
          code: `[package]
name = "intellios_wasm_core"
version = "0.1.0"
edition = "2021"

[lib]
crate-type = ["cdylib", "rlib"]

[dependencies]
wasm-bindgen = "0.2.89"
js-sys = "0.3.66"
web-sys = { version = "0.3.66", features = ["console"] }

[profile.release]
opt-level = "s" # Optimize for binary size
lto = true      # Link-time optimization`,
          language: "toml",
          filePath: "cargo.toml"
        };
      } else if (txt.includes("code") || txt.includes("typescript") || txt.includes("react")) {
        responseText = `Here is a reusable React custom hook framework for tracking frame dimensions dynamically inside IntelliOS to secure layout precision without thread blockage:`;
        codeObj = {
          code: `import { useState, useEffect, useRef, RefObject } from 'react';

export function useContainerDimensions(ref: RefObject<HTMLDivElement | null>) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!ref.current) return;
    
    // Utilize ResizeObserver to handle layout mutations smoothly
    const observer = new ResizeObserver(([entry]) => {
      setDimensions({
        width: entry.contentRect.width,
        height: entry.contentRect.height,
      });
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);

  return dimensions;
}`,
          language: "typescript",
          filePath: "hooks/useDimensions.ts"
        };
      } else if (txt.includes("status") || txt.includes("stats")) {
        responseText = `Scanning system runtime telemetry...
- **System CPU state**: \`1.24% workload\` (WebGL frame buffer optimized)
- **Active Threads**: \`2 persistent memory workers active\`
- **Database Index Status**: \`Cold Storage Sync complete\`
- **Recent Activities**: Recorded \`${recentActivities.length}\` items in current workspace sessions.`;
      } else {
        responseText = `I have received your command: *"${userText}"*. 

As your development copilot, I am scanning your local notes workspace and sprint items to find logical links. You can ask me regarding **Rust-WASM compilation**, generating **TypeScript layout hooks**, registering objects via \`/note\` or \`/task\`, or system operational diagnostics.

What layout or pipeline segments shall we optimize next?`;
      }
      const assistantMsg = {
        id: `chat-${Date.now()}`,
        sender: "assistant",
        text: responseText,
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        codeSnippet: codeObj
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
      addActivity("chat", "AI copilot response", `Generated advice on "${userText.slice(0, 20)}..."`);
      setIsAiTyping(false);
    }, 1200);
  };
  const sendChatMessage = async (text) => {
    if (!text.trim()) return;
    const userMsg = {
      id: `chat-${Date.now()}`,
      sender: "user",
      text,
      timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    setChatMessages((prev) => [...prev, userMsg]);
    addActivity("chat", "User interaction", `Queried AI: "${text.slice(0, 25)}..."`);
    if (backendOnline) {
      setIsAiTyping(true);
      startTypingGuard();
      const workspace = buildWorkspaceSnapshot();
      const streamId = `chat-stream-${Date.now()}`;
      const usedWs = useStreaming && intelliosSocket.isConnected() && intelliosSocket.streamChat(text, workspace);
      if (usedWs) {
        streamMsgIdRef.current = streamId;
        setChatMessages((prev) => [
          ...prev,
          {
            id: streamId,
            sender: "assistant",
            text: "",
            timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          }
        ]);
        return;
      }
      try {
        const result = await apiSendChat(text, workspace);
        handleAiResponse(result);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Request failed";
        handleChatError(msg);
        generateSimulatedResponse(text);
      }
      return;
    }
    generateSimulatedResponse(text);
  };
  const clearChat = () => {
    cancelAiRequest();
    setChatMessages([
      {
        id: "chat-init",
        sender: "assistant",
        text: "Greetings. I am **IntelliOS Assistant**, your workspace context agent. Thread has been successfully reset. Ask me anything about your structures.",
        timestamp: (/* @__PURE__ */ new Date()).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };
  return <AppContext.Provider value={{
    notes,
    tasks,
    recentActivities,
    chatMessages,
    userProfile,
    sidebarExpanded,
    commandBarOpen,
    searchQuery,
    isAiTyping,
    backendOnline,
    useStreaming,
    // Theme & audio controls
    engineTheme,
    setEngineTheme,
    synthHum,
    setSynthHum,
    audioFeedback,
    setAudioFeedback,
    synthVol,
    setSynthVol,
    playSfx,
    setSidebarExpanded,
    setCommandBarOpen,
    setSearchQuery,
    setUserProfile,
    addNote,
    updateNote,
    deleteNote,
    addTask,
    updateTask,
    deleteTask,
    sendChatMessage,
    clearChat,
    cancelAiRequest,
    addActivity
  }}>
      {children}
    </AppContext.Provider>;
};
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside the AppProvider context container.");
  return context;
};
