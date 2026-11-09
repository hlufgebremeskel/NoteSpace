import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NotesList from './NotesList';

describe('NotesList', () => {
  it('renders empty state when search has no matching notes and clears on click', async () => {
    const user = userEvent.setup();
    const onClearSearch = vi.fn();

    render(
      <NotesList
        heading="All Notes"
        activeNav="all"
        notes={[]}
        searchQuery="architecture"
        onSearchChange={vi.fn()}
        onClearSearch={onClearSearch}
      />
    );

    expect(screen.getByRole('heading', { name: /no matching notes/i })).toBeInTheDocument();
    const clearButtons = screen.getAllByRole('button', { name: 'Clear search' });
    expect(clearButtons).toHaveLength(2);

    await user.click(clearButtons[0]);
    expect(onClearSearch).toHaveBeenCalledTimes(1);
  });
});

