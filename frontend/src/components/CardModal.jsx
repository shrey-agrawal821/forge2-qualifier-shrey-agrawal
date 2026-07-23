import React, { useState } from 'react';
import { Calendar, Trash2, Clock } from 'lucide-react';
import { Modal, Button, Input, Textarea, TagBadge, Avatar, isOverdue, formatDate } from './ui';
import { updateCard, deleteCard, attachTag, detachTag, assignMember, removeMember } from '../api';

export default function CardModal({ card: initialCard, lists, allTags, allMembers, onClose, onCardUpdated, onCardDeleted }) {
  const [card, setCard] = useState(initialCard);
  const [title, setTitle] = useState(initialCard.title);
  const [description, setDescription] = useState(initialCard.description || '');
  const [dueDate, setDueDate] = useState(
    initialCard.due_date ? initialCard.due_date.replace(' ', 'T').slice(0, 16) : ''
  );
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('details');

  const isDue = isOverdue(card.due_date);

  async function handleSave() {
    setSaving(true);
    try {
      const { data } = await updateCard(card.id, {
        title,
        description,
        due_date: dueDate || null,
      });
      const updated = { ...data, tags: card.tags, members: card.members };
      setCard(updated);
      onCardUpdated(updated);
    } finally {
      setSaving(false);
    }
  }

  async function handleTagToggle(tag) {
    const hasTag = card.tags.some((t) => t.id === tag.id);
    if (hasTag) {
      await detachTag(card.id, tag.id);
      const updated = { ...card, tags: card.tags.filter((t) => t.id !== tag.id) };
      setCard(updated);
      onCardUpdated(updated);
    } else {
      const { data } = await attachTag(card.id, tag.id);
      const updated = { ...card, tags: data.tags, members: data.members };
      setCard(updated);
      onCardUpdated(updated);
    }
  }

  async function handleMemberToggle(member) {
    const hasMember = card.members.some((m) => m.id === member.id);
    if (hasMember) {
      await removeMember(card.id, member.id);
      const updated = { ...card, members: card.members.filter((m) => m.id !== member.id) };
      setCard(updated);
      onCardUpdated(updated);
    } else {
      const { data } = await assignMember(card.id, member.id);
      const updated = { ...card, tags: data.tags, members: data.members };
      setCard(updated);
      onCardUpdated(updated);
    }
  }

  async function handleDelete() {
    if (!confirm('Delete this card?')) return;
    await deleteCard(card.id);
    onCardDeleted(card.id);
    onClose();
  }

  return (
    <Modal title="Task Details" onClose={onClose} wide>
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <input
            className="flex-1 text-lg font-semibold text-zinc-100 bg-transparent border-none outline-none focus:bg-zinc-800 rounded-md px-2 -mx-2 py-1 transition-colors"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
          />
          <button
            onClick={handleDelete}
            className="text-red-400 hover:bg-red-500/10 transition-colors p-1.5 rounded-lg shrink-0 cursor-pointer"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Due date indicator */}
        {card.due_date && (
          <div className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-md w-fit border ${
            isDue ? 'bg-red-950/20 text-red-400 border-red-900/30' : 'bg-emerald-950/20 text-emerald-400 border-emerald-900/30'
          }`}>
            <Clock size={12} />
            {isDue ? 'Overdue' : 'Due'} — {formatDate(card.due_date)}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 border-b border-zinc-800 -mx-6 px-6">
          {['details', 'tags', 'members'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2 text-xs font-semibold uppercase tracking-wider border-b-2 transition-colors -mb-px cursor-pointer ${
                activeTab === tab
                  ? 'border-indigo-500 text-zinc-100'
                  : 'border-transparent text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Details Tab */}
        {activeTab === 'details' && (
          <div className="flex flex-col gap-4">
            <Textarea
              label="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onBlur={handleSave}
              placeholder="Add a detailed description..."
              rows={4}
            />
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-zinc-400 tracking-wide flex items-center gap-1.5">
                <Calendar size={13} /> Due Date
              </label>
              <input
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                onBlur={handleSave}
                className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 text-sm
                           focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-150"
              />
            </div>
            {saving && <p className="text-[10px] text-zinc-500 italic">Auto-saving changes…</p>}
          </div>
        )}

        {/* Tags Tab */}
        {activeTab === 'tags' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-zinc-400">Select tags to apply to this task:</p>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const active = card.tags.some((t) => t.id === tag.id);
                return (
                  <button
                    key={tag.id}
                    onClick={() => handleTagToggle(tag)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                      active ? 'opacity-100 scale-100' : 'opacity-40 hover:opacity-60 scale-95'
                    }`}
                    style={{
                      backgroundColor: active ? tag.color + '15' : 'transparent',
                      color: tag.color,
                      borderColor: tag.color + '40',
                    }}
                  >
                    {active && <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: tag.color }} />}
                    {tag.name}
                  </button>
                );
              })}
            </div>
            {card.tags.length > 0 && (
              <div className="pt-2 border-t border-zinc-850 mt-2">
                <p className="text-xs font-semibold text-zinc-500 mb-2">Applied Tags:</p>
                <div className="flex flex-wrap gap-2">
                  {card.tags.map((tag) => <TagBadge key={tag.id} tag={tag} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Members Tab */}
        {activeTab === 'members' && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-zinc-400">Assign members to this task:</p>
            <div className="flex flex-col gap-1.5">
              {allMembers.map((member) => {
                const active = card.members.some((m) => m.id === member.id);
                return (
                  <button
                    key={member.id}
                    onClick={() => handleMemberToggle(member)}
                    className={`flex items-center gap-3 p-2 rounded-lg border transition-all text-left cursor-pointer ${
                      active
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-100'
                        : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                    }`}
                  >
                    <Avatar member={member} size={28} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{member.name}</p>
                      <p className="text-[10px] opacity-60 truncate">{member.email}</p>
                    </div>
                    {active && (
                      <span className="w-4 h-4 rounded-full bg-indigo-600 flex items-center justify-center shrink-0">
                        <svg width="8" height="6" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
