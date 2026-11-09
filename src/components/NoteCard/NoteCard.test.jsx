import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NoteCard from './NoteCard';

describe('NoteCard', () => {
  const baseNote = {
    id: 'note-1',
    title: 'Project Roadmap',
    content: '## Milestones\nBuild **NoteSpace** incrementally.',
    categoryId: 'cat-1',
    createdAt: '2026-11-08T10:00:00.000Z',
    updatedAt: '2026-11-09T10:00:00.000Z',
    isFavorite: true,
    isArchived: false,
  };

  const category = {
    id: 'cat-1',
    name: 'Engineering',
    color: '#2563eb',
    createdAt: '2026-11-01T00:00:00.000Z',
  };

  it('renders note title, preview, category, favorite badge, and selection state', async () => {
    const user = userEvent.setup();
    const onSelect = vi.fn();

    render(
      <NoteCard
        note={baseNote}
        category={category}
        isSelected={true}
        onSelect={onSelect}
      />
    );

    const cardBtn = screen.getByRole('button');
    expect(cardBtn).toHaveClass('is-selected');
    expect(cardBtn).toHaveAttribute('aria-current', 'true');
    expect(screen.getByText('Project Roadmap')).toBeInTheDocument();
    expect(screen.getByText('Milestones Build NoteSpace incrementally.')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
    expect(screen.getByLabelText('Favorite note')).toBeInTheDocument();

    await user.click(cardBtn);
    expect(onSelect).toHaveBeenCalledWith('note-1');
  });

  it('falls back to "Untitled Note" when title is blank', () => {
    render(
      <NoteCard
        note={{ ...baseNote, title: '   ', isFavorite: false }}
        category={null}
        isSelected={false}
        onSelect={vi.fn()}
      />
    );

    expect(screen.getByText('Untitled Note')).toBeInTheDocument();
    expect(screen.queryByLabelText('Favorite note')).not.toBeInTheDocument();
  });
});

