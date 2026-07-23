import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Clock } from 'lucide-react';
import { Avatar, isOverdue, formatDate } from './ui';
import CardModal from './CardModal';

export default function KanbanCard({ card, index, listId, allTags, allMembers, lists, onCardUpdated, onCardDeleted }) {
  const [showModal, setShowModal] = useState(false);
  const overdue = isOverdue(card.due_date);

  return (
    <>
      <Draggable draggableId={String(card.id)} index={index}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setShowModal(true)}
            className={`
              group relative rounded-lg p-3.5 cursor-pointer border transition-all duration-150 fade-in
              ${snapshot.isDragging
                ? 'bg-zinc-800 border-zinc-700 shadow-lg scale-[1.01]'
                : 'bg-zinc-950 border-zinc-850 hover:border-zinc-750 hover:bg-zinc-900/60 shadow-sm'
              }
            `}
          >
            {/* Tags section */}
            {card.tags && card.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2.5">
                {card.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: tag.color + '15',
                      color: tag.color,
                      border: `1px solid ${tag.color}25`
                    }}
                    title={tag.name}
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <p className="text-xs font-semibold text-zinc-100 leading-snug mb-1 group-hover:text-white transition-colors">
              {card.title}
            </p>

            {/* Description preview */}
            {card.description && (
              <p className="text-[11px] text-zinc-400 leading-normal line-clamp-2 mb-3">
                {card.description}
              </p>
            )}

            {/* Footer: due date + members */}
            <div className="flex items-center justify-between gap-3 mt-2 pt-2.5 border-t border-zinc-900">
              <div className="flex items-center gap-2">
                {card.due_date && (
                  <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                    overdue
                      ? 'bg-red-950/20 text-red-300 border-red-900/25'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800'
                  }`}>
                    <Clock size={10} />
                    {formatDate(card.due_date)}
                  </span>
                )}
              </div>

              {/* Member Avatars */}
              {card.members && card.members.length > 0 && (
                <div className="flex -space-x-1.5">
                  {card.members.slice(0, 3).map((member) => (
                    <Avatar key={member.id} member={member} size={18} />
                  ))}
                  {card.members.length > 3 && (
                    <span className="w-[18px] h-[18px] rounded-full bg-zinc-900 text-zinc-400 text-[8px] font-extrabold flex items-center justify-center border border-zinc-850 shrink-0">
                      +{card.members.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>

      {showModal && (
        <CardModal
          card={card}
          lists={lists}
          allTags={allTags}
          allMembers={allMembers}
          onClose={() => setShowModal(false)}
          onCardUpdated={(updatedCard) => { onCardUpdated(updatedCard); }}
          onCardDeleted={(cardId) => { onCardDeleted(listId, cardId); setShowModal(false); }}
        />
      )}
    </>
  );
}
