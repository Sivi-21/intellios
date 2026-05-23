import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Terminal, 
  MessageSquareCode, 
  BookOpen, 
  Briefcase, 
  Settings, 
  Sparkles,
  Command,
  Activity,
  Plus
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CommandBar: React.FC = () => {
  const { 
    commandBarOpen, 
    setCommandBarOpen, 
    addNote, 
    addTask, 
    clearChat, 
    addActivity 
  } = useApp();
  
  const [inputVal, setInputVal] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Handle keybindings globally for ⌘K or Ctrl+K toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandBarOpen(prev => !prev);
        setInputVal('');
      }
      
      // Close on Esape
      if (e.key === 'Escape' && commandBarOpen) {
        setCommandBarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandBarOpen, setCommandBarOpen]);

  // Focus input automatically when opened
  useEffect(() => {
    if (commandBarOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    }
  }, [commandBarOpen]);

  const commandItems = [
    {
      id: 'goto-dashboard',
      category: 'NAVIGATION',
      title: 'Navigate to Dashboard',
      subtitle: 'View architectural overview and status cards',
      icon: Terminal,
      action: () => navigate('/')
    },
    {
      id: 'goto-chat',
      category: 'NAVIGATION',
      title: 'Navigate to AI Intelligence Node',
      subtitle: 'Start an instruction thread with the copilot agent',
      icon: MessageSquareCode,
      action: () => navigate('/chat')
    },
    {
      id: 'goto-notes',
      category: 'NAVIGATION',
      title: 'Navigate to Document Index',
      subtitle: 'Open developer blueprints and system drafts',
      icon: BookOpen,
      action: () => navigate('/notes')
    },
    {
      id: 'goto-tasks',
      category: 'NAVIGATION',
      title: 'Navigate to Target Board',
      subtitle: 'Manage active system epics and check-off targets',
      icon: Briefcase,
      action: () => navigate('/tasks')
    },
    {
      id: 'goto-settings',
      category: 'NAVIGATION',
      title: 'Navigate to System Config',
      subtitle: 'Oversee profile states and workspace model overrides',
      icon: Settings,
      action: () => navigate('/settings')
    },
    {
      id: 'action-note',
      category: 'VIRTUAL ACTIONS',
      title: 'Create note blueprint: "/note [title]"',
      subtitle: 'Spawn a document block instantly to local indexes',
      icon: Plus,
      action: () => {
        const title = inputVal.replace(/^\/note\s*/i, '').trim() || 'Unprompted Blueprint';
        addNote(title, `Created dynamically via IntelliOS Global Command Bar. Ready for details...\n\n- Timestamp: ${new Date().toLocaleString()}`, 'Synthesized');
        setInputVal('');
        addActivity('note', 'Document Created', `Created note: "${title}" via Command Palette`);
      }
    },
    {
      id: 'action-task',
      category: 'VIRTUAL ACTIONS',
      title: 'Spawn Workspace Objective: "/task [title]"',
      subtitle: 'Add a new workflow target in the Sprint lists',
      icon: Sparkles,
      action: () => {
        const title = inputVal.replace(/^\/task\s*/i, '').trim() || 'AI Sprint Target';
        addTask(title, 'Provisioned instantly via Ctrl+K command triggers.', 'high', 'todo', 'Command-Palette');
        setInputVal('');
        addActivity('task', 'Objective Synced', `Created target: "${title}" via Command Palette`);
      }
    },
    {
      id: 'action-clear',
      category: 'DIAGNOSTICS',
      title: 'Reset AI Copilot memory stream',
      subtitle: 'Wipe current chat conversation logs in session buffer',
      icon: Settings,
      action: () => {
        clearChat();
        setInputVal('');
      }
    },
    {
      id: 'action-diagnostics',
      category: 'DIAGNOSTICS',
      title: 'Run Workspace telemetry scanner',
      subtitle: 'Execute full mock compile audits on system components',
      icon: Activity,
      action: () => {
        addActivity('system', 'Audits executed', 'Manual compilation checks: 0 code warnings, WebAssembly binds green.');
        alert("Diagnostics scan initiated! All modules compiled successfully.");
        setInputVal('');
      }
    }
  ];

  // Filtering based on user string input
  const filteredCommands = commandItems.filter(item => {
    const q = inputVal.toLowerCase().trim();
    if (!q) return true;
    
    // Check if user is trying to trigger special commands like /note or /task
    if (q.startsWith('/note') && item.id === 'action-note') return true;
    if (q.startsWith('/task') && item.id === 'action-task') return true;
    
    return item.title.toLowerCase().includes(q) || 
           item.subtitle.toLowerCase().includes(q) ||
           item.category.toLowerCase().includes(q);
  });

  // Handle arrow routing
  useEffect(() => {
    const handleNavKeys = (e: KeyboardEvent) => {
      if (!commandBarOpen) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % Math.max(filteredCommands.length, 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + filteredCommands.length) % Math.max(filteredCommands.length, 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          setCommandBarOpen(false);
        }
      }
    };

    window.addEventListener('keydown', handleNavKeys);
    return () => window.removeEventListener('keydown', handleNavKeys);
  }, [commandBarOpen, selectedIndex, filteredCommands]);

  // Group commands by category for display
  const categories = Array.from(new Set(filteredCommands.map(item => item.category)));

  return (
    <AnimatePresence>
      {commandBarOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4">
          
          {/* Backdrop Blur screen overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandBarOpen(false)}
            className="fixed inset-0 bg-neutral-950/65 backdrop-blur-md"
          />

          {/* Core Palette modal box */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            ref={containerRef}
            className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl shadow-cyan-950/15 overflow-hidden flex flex-col max-h-[500px]"
          >
            {/* Search Input Area */}
            <div className="flex h-13 items-center px-4 border-b border-zinc-900 bg-zinc-900/10">
              <Command className="w-5 h-5 text-zinc-500 mr-3 animate-pulse" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Type a workspace path or execute macro (/note , /task) ..."
                value={inputVal}
                onChange={(e) => {
                  setInputVal(e.target.value);
                  setSelectedIndex(0);
                }}
                className="flex-1 bg-transparent text-sm text-zinc-100 placeholder-zinc-500 border-none outline-none focus:ring-0 leading-none h-full"
              />
              <kbd className="font-sans text-[10px] bg-zinc-900 border border-zinc-850 px-1.5 py-0.5 rounded text-zinc-500 select-none shadow-inner">
                ESC
              </kbd>
            </div>

            {/* List Results */}
            <div className="flex-1 overflow-y-auto p-2">
              {filteredCommands.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 flex flex-col items-center justify-center gap-2">
                  <Search className="w-8 h-8 opacity-40 text-cyan-400" />
                  <p className="text-xs font-semibold">No operational hooks match this key query</p>
                  <p className="text-[10px] text-zinc-600 font-mono">Check system spellings or run telemetry</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {categories.map(cat => {
                    const catItems = filteredCommands.filter(item => item.category === cat);
                    return (
                      <div key={cat} className="space-y-1">
                        <div className="px-3 py-1.5 text-[9px] font-mono font-bold tracking-wider text-zinc-600 uppercase">
                          {cat}
                        </div>
                        {catItems.map((item) => {
                          const flatIndex = filteredCommands.indexOf(item);
                          const isSelected = flatIndex === selectedIndex;
                          const Icon = item.icon;

                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                item.action();
                                setCommandBarOpen(false);
                              }}
                              onMouseEnter={() => setSelectedIndex(flatIndex)}
                              className={`w-full flex items-center justify-between text-left p-2.5 rounded-lg border text-sm transition-all duration-100 ${
                                isSelected 
                                  ? 'bg-zinc-900/90 text-white border-zinc-700/50 shadow-md' 
                                  : 'text-zinc-400 border-transparent hover:text-zinc-200'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`p-1.5 rounded-md ${isSelected ? 'bg-cyan-500/10 text-cyan-400' : 'bg-zinc-900/40 text-zinc-500'}`}>
                                  <Icon className="w-4.5 h-4.5" />
                                </div>
                                <div className="flex flex-col">
                                  <span className={`text-xs font-semibold transition-colors ${isSelected ? 'text-zinc-100' : 'text-zinc-300'}`}>
                                    {item.title}
                                  </span>
                                  <span className="text-[10px] text-zinc-500 font-normal truncate max-w-sm sm:max-w-md">
                                    {item.subtitle}
                                  </span>
                                </div>
                              </div>

                              {isSelected && (
                                <span className="text-[10px] font-mono font-semibold text-zinc-500 flex items-center gap-1 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">
                                  <span>ENTER</span>
                                  <span className="text-zinc-700">↵</span>
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer Navigation Hints */}
            <div className="p-3 border-t border-zinc-900 bg-zinc-950/80 flex items-center justify-between text-[10px] font-mono text-zinc-500 select-none">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <span className="bg-zinc-900 px-1 py-0.5 rounded border border-zinc-850">↑↓</span>
                  <span>Navigate</span>
                </span>
                <span className="flex items-center gap-1">
                  <span className="bg-zinc-900 px-1 py-0.5 rounded border border-zinc-850">↵</span>
                  <span>Execute</span>
                </span>
              </div>
              <div className="flex items-center gap-1 text-zinc-600">
                <span>Core: Ready</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
