import React, { useState, useEffect } from 'react';
import { Plus, Trash2, ArrowRight, LayoutDashboard, Settings, Users, Folder, Search, ShieldCheck, Menu, X } from 'lucide-react';
import { getBoards, createBoard, deleteBoard } from '../api';
import { Modal, Input, Textarea, Button } from './ui';

export default function BoardsHome({ onSelectBoard }) {
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    loadBoards();
  }, []);

  async function loadBoards() {
    setLoading(true);
    try {
      const { data } = await getBoards();
      setBoards(data);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate() {
    if (!newTitle.trim()) return;
    setSaving(true);
    try {
      const { data } = await createBoard({ title: newTitle.trim(), description: newDesc.trim() });
      setBoards((prev) => [...prev, data]);
      setNewTitle('');
      setNewDesc('');
      setShowCreate(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(e, boardId) {
    e.stopPropagation();
    if (!confirm('Delete this board and all its content?')) return;
    await deleteBoard(boardId);
    setBoards((prev) => prev.filter((b) => b.id !== boardId));
  }

  const filteredBoards = boards.filter((b) =>
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.description && b.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#121218] border-r border-zinc-800 p-5">
      {/* Workspace Brand Header */}
      <div className="h-14 border-b border-zinc-800/80 flex items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0 shadow-md">
            <LayoutDashboard size={16} className="text-white" />
          </div>
          <div>
            <span className="text-sm font-semibold text-zinc-100 block">KanbanFlow</span>
            <span className="text-[10px] text-zinc-500 font-medium block">Personal Workspace</span>
          </div>
        </div>
        {/* Mobile close button */}
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden text-zinc-400 hover:text-zinc-200 cursor-pointer"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-6">
        <div>
          <span className="px-3 text-[10px] font-bold text-zinc-500 tracking-wider uppercase block mb-3">
            Workspace
          </span>
          <div className="space-y-1">
            <a
              href="#"
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg bg-zinc-805 text-zinc-100 border border-zinc-700/50"
            >
              <Folder size={14} className="text-indigo-400" />
              <span>All Boards</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40 transition-all"
            >
              <Users size={14} />
              <span>Members</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40 transition-all"
            >
              <Settings size={14} />
              <span>Settings</span>
            </a>
          </div>
        </div>

        <div>
          <span className="px-3 text-[10px] font-bold text-zinc-500 tracking-wider uppercase block mb-3">
            Integrations
          </span>
          <div className="mx-2 p-3.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 space-y-1.5">
            <div className="flex items-center gap-1.5 font-semibold text-zinc-300">
              <ShieldCheck size={13} className="text-emerald-500" /> System Online
            </div>
            <p className="text-[11px] leading-relaxed text-zinc-500">
              SQLite database connected and API routes mounted successfully.
            </p>
          </div>
        </div>
      </nav>

      {/* User profile footer locked to the bottom */}
      <div className="mt-auto pt-4 border-t border-zinc-800/80 flex items-center gap-3">
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
          alt="User Avatar"
          className="w-9 h-9 rounded-full bg-zinc-800 border border-zinc-800 shrink-0"
        />
        <div className="min-w-0">
          <span className="text-xs font-semibold text-zinc-200 block truncate">Administrator</span>
          <span className="text-[10px] text-zinc-500 block truncate">admin@example.com</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#09090d] text-zinc-100 relative">
      {/* Desktop Sidebar (Fixed 260px, 100vh) */}
      <aside className="w-[260px] h-screen sticky top-0 shrink-0 hidden md:block">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileSidebarOpen(false)} />
          <div className="relative w-[260px] h-full slide-in z-50">
            {sidebarContent}
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        {/* Mobile Header Bar */}
        <div className="h-14 px-6 border-b border-zinc-900 bg-[#09090d] flex items-center justify-between md:hidden shrink-0">
          <button
            onClick={() => setMobileSidebarOpen(true)}
            className="text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer"
          >
            <Menu size={20} />
          </button>
          <span className="text-sm font-bold tracking-tight">KanbanFlow</span>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="User" />
          </div>
        </div>

        {/* Content Body with consistent 32px padding and spacing system */}
        <main className="flex-1 p-8 md:p-10 max-w-7xl w-full mx-auto space-y-8">
          {/* Header Section (Title Left, Button Right) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-900 pb-6 mt-2">
            <div>
              <h1 className="text-[32px] font-bold text-zinc-50 tracking-tight font-heading leading-tight">
                Workspace Projects
              </h1>
              <p className="text-zinc-400 text-sm mt-1">
                Manage, track, and collaborate on your active projects.
              </p>
            </div>
            <Button onClick={() => setShowCreate(true)} size="md" className="shrink-0 h-fit">
              <Plus size={16} /> Create Board
            </Button>
          </div>

          {/* Search Bar Container */}
          <div className="w-full max-w-[480px] relative">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search projects..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-zinc-200 placeholder-zinc-500 text-sm focus:outline-none focus:border-zinc-700 focus:bg-zinc-900 focus:ring-1 focus:ring-zinc-700 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Active Projects Grid Section */}
          <div className="space-y-6">
            <div>
              <h2 className="text-[22px] font-bold text-zinc-50 tracking-tight font-heading">
                Active Boards
              </h2>
              <p className="text-zinc-500 text-xs mt-1">
                {boards.length === 0 ? 'No active boards found.' : `Currently viewing ${filteredBoards.length} board${filteredBoards.length > 1 ? 's' : ''}`}
              </p>
            </div>

            {/* Loading skeleton */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="h-[200px] rounded-2xl border border-zinc-900 bg-zinc-900/20 shimmer" />
                ))}
              </div>
            )}

            {/* Content Grid */}
            {!loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredBoards.map((board) => (
                  <div
                    key={board.id}
                    onClick={() => onSelectBoard(board.id)}
                    className="group relative flex flex-col justify-between h-[200px] rounded-[16px] bg-zinc-900 border border-zinc-800 shadow-md p-6 hover:-translate-y-1 hover:border-zinc-700 transition-all duration-200 cursor-pointer"
                  >
                    <div>
                      <h3 className="text-base font-semibold text-zinc-100 group-hover:text-indigo-400 transition-colors truncate">
                        {board.title}
                      </h3>
                      <p className="text-[14px] text-zinc-400 leading-relaxed mt-2.5 line-clamp-3">
                        {board.description || 'No description provided.'}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between border-t border-zinc-800/80 pt-4 mt-auto">
                      <span className="text-[11px] font-bold text-zinc-450 uppercase tracking-widest group-hover:text-zinc-200 transition-colors flex items-center gap-1.5">
                        Open Board <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
                      </span>
                      <button
                        onClick={(e) => handleDelete(e, board.id)}
                        className="text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all p-1.5 hover:bg-red-500/10 rounded-md cursor-pointer"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Create Project Button Card */}
                <button
                  onClick={() => setShowCreate(true)}
                  className="rounded-[16px] border border-dashed border-zinc-800 hover:border-zinc-700 bg-zinc-950 hover:bg-zinc-900/10 transition-all p-6 flex flex-col items-center justify-center gap-3.5 text-center h-[200px] group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-lg bg-zinc-900 group-hover:bg-zinc-800 flex items-center justify-center transition-colors border border-zinc-800 shadow-sm">
                    <Plus size={16} className="text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-200 transition-colors block">
                      Create Project Board
                    </span>
                    <span className="text-[10px] text-zinc-500 mt-1 block">
                      Add a new board workspace
                    </span>
                  </div>
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Modal */}
      {showCreate && (
        <Modal title="Create New Project Board" onClose={() => setShowCreate(false)}>
          <div className="flex flex-col gap-4">
            <Input
              label="Board Title"
              placeholder="e.g. Q3 Launch Roadmap"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleCreate(); }}
              autoFocus
            />
            <Textarea
              label="Description"
              placeholder="Provide a brief summary of this board's goals..."
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={3}
            />
            <div className="flex gap-3 pt-2">
              <Button
                onClick={handleCreate}
                disabled={saving || !newTitle.trim()}
                className="flex-1"
              >
                {saving ? 'Creating…' : 'Create Board'}
              </Button>
              <Button variant="secondary" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
