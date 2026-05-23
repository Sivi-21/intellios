import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Terminal, 
  MessageSquareCode, 
  BookOpen, 
  Briefcase, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  Sparkles,
  Cpu,
  Layers,
  Search
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getThemeColors, ThemePreset } from '../lib/theme';

interface SidebarItemProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  path: string;
  isCollapsed: boolean;
  active: boolean;
  onClick: () => void;
  badge?: string;
  badgeColor?: string;
  theme: ThemePreset;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  isCollapsed, 
  active, 
  onClick, 
  badge,
  badgeColor,
  theme
}) => {
  // Dynamically compound active styles
  const activeColorShadow = `0 0 12px rgba(${theme.rawRGB}, 0.08)`;
  const activeBorder = `1px solid rgba(${theme.rawRGB}, 0.25)`;

  return (
    <button
      onClick={onClick}
      style={{
        boxShadow: active ? activeColorShadow : undefined,
        border: active ? activeBorder : '1px solid transparent'
      }}
      className={`relative w-full flex items-center gap-3 p-3 rounded-lg text-sm transition-all duration-200 group overflow-hidden ${
        active 
          ? 'bg-zinc-800/60 text-white' 
          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50'
      }`}
    >
      {/* Animated Active indicator */}
      {active && (
        <motion.div 
          layoutId="sidebarActiveGld"
          className="absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-md"
          style={{ backgroundColor: `rgb(${theme.rawRGB})` }}
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}

      <div className={`p-1 rounded-md transition-colors ${active ? theme.textAccent : 'text-zinc-400 group-hover:text-zinc-200'}`}>
        <Icon className="w-5 h-5" />
      </div>

      {!isCollapsed && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          className="flex-1 flex items-center justify-between font-medium"
        >
          <span>{label}</span>
          {badge && (
            <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${badgeColor || theme.badgeAccent}`}>
              {badge}
            </span>
          )}
        </motion.div>
      )}

      {/* Tooltip for collapsed mode */}
      {isCollapsed && (
        <div className="absolute left-14 invisible group-hover:visible font-sans bg-zinc-950 text-zinc-100 text-xs px-2.5 py-1.5 rounded-md border border-zinc-800 opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-200 shadow-xl z-55 whitespace-nowrap pointer-events-none">
          {label}
          {badge && <span className="ml-1.5 opacity-70 font-mono">({badge})</span>}
        </div>
      )}
    </button>
  );
};

export const Sidebar: React.FC = () => {
  const { 
    sidebarExpanded, 
    setSidebarExpanded, 
    setCommandBarOpen, 
    notes, 
    tasks, 
    engineTheme, 
    playSfx 
  } = useApp();
  
  const location = useLocation();
  const navigate = useNavigate();
  const theme = getThemeColors(engineTheme);

  const activePath = location.pathname;

  const handleRoute = (path: string) => {
    playSfx('click');
    navigate(path);
  };

  const toggleSidebar = (expand: boolean) => {
    playSfx('click');
    setSidebarExpanded(expand);
  };

  const navItems = [
    { 
      icon: Terminal, 
      label: 'Dashboard', 
      path: '/',
      badge: undefined 
    },
    { 
      icon: MessageSquareCode, 
      label: 'AI Chat', 
      path: '/chat',
      badge: 'PRO',
      badgeColor: undefined // will fallback to theme badgeAccent
    },
    { 
      icon: BookOpen, 
      label: 'Notes Index', 
      path: '/notes',
      badge: notes.length > 0 ? String(notes.length) : undefined,
      badgeColor: 'bg-zinc-850/60 text-zinc-400 border-zinc-805'
    },
    { 
      icon: Briefcase, 
      label: 'Target Board', 
      path: '/tasks',
      badge: tasks.filter(t => t.status !== 'completed').length > 0 ? String(tasks.filter(t => t.status !== 'completed').length) : undefined,
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/10'
    }
  ];

  return (
    <motion.aside
      animate={{ width: sidebarExpanded ? 240 : 72 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="relative shrink-0 flex flex-col h-screen bg-zinc-950 border-r border-zinc-900 z-50 text-zinc-100 select-none pb-4"
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-zinc-900 overflow-hidden">
        <div className="flex items-center gap-2.5">
          <div 
            style={{ boxShadow: `0 0 10px rgba(${theme.rawRGB}, 0.25)` }}
            className="relative w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden shrink-0"
          >
            {/* Dynamic background gradient based on theme colors */}
            <div 
              className="absolute inset-0 opacity-80" 
              style={{ backgroundImage: `linear-gradient(to top right, rgb(${theme.rawRGB}), #4f46e5)` }} 
            />
            <Cpu className="w-4.5 h-4.5 text-white animate-pulse relative z-10" />
            <div className="absolute inset-0 bg-white/10 mix-blend-overlay" />
          </div>
          
          {!sidebarExpanded ? null : (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col"
            >
              <span className="font-display font-bold text-sm tracking-wide bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                INTELLIOS
              </span>
              <span className={`text-[9px] font-mono font-semibold tracking-widest leading-none ${theme.textAccent}`}>
                OS_CORE_v2.5
              </span>
            </motion.div>
          )}
        </div>

        {sidebarExpanded && (
          <button 
            onClick={() => toggleSidebar(false)}
            className="p-1 px-1.5 rounded-md text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 transition-colors"
            title="Collapse Sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main Actions Bar (Spotlight Trigger) */}
      <div className="p-3">
        {sidebarExpanded ? (
          <button 
            onClick={() => {
              playSfx('click');
              setCommandBarOpen(true);
            }}
            className="w-full h-9 flex items-center justify-between text-xs font-sans text-zinc-500 bg-zinc-900/60 hover:bg-zinc-900 hover:text-zinc-200 border border-zinc-800/80 hover:border-zinc-700/80 rounded-lg px-2.5 transition-all text-left shadow-inner"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span>Search Actions...</span>
            </div>
            <kbd className="font-mono bg-zinc-950 px-1.5 py-0.5 rounded text-[10px] text-zinc-400 border border-zinc-800 shadow">
              ⌘K
            </kbd>
          </button>
        ) : (
          <button
            onClick={() => {
              playSfx('click');
              setCommandBarOpen(true);
            }}
            className="w-10 h-10 mx-auto flex items-center justify-center text-zinc-500 hover:text-zinc-200 bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 rounded-lg transition-all"
            title="Global Command Palette (Ctrl+K)"
          >
            <Search className="w-4.5 h-4.5" />
          </button>
        )}
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 flex flex-col gap-1.5 px-3 overflow-y-auto">
        <div className="mt-1">
          {!sidebarExpanded ? null : (
            <h3 className="px-3 text-[10px] font-mono font-semibold tracking-wider text-zinc-650 uppercase mb-2">
              Workspace Core
            </h3>
          )}
          <div className="space-y-1">
            {navItems.map((item) => (
              <SidebarItem
                key={item.path}
                icon={item.icon}
                label={item.label}
                path={item.path}
                isCollapsed={!sidebarExpanded}
                active={activePath === item.path}
                onClick={() => handleRoute(item.path)}
                badge={item.badge}
                badgeColor={item.badgeColor}
                theme={theme}
              />
            ))}
          </div>
        </div>

        {/* Configurations Separator */}
        <div className="mt-6">
          {!sidebarExpanded ? null : (
            <h3 className="px-3 text-[10px] font-mono font-semibold tracking-wider text-zinc-650 uppercase mb-2">
              Diagnostics
            </h3>
          )}
          <SidebarItem
            icon={Settings}
            label="System Config"
            path="/settings"
            isCollapsed={!sidebarExpanded}
            active={activePath === '/settings'}
            onClick={() => handleRoute('/settings')}
            theme={theme}
          />
        </div>
      </div>

      {/* FOOTER: EXPAND TRIGGER IF COLLAPSED & ORBIT SUMMARY */}
      <div className="px-3 border-t border-zinc-900/50 pt-3">
        {!sidebarExpanded ? (
          <button 
            onClick={() => toggleSidebar(true)}
            className="w-10 h-10 mx-auto flex items-center justify-center text-zinc-500 hover:text-zinc-200 hover:bg-zinc-900 rounded-lg transition-all"
            title="Expand Sidebar"
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        ) : (
          <div className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/30 border border-zinc-900/60 text-xs">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75`} style={{ backgroundColor: `rgb(${theme.rawRGB})` }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: `rgb(${theme.rawRGB})` }} />
              </span>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] text-zinc-500 font-semibold uppercase leading-none">OS INDEXER LIVE</span>
                <span className="text-[10px] text-zinc-300 font-medium">Telemetry Online</span>
              </div>
            </div>
            <Sparkles className="w-3.5 h-3.5 animate-pulse" style={{ color: `rgb(${theme.rawRGB})` }} />
          </div>
        )}
      </div>
    </motion.aside>
  );
};
