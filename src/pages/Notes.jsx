import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Plus,
  Search,
  LayoutGrid,
  List,
  Star,
  Trash2,
  Calendar,
  X,
  Sparkles,
  BookmarkCheck,
  Check
} from "lucide-react";
import { useApp } from "../context/AppContext";
export const Notes = () => {
  const { notes, addNote, updateNote, deleteNote } = useApp();
  const [searchVal, setSearchVal] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedNote, setSelectedNote] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Workspace");
  const [newContent, setNewContent] = useState("");
  const filteredNotes = notes.filter((note) => {
    const q = searchVal.toLowerCase().trim();
    return note.title.toLowerCase().includes(q) || note.category.toLowerCase().includes(q) || note.content.toLowerCase().includes(q);
  });
  const handleCreate = (e) => {
    e.preventDefault();
    addNote(newTitle, newContent, newCategory);
    setNewTitle("");
    setNewContent("");
    setNewCategory("Workspace");
    setShowCreateModal(false);
  };
  const toggleFavorite = (id, e) => {
    e.stopPropagation();
    const note = notes.find((n) => n.id === id);
    if (note) {
      updateNote(id, { isFavorite: !note.isFavorite });
    }
  };
  return <div className="space-y-6 select-none relative">
      
      {
    /* Search Actions Module */
  }
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4.5 bg-zinc-950/40 border border-zinc-900 rounded-2xl">
        
        {
    /* Search Input bar */
  }
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-2.5.5 w-4 h-4 text-zinc-500" />
          <input
    type="text"
    placeholder="Search blueprints or topics ..."
    value={searchVal}
    onChange={(e) => setSearchVal(e.target.value)}
    className="w-full h-10 pl-10 pr-4 bg-zinc-900/40 focus:bg-zinc-900 border border-zinc-900 focus:border-zinc-750 focus:ring-1 focus:ring-zinc-800 rounded-xl text-xs font-sans text-zinc-100 placeholder-zinc-500 focus:outline-none transition-all"
  />
        </div>

        {
    /* View mode toggle & Create Button */
  }
        <div className="flex items-center gap-3">
          
          {
    /* Toggles */
  }
          <div className="flex h-10 items-center bg-zinc-900/60 border border-zinc-900 rounded-xl p-1 text-zinc-500">
            <button
    onClick={() => setViewMode("grid")}
    className={`p-1.5 px-2 rounded-lg transition-all cursor-pointer ${viewMode === "grid" ? "bg-zinc-850 text-cyan-400" : "hover:text-zinc-300"}`}
    title="Grid Mode"
  >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
    onClick={() => setViewMode("list")}
    className={`p-1.5 px-2 rounded-lg transition-all cursor-pointer ${viewMode === "list" ? "bg-zinc-850 text-cyan-400" : "hover:text-zinc-300"}`}
    title="List Mode"
  >
              <List className="w-4 h-4" />
            </button>
          </div>

          {
    /* Quick Create Note */
  }
          <button
    onClick={() => setShowCreateModal(true)}
    className="h-10 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-zinc-950 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 rounded-xl shadow-lg shadow-cyan-500/5 cursor-pointer active:scale-97 transition-all leading-none"
  >
            <Plus className="w-4 h-4" />
            <span>Spawn Note</span>
          </button>

        </div>

      </div>

      {
    /* Grid Canvas Lists */
  }
      {filteredNotes.length === 0 ? <div className="p-16 text-center border border-zinc-900 bg-zinc-950/20 rounded-2xl flex flex-col items-center justify-center gap-2">
          <BookmarkCheck className="w-10 h-10 text-cyan-400/50 animate-pulse" />
          <h3 className="text-zinc-300 font-semibold text-sm mt-2">Zero matching documents found</h3>
          <p className="text-xs text-zinc-500 font-sans max-w-xs">Verify your search characters or click the "Spawn Note" action button above to write index documents.</p>
        </div> : viewMode === "grid" ? (
    /* Grid Layout Mode */
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4.5">
          {filteredNotes.map((note) => <motion.div
      layoutId={`note-card-${note.id}`}
      key={note.id}
      onClick={() => setSelectedNote(note)}
      className="p-5 bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 rounded-2xl cursor-pointer flex flex-col justify-between group transition-all duration-200 relative overflow-hidden shadow-md"
    >
              {
      /* Dynamic top highlight tag */
    }
              <div className="flex items-center justify-between pointer-events-auto">
                <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider bg-zinc-900 border border-zinc-850 text-zinc-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/5 group-hover:border-cyan-500/10 uppercase transition-all">
                  {note.category}
                </span>

                <div className="flex items-center gap-1">
                  <button
      onClick={(e) => toggleFavorite(note.id, e)}
      className="p-1 text-zinc-500 hover:text-amber-400 transition-colors cursor-pointer"
    >
                    <Star className={`w-3.5 h-3.5 ${note.isFavorite ? "fill-amber-400 text-amber-500 animate-pulse" : ""}`} />
                  </button>
                  <button
      onClick={(e) => {
        e.stopPropagation();
        deleteNote(note.id);
      }}
      className="p-1 opacity-0 group-hover:opacity-100 text-zinc-500 hover:text-rose-400 transition-all cursor-pointer"
      title="Delete Draft"
    >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {
      /* Title & Preview Body */
    }
              <div className="mt-4 space-y-2 flex-1 text-left">
                <h4 className="font-display font-semibold text-sm text-zinc-200 tracking-tight leading-snug group-hover:text-white transition-colors truncate">
                  {note.title}
                </h4>
                <p className="text-[11px] text-zinc-400 leading-normal font-sans line-clamp-3">
                  {note.content.replace(/##/g, "").replace(/\[.*?\]/g, "").replace(/`/g, "")}
                </p>
              </div>

              {
      /* Dynamic stamp footer */
    }
              <div className="mt-5 pt-3 border-t border-zinc-900/60 flex items-center justify-between text-[10px] font-mono text-zinc-650">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Modified</span>
                </span>
                <span className="font-medium text-zinc-500">{note.updatedAt}</span>
              </div>
            </motion.div>)}
        </div>
  ) : (
    /* List Layout Mode */
    <div className="space-y-2">
          {filteredNotes.map((note) => <motion.div
      layoutId={`note-card-${note.id}`}
      key={note.id}
      onClick={() => setSelectedNote(note)}
      className="p-3.5 bg-zinc-950/60 border border-zinc-900 hover:border-zinc-800 rounded-xl cursor-pointer flex items-center justify-between group transition-all"
    >
              <div className="flex items-center gap-4 text-left flex-1 min-w-0">
                <div onClick={(e) => toggleFavorite(note.id, e)} className="cursor-pointer text-zinc-650 hover:text-amber-400">
                  <Star className={`w-3.5 h-3.5 ${note.isFavorite ? "fill-amber-400 text-amber-400" : ""}`} />
                </div>
                <div className="flex-1 min-w-0 flex items-center gap-3">
                  <span className="px-1.5 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider bg-zinc-900 border border-zinc-850 text-zinc-500 uppercase shrink-0">
                    {note.category}
                  </span>
                  <span className="text-xs font-semibold text-zinc-300 truncate group-hover:text-white transition-colors">
                    {note.title}
                  </span>
                  <span className="text-[11px] text-zinc-500 font-sans truncate hidden md:block max-w-[400px]">
                    — {note.content.slice(0, 80).replace(/##/g, "")}...
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4 font-mono text-[10px] text-zinc-650 shrink-0">
                <span className="hidden sm:inline">{note.updatedAt}</span>
                <button
      onClick={(e) => {
        e.stopPropagation();
        deleteNote(note.id);
      }}
      className="p-1 opacity-100 sm:opacity-0 group-hover:opacity-100 text-zinc-600 hover:text-rose-400 transition-all cursor-pointer"
    >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>)}
        </div>
  )}

      {
    /* 2. Interactive Note Viewer & Realtime Editor Modal/Slideover */
  }
      <AnimatePresence>
        {selectedNote && <div className="fixed inset-0 z-50 flex items-end sm:items-stretch justify-end">
            {
    /* Backdrop slide dim overlay */
  }
            <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={() => setSelectedNote(null)}
    className="absolute inset-0 bg-neutral-950/50 backdrop-blur-sm"
  />

            {
    /* Editing Slide panel container */
  }
            <motion.div
    initial={{ x: "100%" }}
    animate={{ x: 0 }}
    exit={{ x: "100%" }}
    transition={{ type: "spring", stiffness: 300, damping: 28 }}
    className="relative w-full max-w-xl h-[85vh] sm:h-full bg-zinc-950 border-t sm:border-t-0 sm:border-l border-zinc-900/80 shadow-2xl z-50 flex flex-col overflow-hidden"
  >
              {
    /* Editor Header controls */
  }
              <div className="flex h-15 items-center justify-between px-5.5 border-b border-zinc-900">
                <div className="flex items-center gap-2">
                  <span className="p-1 py-0.5 rounded text-[8px] font-mono font-bold tracking-wider bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 uppercase">
                    Core Document
                  </span>
                  <span className="text-[10px] font-mono text-zinc-500 uppercase font-semibold">Workspace Index</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
    onClick={() => {
      updateNote(selectedNote.id, { isFavorite: !selectedNote.isFavorite });
      setSelectedNote((prev) => prev ? { ...prev, isFavorite: !prev.isFavorite } : null);
    }}
    className="p-2 text-zinc-400 hover:text-amber-400 transition-all cursor-pointer"
  >
                    <Star className={`w-4 h-4 ${selectedNote.isFavorite ? "fill-amber-400 text-amber-500" : ""}`} />
                  </button>
                  <button
    onClick={() => setSelectedNote(null)}
    className="p-2 text-zinc-400 hover:text-zinc-200 transition-all cursor-pointer"
  >
                    <X className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>

              {
    /* Editor Writing Area */
  }
              <div className="flex-1 p-6 space-y-4 overflow-y-auto">
                <div className="space-y-1 text-left">
                  <input
    type="text"
    value={selectedNote.category}
    onChange={(e) => {
      updateNote(selectedNote.id, { category: e.target.value });
      setSelectedNote((prev) => prev ? { ...prev, category: e.target.value } : null);
    }}
    className="w-full bg-transparent border-none text-[10px] font-mono text-cyan-400 tracking-wider uppercase focus:ring-0 focus:outline-none p-0 font-bold"
    placeholder="Document Category ..."
  />
                  
                  <input
    type="text"
    value={selectedNote.title}
    onChange={(e) => {
      updateNote(selectedNote.id, { title: e.target.value });
      setSelectedNote((prev) => prev ? { ...prev, title: e.target.value } : null);
    }}
    className="w-full bg-transparent border-none text-lg font-display font-semibold text-zinc-100 tracking-tight focus:ring-0 focus:outline-none p-0 focus:border-zinc-800"
    placeholder="Blueprint Title ..."
  />
                </div>

                {
    /* Main Content Area */
  }
                <div className="pt-4 border-t border-zinc-900/60 h-[calc(100%-8rem)] text-left">
                  <textarea
    value={selectedNote.content}
    onChange={(e) => {
      updateNote(selectedNote.id, { content: e.target.value });
      setSelectedNote((prev) => prev ? { ...prev, content: e.target.value } : null);
    }}
    className="w-full h-full bg-transparent border-none focus:ring-0 focus:outline-none text-xs text-zinc-300 placeholder-zinc-650 leading-relaxed font-mono resize-none"
    placeholder="Begin typing core blueprint details in markdown guidelines ..."
  />
                </div>
              </div>

              {
    /* Status indicators footer */
  }
              <div className="p-4 border-t border-zinc-900 bg-zinc-900/20 text-xs font-sans text-zinc-600 flex justify-between select-none">
                <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest leading-none flex items-center gap-1">
                  <Check className="w-3 h-3 text-emerald-500" />
                  Sync Active
                </span>
                <span>Modifications stored locally</span>
              </div>
            </motion.div>
          </div>}
      </AnimatePresence>

      {
    /* 3. Spawn Create Modal Drawer */
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
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider">Initialize Document index</span>
                </div>
                <button onClick={() => setShowCreateModal(false)} className="text-zinc-500 hover:text-zinc-300">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-5.5 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-zinc-500 tracking-wider">TITLE</label>
                    <input
    type="text"
    required
    value={newTitle}
    onChange={(e) => setNewTitle(e.target.value)}
    placeholder="e.g. System Roadmap"
    className="w-full h-9 px-3 bg-zinc-900/40 border border-zinc-900 focus:border-zinc-800 focus:outline-none rounded-lg text-xs hover:bg-zinc-900"
  />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-mono text-zinc-500 tracking-wider">CATEGORY</label>
                    <input
    type="text"
    required
    value={newCategory}
    onChange={(e) => setNewCategory(e.target.value)}
    placeholder="e.g. System Design"
    className="w-full h-9 px-3 bg-zinc-900/40 border border-zinc-900 focus:border-zinc-800 focus:outline-none rounded-lg text-xs hover:bg-zinc-900"
  />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-mono text-zinc-500 tracking-wider">DOCUMENT CONTENT (MARKDOWN SUPPORTED)</label>
                  <textarea
    rows={6}
    value={newContent}
    required
    onChange={(e) => setNewContent(e.target.value)}
    placeholder="Enter document outline or setup steps..."
    className="w-full p-3.5 bg-zinc-900/40 border border-zinc-900 focus:border-zinc-800 focus:outline-none rounded-lg text-xs font-mono"
  />
                </div>

                <div className="pt-3 flex justify-end gap-2.5">
                  <button
    type="button"
    onClick={() => setShowCreateModal(false)}
    className="h-10 px-4 text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 border border-transparent rounded-lg transition-colors cursor-pointer"
  >
                    Cancel
                  </button>
                  <button
    type="submit"
    className="h-10 px-5 text-xs font-semibold text-zinc-950 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 rounded-lg shadow cursor-pointer active:scale-97 transition-all leading-none focus:outline-none"
  >
                    Create blueprint
                  </button>
                </div>
              </form>
            </motion.div>
          </div>}
      </AnimatePresence>

    </div>;
};
