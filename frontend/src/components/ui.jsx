import React from 'react';
import { X } from 'lucide-react';

// ─── Utility ─────────────────────────────────────────────────────────────────

export function cn(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function isOverdue(dateStr) {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
}

export function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── Tag Badge ────────────────────────────────────────────────────────────────

export function TagBadge({ tag, onRemove }) {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border"
      style={{
        backgroundColor: tag.color + '10',
        color: tag.color,
        borderColor: tag.color + '30',
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ backgroundColor: tag.color }} />
      {tag.name}
      {onRemove && (
        <button onClick={() => onRemove(tag.id)} className="hover:opacity-100 opacity-60 ml-0.5 transition-opacity cursor-pointer">
          <X size={12} />
        </button>
      )}
    </span>
  );
}

// ─── Avatar ───────────────────────────────────────────────────────────────────

export function Avatar({ member, size = 24 }) {
  return (
    <img
      src={member.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`}
      alt={member.name}
      title={member.name}
      className="rounded-full border border-zinc-800 bg-zinc-950 shrink-0"
      style={{ width: size, height: size }}
    />
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

export function Modal({ title, onClose, children, wide = false }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className={cn(
          'relative bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl flex flex-col max-h-[90vh] slide-in',
          wide ? 'w-full max-w-2xl' : 'w-full max-w-md'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <h2 className="text-zinc-50 font-semibold text-sm tracking-wide">{title}</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 transition-all rounded-md p-1 cursor-pointer hover:bg-zinc-800"
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────

export function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-zinc-400 tracking-wide">{label}</label>}
      <input
        className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600
                   text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-150"
        {...props}
      />
    </div>
  );
}

// ─── Textarea ────────────────────────────────────────────────────────────────

export function Textarea({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-zinc-400 tracking-wide">{label}</label>}
      <textarea
        className="w-full px-3.5 py-2 rounded-lg bg-zinc-950 border border-zinc-800 text-zinc-100 placeholder-zinc-600
                   text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all duration-150 resize-none"
        rows={3}
        {...props}
      />
    </div>
  );
}

// ─── Button ───────────────────────────────────────────────────────────────────

export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-1.5 font-medium rounded-lg transition-all duration-150 cursor-pointer select-none active:scale-[0.98]';
  const variants = {
    primary: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm border border-indigo-500/25',
    secondary: 'bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-800',
    danger: 'bg-red-950/20 hover:bg-red-950/40 text-red-300 border border-red-900/30 hover:border-red-900/50',
    ghost: 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-xs font-semibold',
    md: 'px-4 py-2 text-sm font-semibold',
    lg: 'px-5 py-2.5 text-sm font-semibold',
  };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}
