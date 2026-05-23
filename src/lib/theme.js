export const THEME_PRESETS = {
  cyan: {
    id: "cyan",
    name: "CHRONOS BLUE",
    badge: "COLD_ICE",
    glowClass: "shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.35)]",
    glowHeading: "text-shadow-[0_0_8px_rgba(6,182,212,0.4)]",
    textAccent: "text-cyan-400",
    textMutedAccent: "text-cyan-500/80",
    borderAccent: "border-cyan-500/30 hover:border-cyan-400",
    borderMutedAccent: "border-cyan-500/15",
    bgAccent: "bg-cyan-500/10",
    bgMutedAccent: "bg-cyan-500/5",
    badgeAccent: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    textGradient: "from-cyan-400 to-indigo-400 bg-clip-text text-transparent",
    rawRGB: "6, 182, 212"
  },
  green: {
    id: "green",
    name: "MATRIX REVOLUTION",
    badge: "GRID_LIME",
    glowClass: "shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.35)]",
    glowHeading: "text-shadow-[0_0_8px_rgba(16,185,129,0.4)]",
    textAccent: "text-emerald-400",
    textMutedAccent: "text-emerald-500/80",
    borderAccent: "border-emerald-500/30 hover:border-emerald-400",
    borderMutedAccent: "border-emerald-500/15",
    bgAccent: "bg-emerald-500/10",
    bgMutedAccent: "bg-emerald-500/5",
    badgeAccent: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    textGradient: "from-emerald-400 to-teal-400 bg-clip-text text-transparent",
    rawRGB: "16, 185, 129"
  },
  amber: {
    id: "amber",
    name: "SUPERNOVA SOLAR",
    badge: "WARN_COCKPIT",
    glowClass: "shadow-[0_0_20px_rgba(245,158,11,0.2)] hover:shadow-[0_0_30px_rgba(245,158,11,0.35)]",
    glowHeading: "text-shadow-[0_0_8px_rgba(245,158,11,0.4)]",
    textAccent: "text-amber-400",
    textMutedAccent: "text-amber-500/80",
    borderAccent: "border-amber-500/30 hover:border-amber-400",
    borderMutedAccent: "border-amber-500/15",
    bgAccent: "bg-amber-500/10",
    bgMutedAccent: "bg-amber-500/5",
    badgeAccent: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    textGradient: "from-amber-400 to-rose-400 bg-clip-text text-transparent",
    rawRGB: "245, 158, 11"
  },
  purple: {
    id: "purple",
    name: "NEURAL NEBULA",
    badge: "HYPER_VIOLET",
    glowClass: "shadow-[0_0_20px_rgba(168,85,247,0.2)] hover:shadow-[0_0_30px_rgba(168,85,247,0.35)]",
    glowHeading: "text-shadow-[0_0_8px_rgba(168,85,247,0.4)]",
    textAccent: "text-purple-400",
    textMutedAccent: "text-purple-500/80",
    borderAccent: "border-purple-500/30 hover:border-purple-400",
    borderMutedAccent: "border-purple-500/15",
    bgAccent: "bg-purple-500/10",
    bgMutedAccent: "bg-purple-500/5",
    badgeAccent: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    textGradient: "from-purple-400 to-fuchsia-400 bg-clip-text text-transparent",
    rawRGB: "168, 85, 247"
  }
};
export function getThemeColors(theme) {
  return THEME_PRESETS[theme] || THEME_PRESETS.cyan;
}
