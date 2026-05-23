import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, 
  Sparkles, 
  Terminal, 
  Activity, 
  Cpu, 
  ChevronDown, 
  Copy, 
  Check, 
  Send,
  HelpCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ChatMessage } from '../types';

interface CodeSnippetViewerProps {
  code: string;
  language: string;
  filePath?: string;
}

const CodeSnippetViewer: React.FC<CodeSnippetViewerProps> = ({ code, language, filePath }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-4.5 rounded-xl bg-zinc-950 border border-zinc-850 overflow-hidden font-mono text-xs shadow-lg shadow-zinc-950/50">
      
      {/* Code Header Bar */}
      <div className="flex h-9 items-center justify-between px-3.5 bg-zinc-900 border-b border-zinc-850">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-[10px] font-mono text-zinc-400 font-semibold uppercase">{filePath || language}</span>
        </div>
        <button 
          onClick={handleCopy}
          className="p-1.5 rounded-md hover:bg-zinc-850/60 text-zinc-400 hover:text-zinc-200 transition-all flex items-center gap-1.5 text-[10px]"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400 font-bold">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="p-4 overflow-x-auto overflow-y-hidden leading-relaxed text-zinc-300 font-mono text-[11px] select-text">
        <pre>{code}</pre>
      </div>

    </div>
  );
};

export const AIChat: React.FC = () => {
  const { chatMessages, sendChatMessage, clearChat, cancelAiRequest, isAiTyping, userProfile, setUserProfile, backendOnline } = useApp();
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [activeModel, setActiveModel] = useState(userProfile.geminiModel);
  const [showModelsDropdown, setShowModelsDropdown] = useState(false);

  // Auto-scroll to bottom on message updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiTyping]);

  const handleSend = () => {
    if (!inputMessage.trim()) return;
    sendChatMessage(inputMessage);
    setInputMessage('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleModelChange = (model: string) => {
    setActiveModel(model);
    setUserProfile(prev => ({ ...prev, geminiModel: model }));
    setShowModelsDropdown(false);
  };

  // Preset intelligent macros inside active chat view
  const macroPrompts = [
    { label: 'Rust Compiler WASM Config', value: 'Explain Rust WASM compiler config' },
    { label: 'TS Layout Resize Hook', value: 'Generate TS Container dimension React hook' },
    { label: 'Verify CPU System telemetry', value: 'Check workspace system diagnostics status' }
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] rounded-2xl bg-zinc-950/60 border border-zinc-900 overflow-hidden shadow-2xl relative select-none">
      
      {/* Chat Sub-Header / Controls */}
      <div className="flex h-14 items-center justify-between px-5 border-b border-zinc-900 bg-zinc-900/10">
        
        {/* Left Side: Agent status details */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-zinc-200">IntelliOS Autonomous Agent</span>
            <span className="text-[10px] font-mono text-zinc-500 tracking-wider">
              {backendOnline ? 'GROQ NEURAL LINK • LIVE' : 'OFFLINE • LOCAL FALLBACK'}
            </span>
          </div>
        </div>

        {/* Right Side: Models dropdown & Clear commands */}
        <div className="flex items-center gap-2">
          
          {/* Active Model Selector */}
          <div className="relative">
            <button
              onClick={() => setShowModelsDropdown(!showModelsDropdown)}
              className="px-3 h-8.5 rounded-lg border border-zinc-900 hover:border-zinc-800 bg-zinc-900/30 hover:bg-zinc-900 text-[10px] sm:text-xs font-mono font-medium text-zinc-400 hover:text-zinc-200 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Cpu className="w-3.5 h-3.5 text-cyan-400" />
              <span>{activeModel}</span>
              <ChevronDown className="w-3 h-3 text-zinc-500" />
            </button>

            {showModelsDropdown && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowModelsDropdown(false)} />
                <div className="absolute right-0 mt-2.5 w-44 rounded-xl bg-zinc-950 border border-zinc-800 shadow-2xl z-50 p-1 space-y-0.5">
                  {[
                    { id: 'gemini-2.5-pro', name: 'gemini-2.5-pro', desc: 'Max capability code agent' },
                    { id: 'gemini-2.5-flash', name: 'gemini-2.5-flash', desc: 'Fast recursive inference' },
                    { id: 'gemini-1.5-pro', name: 'gemini-1.5-pro', desc: 'Classic contextual reasoning' }
                  ].map(m => (
                    <button
                      key={m.id}
                      onClick={() => handleModelChange(m.name)}
                      className={`w-full p-2 text-left rounded-lg text-xs transition-colors flex flex-col cursor-pointer ${
                        activeModel === m.name
                          ? 'bg-zinc-900 text-zinc-100'
                          : 'hover:bg-zinc-900/50 text-zinc-400 hover:text-zinc-200'
                      }`}
                    >
                      <span className="font-mono font-semibold">{m.name}</span>
                      <span className="text-[9px] text-zinc-500 font-sans mt-0.5 italic">{m.desc}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {isAiTyping && (
            <button
              onClick={cancelAiRequest}
              className="px-2.5 h-8.5 rounded-lg border border-amber-900/50 bg-amber-950/30 hover:bg-amber-900/40 text-[10px] font-mono text-amber-400 transition-all cursor-pointer"
              title="Cancel stuck request"
            >
              Cancel
            </button>
          )}

          {/* Clear Conversations trigger */}
          <button 
            onClick={clearChat}
            className="p-2 h-8.5 rounded-lg border border-transparent hover:border-zinc-900 hover:bg-zinc-900/50 text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer"
            title="Wipe Chat Stream"
          >
            <Trash2 className="w-4 h-4" />
          </button>

        </div>

      </div>

      {/* Main Scrollable Messages Box */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-zinc-950/20">
        
        {chatMessages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} max-w-full`}
          >
            {/* Sender Badge */}
            <div className={`flex items-center gap-1.5 text-[9px] font-mono text-zinc-500 uppercase tracking-wider mb-1 px-1`}>
              <Clock className="w-3 h-3 text-zinc-650" />
              <span>{msg.timestamp}</span>
              <span>•</span>
              <span className={msg.sender === 'user' ? 'text-zinc-400 font-semibold' : 'text-cyan-400 font-semibold'}>
                {msg.sender === 'user' ? 'USER ADDR' : 'AI ENGINE'}
              </span>
            </div>

            {/* Content box */}
            <div className={`rounded-xl p-4 text-xs leading-relaxed max-w-[85%] border shadow-xl ${
              msg.sender === 'user'
                ? 'bg-zinc-900 text-zinc-100 border-zinc-800'
                : 'bg-zinc-900/35 text-zinc-300 border-zinc-900/60 font-sans backdrop-blur cursor-text select-text select-all'
            }`}>
              {/* If text starts with Markdown formatting check, render cleanly */}
              <div 
                className="whitespace-pre-line prose prose-invert font-sans max-w-none text-zinc-200"
                dangerouslySetInnerHTML={{ 
                  __html: msg.text
                    .replace(/\*\*(.*?)\*\*/g, '<strong class="text-white text-medium">$1</strong>')
                    .replace(/\*(.*?)\*/g, '<em class="text-zinc-100">$1</em>')
                    .replace(/`(.*?)`/g, '<code class="bg-zinc-950 px-1 py-0.5 rounded font-mono text-cyan-400">$1</code>')
                }}
              />

              {/* Nested codeblock if present */}
              {msg.codeSnippet && (
                <CodeSnippetViewer 
                  code={msg.codeSnippet.code} 
                  language={msg.codeSnippet.language} 
                  filePath={msg.codeSnippet.filePath}
                />
              )}
            </div>
          </motion.div>
        ))}

        {/* Loading / Writing Indicator */}
        <AnimatePresence>
          {isAiTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-start"
            >
              <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-600 uppercase tracking-wider mb-1">
                <Clock className="w-3 h-3 text-zinc-650" />
                <span>Now</span>
                <span>•</span>
                <span className="text-cyan-500 font-bold">ANALYZING INDEXES</span>
              </div>
              <div className="rounded-xl p-3.5 bg-zinc-900/20 border border-zinc-900 flex items-center gap-3 text-xs text-zinc-500 font-sans">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-300 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
                </div>
                <span className="font-mono text-[10px] tracking-wide text-zinc-400 uppercase">Consulting attention loops ...</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={chatEndRef} />
      </div>

      {/* Recommended macro prompts floating footer bar */}
      <div className="px-5 py-2.5 bg-zinc-950/40 border-t border-zinc-900 flex flex-wrap gap-2 overflow-x-auto whitespace-nowrap scrollbar-none select-none">
        {macroPrompts.map((macro, i) => (
          <button
            key={i}
            onClick={() => setInputMessage(macro.value)}
            className="px-2.5 py-1.5 rounded-lg bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-[10px] font-sans font-medium text-zinc-400 hover:text-cyan-400 transition-all cursor-pointer flex items-center gap-1.5"
          >
            <span>{macro.label}</span>
            <ArrowRight className="w-3 h-3 opacity-60" />
          </button>
        ))}
      </div>

      {/* Chat Terminal Inputs Panel */}
      <div className="p-4 bg-zinc-950 border-t border-zinc-900 flex items-center gap-2">
        <div className="relative flex-1">
          <textarea
            rows={1}
            placeholder='Type instructions (Use "/note [title]" or "/task [title]" as macros) ...'
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full pl-4 pr-12 py-3 bg-zinc-900/50 focus:bg-zinc-900 border border-zinc-900 focus:border-zinc-700/80 rounded-xl text-xs font-sans text-zinc-200 placeholder-zinc-500 transition-all focus:outline-none focus:ring-1 focus:ring-zinc-850 resize-none max-h-24 h-11"
          />
          <div className="absolute right-3.5 top-2.5 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-zinc-700 hover:text-zinc-400 transition-colors hidden sm:block cursor-pointer" title="Workspace help index" />
          </div>
        </div>

        <button 
          onClick={handleSend}
          disabled={!inputMessage.trim() || isAiTyping}
          className={`h-11 w-11 flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 shadow-lg shadow-cyan-500/10 cursor-pointer text-zinc-950 active:scale-95 transition-all outline-none disabled:opacity-45 disabled:pointer-events-none shrink-0`}
        >
          <Send className="w-4.5 h-4.5" />
        </button>
      </div>

    </div>
  );
};
