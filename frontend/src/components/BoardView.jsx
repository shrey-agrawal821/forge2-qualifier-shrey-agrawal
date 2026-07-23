import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import { Plus, ArrowLeft, X, LayoutDashboard, Settings, Users, Folder, ShieldCheck, Menu } from 'lucide-react';
import KanbanList from './KanbanList';
import { getBoard, createList, updateCard, updateList, getTags, getMembers } from '../api';
import { Button } from './ui';

export default function BoardView({ boardId, onBack }) {
  const [board, setBoard] = useState(null);
  const [lists, setLists] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [allMembers, setAllMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingList, setAddingList] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [boardRes, tagsRes, membersRes] = await Promise.all([
        getBoard(boardId),
        getTags(),
        getMembers(),
      ]);
      setBoard(boardRes.data);
      setLists(boardRes.data.lists || []);
      setAllTags(tagsRes.data);
      setAllMembers(membersRes.data);
      setLoading(false);
    }
    load();
  }, [boardId]);

  // ── Drag & Drop ─────────────────────────────────────────────────────────────

  async function onDragEnd(result) {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceListId = parseInt(source.droppableId);
    const destListId = parseInt(destination.droppableId);
    const cardId = parseInt(draggableId);

    // Optimistic update
    const newLists = lists.map((l) => ({ ...l, cards: [...(l.cards || [])] }));
    const sourceList = newLists.find((l) => l.id === sourceListId);
    const destList = newLists.find((l) => l.id === destListId);
    const [movedCard] = sourceList.cards.splice(source.index, 1);
    movedCard.list_id = destListId;
    destList.cards.splice(destination.index, 0, movedCard);

    // Re-assign positions
    destList.cards.forEach((c, i) => { c.position = i; });
    sourceList.cards.forEach((c, i) => { c.position = i; });

    setLists(newLists);

    // Persist to backend
    try {
      await updateCard(cardId, {
        list_id: destListId,
        position: destination.index,
      });
      // Update positions of all affected cards in source list
      await Promise.all(
        sourceList.cards.map((c) => updateCard(c.id, { position: c.position }))
      );
      if (sourceListId !== destListId) {
        await Promise.all(
          destList.cards.map((c) => updateCard(c.id, { position: c.position }))
        );
      }
    } catch (e) {
      console.error('DnD sync failed', e);
    }
  }

  // ── List mutation helpers ───────────────────────────────────────────────────

  async function handleAddList() {
    if (!newListTitle.trim()) return;
    setSaving(true);
    try {
      const { data } = await createList(boardId, { title: newListTitle.trim() });
      setLists((prev) => [...prev, { ...data, cards: [] }]);
      setNewListTitle('');
      setAddingList(false);
    } finally {
      setSaving(false);
    }
  }

  function handleListUpdated(updatedList) {
    setLists((prev) => prev.map((l) => (l.id === updatedList.id ? { ...l, ...updatedList } : l)));
  }

  function handleListDeleted(listId) {
    setLists((prev) => prev.filter((l) => l.id !== listId));
  }

  // ── Card mutation helpers ───────────────────────────────────────────────────

  function handleCardAdded(listId, card) {
    setLists((prev) =>
      prev.map((l) => l.id === listId ? { ...l, cards: [...(l.cards || []), card] } : l)
    );
  }

  function handleCardUpdated(updatedCard) {
    setLists((prev) =>
      prev.map((l) => ({
        ...l,
        cards: (l.cards || []).map((c) => (c.id === updatedCard.id ? { ...c, ...updatedCard } : c)),
      }))
    );
  }

  function handleCardDeleted(listId, cardId) {
    setLists((prev) =>
      prev.map((l) => l.id === listId ? { ...l, cards: (l.cards || []).filter((c) => c.id !== cardId) } : l)
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-zinc-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-indigo-600 border-t-transparent animate-spin" />
          <p className="text-zinc-500 text-xs font-semibold tracking-wide">Loading Board Canvas…</p>
        </div>
      </div>
    );
  }

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
            <button
              onClick={onBack}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/40 transition-all text-left cursor-pointer"
            >
              <Folder size={14} />
              <span>All Boards</span>
            </button>
            <a
              href="#"
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-805/40 transition-all"
            >
              <Users size={14} />
              <span>Members</span>
            </a>
            <a
              href="#"
              className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-805/40 transition-all"
            >
              <Settings size={14} />
              <span>Settings</span>
            </a>
          </div>
        </div>

        <div>
          <span className="px-3 text-[10px] font-bold text-zinc-500 tracking-wider uppercase block mb-3">
            Active Project
          </span>
          <div className="px-3 py-2 rounded-lg bg-zinc-900 text-xs font-semibold text-zinc-200 border border-zinc-800 truncate">
            {board?.title}
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
    <div className="min-h-screen flex bg-[#09090d] text-zinc-100 relative h-screen overflow-hidden">
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
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 px-6 border-b border-zinc-900 bg-zinc-950 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3.5 min-w-0">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="text-zinc-400 hover:text-zinc-200 p-1 cursor-pointer md:hidden"
            >
              <Menu size={20} />
            </button>
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-zinc-450 hover:text-zinc-250 hover:bg-zinc-900 border border-zinc-900 rounded-lg transition-all text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft size={13} /> Back
            </button>
            <div className="w-px h-4 bg-zinc-800" />
            <h1 className="text-zinc-50 font-semibold text-sm truncate font-heading tracking-tight">
              {board?.title}
            </h1>
            {board?.description && (
              <>
                <span className="text-zinc-800 hidden md:inline">•</span>
                <p className="text-zinc-500 text-xs truncate max-w-sm hidden md:block">
                  {board.description}
                </p>
              </>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-md">
              Board Canvas
            </span>
          </div>
        </header>

        {/* Board canvas — horizontal scroll */}
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex-1 overflow-x-auto overflow-y-hidden bg-zinc-950/20">
            <div className="flex gap-4 p-6 h-full items-start">
              {lists.map((list) => (
                <KanbanList
                  key={list.id}
                  list={list}
                  allLists={lists}
                  allTags={allTags}
                  allMembers={allMembers}
                  onListUpdated={handleListUpdated}
                  onListDeleted={handleListDeleted}
                  onCardAdded={handleCardAdded}
                  onCardUpdated={handleCardUpdated}
                  onCardDeleted={handleCardDeleted}
                />
              ))}

              {/* Add List Column */}
              <div className="w-72 shrink-0">
                {addingList ? (
                  <div className="bg-zinc-905 border border-zinc-800 rounded-xl p-3.5 flex flex-col gap-3 fade-in">
                    <input
                      autoFocus
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-lg px-3 py-1.5 text-xs font-semibold text-zinc-200 placeholder-zinc-650 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="List name…"
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleAddList(); if (e.key === 'Escape') { setAddingList(false); setNewListTitle(''); }}}
                    />
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={handleAddList}
                        disabled={saving || !newListTitle.trim()}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        {saving ? 'Adding…' : 'Add List'}
                      </button>
                      <button
                        onClick={() => { setAddingList(false); setNewListTitle(''); }}
                        className="text-zinc-500 hover:text-zinc-300 px-2 cursor-pointer transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingList(true)}
                    className="w-full flex items-center justify-center gap-1.5 text-zinc-500 hover:text-zinc-300 bg-zinc-900/30 hover:bg-zinc-900/50 border border-dashed border-zinc-850 hover:border-zinc-800 rounded-xl py-3 px-4 text-xs font-semibold transition-all cursor-pointer"
                  >
                    <Plus size={14} /> Add Column
                  </button>
                )}
              </div>
            </div>
          </div>
        </DragDropContext>
      </div>
    </div>
  );
}
