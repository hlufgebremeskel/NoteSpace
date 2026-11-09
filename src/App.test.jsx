import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App - Phase 4 CRUD Operations', () => {
  beforeEach(() => {
    document.documentElement.removeAttribute('data-theme');
  });

  it('creates a new note at the top of the list and selects it in the editor', async () => {
    const user = userEvent.setup();
    render(<App />);

    const notesRegion = screen.getByRole('region', { name: /notes list/i });
    expect(within(notesRegion).getAllByRole('listitem')).toHaveLength(4);

    await user.click(screen.getByRole('button', { name: 'New Note' }));

    const listItems = within(notesRegion).getAllByRole('listitem');
    expect(listItems).toHaveLength(5);

    const firstCard = within(listItems[0]).getByRole('button');
    expect(firstCard).toHaveClass('is-selected');
    expect(firstCard).toHaveTextContent('Untitled Note');

    expect(screen.getByRole('textbox', { name: /note title/i })).toHaveValue('Untitled Note');
    expect(screen.getByRole('textbox', { name: /markdown editor/i })).toHaveValue('');
  });

  it('updates note title, content, and category immutably and handles blank title fallback', async () => {
    const user = userEvent.setup();
    render(<App />);

    const titleInput = screen.getByRole('textbox', { name: /note title/i });
    await user.clear(titleInput);

    const notesRegion = screen.getByRole('region', { name: /notes list/i });
    const firstCard = within(within(notesRegion).getAllByRole('listitem')[0]).getByRole('button');
    expect(firstCard).toHaveTextContent('Untitled Note');

    await user.type(titleInput, 'Architecture Decisions');
    expect(firstCard).toHaveTextContent('Architecture Decisions');

    const editorInput = screen.getByRole('textbox', { name: /markdown editor/i });
    await user.clear(editorInput);
    await user.type(editorInput, 'Updated body content');
    expect(editorInput).toHaveValue('Updated body content');
    expect(firstCard).toHaveTextContent('Updated body content');

    const categorySelect = screen.getByRole('combobox', { name: /note category/i });
    await user.selectOptions(categorySelect, 'cat-engineering');
    expect(categorySelect).toHaveValue('cat-engineering');
    expect(firstCard).toHaveTextContent('Engineering');
  });

  it('confirms deletion via ConfirmDialog, clears selection, and handles deleting the final note', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Cancel deletion keeps the note
    await user.click(screen.getByRole('button', { name: /delete note/i }));
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(screen.queryByRole('alertdialog')).not.toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: /note title/i })).toHaveValue('Welcome to NoteSpace');

    // Confirm deletion removes note and clears selection
    await user.click(screen.getByRole('button', { name: /delete note/i }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));
    expect(screen.getByRole('heading', { name: /no note selected/i })).toBeInTheDocument();

    const notesRegion = screen.getByRole('region', { name: /notes list/i });
    expect(within(notesRegion).getAllByRole('listitem')).toHaveLength(3);

    // Delete remaining 3 active notes one by one until none remain
    for (let i = 0; i < 3; i += 1) {
      const remainingCards = within(notesRegion).getAllByRole('listitem');
      await user.click(within(remainingCards[0]).getByRole('button'));
      await user.click(screen.getByRole('button', { name: /delete note/i }));
      await user.click(screen.getByRole('button', { name: 'Delete' }));
    }

    expect(screen.getByRole('heading', { name: /no notes yet/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /no note selected/i })).toBeInTheDocument();
  });

  it('navigates between notes and switches sidebar views cleanly', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(
      screen.getByRole('button', { name: /React State & Storage Architecture/i })
    );
    expect(screen.getByRole('textbox', { name: /note title/i })).toHaveValue(
      'React State & Storage Architecture'
    );

    const sidebar = screen.getByRole('complementary', { name: /primary sidebar/i });
    await user.click(within(sidebar).getByRole('button', { name: /favorites/i }));
    expect(screen.getByRole('heading', { name: 'Favorites' })).toBeInTheDocument();

    await user.click(within(sidebar).getByRole('button', { name: /archived/i }));
    expect(screen.getByRole('heading', { name: 'Archived' })).toBeInTheDocument();
  });

  it('opens settings modal, switches themes, and toggles mobile sidebar drawer', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(screen.getByRole('button', { name: /open settings/i }));
    await user.click(screen.getByRole('button', { name: /dark/i }));
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark');
    await user.keyboard('{Escape}');

    const sidebarWrapper = container.querySelector('.sidebar-wrapper');
    const openButtons = screen.getAllByRole('button', { name: /open navigation menu/i });
    await user.click(openButtons[0]);
    expect(sidebarWrapper).toHaveClass('is-open');
    await user.click(screen.getByRole('button', { name: /close navigation menu/i }));
    expect(sidebarWrapper).not.toHaveClass('is-open');
  });
});
