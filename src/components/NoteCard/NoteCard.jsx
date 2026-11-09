import React from 'react';
import { Star } from 'lucide-react';
import { formatNoteDate, formatFullDateTime } from '../../utils/dateHelpers';
import { getNotePreview } from '../../utils/noteHelpers';
import './NoteCard.css';

/**
 * Displays a single note summary item inside the NotesList panel.
 */
export default function NoteCard({
  note,
  category = null,
  isSelected = false,
  onSelect,
}) {
  const displayTitle = note.title && note.title.trim() ? note.title : 'Untitled Note';
  const previewText = getNotePreview(note.content);
  const formattedDate = formatNoteDate(note.updatedAt);
  const fullDate = formatFullDateTime(note.updatedAt);

  return (
    <button
      type="button"
      className={`note-card ${isSelected ? 'is-selected' : ''}`}
      onClick={() => onSelect(note.id)}
      aria-current={isSelected ? 'true' : undefined}
    >
      <div className="note-card-header">
        <span className="note-card-title">{displayTitle}</span>
        {note.isFavorite && (
          <span
            className="note-card-favorite"
            aria-label="Favorite note"
            title="Favorite"
          >
            <Star size={13} fill="currentColor" aria-hidden="true" />
          </span>
        )}
      </div>

      <p className="note-card-preview">{previewText}</p>

      <div className="note-card-meta">
        {category && (
          <span className="note-card-category">
            <span
              className="note-card-category-dot"
              style={{ backgroundColor: category.color }}
              aria-hidden="true"
            />
            <span>{category.name}</span>
          </span>
        )}
        <time
          className="note-card-date"
          dateTime={note.updatedAt}
          title={fullDate || undefined}
        >
          {formattedDate}
        </time>
      </div>
    </button>
  );
}

