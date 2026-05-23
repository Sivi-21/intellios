import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Search, 
  Terminal, 
  Activity, 
  CloudLightning,
  Sparkles,
  CheckCircle,
  Clock,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { searchQuery, setSearchQuery, recentActivities, userProfile, setCommandBarOpen } = useApp();
  const location = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Format active path into human titles
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/': return { main: 'Architect Studio', sub: 'Control Center' };
      case '/chat': return { main: 'AI Intelligence Node', sub: 'Copilot Chat' };
      case '/notes': return { main: 'Document Index', sub: 'Draft Blueprints' };
      case '/tasks': return { main: 'Target Board', sub: 'Sprint Epics' };
      case '/settings': return { main: 'Workspace Prefs', sub: 'System Environment' };
      default: return { main: 'IntelliOS', sub: 'Autonomous Desk' };
    }
  };

  const title = getPageTitle();

  return (
    <header className="sticky top-0 z-40 w-full h-16 bg-zinc-950/80 backdrop-blur-xl border-b border-zinc-900/60 flex items-center justify-between px-6 select-none">
      
      {/* Page Title & Breadcrumb Block */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-zinc-500 uppercase font-semibold">
          <span>INTELLIOS</span>
          <span>/</span>
          <span className="text-cyan-500">{title.sub}</span>
        </div>
        <h1 className="font-display font-semibold text-base text-zinc-200 tracking-tight">
          {title.main}
        </h1>
      </div>

      {/* Right Navigation & Status Utilities */}
      <div className="flex items-center gap-4">
        
        {/* Workspace Quick Fuzzy Search bar */}
        <div className="relative w-64 hidden md:block">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search items ... (⌘K)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => {
              // Press Ctrl+K to open, or click here to start typing or open palette
            }}
            className="w-full h-9 pl-9 pr-4 bg-zinc-900/40 focus:bg-zinc-900 hover:border-zinc-800 focus:border-zinc-700/80 rounded-lg text-xs font-sans text-zinc-200 placeholder-zinc-500 border border-zinc-900 transition-all focus:outline-none focus:ring-1 focus:ring-zinc-800"
          />
        </div>

        {/* Real-time System Telemetry Diagnostic Badge */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-zinc-900/30 border border-zinc-900 text-[11px] font-mono font-medium text-zinc-400">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span className="text-zinc-500">SYNC:</span>
            <span className="text-zinc-300">CLOUD</span>
          </div>
          <span className="text-zinc-700">|</span>
          <div className="flex items-center gap-1 text-zinc-300">
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>99.8% ACC</span>
          </div>
        </div>

        {/* Dynamic Global Notifications Center */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfileMenu(false);
            }}
            className={`relative p-2 rounded-lg border transition-all ${
              showNotifications 
                ? 'bg-zinc-900 text-zinc-200 border-zinc-700' 
                : 'bg-zinc-950/40 hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 border-zinc-900 hover:border-zinc-800'
            }`}
          >
            <Bell className="w-4.5 h-4.5" />
            
            {/* Dynamic notifications ping status */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-500 border border-zinc-950" />
          </button>

          {/* Notifications Dropdown Panel */}
          <AnimatePresence>
            {showNotifications && (
              <>
                {/* Backdrop closer */}
                <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-80 max-h-[420px] bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col"
                >
                  <div className="p-3.5 border-b border-zinc-900/80 flex items-center justify-between bg-zinc-900/20">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs font-semibold text-zinc-200">Alerts & System Logs</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-zinc-900 text-zinc-400 border border-zinc-850">
                      Live
                    </span>
                  </div>

                  <div className="overflow-y-auto flex-1 divide-y divide-zinc-900/50">
                    {recentActivities.map((act) => (
                      <div key={act.id} className="p-3.5 hover:bg-zinc-900/40 transition-colors flex gap-2.5 text-left">
                        <div className="mt-0.5">
                          {act.type === 'chat' && <Sparkles className="w-3.5 h-3.5 text-cyan-400" />}
                          {act.type === 'task' && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
                          {act.type === 'note' && <Terminal className="w-3.5 h-3.5 text-indigo-400" />}
                          {act.type === 'system' && <CloudLightning className="w-3.5 h-3.5 text-violet-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-zinc-200 truncate">{act.title}</p>
                          <p className="text-[11px] text-zinc-500 leading-normal mt-0.5">{act.description}</p>
                          <div className="flex items-center gap-1.5 mt-1.5 text-[9px] font-mono text-zinc-600">
                            <Clock className="w-3 h-3" />
                            <span>{act.timestamp}</span>
                            {act.meta && (
                              <>
                                <span>•</span>
                                <span className="text-zinc-500 uppercase font-semibold">{act.meta}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-2 border-t border-zinc-900 bg-zinc-900/10 text-center">
                    <button 
                      onClick={() => setCommandBarOpen(true)}
                      className="w-full py-1.5 text-[10px] font-medium text-zinc-400 hover:text-zinc-200 transition-colors rounded hover:bg-zinc-900 font-sans"
                    >
                      Open Unified Diagnostics Panel
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* User Identity Avatar Profile Section */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowProfileMenu(!showProfileMenu);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-zinc-900/60 border border-zinc-800 hover:bg-zinc-900 transition-colors cursor-pointer select-none"
          >
            <div className="w-6.5 h-6.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-display font-bold text-xs flex items-center justify-center">
              {userProfile.avatar}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[11px] font-semibold text-zinc-200 leading-none">
                {userProfile.name}
              </span>
              <span className="text-[9px] font-mono text-zinc-500 leading-none mt-0.5">
                {userProfile.role}
              </span>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          <AnimatePresence>
            {showProfileMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowProfileMenu(false)} />
                
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-48 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col"
                >
                  <div className="p-3 border-b border-zinc-900 italic text-zinc-500 text-[10px] bg-zinc-900/10">
                    Signed in as <b className="text-zinc-300 not-italic font-sans">{userProfile.email}</b>
                  </div>

                  <div className="p-1 space-y-0.5">
                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        // Open Settings Page
                        window.location.hash = '#/settings';
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-900 text-left transition-colors"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Configure Profile</span>
                    </button>
                    
                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        window.location.hash = '#/settings';
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-100 rounded-lg hover:bg-zinc-900 text-left transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5" />
                      <span>AI Model Overrides</span>
                    </button>
                  </div>

                  <div className="p-1 border-t border-zinc-900">
                    <button 
                      onClick={() => {
                        setShowProfileMenu(false);
                        alert("Profile signing reset is locked under sandbox context.");
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-400 hover:text-red-300 rounded-lg hover:bg-red-500/10 text-left transition-colors"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Lock Security State</span>
                    </button>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

      </div>
    </header>
  );
};
