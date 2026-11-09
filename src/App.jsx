import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { X } from 'lucide-react';
import Sidebar from './components/Sidebar/Sidebar';
import NotesList from './components/NotesList/NotesList';
import Editor from './components/Editor/Editor';
import SettingsDialog from './components/SettingsDialog/SettingsDialog';
import ConfirmDialog from './components/ConfirmDialog/ConfirmDialog';
import { INITIAL_NOTES, INITIAL_CATEGORIES } from './data/initialData';
import {
  createNewNote,
  updateNoteInList,
  deleteNoteFromList,
  filterNotesByNav,
  getNavCounts,
  resolveCategory,
} from './utils/noteHelpers';
import './styles/layout.css';

const NAV_HEADINGS = {
  all: 'All Notes',
  favorites: 'Favorites',
  recent: 'Recently Updated',
  archived: 'Archived',
};

/**
 * NoteSpace Root Application Component
 * Phase 4: Complete immutable Note CRUD with confirmation dialog.
 */
export default function App() {
  const [notes, setNotes] = useState(INITIAL_NOTES);
  const [categories] = useState(INITIAL_CATEGORIES);
  const [activeNav, setActiveNav] = useState('all');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const [selectedNoteId, setSelectedNoteId] = useState(INITIAL_NOTES[0]?.id ?? null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mobileView, setMobileView] = useState('list');
  const [theme, setTheme] = useState('light');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [deleteCandidateId, setDeleteCandidateId] = useState(null);
  const [statusNotice, setStatusNotice] = useState('');

  const titleInputRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!isSidebarOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSidebarOpen]);

  useEffect(() => {
    if (!statusNotice) return undefined;
    const timer = setTimeout(() => setStatusNotice(''), 4000);
    return () => clearTimeout(timer);
  }, [statusNotice]);

  const navCounts = useMemo(() => getNavCounts(notes), [notes]);

  const visibleNotes = useMemo(
    () => filterNotesByNav(notes, activeNav, selectedCategoryId),
    [notes, activeNav, selectedCategoryId]
  );

  const selectedNote = useMemo(
    () => notes.find((note) => note.id === selectedNoteId) || null,
    [notes, selectedNoteId]
  );

  const notePendingDeletion = useMemo(
    () => notes.find((note) => note.id === deleteCandidateId) || null,
    [notes, deleteCandidateId]
  );

  const currentHeading = useMemo(() => {
    if (selectedCategoryId) {
      const category = resolveCategory(categories, selectedCategoryId);
      return category ? category.name : 'Category';
    }
    return NAV_HEADINGS[activeNav] || 'All Notes';
  }, [activeNav, selectedCategoryId, categories]);

  const syncSelectionForView = useCallback(
    (nextNav, nextCategoryId) => {
      const nextList = filterNotesByNav(notes, nextNav, nextCategoryId);
      const stillVisible = nextList.some((note) => note.id === selectedNoteId);
      if (!stillVisible) {
        setSelectedNoteId(nextList[0]?.id ?? null);
      }
    },
    [notes, selectedNoteId]
  );

  const handleSelectNav = useCallback(
    (navId) => {
      setActiveNav(navId);
      setSelectedCategoryId(null);
      syncSelectionForView(navId, null);
      setMobileView('list');
      setIsSidebarOpen(false);
    },
    [syncSelectionForView]
  );

  const handleSelectCategory = useCallback(
    (categoryId) => {
      setSelectedCategoryId(categoryId);
      syncSelectionForView(activeNav, categoryId);
      setMobileView('list');
      setIsSidebarOpen(false);
    },
    [activeNav, syncSelectionForView]
  );

  const handleSelectNote = useCallback((noteId) => {
    setSelectedNoteId(noteId);
    setMobileView('editor');
  }, []);

  const handleNewNote = useCallback(() => {
    const newNote = createNewNote({
      categoryId: selectedCategoryId || null,
    });

    setNotes((prev) => [newNote, ...prev]);
    setSelectedNoteId(newNote.id);

    if (!selectedCategoryId && (activeNav === 'archived' || activeNav === 'favorites')) {
      setActiveNav('all');
    }

    setMobileView('editor');
    setIsSidebarOpen(false);

    setTimeout(() => {
      if (titleInputRef.current) {
        titleInputRef.current.focus();
        titleInputRef.current.select();
      }
    }, 0);
  }, [activeNav, selectedCategoryId]);

  const handleChangeTitle = useCallback(
    (title) => {
      if (!selectedNoteId) return;
      setNotes((prev) => updateNoteInList(prev, selectedNoteId, { title }));
    },
    [selectedNoteId]
  );

  const handleChangeContent = useCallback(
    (content) => {
      if (!selectedNoteId) return;
      setNotes((prev) => updateNoteInList(prev, selectedNoteId, { content }));
    },
    [selectedNoteId]
  );

  const handleChangeCategory = useCallback(
    (categoryId) => {
      if (!selectedNoteId) return;
      setNotes((prev) => updateNoteInList(prev, selectedNoteId, { categoryId }));
    },
    [selectedNoteId]
  );

  const handleRequestDeleteNote = useCallback(() => {
    if (!selectedNoteId) return;
    setDeleteCandidateId(selectedNoteId);
  }, [selectedNoteId]);

  const handleConfirmDeleteNote = useCallback(() => {
    if (!deleteCandidateId) return;
    setNotes((prev) => deleteNoteFromList(prev, deleteCandidateId));
    if (selectedNoteId === deleteCandidateId) {
      setSelectedNoteId(null);
      setMobileView('list');
    }
    setDeleteCandidateId(null);
    setStatusNotice('Note deleted');
  }, [deleteCandidateId, selectedNoteId]);

  const handleCreateCategory = useCallback(() => {
    setIsSidebarOpen(false);
    setStatusNotice('Category management will be connected in Phase 7.');
  }, []);

  const handleOpenSettings = useCallback(() => {
    setIsSidebarOpen(false);
    setIsSettingsOpen(true);
  }, []);

  const deleteDisplayTitle =
    notePendingDeletion?.title && notePendingDeletion.title.trim()
      ? notePendingDeletion.title
      : 'Untitled Note';

  return (
    <div className="app-shell" data-mobile-view={mobileView}>
      <div
        className={`sidebar-backdrop ${isSidebarOpen ? 'is-visible' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      <div className={`sidebar-wrapper ${isSidebarOpen ? 'is-open' : ''}`}>
        <Sidebar
          activeNav={activeNav}
          selectedCategoryId={selectedCategoryId}
          categories={categories}
          counts={navCounts}
          onSelectNav={handleSelectNav}
          onSelectCategory={handleSelectCategory}
          onNewNote={handleNewNote}
          onCreateCategory={handleCreateCategory}
          onOpenSettings={handleOpenSettings}
          onClose={() => setIsSidebarOpen(false)}
        />
      </div>

      <div className="notes-list-wrapper">
        <NotesList
          heading={currentHeading}
          activeNav={activeNav}
          notes={visibleNotes}
          categories={categories}
          selectedNoteId={selectedNoteId}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={() => setSearchQuery('')}
          onSelectNote={handleSelectNote}
          onNewNote={handleNewNote}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />
      </div>

      <div className="editor-wrapper">
        <Editor
          note={selectedNote}
          categories={categories}
          onChangeTitle={handleChangeTitle}
          onChangeContent={handleChangeContent}
          onChangeCategory={handleChangeCategory}
          onDeleteNote={selectedNote ? handleRequestDeleteNote : undefined}
          onNewNote={handleNewNote}
          onBackToList={() => setMobileView('list')}
          onOpenSidebar={() => setIsSidebarOpen(true)}
          titleInputRef={titleInputRef}
        />
      </div>

      <ConfirmDialog
        isOpen={Boolean(notePendingDeletion)}
        title="Delete Note"
        message={`Are you sure you want to delete "${deleteDisplayTitle}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleConfirmDeleteNote}
        onCancel={() => setDeleteCandidateId(null)}
      />

      <SettingsDialog
        isOpen={isSettingsOpen}
        theme={theme}
        onChangeTheme={setTheme}
        onClose={() => setIsSettingsOpen(false)}
      />

      {statusNotice && (
        <div className="status-toast" role="status" aria-live="polite">
          <span className="status-toast-message">{statusNotice}</span>
          <button
            type="button"
            className="status-toast-close"
            onClick={() => setStatusNotice('')}
            aria-label="Dismiss notification"
          >
            <X size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
