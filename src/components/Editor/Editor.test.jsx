import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Editor from './Editor';

describe('Editor - Phase 5 Markdown Editor & Preview', () => {
  const sampleNote = {
    id: 'note-1',
    title: 'Design Notes',
    content: '# Hello World',
    categoryId: null,
    createdAt: '2026-11-09T10:00:00.000Z',
    updatedAt: '2026-11-09T10:00:00.000Z',
    isFavorite: false,
    isArchived: false,
  };

  it('renders empty state when no note is selected', () => {
    render(<Editor note={null} />);
    expect(screen.getByRole('heading', { name: /no note selected/i })).toBeInTheDocument();
  });

  it('renders live GFM preview in split mode and switches between Edit and Preview tabs', async () => {
    const user = userEvent.setup();
    render(<Editor note={sampleNote} onChangeTitle={vi.fn()} onChangeContent={vi.fn()} />);

    expect(screen.getByRole('textbox', { name: /note title/i })).toHaveValue('Design Notes');
    expect(screen.getByRole('textbox', { name: /markdown editor/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Hello World' })).toBeInTheDocument();
    expect(screen.getByText('3 words')).toBeInTheDocument();
    expect(screen.getByText('13 characters')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /preview/i }));
    expect(screen.queryByRole('textbox', { name: /markdown editor/i })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Hello World' })).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: /edit/i }));
    expect(screen.getByRole('textbox', { name: /markdown editor/i })).toBeInTheDocument();
  });

  it('applies toolbar formatting to selected text via textarea ref', async () => {
    const user = userEvent.setup();
    const onChangeContent = vi.fn();

    render(
      <Editor
        note={{ ...sampleNote, content: 'Hello World' }}
        onChangeTitle={vi.fn()}
        onChangeContent={onChangeContent}
      />
    );

    const textarea = screen.getByRole('textbox', { name: /markdown editor/i });
    textarea.focus();
    textarea.setSelectionRange(6, 11);

    await user.click(screen.getByRole('button', { name: 'Bold (Ctrl+B)' }));
    expect(onChangeContent).toHaveBeenCalledWith('Hello **World**');
  });
});
