import { v4 as uuidv4 } from 'uuid';

/**
 * Extracts a clean plain-text preview snippet from Markdown source content.
 */
export function getNotePreview(content = '', maxLength = 110) {
  if (typeof content !== 'string' || !content.trim()) {
    return 'No additional text';
  }

  const plainText = content
    // Remove fenced code block markers
    .replace(/```[\s\S]*?```/g, (block) =>
      block.replace(/```[^\n]*\n?/g, '').replace(/```/g, '')
    )
    // Convert markdown links [text](url) -> text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Strip markdown task list checkboxes
    .replace(/^\s*[-*+]\s+\[[ xX]\]\s+/gm, '')
    // Strip heading hashes, blockquotes, list bullets, horizontal rules
    .replace(/^\s{0,3}(#{1,6}\s+|>\s*|[-*+]\s+|\d+\.\s+|---+\s*$)/gm, '')
    // Strip inline formatting symbols (*, _, ~, `)
    .replace(/[*_~`]/g, '')
    // Collapse whitespace and newlines
    .replace(/\s+/g, ' ')
    .trim();

  if (!plainText) {
    return 'No additional text';
  }

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.slice(0, maxLength).trimEnd()}...`;
}

/**
 * Calculates word count and character count for note content.
 */
export function getNoteStats(content = '') {
  if (typeof content !== 'string' || !content) {
    return { wordCount: 0, charCount: 0 };
  }

  const trimmed = content.trim();
  const wordCount = trimmed ? trimmed.split(/\s+/).length : 0;

  return {
    wordCount,
    charCount: content.length,
  };
}

/**
 * Safely resolves a note's categoryId to a category object.
 * Returns null if categoryId is missing or points to a deleted/unknown category.
 */
export function resolveCategory(categories = [], categoryId = null) {
  if (!categoryId || !Array.isArray(categories)) {
    return null;
  }

  return categories.find((category) => category.id === categoryId) || null;
}

/**
 * Computes sidebar navigation badge counts across all notes.
 */
export function getNavCounts(notes = []) {
  const activeNotes = notes.filter((note) => !note.isArchived);
  const favoriteNotes = activeNotes.filter((note) => note.isFavorite);
  const archivedNotes = notes.filter((note) => note.isArchived);

  return {
    all: activeNotes.length,
    favorites: favoriteNotes.length,
    recent: activeNotes.length,
    archived: archivedNotes.length,
  };
}

/**
 * Filters notes according to the selected sidebar view and optional category.
 */
export function filterNotesByNav(
  notes = [],
  activeNav = 'all',
  selectedCategoryId = null
) {
  let filtered;

  if (selectedCategoryId) {
    filtered = notes.filter(
      (note) => !note.isArchived && note.categoryId === selectedCategoryId
    );
  } else {
    switch (activeNav) {
      case 'favorites':
        filtered = notes.filter((note) => !note.isArchived && note.isFavorite);
        break;
      case 'archived':
        filtered = notes.filter((note) => note.isArchived);
        break;
      case 'recent':
      case 'all':
      default:
        filtered = notes.filter((note) => !note.isArchived);
        break;
    }
  }

  if (activeNav === 'recent') {
    return [...filtered].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }

  return filtered;
}

/**
 * Creates a new note adhering to the canonical NoteSpace data model.
 */
export function createNewNote({
  categoryId = null,
  id = uuidv4(),
  now = new Date().toISOString(),
} = {}) {
  return {
    id,
    title: 'Untitled Note',
    content: '',
    categoryId,
    createdAt: now,
    updatedAt: now,
    isFavorite: false,
    isArchived: false,
  };
}

/**
 * Immutably updates an existing note and refreshes its updatedAt timestamp.
 */
export function updateNoteInList(
  notes = [],
  noteId,
  updates = {},
  now = new Date().toISOString()
) {
  return notes.map((note) =>
    note.id === noteId
      ? {
          ...note,
          ...updates,
          updatedAt: now,
        }
      : note
  );
}

/**
 * Immutably removes a note from the list by ID.
 */
export function deleteNoteFromList(notes = [], noteId) {
  return notes.filter((note) => note.id !== noteId);
}


