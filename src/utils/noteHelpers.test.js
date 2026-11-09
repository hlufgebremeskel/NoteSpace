import { describe, it, expect } from 'vitest';
import {
  getNotePreview,
  getNoteStats,
  resolveCategory,
  getNavCounts,
  filterNotesByNav,
  createNewNote,
  updateNoteInList,
  deleteNoteFromList,
} from './noteHelpers';

describe('noteHelpers', () => {
  const categories = [
    { id: 'c1', name: 'Engineering', color: '#2563eb', createdAt: '2026-11-01T00:00:00.000Z' },
  ];

  const notes = [
    {
      id: 'n1',
      title: 'Note One',
      content: 'First',
      categoryId: 'c1',
      createdAt: '2026-11-01T10:00:00.000Z',
      updatedAt: '2026-11-05T10:00:00.000Z',
      isFavorite: true,
      isArchived: false,
    },
    {
      id: 'n2',
      title: 'Note Two',
      content: 'Second',
      categoryId: null,
      createdAt: '2026-11-02T10:00:00.000Z',
      updatedAt: '2026-11-07T10:00:00.000Z',
      isFavorite: false,
      isArchived: false,
    },
    {
      id: 'n3',
      title: 'Archived Note',
      content: 'Old',
      categoryId: 'c1',
      createdAt: '2026-10-01T10:00:00.000Z',
      updatedAt: '2026-10-05T10:00:00.000Z',
      isFavorite: true,
      isArchived: true,
    },
  ];

  it('extracts clean plain-text preview from Markdown and truncates cleanly', () => {
    const md = '# Heading\n\n**Bold** text with [link](https://example.com) and `code`';
    expect(getNotePreview(md)).toBe('Heading Bold text with link and code');
    expect(getNotePreview('')).toBe('No additional text');
    expect(getNotePreview('a'.repeat(150), 20)).toBe('a'.repeat(20) + '...');
  });

  it('computes word and character counts', () => {
    expect(getNoteStats('Hello NoteSpace world')).toEqual({ wordCount: 3, charCount: 21 });
    expect(getNoteStats('')).toEqual({ wordCount: 0, charCount: 0 });
  });

  it('safely resolves valid and missing category references', () => {
    expect(resolveCategory(categories, 'c1')?.name).toBe('Engineering');
    expect(resolveCategory(categories, 'missing-id')).toBeNull();
    expect(resolveCategory(categories, null)).toBeNull();
  });

  it('computes navigation counts excluding archived from active views', () => {
    expect(getNavCounts(notes)).toEqual({
      all: 2,
      favorites: 1,
      recent: 2,
      archived: 1,
    });
  });

  it('filters notes by navigation view and category', () => {
    expect(filterNotesByNav(notes, 'all')).toHaveLength(2);
    expect(filterNotesByNav(notes, 'favorites').map((n) => n.id)).toEqual(['n1']);
    expect(filterNotesByNav(notes, 'archived').map((n) => n.id)).toEqual(['n3']);
    expect(filterNotesByNav(notes, 'recent').map((n) => n.id)).toEqual(['n2', 'n1']);
    expect(filterNotesByNav(notes, 'all', 'c1').map((n) => n.id)).toEqual(['n1']);
  });

  it('creates a new note with default schema values and unique IDs', () => {
    const a = createNewNote({ now: '2026-11-09T12:00:00.000Z' });
    const b = createNewNote({ categoryId: 'c1', now: '2026-11-09T12:00:01.000Z' });

    expect(a.id).toBeTruthy();
    expect(b.id).toBeTruthy();
    expect(a.id).not.toBe(b.id);
    expect(a.title).toBe('Untitled Note');
    expect(a.content).toBe('');
    expect(a.categoryId).toBeNull();
    expect(b.categoryId).toBe('c1');
    expect(a.isFavorite).toBe(false);
    expect(a.isArchived).toBe(false);
  });

  it('immutably updates a note and preserves untouched properties', () => {
    const updated = updateNoteInList(
      notes,
      'n1',
      { title: 'Updated One' },
      '2026-11-09T14:00:00.000Z'
    );

    expect(updated).not.toBe(notes);
    expect(notes[0].title).toBe('Note One');
    expect(updated[0].title).toBe('Updated One');
    expect(updated[0].updatedAt).toBe('2026-11-09T14:00:00.000Z');
    expect(updated[0].createdAt).toBe('2026-11-01T10:00:00.000Z');
    expect(updated[0].isFavorite).toBe(true);
    expect(updated[1]).toBe(notes[1]);
  });

  it('immutably deletes a note from the list', () => {
    const remaining = deleteNoteFromList(notes, 'n2');
    expect(remaining).toHaveLength(2);
    expect(remaining.map((n) => n.id)).toEqual(['n1', 'n3']);
    expect(notes).toHaveLength(3);
  });
});

