import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus, MoreHorizontal, Trash2, Edit2, Check, X } from 'lucide-react';
import KanbanCard from './KanbanCard';
import { createCard, updateList, deleteList } from '../api';

export default function KanbanList({ list, allLists, allTags, allMembers, onListUpdated, onListDeleted, onCardAdded, onCardUpdated, onCardDeleted }) {
  const [addingCard, setAddingCard] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState('');
  const [editingTitle, setEditingTitle] = useState(false);
  const [listTitle, setListTitle] = useState(list.title);
  const [showMenu, setShowMenu] = useState(false);
  const [saving, setSaving] = useState(false);

  async function handleAddCard() {
    if (!newCardTitle.trim()) return;
    setSaving(true);
    try {
      const { data } = await createCard(list.id, { title: newCardTitle.trim() });
      onCardAdded(list.id, data);
      setNewCardTitle('');
      setAddingCard(false);
    } finally {
      setSaving(false);
    }
  }

  async function handleSaveTitle() {
    if (!listTitle.trim() || listTitle === list.title) {
      setListTitle(list.title);
      setEditingTitle(false);
      return;
    }
    const { data } = await updateList(list.id, { title: listTitle.trim() });
    onListUpdated({ ...list, title: data.title });
    setEditingTitle(false);
  }

  async function handleDeleteList() {
    if (!confirm(`Delete "${list.title}" and all its cards?`)) return;
    await deleteList(list.id);
    onListDeleted(list.id);
    setShowMenu(false);
  }

  return (
    <div className="flex flex-col w-72 shrink-0 rounded-xl bg-zinc-900 border border-zinc-800 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-850">
        {editingTitle ? (
          <div className="flex items-center gap-1.5 flex-1">
            <input
              autoFocus
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-xs font-medium text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              value={listTitle}
              onChange={(e) => setListTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveTitle(); if (e.key === 'Escape') { setListTitle(list.title); setEditingTitle(false); }}}
            />
            <button onClick={handleSaveTitle} className="text-emerald-500 hover:text-emerald-400 p-1 cursor-pointer"><Check size={13} /></button>
            <button onClick={() => { setListTitle(list.title); setEditingTitle(false); }} className="text-zinc-500 hover:text-zinc-300 p-1 cursor-pointer"><X size={13} /></button>
          </div>
        ) : (
          <h3
            className="text-xs font-semibold text-zinc-300 uppercase tracking-wider cursor-pointer hover:text-white flex-1 truncate font-heading"
            onClick={() => setEditingTitle(true)}
          >
            {list.title}
          </h3>
        )}
        <div className="flex items-center gap-1.5 ml-2 shrink-0">
          <span className="text-[10px] text-zinc-400 font-bold bg-zinc-950 border border-zinc-800 rounded px-1.5 py-0.5">
            {list.cards?.length ?? 0}
          </span>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800 rounded p-1 transition-all cursor-pointer"
            >
              <MoreHorizontal size={13} />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-full mt-1 w-40 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg z-20 overflow-hidden slide-in">
                  <button
                    onClick={() => { setEditingTitle(true); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-all text-left cursor-pointer"
                  >
                    <Edit2 size={12} /> Rename List
                  </button>
                  <button
                    onClick={handleDeleteList}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-400 hover:bg-red-950/20 transition-all text-left cursor-pointer"
                  >
                    <Trash2 size={12} /> Delete List
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Cards droppable area */}
      <Droppable droppableId={String(list.id)}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-2 p-3 min-h-[60px] transition-colors rounded-b-xl flex-1 max-h-[calc(100vh-220px)] overflow-y-auto ${
              snapshot.isDraggingOver ? 'bg-zinc-950/40' : ''
            }`}
          >
            {(list.cards || []).map((card, index) => (
              <KanbanCard
                key={card.id}
                card={card}
                index={index}
                listId={list.id}
                allTags={allTags}
                allMembers={allMembers}
                lists={allLists}
                onCardUpdated={onCardUpdated}
                onCardDeleted={onCardDeleted}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {/* Add card section */}
      <div className="px-3 pb-3">
        {addingCard ? (
          <div className="flex flex-col gap-2 p-2.5 bg-zinc-950 rounded-lg border border-zinc-800 shadow-inner fade-in">
            <textarea
              autoFocus
              className="w-full bg-transparent text-xs text-zinc-200 placeholder-zinc-650 resize-none focus:outline-none"
              placeholder="Card title…"
              rows={2}
              value={newCardTitle}
              onChange={(e) => setNewCardTitle(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddCard(); } if (e.key === 'Escape') { setAddingCard(false); setNewCardTitle(''); }}}
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={handleAddCard}
                disabled={saving || !newCardTitle.trim()}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold py-1.5 rounded-md transition-colors cursor-pointer"
              >
                {saving ? 'Adding…' : 'Add Card'}
              </button>
              <button
                onClick={() => { setAddingCard(false); setNewCardTitle(''); }}
                className="text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900 rounded-md px-2 cursor-pointer transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAddingCard(true)}
            className="w-full flex items-center justify-center gap-1.5 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg py-2 px-3 text-xs font-semibold transition-all cursor-pointer border border-transparent hover:border-zinc-800"
          >
            <Plus size={13} /> Add card
          </button>
        )}
      </div>
    </div>
  );
}
