import React from 'react';
import { Menu, Plus, Search, FileText, Star, Clock, Archive } from 'lucide-react';
import SearchBar from '../SearchBar/SearchBar';
import EmptyState from '../EmptyState/EmptyState';
import NoteCard from '../NoteCard/NoteCard';
import { resolveCategory } from '../../utils/noteHelpers';
import './NotesList.css';

const EMPTY_STATE_CONFIG = {
  all: {
    icon: FileText,
    title: 'No notes yet',
    description: 'Create your first note to start capturing ideas in Markdown.',
  },
  favorites: {
    icon: Star,
    title: 'No favorite notes',
    description: 'Star important notes to keep them pinned in your Favorites view.',
  },
  recent: {
    icon: Clock,
    title: 'No recently updated notes',
    description: 'Notes you create or modify will appear here in chronological order.',
  },
  archived: {
    icon: Archive,
    title: 'Archive is empty',
    description: 'Archived notes are stored separately here and hidden from All Notes.',
  },
};

/**
 * Middle column displaying the current view heading, search bar, and filtered notes list.
 */
export default function NotesList({
  heading = 'All Notes',
  activeNav = 'all',
  notes = [],
  categories = [],
  selectedNoteId = null,
  searchQuery = '',
  onSearchChange,
  onClearSearch,
  onSelectNote,
  onNewNote,
  onOpenSidebar,
  searchInputRef = null,
  renderNoteCard,
}) {
  const emptyConfig = searchQuery.trim()
    ? {
        icon: Search,
        title: 'No matching notes',
        description: `No notes matched "${searchQuery.trim()}". Try a different keyword.`,
      }
    : EMPTY_STATE_CONFIG[activeNav] || EMPTY_STATE_CONFIG.all;

  return (
    <section className="notes-list-panel" aria-label="Notes list">
      <header className="notes-list-header">
        <div className="notes-list-header-left">
          <button
            type="button"
            className="btn-icon mobile-only-btn"
            onClick={onOpenSidebar}
            aria-label="Open navigation menu"
            title="Open menu"
          >
            <Menu size={18} />
          </button>
          <h1 className="notes-list-title">{heading}</h1>
          <span className="notes-list-count" aria-label={`${notes.length} notes`}>
            ({notes.length})
          </span>
        </div>

        <button
          type="button"
          className="btn-icon"
          onClick={onNewNote}
          aria-label="Create new note"
          title="New note"
        >
          <Plus size={18} />
        </button>
      </header>

      <div className="notes-list-search">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          onClear={onClearSearch}
          inputRef={searchInputRef}
        />
      </div>

      <div className="notes-list-body">
        {notes.length === 0 ? (
          <EmptyState
            icon={emptyConfig.icon}
            title={emptyConfig.title}
            description={emptyConfig.description}
            actionLabel={
              searchQuery.trim()
                ? 'Clear search'
                : activeNav === 'all'
                ? 'Create Note'
                : undefined
            }
            onAction={
              searchQuery.trim()
                ? onClearSearch
                : activeNav === 'all'
                ? onNewNote
                : undefined
            }
          />
        ) : (
          <div className="notes-list-items" role="list">
            {notes.map((note) =>
              renderNoteCard ? (
                renderNoteCard(note)
              ) : (
                <div key={note.id} role="listitem">
                  <NoteCard
                    note={note}
                    category={resolveCategory(categories, note.categoryId)}
                    isSelected={selectedNoteId === note.id}
                    onSelect={onSelectNote}
                  />
                </div>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}
