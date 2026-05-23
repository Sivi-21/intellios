import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Search,
  Clock,
  Trash2,
  Sparkles,
  FolderOpen,
  ArrowRight,
  ArrowLeft,
  X
} from "lucide-react";
import { useApp } from "../context/AppContext";
const Column = ({ title, count, colorClass, children }) => {
  return <div className="flex flex-col flex-1 min-w-[250px] bg-zinc-950/40 rounded-2xl border border-zinc-900 overflow-hidden pb-4">
      {
    /* Column Title bar */
  }
      <div className="h-11.5 flex items-center justify-between px-3.5 border-b border-zinc-900 bg-zinc-900/10">
        <div className="flex items-center gap-2">
          <span className={`w-1.5 h-1.5 rounded-full ${colorClass}`} />
          <span className="text-xs font-semibold text-zinc-300 font-sans tracking-tight">{title}</span>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-zinc-900 border border-zinc-850 text-zinc-500 font-semibold shadow-inner">
          {count}
        </span>
      </div>

      {
    /* Main Container */
  }
      <div className="flex-1 p-2.5 overflow-y-auto space-y-2 mt-1">
        {children}
      </div>

    </div>;
};
export const Tasks = () => {
  const { tasks, addTask, updateTask, deleteTask } = useApp();
  const [searchVal, setSearchVal] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newPriority, setNewPriority] = useState("medium");
  const [newStatus, setNewStatus] = useState("todo");
  const [newCategory, setNewCategory] = useState("Frontend");
  const filteredTasks = tasks.filter((task) => {
    const q = searchVal.toLowerCase().trim();
    if (!q) return true;
    return task.title.toLowerCase().includes(q) || task.category.toLowerCase().includes(q) || task.description?.toLowerCase().includes(q);
  });
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case "urgent":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "high":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "medium":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      default:
        return "bg-zinc-800 text-zinc-400 border-zinc-700/60";
    }
  };
  const cycleStatus = (id, current, direction) => {
    const sequence = ["backlog", "todo", "in_progress", "completed"];
    const idx = sequence.indexOf(current);
    let nextIdx = direction === "forward" ? idx + 1 : idx - 1;
    if (nextIdx >= sequence.length) nextIdx = sequence.length - 1;
    if (nextIdx < 0) nextIdx = 0;
    updateTask(id, { status: sequence[nextIdx] });
  };
  const handleCreate = (e) => {
    e.preventDefault();
    addTask(newTitle, newDesc, newPriority, newStatus, newCategory);
    setNewTitle("");
    setNewDesc("");
    setNewPriority("medium");
    setNewStatus("todo");
    setNewCategory("Frontend");
    setShowCreateModal(false);
  };
  const columns = [
    { status: "backlog", title: "Scope Backlog", color: "bg-zinc-500" },
    { status: "todo", title: "Target Objectives", color: "bg-indigo-400" },
    { status: "in_progress", title: "Active Pipelines", color: "bg-cyan-400" },
    { status: "completed", title: "Completed Repos", color: "bg-emerald-400" }
  ];
  return <div className="space-y-6 select-none relative">
      
      {
    /* Top Search Controls Bar */
  }
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 bg-zinc-950/40 border border-zinc-900 rounded-2xl">
        
        {
    /* Search Input bar */
  }
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5.5 w-4 h-4 text-zinc-500" />
          <input
    type="text"
    placeholder="Search tasks or modules ..."
    value={searchVal}
    onChange={(e) => setSearchVal(e.target.value)}
    className="w-full h-10 pl-10 pr-4 bg-zinc-900/40 focus:bg-zinc-900 border border-zinc-900 focus:border-zinc-750 focus:ring-1 focus:ring-zinc-800 rounded-xl text-xs font-sans text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all"
  />
        </div>

        {
    /* Action button */
  }
        <button
    onClick={() => setShowCreateModal(true)}
    className="h-10 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-950 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 rounded-xl shadow-lg shadow-cyan-500/5 cursor-pointer active:scale-97 transition-all leading-none"
  >
          <Plus className="w-4 h-4" />
          <span>Synchronize Target</span>
        </button>

      </div>

      {
    /* Kanban Container Grid */
  }
      <div className="flex flex-col lg:flex-row gap-4.5 overflow-x-auto pb-4 items-stretch h-[calc(100vh-14rem)]">
        {columns.map((col) => {
    const colTasks = filteredTasks.filter((t) => t.status === col.status);
    return <Column key={col.status} title={col.title} count={colTasks.length} colorClass={col.color}>
              {colTasks.length === 0 ? <div className="h-32 border border-dashed border-zinc-900 flex flex-col items-center justify-center text-center p-4 rounded-xl font-sans text-zinc-600 gap-1 mt-1 opacity-70">
                  <FolderOpen className="w-5 h-5 opacity-40 text-cyan-400" />
                  <span className="text-[10px] font-semibold text-zinc-500">Empty list</span>
                </div> : colTasks.map((task) => <motion.div
      layoutId={`task-card-${task.id}`}
      key={task.id}
      className="p-4 bg-zinc-900/35 hover:bg-zinc-900/80 border border-zinc-900 hover:border-zinc-800 rounded-xl flex flex-col justify-between text-left relative overflow-hidden group shadow-md transition-all duration-200"
    >
                    {
      /* Header tags */
    }
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-zinc-950 border border-zinc-850 text-zinc-500 uppercase tracking-wider">
                        {task.category}
                      </span>
                      <span className={`text-[8.5px] font-mono font-bold tracking-wide px-1.5 py-0.5 rounded border ${getPriorityBadge(task.priority)} uppercase`}>
                        {task.priority}
                      </span>
                    </div>

                    {
      /* Description Area */
    }
                    <div className="mt-3.5 space-y-1">
                      <h5 className="text-xs font-semibold text-zinc-200 group-hover:text-cyan-300 transition-colors tracking-tight leading-snug">
                        {task.title}
                      </h5>
                      {task.description && <p className="text-[10px] text-zinc-500 leading-normal font-sans line-clamp-2">
                          {task.description}
                        </p>}
                    </div>

                    {
      /* Micro controls bottom row */
    }
                    <div className="mt-4 pt-3 border-t border-zinc-950/80 flex items-center justify-between text-[10px] font-mono text-zinc-600 select-none">
                      <span className="text-[9.5px] font-medium text-zinc-500 flex items-center gap-1.5">
                        <Clock className="w-3 h-3 text-zinc-650 animate-pulse" />
                        <span>{task.dueDate}</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        {
      /* Status cycler switches */
    }
                        <button
      onClick={() => cycleStatus(task.id, task.status, "backward")}
      disabled={task.status === "backlog"}
      className="p-1 text-zinc-650 hover:text-zinc-400 hover:bg-zinc-850 rounded disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
      title="Move Left"
    >
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
      onClick={() => cycleStatus(task.id, task.status, "forward")}
      disabled={task.status === "completed"}
      className="p-1 text-zinc-650 hover:text-zinc-400 hover:bg-zinc-850 rounded disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
      title="Move Right"
    >
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        
                        <button
      onClick={() => deleteTask(task.id)}
      className="p-1 text-zinc-650 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-all cursor-pointer opacity-0 group-hover:opacity-100"
      title="Erase Objective"
    >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                  </motion.div>)}
            </Column>;
  })}
      </div>

      {
    /* Modal Dialog for Task Spawning */
  }
      <AnimatePresence>
        {showCreateModal && <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={() => setShowCreateModal(false)}
    className="absolute inset-0 bg-neutral-950/70 backdrop-blur-sm"
  />

            <motion.div
    initial={{ scale: 0.96 }}
    animate={{ scale: 1 }}
    exit={{ scale: 0.96 }}
    className="relative w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col text-left"
  >
              <div className="p-4 border-b border-zinc-900 flex justify-between items-center bg-zinc-900/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Initialize Workspace Target</span>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="text-zinc-500 hover:text-zinc-300">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-5.5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-zinc-500 tracking-wider">TARGET NAME</label>
                    <input
    type="text"
    required
    value={newTitle}
    onChange={(e) => setNewTitle(e.target.value)}
    placeholder="e.g. Implement WASM cache bindings"
    className="w-full h-9 px-3 bg-zinc-900/40 border border-zinc-900 focus:border-zinc-800 focus:outline-none rounded-lg text-xs hover:bg-zinc-900"
  />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-zinc-500 tracking-wider">MODULE CATEGORY</label>
                    <input
    type="text"
    required
    value={newCategory}
    onChange={(e) => setNewCategory(e.target.value)}
    placeholder="e.g. AI Pipeline"
    className="w-full h-9 px-3 bg-zinc-900/40 border border-zinc-900 focus:border-zinc-800 focus:outline-none rounded-lg text-xs hover:bg-zinc-900"
  />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-zinc-500 tracking-wider">PRIORITY LEVEL</label>
                    <select
    value={newPriority}
    onChange={(e) => setNewPriority(e.target.value)}
    className="w-full h-9 px-3 bg-zinc-900/60 border border-zinc-900 focus:border-zinc-800 focus:outline-none rounded-lg text-xs text-zinc-450 hover:bg-zinc-900"
  >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                      <option value="urgent">Urgent Block</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-zinc-500 tracking-wider">INITIAL STATE</label>
                    <select
    value={newStatus}
    onChange={(e) => setNewStatus(e.target.value)}
    className="w-full h-9 px-3 bg-zinc-900/60 border border-zinc-900 focus:border-zinc-800 focus:outline-none rounded-lg text-xs text-zinc-455 hover:bg-zinc-900"
  >
                      <option value="backlog">Scope Backlog</option>
                      <option value="todo">Todo Objective</option>
                      <option value="in_progress">Active Code Pipeline</option>
                      <option value="completed">Completed Target</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-zinc-500 tracking-wider">MEMBER NOTES & DESCRIPTIONS</label>
                  <textarea
    rows={4}
    value={newDesc}
    onChange={(e) => setNewDesc(e.target.value)}
    placeholder="Enter objective descriptions or verification parameters..."
    className="w-full p-3 bg-zinc-900/40 border border-zinc-900 focus:border-zinc-800 focus:outline-none rounded-lg text-xs font-mono"
  />
                </div>

                <div className="pt-3 flex justify-end gap-2.5">
                  <button
    type="button"
    onClick={() => setShowCreateModal(false)}
    className="h-10 px-4 text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent rounded-lg transition-colors cursor-pointer"
  >
                    Discard
                  </button>
                  <button
    type="submit"
    className="h-10 px-5 text-xs font-semibold text-zinc-950 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 rounded-lg shadow cursor-pointer active:scale-97 transition-all leading-none focus:outline-none"
  >
                    Synchronize target
                  </button>
                </div>
              </form>
            </motion.div>
          </div>}
      </AnimatePresence>

    </div>;
};
